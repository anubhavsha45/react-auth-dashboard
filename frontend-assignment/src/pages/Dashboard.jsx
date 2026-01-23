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

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to fetch tasks: " + text);
      }

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

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to fetch profile: " + text);
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to add task: " + text);
      }

      const data = await res.json();
      setTasks((prev) => [...prev, data]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to delete task: " + text);
      }

      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to update task: " + text);
      }

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
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
