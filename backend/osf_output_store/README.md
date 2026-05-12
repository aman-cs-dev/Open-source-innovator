# 🧪 Combinations API

A lightweight FastAPI backend for generating combinatorial sets from a list of items, exporting results as CSV, and archiving data to the [Open Science Framework (OSF)](https://osf.io).

---

## Table of Contents

* [Overview](https://www.google.com/search?q=%23overview)
* [Tech Stack](https://www.google.com/search?q=%23tech-stack)
* [Getting Started](https://www.google.com/search?q=%23getting-started)
* [Prerequisites](https://www.google.com/search?q=%23prerequisites)
* [Installation](https://www.google.com/search?q=%23installation)
* [Environment Variables](https://www.google.com/search?q=%23environment-variables)
* [Running the Server](https://www.google.com/search?q=%23running-the-server)


* [API Reference](https://www.google.com/search?q=%23api-reference)
* [POST /read-file](https://www.google.com/search?q=%23post-read-file)
* [POST /generate-combinations](https://www.google.com/search?q=%23post-generate-combinations)
* [POST /create-csv](https://www.google.com/search?q=%23post-create-csv)
* [POST /upload-to-osf](https://www.google.com/search?q=%23post-upload-to-osf)


* [Data Models](https://www.google.com/search?q=%23data-models)
* [Project Structure](https://www.google.com/search?q=%23project-structure)
* [Error Handling](https://www.google.com/search?q=%23error-handling)
* [Notes & Gotchas](https://www.google.com/search?q=%23notes--gotchas)

---

## Overview

This API is designed for research workflows that need to:

1. **Extract** items from various file formats including PDF, DOCX, CSV, and Excel.
2. **Generate** all unique k-combinations from a given list of material concepts.
3. **Export** results as a downloadable CSV with unique job IDs and timestamps.
4. **Archive** data to an OSF project node using specialized storage logic to establish a permanent record of "prior art".

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| HTTP Client | [httpx](https://www.python-httpx.org/) |
| Data Validation | [Pydantic](https://docs.pydantic.dev/) |
| Document Parsing | `pdfplumber`, `python-docx`, `pandas` |
| Storage Logic | `osf_output_store.py` |
| OSF Integration | OSF WaterButler API |

---

## Getting Started

### Prerequisites

* Python 3.10+
* An [OSF account](https://osf.io) with a Personal Access Token
* An OSF project node (Short ID)

### Installation

```bash
git clone https://github.com/aman-cs-dev/innovation_website.git
cd innovation_website/backend

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

```

### Environment Variables

Create a `.env` file in the project root:

```env
PROJECT_ID=your_osf_project_id 
OSF_TOKEN=your_osf_personal_token

```

### Running the Server

```bash
uvicorn main:app --reload

```

---

## API Reference

### `POST /read-file`

Extracts items from uploaded documents for processing.

* **Supports**: `.pdf`, `.docx`, `.csv`, `.xls`, `.xlsx`.
* **Logic**: Automatically handles paragraph extraction from Word and line-based text from PDFs.

### `POST /generate-combinations`

Generates all unique combinations of size `k` from the provided list using `itertools`.

**Request Body**

```json
{
  "items": ["PLA", "Graphene", "Silica"],
  "size": 2
}

```

### `POST /create-csv`

Streams a downloadable CSV file containing the generated combinations.

* **Filename Format**: `{uuid}_{ISO-timestamp}.csv`.

### `POST /upload-to-osf`

Uploads a CSV file directly to the configured OSF project node using optimized output storage logic.

* **Output**: Returns the `osf_file_page_url` for a verifiable public record.

---

## Data Models

* **`Combinations` (`model.py`)**: Defines the schema for generating combinations (items and size).
* **`Output_Csv` (`model_csv.py`)**: Defines the schema for CSV exportation, including combination strings and metadata.

---

## Project Structure

```
.
├── main.py                # Route handlers (PDF/DOCX/CSV parsing & OSF logic)
├── model.py               # Pydantic model for combinations
├── model_csv.py           # Pydantic model for CSV output
├── osf_output_store.py    # Specialized logic for OSF file archiving
├── .gitignore             # Environment variable protection
├── requirements.txt       # Project dependencies
└── README.md

```

---

## Error Handling

* **Invalid Formats**: Returns `{"status": "invalid_path"}` for unsupported file extensions.
* **Validation**: Ensures `size (k)` is mathematically valid for the provided item count.
* **Catch-All**: Returns `{"status": "error", "reason": str(e)}` to prevent frontend crashes on unexpected failures.

---

## Notes & Gotchas

* **Timezone**: Timestamps are localized to `America/Toronto` (EST) for consistent legal logging.
* **OSF Integrity**: The storage logic ensures all uploads are valid CSVs with at least 2 columns to verify data quality.

---

## License

MIT — *Built for combinatorial innovation • 2026 • v1.0.4*