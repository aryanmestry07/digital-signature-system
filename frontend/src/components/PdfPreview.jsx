import { useEffect, useState, useRef } from "react";
import { Document, Page } from "react-pdf";

function PdfPreview({ pdfUrl, docId }) {
  const [placeholders, setPlaceholders] = useState([]);
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    if (!docId) return;

    fetch(`http://localhost:8000/signatures/placeholders/${docId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPlaceholders(data));
  }, [docId]);

  return (
    <div
      ref={pdfContainerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* PDF */}
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>

      {/* Signature placeholders */}
      {placeholders.map((sig) => (
        <div
          key={sig.id}
          style={{
            position: "absolute",
            left: `${sig.x * 100}%`,
            top: `${sig.y * 100}%`,
            width: "120px",
            height: "40px",
            border: "2px dashed #2563eb",
            color: "#2563eb",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(37, 99, 235, 0.05)",
          }}
        >
          Sign here
        </div>
      ))}
    </div>
  );
}

export default PdfPreview;
