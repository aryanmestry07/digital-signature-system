import { Document, Page } from "react-pdf";

function PdfPreview({ pdfUrl }) {
  if (!pdfUrl) return null;

  return (
    <div className="pdf-preview">
      <h3>PDF Preview</h3>

      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

export default PdfPreview;
