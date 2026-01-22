function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}
export default ProtectedRoute;
