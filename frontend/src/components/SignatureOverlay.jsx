import { useState } from "react";

function SignatureOverlay() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tool Label */}
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Signing Tool
      </span>

      <div
        draggable
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        className={`
          group relative flex items-center gap-3 px-5 py-3 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300
          ${
            isDragging
              ? "opacity-50 scale-95 shadow-inner bg-slate-100"
              : "bg-white border-2 border-indigo-600 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1"
          }
        `}
      >
        {/* Signature Icon */}
        <div className="text-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>

        {/* Text */}
        <span className="text-sm font-bold text-slate-800 whitespace-nowrap select-none">
          Place Signature
        </span>

        {/* Decorative "Grab" Dots */}
        <div className="flex flex-col gap-1 ml-2 opacity-30 group-hover:opacity-60 transition-opacity">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 text-center leading-tight">
        Drag onto the document <br /> to apply your signature
      </p>
    </div>
  );
}

export default SignatureOverlay;