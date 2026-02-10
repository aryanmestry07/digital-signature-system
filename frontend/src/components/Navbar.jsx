import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 flex justify-between text-white">
      <h2 className="font-bold">Digital Signature System</h2>
      <Link to="/dashboard" className="hover:underline">
        Dashboard
      </Link>
    </nav>
  );
}

export default Navbar;
