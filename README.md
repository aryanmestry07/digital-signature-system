# ✍️ SignFlow – Digital Signature Web Application

SignFlow is a full-stack Digital Signature Web Application that allows users to securely upload documents, place signatures interactively, and generate signed PDFs with precise coordinate alignment.

Built using React (Frontend) and FastAPI (Backend).

---

## 🚀 Features

- 📂 Upload and manage PDF documents
- 🖱️ Interactive drag-and-drop signature placement
- 🎨 Automatic background removal from signature images
- 📐 Accurate relative-to-absolute coordinate mapping
- 📝 Backend PDF embedding using PyMuPDF
- 🔐 JWT-based authentication & protected routes
- 📊 Document status tracking (Pending / Signed / Rejected)
- 🧾 Audit logging for signed actions
- 📥 Download signed PDF

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- React-PDF
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy
- PyMuPDF
- Pillow (PIL)
- SQLite

### Authentication
- JWT (JSON Web Token)

---

## 🧠 Key Learning

One of the most challenging parts of this project was aligning frontend-relative coordinates with backend PDF coordinate systems to ensure precise signature placement.

This project helped in understanding:

- Full-stack architecture
- Secure authentication flows
- PDF rendering and manipulation
- Coordinate system alignment
- Real-world document workflows

---

## 📸 How It Works

1. User logs in using JWT authentication.
2. User uploads a PDF document.
3. User uploads a PNG signature.
4. White background is removed automatically.
5. User drags and places the signature on the PDF.
6. Relative coordinates are sent to backend.
7. Backend converts them to absolute PDF coordinates.
8. Signed PDF is generated and available for download.

---

## ⚙️ Installation & Setup

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
