
import time
import csv
import io
import urllib
import uuid
import pdfplumber
from docx import Document
import itertools
from urllib.request import urlopen
import pandas as pd
from fastapi import FastAPI, Request,UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from datetime import datetime, timezone
import httpx
from zoneinfo import ZoneInfo
from fastapi.middleware.cors import CORSMiddleware
from model import Combinations
from dotenv import load_dotenv
import os

from model_csv import Output_Csv




# initialises FastAPI
app = FastAPI()

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID")
OSF_TOKEN = os.getenv("OSF_TOKEN")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],  # so React can read filename header
)

# checks if the list is separated by comma or new line
def check_list_type(raw_text:str) -> list[str]:

    flattened = " ".join(raw_text.split())
    
    if "," in flattened:
        # Comma-separated (handles single line, wrapped across lines, anything)
        return [item.strip() for item in flattened.split(",") if item.strip()]
    else:
        # Newline-separated — iterate over ALL lines not just lines[0]
        return [line.strip() for line in raw_text.split("\n") if line.strip()]
    
    
# reads the inputted file to find the inputs
@app.post("/read-file")
async def read_file(file: UploadFile):
    try:
        content = await file.read()
        filename = file.filename.lower()

        if not content or not content.strip():
            return JSONResponse({"status": "error", "reason": "File is empty."})

        final_items = []

        # PDF
        if filename.endswith(".pdf"):
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                all_text = []
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        all_text.append(text)
            final_items = check_list_type("\n".join(all_text))

        # Word
        elif filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            raw = "\n".join(p.text.strip() for p in doc.paragraphs if p.text.strip())
            final_items = check_list_type(raw)

        # CSV / Excel
        elif filename.endswith(".csv") or filename.endswith(".xls") or filename.endswith(".xlsx"):
           
            if filename.endswith(".csv"):
              df = pd.read_csv(io.BytesIO(content), header=None, encoding='utf-8-sig')
            else:
              df = pd.read_excel(io.BytesIO(content), header=None)

            df = df.dropna(axis=1, how='all')  # drop empty columns
            df = df.dropna(axis=0, how='all')  # drop empty rows

            # if items go across columns (1 row, many columns) 
            if df.shape[0] == 1 and df.shape[1] > 1:
                df = df.T.reset_index(drop=True)
                df.columns = range(df.shape[1])  # rename columns 0, 1, 2...

            df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)

            if df.shape[1] > 1:
              return JSONResponse({"status": "error", "reason": "Multiple columns detected. Upload a single-column list."})

            raw = "\n".join(df[0].dropna().astype(str).tolist())
            final_items = check_list_type(raw)

        else:
            return JSONResponse({"status": "error", "reason": "Unsupported file type. Please upload a CSV, PDF, or DOCX."})

        if not final_items:
            return JSONResponse({"status": "error", "reason": "File is empty or no readable content found."})

        return JSONResponse({"status": "success", "data": {"items": final_items}})

    except Exception as e:
        return JSONResponse({"status": "error", "reason": str(e)})


# Post method to generate combinations out of the input given by frontend
@app.post("/generate-combinations")
def generate_combinations(data: Combinations):
    try:
        start_time = time.time()

        current_time_utc = datetime.now(timezone.utc)
        eastern = current_time_utc.astimezone(ZoneInfo("America/Toronto"))
        formatted_time_est = eastern.strftime("%Y-%m-%d %I:%M %p %Z")

        items = data.items
        k = data.size

        # basic validation
        if k < 1:
            raise HTTPException(status_code=400, detail="size must be >= 1")
        if k > len(items):
            raise HTTPException(status_code=400, detail=f"size cannot be greater than number of items ({len(items)})")

        combos = []
        compound_number = 1

        for combo in itertools.combinations(items, k):
            combos.append({
                "compound_number": compound_number,
                "materials": list(combo),
            })
            compound_number += 1

        print(f"Generated {len(combos)} combinations in {time.time() - start_time:.4f}s at {formatted_time_est}")

        return {"status": "good", "combinations": combos, "generated_at": formatted_time_est}

    except HTTPException:
        # re-raise clean API errors
        raise
    except Exception as e:
        # unexpected errors
        return {"status": "error", "message": str(e)}
    
