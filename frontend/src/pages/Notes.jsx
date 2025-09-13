import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Header from "../components/Header";
import NoteItem from "../components/NoteItem";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [tenantPlan, setTenantPlan] = useState("free");
    const [role, setRole] = useState("");
    const [tenantSlug, setTenantSlug] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("Member");

    const navigate = useNavigate();

    // Fetch notes and tenant info
    const fetchNotes = async () => {
        try {
            const res = await API.get("/notes");
            setNotes(res.data);

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

    useEffect(() => {
        fetchNotes();
    }, []);

    // Create or Update Note
    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const res = await API.put(`/notes/${editId}`, { title, content });
                setNotes(notes.map(n => n._id === editId ? res.data : n));
                setEditId(null);
                setSuccess("Note updated successfully!");
            } else {
                const res = await API.post("/notes", { title, content });
                setNotes([...notes, res.data]);
                setSuccess("Note created successfully!");
            }
            setTitle("");
            setContent("");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save note");
            setSuccess("");
        }
    };

    // Edit Note
    const startEdit = (note) => {
        setEditId(note._id);
        setTitle(note.title);
        setContent(note.content);
        setSuccess("");
        setError("");
    };

    // Delete Note
    const deleteNote = async (id) => {
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter(n => n._id !== id));
        } catch (err) {
            setError("Failed to delete note");
        }
    };

    // Upgrade Tenant Plan
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

    // Invite User (Admin only)
    const inviteUser = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/tenants/${tenantSlug}/invite`, { email: inviteEmail, role: inviteRole });
            setSuccess(`User ${inviteEmail} invited successfully!`);
            setInviteEmail("");
            setInviteRole("Member");
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to invite user");
            setSuccess("");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div style={{ maxWidth: "700px", margin: "50px auto" }}>
            <Header
                role={role}
                tenantPlan={tenantPlan}
                onUpgrade={upgradeTenant}
                onLogout={logout}
            />

            <h2>Notes</h2>

            {/* Free Plan Limit Notification */}
            {tenantPlan === "free" && notes.length >= 3 && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                    Free plan limit reached. Upgrade to Pro to add more notes.
                </p>
            )}

            {/* Create / Edit Note Form */}
            <form onSubmit={handleNoteSubmit}>
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
                <button type="submit">{editId ? "Update Note" : "Add Note"}</button>
            </form>

            {role === "Admin" && tenantPlan === "free" && (
                <button onClick={upgradeTenant} style={{ marginTop: "10px" }}>
                    Upgrade to Pro
                </button>
            )}

            {/* Admin Invite Users Form */}
            {role === "Admin" && (
                <div style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
                    <h3>Invite User</h3>
                    <form onSubmit={inviteUser}>
                        <input
                            type="email"
                            placeholder="User Email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            style={{ marginRight: "10px" }}
                        />
                        <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ marginRight: "10px" }}>
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button type="submit">Invite</button>
                    </form>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {/* Notes List */}
            <ul>
                {notes.map((note) => (
                    <NoteItem
                        key={note._id}
                        note={note}
                        onDelete={deleteNote}
                        onEdit={startEdit}
                    />
                ))}
            </ul>
        </div>
    );
};

export default Notes;