import { useState, useRef } from "react";

function UploadZone({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef(null);
  const uploadLock = useRef(false);   // 🔥 hard lock

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    // HARD PREVENT DOUBLE CALL
    if (uploadLock.current) return;
    uploadLock.current = true;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);

      // Release lock
      uploadLock.current = false;

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[280px] transition-all duration-300 rounded-2xl
        ${dragging
          ? "border-2 border-indigo-500 bg-indigo-50/50 scale-[1.01]"
          : "bg-transparent"
        }
      `}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-1">
          {isUploading ? "Uploading..." : "Click or Drag PDF"}
        </h3>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        id="pdfUpload"
        disabled={isUploading}
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />

      <label
        htmlFor="pdfUpload"
        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer
          ${isUploading
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
          }
        `}
      >
        {isUploading ? "Please Wait" : "Choose File"}
      </label>
    </div>
  );
}

export default UploadZone;