@app.post("/create-csv")
async def create_csv(payload: Output_Csv):
    try:
        buf = io.StringIO(newline="")
        w = csv.writer(buf)

        job_id = str(uuid.uuid4())
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H-%M-%SZ")
        filename = f"{job_id}_{ts}.csv"

        w.writerow(["job_id", job_id])
        w.writerow(["size", payload.size])
        w.writerow(["items", " | ".join(payload.items)])
        w.writerow(["combos", payload.combos])
        w.writerow([])
        w.writerow(["index", "combination"])

        for i, combo in enumerate(payload.combinations, start=1):
            w.writerow([i, combo])

        csv_bytes = buf.getvalue().encode("utf-8")

        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=500)
    
    # returns the filename based on the job_id and current time
def make_filename(job_id :  str) -> str:

    

    name = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    return f"{job_id}_{name}.csv"

# basic filename check (optional)
def is_csv(file_content: bytes, filename: str) -> bool:

    if filename and not filename.lower().endswith(".csv"):
        return False

    if not file_content or not file_content.strip():
        return False

    # decode safely
    try:
        text = file_content.decode("utf-8-sig")  # handles BOM too
    except UnicodeDecodeError:
        return False

    # try parsing as comma-separated CSV
    try:
        reader = csv.reader(io.StringIO(text))
        first_row = next(reader, None)
        if not first_row:
            return False

        # require at least 2 columns in first row
        if len(first_row) < 2:
            return False

        return True
    except Exception:
        return False

@app.get("/osf-whoami")
async def osf_whoami():
    headers = {"Authorization": f"Bearer {OSF_TOKEN}"}
    async with httpx.AsyncClient(timeout=30) as client:
        me = await client.get("https://api.osf.io/v2/users/me/", headers=headers)
        node = await client.get(f"https://api.osf.io/v2/nodes/{PROJECT_ID}/", headers=headers)
    return {"me_status": me.status_code, "me": me.text[:300], "node_status": node.status_code, "node": node.text[:300]}

@app.get("/osf-perms")
async def osf_perms():
    headers = {"Authorization": f"Bearer {OSF_TOKEN}"}
    async with httpx.AsyncClient(timeout=30) as client:
        contrib = await client.get(
            f"https://api.osf.io/v2/nodes/{PROJECT_ID}/contributors/",
            headers=headers,
        )
    return {"status": contrib.status_code, "body": contrib.text[:2000]}



@app.post("/upload-to-osf")
async def upload_csv_to_osf(
    file: UploadFile = File(...),
    job_id: str | None = Form(None),
):
    try:
        if not OSF_TOKEN or not PROJECT_ID:
            raise HTTPException(status_code=500, detail="Missing OSF_TOKEN or OSF_PROJECT_ID")

        csv_bytes = await file.read()
        if not csv_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        filename = make_filename(job_id)
        safe_name = urllib.parse.quote(filename)

        upload_url = (
            f"https://files.osf.io/v1/resources/{PROJECT_ID}/providers/osfstorage/"
            f"?kind=file&name={safe_name}"
        )

        headers = {
            "Authorization": f"Bearer {OSF_TOKEN}",
            "Content-Type": "application/octet-stream",
        }

        if not is_csv(csv_bytes, file.filename):
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid CSV")

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.put(upload_url, content=csv_bytes, headers=headers)

        if resp.status_code >= 400:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        # ✅ NEW: parse OSF response to get the file page URL
        payload = resp.json()

        file_id_full = payload.get("data", {}).get("id", "")  # "osfstorage/69916..."
        file_id = file_id_full.split("/")[-1]                # "69916..."

        project_id = PROJECT_ID  # "Rcusy" in your case

        osf_file_page_url = f"https://osf.io/{project_id}/files/osfstorage/{file_id}/"

        
        print(f"File uploaded successfully. OSF file page URL: {osf_file_page_url}")
        print(f"Full OSF response payload: {payload}")
        print(f"Upload URL: {upload_url}")
        print(f"Filename: {filename}")
        print(f"Safe Filename: {safe_name}")
        print(f"Request Headers: {headers}")

        return JSONResponse({
    "ok": True,
    "uploaded_filename": filename,
    "osf_file_page_url": osf_file_page_url,
    "osf_file_id": file_id,
})

    

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))