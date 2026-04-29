import { useEffect, useState } from "react";

const API = "http://localhost:8000/api";

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
      <div style={{ padding: "2rem", color: "white" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      {/* ANALYTICS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Card
          title="Total Students"
          value={analytics.total_students}
        />
        <Card
          title="Active (7 Days)"
          value={analytics.active_students_last_7_days}
        />
        <Card
          title="Verified"
          value={analytics.verified_students}
        />
        <Card
          title="Enrollments"
          value={analytics.total_enrollments}
        />
        <Card
          title="Lesson Unlocks"
          value={analytics.total_lesson_unlocks}
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
          className="glass-panel"
          style={{
            flex: 1,
            minWidth: "360px",
            padding: "1.5rem",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>
            Create Student
          </h3>

          <form onSubmit={handleCreateStudent}>
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
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
              />
              <Input
                label="Student ID"
                name="student_id"
                value={form.student_id}
                onChange={handleChange}
              />
            </Row>

            <Row>
              <Input
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
              />
              <Input
                label="Course"
                name="course"
                value={form.course}
                onChange={handleChange}
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
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Student"}
            </button>

            {message && (
              <p style={{ marginTop: "1rem" }}>{message}</p>
            )}
          </form>
        </div>

        {/* TABLE */}
        <div
          className="glass-panel"
          style={{
            flex: 2,
            minWidth: "650px",
            padding: "1.5rem",
            overflowX: "auto",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>
            Student List
          </h3>

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
                      padding: "1rem",
                      textAlign: "center",
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
                      borderTop:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <TD>{student.username}</TD>
                    <TD>
                      {student.first_name}{" "}
                      {student.last_name}
                    </TD>
                    <TD>{student.student_id}</TD>
                    <TD>{student.department}</TD>
                    <TD>
                      {student.is_verified
                        ? "✅ Yes"
                        : "❌ No"}
                    </TD>
                    <TD>
                      <div
                        style={{
                          display: "flex",
                          gap: ".5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className="btn-primary"
                          style={{
                            width: "auto",
                            padding:
                              ".45rem .75rem",
                          }}
                          onClick={() =>
                            handleVerify(student.id)
                          }
                        >
                          Verify
                        </button>

                        <button
                          className="btn-primary"
                          style={{
                            width: "auto",
                            padding:
                              ".45rem .75rem",
                            background:
                              "var(--danger-color)",
                          }}
                          onClick={() =>
                            handleDelete(
                              student.id,
                              student.username
                            )
                          }
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

function Card({ title, value }) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.25rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem" }}>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  required,
}) {
  return (
    <div style={{ marginBottom: "1rem", flex: 1 }}>
      <label
        style={{
          display: "block",
          marginBottom: ".45rem",
        }}
      >
        {label}
      </label>

      <input
        className="input-field"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

function Row({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
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
        padding: ".75rem",
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
        padding: ".75rem",
      }}
    >
      {children}
    </td>
  );
}