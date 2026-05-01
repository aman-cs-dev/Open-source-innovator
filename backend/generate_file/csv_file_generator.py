import csv
from fastapi import FastAPI, UploadFile, File
from datetime import datetime, timezone
import pandas as pd
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

# reads the csv file
@app.post("/read-csv")
async def read_csv(file: UploadFile):
    try:
        # stores the binary format and converts in into df
        content = file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        # removes all rows / spaces
        df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)

        # converts the df to a list of objects

        final_data = df.to_dict(orient='list')    

        # sends the data to frontend

        return JSONResponse({

            "status": "success",
            "data": final_data
        })    
    
    except Exception as e:
        return({"status":"error", "reason": str(e)})





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