import { useEffect, useState } from "react";
import DocumentList from "./DocumentList";
import PdfPreview from "./PdfPreview";
import Navbar from "./Navbar";
import Loader from "./Loader";
import { fetchUserDocuments } from "../services/documentService";
import "./Dashboard.css";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = "123"; // example logged-in user id

  useEffect(() => {
    const loadDocuments = async () => {
      setLoading(true);
      const data = await fetchUserDocuments(userId);
      setDocuments(data);
      setLoading(false);
    };

    loadDocuments();
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <h2 className="dashboard-title">User Dashboard</h2>

        {loading ? (
          <Loader />
        ) : (
          <DocumentList
            documents={documents}
            onPreview={setSelectedPDF}
          />
        )}

        <PdfPreview  pdfUrl={selectedPDF?.url} docId={selectedPDF?.id} />
      </div>
    </>
  );
}

export default Dashboard;
