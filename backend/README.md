

# 🛡️ Open Innovation Prior-Art Generator

### *A Full-Stack Solution for Systematic Combinatorial Disclosure*

The **Open Innovation Prior-Art Generator** is a specialized platform designed to protect open research. By generating exhaustive combinatorial subsets of material concepts and archiving them with verifiable timestamps on the **Open Science Framework (OSF)**, it establishes "prior art" to prevent the patenting of mathematically predictable innovations.

---

## 📋 Table of Contents

* [Overview](https://www.google.com/search?q=%23overview)
* [Tech Stack](https://www.google.com/search?q=%23tech-stack)
* [Getting Started](https://www.google.com/search?q=%23getting-started)
* [Environment Variables](https://www.google.com/search?q=%23environment-variables)
* [Installation](https://www.google.com/search?q=%23installation)


* [API Reference](https://www.google.com/search?q=%23api-reference)
* [File Processing](https://www.google.com/search?q=%23file-processing)
* [Combinatorial Engine](https://www.google.com/search?q=%23combinatorial-engine)
* [OSF Archiving](https://www.google.com/search?q=%23osf-archiving)


* [Key Features & UX](https://www.google.com/search?q=%23key-features--ux)
* [Project Structure](https://www.google.com/search?q=%23project-structure)
* [License](https://www.google.com/search?q=%23license)

---

## Overview

In modern R&D, "patent trolls" often claim rights over obvious combinations of known materials. This tool uses **Combinatorial Innovation** logic to publish these possibilities faster than they can be patented.

1. 
**Ingest**: Extract items from PDF, DOCX, or CSV files.


2. 
**Process**: Generate all unique $K$-sized combinations using high-performance Python logic.


3. 
**Archive**: Upload results to **OSF Storage** via automated API calls to create a permanent legal record.



---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | <br>[React.js](https://www.google.com/search?q=https://react.dev/), [Framer Motion](https://www.google.com/search?q=https://www.framer.com/motion/) 

 |
| **Backend** | <br>[FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.google.com/search?q=https://www.uvicorn.org/) 

 |
| **Data Science** | <br>[Pandas](https://www.google.com/search?q=https://pandas.pydata.org/), `itertools` 

 |
| **Parsing** | <br>`pdfplumber`, `python-docx` 

 |
| **Authentication** | <br>[Firebase Auth](https://www.google.com/search?q=https://firebase.google.com/docs/auth) 

 |
| **Legal/Storage** | <br>[Open Science Framework (OSF) API](https://developer.osf.io/) 

 |

---

## Getting Started

### Environment Variables

Create a `.env` file in the **backend** directory:

```env
[cite_start]PROJECT_ID=your_osf_project_id    # The short ID from your OSF project URL [cite: 1, 2]
[cite_start]OSF_TOKEN=your_osf_token         # Personal Access Token from osf.io/settings/tokens [cite: 1, 2]

```

### Installation

**Backend Setup** 

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

```

**Frontend Setup** 

```bash
cd frontend
npm install
npm run dev

```

---

## API Reference

### `POST /read-file`

Extracts text from uploaded documents and returns a clean list of items.

* 
**Supports**: `.pdf`, `.docx`, `.csv`, `.xls`, `.xlsx`.


* 
**Logic**: Automatically handles paragraph splitting and whitespace stripping.



### `POST /generate-combinations`

Generates $K$-sized subsets from the provided list.

* 
**Request Body**: `{ "items": string[], "size": int }`.


* 
**Response**: Returns a JSON object with `compound_number`, `materials`, and an EST timestamp.



### `POST /upload-to-osf`

Publishes a generated CSV to the OSF node.

* 
**Validation**: Includes `is_csv()` check for UTF-8-sig encoding and multi-column verification.


* 
**Output**: Returns the `osf_file_page_url` for direct legal citation.



---

## Key Features & UX

* 
**Smart Parsing**: Includes "Paragraph Detection" to prevent bloat and ensure only list-style items are processed.


* 
**Highly Visible Instructions**: A blurred-glass modal with scrollable examples appears automatically if a file is empty or formatted incorrectly.


* 
**Visual Feedback**: Integrated **Three-Dot Loaders** and OSF status banners (uploading/success/error).


* 
**Manual Session Support**: A robust fallback for users who prefer not to use Firebase social login.



---

## Project Structure

```
.
├── backend
[cite_start]│   ├── main.py            # FastAPI routes and OSF logic [cite: 2]
[cite_start]│   ├── model.py           # Pydantic schema for combinations [cite: 2]
[cite_start]│   └── model_csv.py       # Pydantic schema for CSV export [cite: 2]
├── frontend
│   ├── src
│   │   ├── pages
[cite_start]│   │   │   ├── Combinations.jsx # Main tool interface [cite: 1]
[cite_start]│   │   │   └── Profile.jsx      # Account & History dashboard [cite: 1]
[cite_start]│   │   └── firebase             # Auth configuration [cite: 1, 2]
└── README.md

```

---

## Notes & Gotchas

* 
**Timezone**: All generated combinations are timestamped in `America/Toronto` (EST) for consistent legal logging.


* 
**OSF Project ID**: Ensure your OSF project is set to **Public**; otherwise, generated links will return a `403 Forbidden` error for external viewers.


* 
**Vite Imports**: If adding new landing pages, ensure `Landing_Navbar` imports use the correct relative paths to avoid Vite resolution errors.



---

## License

MIT — *Built for combinatorial innovation • 2026 • v1.0.4*