import { Link, Navigate } from "react-router-dom";

function Home() {
  const isAuthenticated = localStorage.getItem("token");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4 text-center" style={{ width: "400px" }}>
        <h3 className="mb-3">Welcome</h3>
        <p className="mb-4">Choose an option to continue</p>

        <Link to="/login" className="btn btn-primary w-100 mb-2">
          Login
        </Link>

        <Link to="/register" className="btn btn-outline-primary w-100">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
