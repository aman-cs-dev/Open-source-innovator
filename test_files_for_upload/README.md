
# 🧪 Test Files: Combinatorial Prior-Art Generator

This folder contains a standardized suite of test files used to verify the robustness of the **File Upload & Extraction** pipeline. These files are designed to test the frontend's ability to distinguish between valid material lists and "junk" data that should trigger the **File Upload Instructions** modal.

---

## 📋 Table of Contents

* [Rejection Suite (Should Fail)](https://www.google.com/search?q=%23rejection-suite-should-fail)
* [Validation Suite (Should Pass)](https://www.google.com/search?q=%23validation-suite-should-pass)
* [Validation Rules](https://www.google.com/search?q=%23validation-rules)

---

## ❌ Rejection Suite (Should Fail)

*These files are "stupid" by design to ensure the UI blocks invalid data and guides the user.*

| File Name | Failure Type | Expected Behavior |
| --- | --- | --- |
| `test_rejection_scientific.csv` | **Multi-Column** | Trigger: `columns.length > 1`. Displays error: "Multiple columns detected". |
| `stupid_horizontal_list.csv` | **Format Violation** | Rejects data spread horizontally across columns instead of vertically. |
| `stupid_metadata_mess.csv` | **Junk Data** | Rejects files containing system IDs, timestamps, and boolean flags. |
| `stupid_number_grid.csv` | **Matrix Format** | Blocks 5x5 grids of numbers that do not constitute a material list. |
| `rejected_complex_data.csv` | **Paragraphs** | Trigger: **Paragraph Detection**. Blocks descriptive text and multi-column layouts. |

---

## ✅ Validation Suite (Should Pass)

*These files strictly follow the **"Single Column / Simple List"** rule.*

| File Name | Content Type | Expected Behavior |
| --- | --- | --- |
| `pass_chemicals_list.csv` | Chemical Precursors | 8 items successfully imported into the "Your list" container. |
| `pass_polymers_list.csv` | Industrial Polymers | Validates clean vertical parsing without headers. |
| `pass_concepts_list.csv` | Abstract Concepts | Validates that short phrases like "UV Resistance" pass character checks. |
| `test_materials_large.csv` | High-Volume List | 60 items successfully loaded to test UI scrolling and stress-testing. |

---

## ⚖️ Validation Rules

The frontend logic in `Submit.jsx` enforces the following gates before data is accepted:

1. **Extension Gate**: Only `.csv`, `.pdf`, and `.docx` are accepted.
2. **Column Gate**: If `Object.keys(result.data).length > 1`, the file is rejected to maintain list integrity.
3. **Paragraph Gate**: Any entry containing more than **12 words** or **150 characters** is flagged as a paragraph and blocked.
4. **Instruction Trigger**: On any failure, the **File Upload Instructions** modal is automatically displayed to educate the user.

---

## 👤 Author

**Aman Sharma** Full Stack Developer Intern | Open Source Innovation Lab 

---

*Built for combinatorial innovation • 2026 • v1.0.4*