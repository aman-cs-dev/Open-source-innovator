import csv
from fastapi import FastAPI, UploadFile, File
from datetime import datetime, timezone
import pandas as pd
from docx import Document
import pdfplumber
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from model_csv import Output_Csv
import uuid
import io


# initialises FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
     expose_headers=["Content-Disposition"],  # so React can read filename header
)

# reads the inputted file to find the inputs
@app.post("/read-file")
async def read_file(file: UploadFile):
    try:
        # stores the binary format and converts in into df
        content = await file.read()
        filename = file.filename.lower()
        extracted_text = []

        # for pdf
        if(filename.endswith(".pdf")):
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    extracted_text.append(page.extract_text())
            final_input = {"items":  "\n".join(extracted_text).split("\n")}
        

        # for word
        elif(filename.endswith(".docx")):
            doc = Document(io.BytesIO(content))
            final_input = {"items": [para.text for para in doc.paragraphs if para.text.strip()]}

        # for csv
        elif (filename.endswith(".csv")):
            df = pd.read_csv(io.BytesIO(content))
            df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
            final_input = df.to_dict(orient='list')   

        else:
            return JSONResponse({"status": "invalid_path"})     

        # sends the data to the react frontend
        return JSONResponse({

            "status": "success",
            "data": final_input
        })    
    
    # Sends error 400 which means client side error
    except Exception as e:
        return JSONResponse({"status":"error", "reason": str(e)})




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