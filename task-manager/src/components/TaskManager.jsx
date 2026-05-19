import { useState, useEffect } from "react";

const PRIORITIES = ["Low", "Medium", "High"];
const FILTERS = ["All", "Active", "Completed"];

const priorityColor = {
  Low: "#4ade80",
  Medium: "#facc15",
  High: "#f87171",
};

const priorityBg = {
  Low: "#052e16",
  Medium: "#1c1400",
  High: "#1f0606",
};

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design wireframes", desc: "Create low-fidelity mockups", priority: "High", completed: false, createdAt: Date.now() - 86400000 },
    { id: 2, title: "Set up project repo", desc: "Initialize Git and folder structure", priority: "Medium", completed: true, createdAt: Date.now() - 43200000 },
  ]);
  const [form, setForm] = useState({ title: "", desc: "", priority: "Medium" });
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({ total: 0, done: 0 });
  const [toast, setToast] = useState(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    setStats({ total: tasks.length, done: tasks.filter(t => t.completed).length });
  }, [tasks]);

  useEffect(() => {
    setAnimIn(true);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Task title is required.";
    else if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters.";
    if (form.title.trim().length > 60) e.title = "Title must be under 60 characters.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    if (editId !== null) {
      setTasks(tasks.map(t => t.id === editId ? { ...t, ...form } : t));
      setEditId(null);
      showToast("Task updated!");
    } else {
      setTasks([{ id: Date.now(), ...form, completed: false, createdAt: Date.now() }, ...tasks]);
      showToast("Task added!");
    }
    setForm({ title: "", desc: "", priority: "Medium" });
  };

  const handleEdit = (task) => {
    setForm({ title: task.title, desc: task.desc, priority: task.priority });
    setEditId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    showToast("Task removed.", "error");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ title: "", desc: "", priority: "Medium" });
    setErrors({});
  };

  const filtered = tasks.filter(t => {
    const matchFilter = filter === "All" || (filter === "Completed" ? t.completed : !t.completed);
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const progress = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      backgroundImage: "radial-gradient(ellipse 80% 60% at 50% -10%, #1a0a2e 0%, transparent 70%)",
      fontFamily: "'DM Mono', 'Fira Mono', monospace",
      color: "#e2e2e8",
      padding: "0 0 80px",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fade-in { animation: fadeUp 0.6s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .task-card {
          background: #111118;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          padding: 18px 20px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          animation: fadeUp 0.4s ease both;
          position: relative;
          overflow: hidden;
        }
        .task-card:hover {
          border-color: #7c3aed44;
          box-shadow: 0 0 24px #7c3aed18;
          transform: translateY(-2px);
        }
        .task-card.done { opacity: 0.55; }

        .btn {
          border: none;
          cursor: pointer;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.15s;
          padding: 8px 18px;
          letter-spacing: 0.03em;
        }
        .btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .btn:active { transform: scale(0.97); }

        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          box-shadow: 0 2px 12px #7c3aed44;
        }
        .btn-ghost {
          background: #1e1e2e;
          color: #a0a0b8;
          border: 1px solid #2a2a3e;
        }
        .btn-icon {
          background: transparent;
          border: 1px solid #2a2a3e;
          color: #a0a0b8;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-icon:hover { border-color: #7c3aed88; color: #c4b5fd; }

        .input-field {
          background: #0f0f18;
          border: 1px solid #1e1e2e;
          border-radius: 8px;
          padding: 10px 14px;
          color: #e2e2e8;
          font-family: inherit;
          font-size: 13px;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .input-field:focus {
          border-color: #7c3aed88;
          box-shadow: 0 0 0 3px #7c3aed18;
        }
        .input-field::placeholder { color: #404058; }
        .input-field.error { border-color: #f87171; }

        .select-field {
          background: #0f0f18;
          border: 1px solid #1e1e2e;
          border-radius: 8px;
          padding: 10px 14px;
          color: #e2e2e8;
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
          outline: none;
          appearance: none;
          transition: border-color 0.2s;
        }
        .select-field:focus { border-color: #7c3aed88; }

        .filter-pill {
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid #1e1e2e;
          background: #111118;
          color: #a0a0b8;
          font-family: inherit;
          transition: all 0.15s;
        }
        .filter-pill.active {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 2px 10px #7c3aed44;
        }

        .progress-bar {
          background: #1e1e2e;
          border-radius: 99px;
          height: 6px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5, #06b6d4);
          transition: width 0.5s ease;
        }

        .toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          padding: 12px 22px;
          border-radius: 10px;
          font-size: 13px;
          font-family: inherit;
          z-index: 999;
          animation: slideUp 0.3s ease;
          box-shadow: 0 4px 24px #0008;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "22px 0 18px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
              task<span style={{ color: "#7c3aed" }}>flow</span>
            </div>
            <div style={{ fontSize: 11, color: "#404058", marginTop: 2, letterSpacing: "0.08em" }}>REACT TASK MANAGER</div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#c4b5fd" }}>{stats.total}</div>
              <div style={{ fontSize: 10, color: "#404058", letterSpacing: "0.06em" }}>TOTAL</div>
            </div>
            <div style={{ width: 1, height: 28, background: "#1e1e2e" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#4ade80" }}>{stats.done}</div>
              <div style={{ fontSize: 10, color: "#404058", letterSpacing: "0.06em" }}>DONE</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 0" }}>

        {/* Progress */}
        <div className={animIn ? "fade-in" : ""} style={{ animationDelay: "0.05s", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#404058", letterSpacing: "0.08em" }}>PROGRESS</span>
            <span style={{ fontSize: 11, color: "#7c3aed" }}>{progress}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Form */}
        <div className={animIn ? "fade-in" : ""} style={{
          animationDelay: "0.1s",
          background: "#111118",
          border: `1px solid ${editId ? "#7c3aed55" : "#1e1e2e"}`,
          borderRadius: 14,
          padding: "22px 22px",
          marginBottom: 28,
          boxShadow: editId ? "0 0 32px #7c3aed18" : "none",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}>
          <div style={{ fontSize: 11, color: "#7c3aed", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 500 }}>
            {editId ? "✎ EDITING TASK" : "+ NEW TASK"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <input
                className={`input-field${errors.title ? " error" : ""}`}
                placeholder="Task title *"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                maxLength={60}
              />
              {errors.title && <div style={{ color: "#f87171", fontSize: 11, marginTop: 5, paddingLeft: 2 }}>{errors.title}</div>}
            </div>

            <textarea
              className="input-field"
              placeholder="Description (optional)"
              rows={2}
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
              style={{ resize: "none" }}
            />

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <select
                  className="select-field"
                  style={{ width: "100%", paddingRight: 32 }}
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p} Priority</option>)}
                </select>
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: "#404058" }}>▼</span>
              </div>

              <button className="btn btn-primary" onClick={handleSubmit} style={{ whiteSpace: "nowrap" }}>
                {editId ? "Update" : "Add Task"}
              </button>

              {editId && (
                <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
          </div>
        </div>

        {/* Filters + Search */}
        <div className={animIn ? "fade-in" : ""} style={{ animationDelay: "0.15s", display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <input
            className="input-field"
            style={{ flex: 1, minWidth: 160, padding: "8px 14px" }}
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {FILTERS.map(f => (
            <button key={f} className={`filter-pill${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Task List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#2a2a3e", padding: "60px 0", fontSize: 13 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>○</div>
              No tasks found
            </div>
          )}
          {filtered.map((task, i) => (
            <div
              key={task.id}
              className={`task-card${task.completed ? " done" : ""}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Priority stripe */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                background: priorityColor[task.priority],
                borderRadius: "12px 0 0 12px",
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingLeft: 6 }}>
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: `2px solid ${task.completed ? "#7c3aed" : "#2a2a3e"}`,
                    background: task.completed ? "#7c3aed" : "transparent",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#fff", marginTop: 2,
                    transition: "all 0.2s",
                  }}
                >
                  {task.completed ? "✓" : ""}
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                    <span style={{
                      fontSize: 14, fontWeight: 500, color: task.completed ? "#404058" : "#e2e2e8",
                      textDecoration: task.completed ? "line-through" : "none",
                      transition: "color 0.2s",
                    }}>{task.title}</span>
                    <span className="badge" style={{
                      background: priorityBg[task.priority],
                      color: priorityColor[task.priority],
                      border: `1px solid ${priorityColor[task.priority]}33`,
                    }}>{task.priority}</span>
                    {task.completed && (
                      <span className="badge" style={{ background: "#052e16", color: "#4ade80", border: "1px solid #4ade8033" }}>done</span>
                    )}
                  </div>
                  {task.desc && (
                    <div style={{ fontSize: 12, color: "#505068", lineHeight: 1.5 }}>{task.desc}</div>
                  )}
                  <div style={{ fontSize: 10, color: "#2a2a3e", marginTop: 6, letterSpacing: "0.04em" }}>
                    {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button className="btn-icon" title="Edit" onClick={() => handleEdit(task)}>✎</button>
                  <button className="btn-icon" title="Delete" onClick={() => handleDelete(task.id)}
                    style={{ color: "#f87171", borderColor: "#f8717133" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1f0606"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length > 0 && filtered.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#2a2a3e", letterSpacing: "0.06em" }}>
            {filtered.length} task{filtered.length !== 1 ? "s" : ""} shown
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{
          background: toast.type === "error" ? "#1f0606" : "#0a1a0f",
          border: `1px solid ${toast.type === "error" ? "#f87171" : "#4ade80"}33`,
          color: toast.type === "error" ? "#f87171" : "#4ade80",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}