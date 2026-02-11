import { useState } from "react";

function SignatureOverlay({ onDrop }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      className="bg-blue-500 text-white px-3 py-1 rounded cursor-move"
    >
      Drag Signature
    </div>
  );
}

export default SignatureOverlay;
