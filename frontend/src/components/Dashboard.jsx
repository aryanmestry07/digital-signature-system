import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Add this
import DocumentList from "./DocumentList";
import Navbar from "./Navbar";
import Loader from "./Loader";
import UploadZone from "./UploadZone";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  
  const navigate = useNavigate(); // Hook for navigation
  const token = localStorage.getItem("token");

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/documents/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  // Logic to handle clicking a document
  const handlePreview = (doc) => {
    // We pass the URL in state so PdfPreview can read it
    navigate(`/preview/${doc.id}`, { state: { pdfUrl: doc.url } });
  };

  const stats = {
    ALL: documents.length,
    PENDING: documents.filter(d => d.status === "PENDING").length,
    SIGNED: documents.filter(d => d.status === "SIGNED").length,
    REJECTED: documents.filter(d => d.status === "REJECTED").length,
  };

  const filteredDocuments = filter === "ALL" 
    ? documents 
    : documents.filter((doc) => doc.status === filter);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Digital Signature Dashboard
          </h1>
        </header>

        <div className="space-y-12">
          <section className="flex justify-center">
            <div className="w-full bg-white p-2 rounded-3xl shadow-sm border border-slate-200">
              <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <UploadZone onUploadSuccess={loadDocuments} />
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {["ALL", "PENDING", "SIGNED", "REJECTED"].map((key) => (
              <button 
                key={key} 
                onClick={() => setFilter(key)}
                className={`p-6 rounded-2xl border bg-white ${filter === key ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}`}
              >
                <p className="text-[10px] font-black uppercase text-slate-400">{key}</p>
                <p className="text-3xl font-bold">{stats[key]}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8">
              {loading ? (
                <div className="flex justify-center"><Loader /></div>
              ) : (
                <DocumentList
                  documents={filteredDocuments}
                  onPreview={handlePreview} // Use the new navigation handler
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;