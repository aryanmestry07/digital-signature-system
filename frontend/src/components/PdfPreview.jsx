import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useLocation, useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfPreview() {
  const { docId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [placedPosition, setPlacedPosition] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const pageRef = useRef(null);
  const token = localStorage.getItem("token");

  // Constants for scaling
  const PDF_WIDTH = 750;
  const SIGNATURE_WIDTH = 150;
  const SIGNATURE_HEIGHT = 60;

  const pdfUrl = location.state?.pdfUrl ? `http://localhost:8000${location.state.pdfUrl}` : null;
  const signedPdfUrl = `http://localhost:8000/uploads/signed_${docId}.pdf`;

  // --- Signature Upload Logic ---
  const handleSignatureUpload = async () => {
    if (!signatureFile) return alert("Select PNG first");

    const formData = new FormData();
    formData.append("file", signatureFile);

    const res = await fetch("http://localhost:8000/api/signatures/upload-signature", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setSignaturePreview(`http://localhost:8000/${data.signature_path}`);
      alert("Signature tool ready!");
    } else {
      alert(data.detail || "Upload failed");
    }
  };

  // --- Drop Logic ---
  const handleDropOnPdf = (e) => {
    e.preventDefault();
    if (!signaturePreview || isConfirmed) return;

    const canvas = pageRef.current.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    setPlacedPosition({
      xPx,
      yPx,
      relativeX: xPx / rect.width,
      relativeY: yPx / rect.height,
    });
  };

  const handleDragOver = (e) => e.preventDefault();

  // --- Final Confirmation Logic ---
  const handleConfirm = async () => {
    if (!placedPosition) return alert("Drag signature onto document first");

    const canvas = pageRef.current.querySelector("canvas");
    const rect = canvas.getBoundingClientRect();
    const widthRatio = SIGNATURE_WIDTH / rect.width;

    const res = await fetch("http://localhost:8000/api/signatures/confirm-sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        document_id: docId,
        x: placedPosition.relativeX,
        y: placedPosition.relativeY,
        page: 1,
        width_ratio: widthRatio,
      }),
    });

    if (res.ok) {
      setIsConfirmed(true);
      alert("Document signed successfully!");
    } else {
      const err = await res.json();
      alert(err.detail || "Error signing");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <div className="max-w-[1400px] mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center font-black text-xs uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="mr-2 text-lg">←</span> Back to Dashboard
        </button>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* PDF VIEWPORT */}
          <div className="flex-[0_0_75%] bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex justify-center">
            <div
              ref={pageRef}
              onDrop={handleDropOnPdf}
              onDragOver={handleDragOver}
              className="relative shadow-2xl border border-slate-200"
              style={{ width: `${PDF_WIDTH}px` }}
            >
              <Document 
                file={isConfirmed ? signedPdfUrl : pdfUrl} 
                loading={<div className="p-20 font-bold text-slate-400">Loading Document...</div>}
              >
                <Page 
                  pageNumber={1} 
                  width={PDF_WIDTH} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false} 
                />
              </Document>

              {placedPosition && !isConfirmed && (
                <img
                  src={signaturePreview}
                  alt="Placed Signature"
                  className="absolute pointer-events-none"
                  style={{
                    left: `${placedPosition.xPx}px`,
                    top: `${placedPosition.yPx}px`,
                    width: `${SIGNATURE_WIDTH}px`,
                    height: `${SIGNATURE_HEIGHT}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </div>
          </div>

          {/* CONTROL PANEL */}
          <div className="flex-[0_0_25%] w-full space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Sign Document</h3>

              {!isConfirmed ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">1. Select Signature</label>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setSignatureFile(file);
                        setSignaturePreview(URL.createObjectURL(file));
                      }}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>

                  <button
                    onClick={handleSignatureUpload}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Load Tool
                  </button>

                  {signaturePreview && (
                    <div className="pt-6 border-t border-slate-100">
                      <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">2. Drag to PDF</label>
                      <div
                        draggable
                        className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing"
                      >
                        <img src={signaturePreview} alt="Draggable Preview" style={{ width: `${SIGNATURE_WIDTH}px`, height: `${SIGNATURE_HEIGHT}px` }} />
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">Ready to place</span>
                      </div>
                    </div>
                  )}

                  {placedPosition && (
                    <button
                      onClick={handleConfirm}
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                    >
                      Confirm Placement
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-emerald-500 text-4xl mb-2">✓</div>
                  <p className="font-bold text-slate-800">Successfully Signed</p>
                </div>
              )}
            </div>

            <a
              href={isConfirmed ? signedPdfUrl : "#"}
              download
              className={`w-full flex items-center justify-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isConfirmed ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-300 pointer-events-none"
              }`}
            >
              Download Final PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfPreview;