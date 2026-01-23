import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://react-auth-dashboard.onrender.com";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    setTasks((prev) => [...prev, data]);
    setTitle("");
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function toggleTask(id) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h3 className="mb-0">Dashboard</h3>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline-danger"
          >
            Logout
          </button>
        </div>

        {user && (
          <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
            Logged in as: {user.email}
          </p>
        )}

        <form onSubmit={addTask} className="d-flex gap-2 mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="New task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn btn-primary">Add</button>
        </form>

        <input
          className="form-control mb-3"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && <div className="alert alert-danger py-1">{error}</div>}

        <ul className="list-group">
          {filteredTasks.length === 0 && (
            <li className="list-group-item text-muted text-center">
              No tasks yet. Add your first task.
            </li>
          )}

          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                onClick={() => toggleTask(task.id)}
                style={{
                  cursor: "pointer",
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#6c757d" : "inherit",
                }}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-sm btn-outline-danger"
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
