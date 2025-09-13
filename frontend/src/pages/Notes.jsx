import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Header from "../components/Header";
import NoteItem from "../components/NoteItem";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [tenantPlan, setTenantPlan] = useState("free");
    const [role, setRole] = useState("");
    const [tenantSlug, setTenantSlug] = useState("");
    const navigate = useNavigate();

    // Fetch notes
    const fetchNotes = async () => {
        try {
            const res = await API.get("/notes");
            setNotes(res.data);

            // Decode JWT token
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setRole(payload.role);
            }

            const tenantRes = await API.get("/tenants/me");
            setTenantPlan(tenantRes.data.plan);
            setTenantSlug(tenantRes.data.slug);
        } catch (err) {
            setError("Failed to fetch notes");
        }
    };

    // Create new note
    const createNote = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/notes", { title, content });
            setNotes([...notes, res.data]);
            setTitle("");
            setContent("");
            setSuccess("Note created!");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create note");
            setSuccess("");
        }
    };

    // Delete a note
    const deleteNote = async (id) => {
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n._id !== id));
        } catch (err) {
            setError("Failed to delete note");
        }
    };

    // Upgrade tenant plan
    const upgradeTenant = async () => {
        try {
            await API.post(`/tenants/${tenantSlug}/upgrade`);
            setTenantPlan("pro");
            setSuccess("Tenant upgraded to Pro!");
            setError("");
        } catch (err) {
            setError("Upgrade failed");
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto" }}>
            <h2>My Notes</h2>
            <button onClick={logout} style={{ float: "right" }}>Logout</button>

            <form onSubmit={createNote}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ display: "block", marginBottom: "10px", width: "100%" }}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    style={{ display: "block", marginBottom: "10px", width: "100%", height: "80px" }}
                />
                <button type="submit">Add Note</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {/* Upgrade button visible only to Admins */}
            {role === "Admin" && tenantPlan === "free" && (
                <button onClick={upgradeTenant} style={{ marginTop: "20px" }}>
                    Upgrade to Pro
                </button>
            )}

            <Header
                role={role}
                tenantPlan={tenantPlan}
                onUpgrade={upgradeTenant}
                onLogout={logout}
            />

            <ul>
                {notes.map((note) => (
                    <NoteItem key={note._id} note={note} onDelete={deleteNote} />
                ))}
            </ul>
        </div>
    );
};

export default Notes;