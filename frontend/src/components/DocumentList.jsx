import React from "react";

function DocumentList({ documents, onPreview }) {
  // Helper to determine status styles
  const getStatusStyles = (status) => {
    switch (status) {
      case "SIGNED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="w-full">
      {/* Empty State */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 font-medium italic">No documents found in this category.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5"
            >
              {/* Left Section: Icon & Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {/* Simple File Icon SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs uppercase tracking-tight text-sm">
                    {doc.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getStatusStyles(doc.status)}`}>
                      {doc.status || "PENDING"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Updated: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right Section: Action Button */}
              <div className="mt-4 sm:mt-0 flex items-center">
                <button
                  onClick={() => onPreview(doc)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-50 text-slate-700 px-6 py-2.5 rounded-xl text-xs font-black border border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;