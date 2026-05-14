import { useEffect, useState } from "react";
import { Users, UserCheck, BookOpen, UserPlus, Key, GraduationCap, Building, MapPin, Mail, Phone, Hash, User } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL}/api`;

export default function StudentManager() {
  const token = localStorage.getItem("access_token");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [analytics, setAnalytics] = useState({
    total_students: 0,
    active_students_last_7_days: 0,
    verified_students: 0,
    inactive_students: 0,
    total_enrollments: 0,
    total_lesson_unlocks: 0,
  });

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    student_id: "",
    department: "",
    course: "",
    year: "",
    city: "",
    state: "",
    country: "India",
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const fetchAll = async () => {
    try {
      setPageLoading(true);

      const [analyticsRes, studentsRes] = await Promise.all([
        fetch(`${API}/admin/analytics/`, {
          headers: authHeaders,
        }),
        fetch(`${API}/admin/students/`, {
          headers: authHeaders,
        }),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data);
      }
    } catch (error) {
      setMessage("Failed to load data.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      student_id: "",
      department: "",
      course: "",
      year: "",
      city: "",
      state: "",
      country: "India",
    });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API}/admin/students/create/`, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Student created successfully.");
        resetForm();
        fetchAll();
      } else {
        setMessage(JSON.stringify(data));
      }
    } catch (error) {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    const ok = window.confirm(
      `Delete student "${username}" permanently?`
    );

    if (!ok) return;

    try {
      const res = await fetch(
        `${API}/admin/students/${id}/delete/`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (res.ok) {
        setMessage("Student deleted.");
        fetchAll();
      } else {
        setMessage("Delete failed.");
      }
    } catch {
      setMessage("Network error.");
    }
  };

  const handleVerify = async (id) => {
    try {
      const res = await fetch(
        `${API}/admin/students/${id}/verify/`,
        {
          method: "PATCH",
          headers: authHeaders,
        }
      );

      if (res.ok) {
        fetchAll();
      }
    } catch { }
  };

  if (pageLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div className="shimmer-bg" style={{ width: "200px", height: "12px", borderRadius: "6px" }}></div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem", animation: "slideUpFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* ANALYTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <Card
          title="Total Students"
          value={analytics.total_students}
          icon={Users}
          color="#3b82f6"
        />
        <Card
          title="Active (7 Days)"
          value={analytics.active_students_last_7_days}
          icon={UserCheck}
          color="#10b981"
        />
        <Card
          title="Verified"
          value={analytics.verified_students}
          icon={UserPlus}
          color="#8b5cf6"
        />
        <Card
          title="Enrollments"
          value={analytics.total_enrollments}
          icon={BookOpen}
          color="#f59e0b"
        />
        <Card
          title="Lesson Unlocks"
          value={analytics.total_lesson_unlocks}
          icon={Key}
          color="#ef4444"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* CREATE FORM */}
        <div
          className="premium-glass"
          style={{
            flex: 1,
            minWidth: "360px",
            padding: "2rem",
            borderRadius: "24px",
            background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "8px", borderRadius: "10px", color: "#3b82f6" }}>
              <UserPlus size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>Create Student</h3>
          </div>

          <form onSubmit={handleCreateStudent}>
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              icon={User}
            />

            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
              type="email"
            />

            <Input
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              icon={Key}
              type="password"
            />

            <Row>
              <Input
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
              <Input
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
            </Row>

            <Row>
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={Phone}
              />
              <Input
                label="Student ID"
                name="student_id"
                value={form.student_id}
                onChange={handleChange}
                icon={Hash}
              />
            </Row>

            <Row>
              <Input
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                icon={Building}
              />
              <Input
                label="Course"
                name="course"
                value={form.course}
                onChange={handleChange}
                icon={GraduationCap}
              />
            </Row>

            <Row>
              <Input
                label="Year"
                name="year"
                value={form.year}
                onChange={handleChange}
              />
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                icon={MapPin}
              />
            </Row>

            <Row>
              <Input
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
              />
              <Input
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </Row>

            <button
              type="submit"
              className="btn-premium"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem", padding: "1rem" }}
            >
              {loading
                ? "Creating..."
                : "Create Student"}
            </button>

            {message && (
              <div style={{ 
                marginTop: "1.5rem", 
                padding: "1rem", 
                borderRadius: "12px", 
                background: message.includes("success") ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: message.includes("success") ? "#10b981" : "#ef4444",
                border: `1px solid ${message.includes("success") ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                textAlign: "center",
                fontSize: "0.95rem"
              }}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* TABLE */}
        <div
          className="premium-glass"
          style={{
            flex: 2,
            minWidth: "650px",
            padding: "2rem",
            overflowX: "auto",
            borderRadius: "24px",
            background: "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "rgba(139, 92, 246, 0.1)", padding: "8px", borderRadius: "10px", color: "#8b5cf6" }}>
              <Users size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700 }}>Student List</h3>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <TH>User</TH>
                <TH>Name</TH>
                <TH>Student ID</TH>
                <TH>Department</TH>
                <TH>Verified</TH>
                <TH>Action</TH>
              </tr>
            </thead>

            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "3rem 1rem",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "1.1rem"
                    }}
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <TD>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 600 }}>
                          {student.username.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{student.username}</span>
                      </div>
                    </TD>
                    <TD>
                      {student.first_name || student.last_name ? (
                        <span style={{ color: "var(--text-secondary)" }}>{student.first_name} {student.last_name}</span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Not set</span>
                      )}
                    </TD>
                    <TD><span style={{ fontFamily: "monospace", color: "var(--text-secondary)" }}>{student.student_id || "-"}</span></TD>
                    <TD>{student.department || "-"}</TD>
                    <TD>
                      {student.is_verified ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.8rem", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "0.8rem", fontWeight: 600 }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></div>
                          Verified
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.8rem", borderRadius: "20px", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600 }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444" }}></div>
                          Pending
                        </span>
                      )}
                    </TD>
                    <TD>
                      <div
                        style={{
                          display: "flex",
                          gap: ".5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {!student.is_verified && (
                          <button
                            className="btn-secondary-premium"
                            style={{
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.8rem",
                              background: "rgba(59, 130, 246, 0.15)",
                              color: "#3b82f6",
                            }}
                            onClick={() => handleVerify(student.id)}
                          >
                            Verify
                          </button>
                        )}

                        <button
                          className="btn-secondary-premium"
                          style={{
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.8rem",
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444",
                          }}
                          onClick={() => handleDelete(student.id, student.username)}
                        >
                          Delete
                        </button>
                      </div>
                    </TD>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Card({ title, value, icon: Icon, color }) {
  return (
    <div
      className="premium-glass"
      style={{
        padding: "1.5rem",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = `0 12px 30px ${color}22`;
        e.currentTarget.style.borderColor = `${color}44`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--glass-shadow)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          boxShadow: `inset 0 0 0 1px ${color}44`
        }}
      >
        {Icon && <Icon size={26} strokeWidth={2.5} />}
      </div>
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
          {title}
        </p>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, lineHeight: 1 }}>{value}</h2>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, required, icon: Icon, type = "text" }) {
  return (
    <div style={{ marginBottom: "1.25rem", flex: 1 }}>
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.9rem",
          color: "var(--text-secondary)",
          fontWeight: 500,
        }}
      >
        {label} {required && <span style={{ color: "var(--accent-primary)" }}>*</span>}
      </label>

      <div style={{ position: "relative" }}>
        {Icon && (
          <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", transition: "color 0.2s" }}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: "100%",
            padding: `0.85rem 1rem 0.85rem ${Icon ? "2.75rem" : "1rem"}`,
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            outline: "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onFocus={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.06)";
            e.target.style.borderColor = "var(--accent-secondary)";
            e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.15)";
            if(e.target.previousSibling) e.target.previousSibling.style.color = "var(--accent-secondary)";
          }}
          onBlur={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.03)";
            e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
            e.target.style.boxShadow = "none";
            if(e.target.previousSibling) e.target.previousSibling.style.color = "var(--text-muted)";
          }}
        />
      </div>
    </div>
  );
}

function Row({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1.25rem",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

function TH({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "1.25rem 1rem",
        color: "var(--text-muted)",
        fontWeight: 600,
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </th>
  );
}

function TD({ children }) {
  return (
    <td
      style={{
        padding: "1.25rem 1rem",
        fontSize: "0.95rem",
      }}
    >
      {children}
    </td>
  );
}