import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Header from "../components/Header";
import NoteItem from "../components/NoteItem";
import { motion, AnimatePresence } from "framer-motion";

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

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const res = await API.put(`/notes/${editId}`, { title, content });
                setNotes(notes.map((n) => (n._id === editId ? res.data : n)));
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

    const startEdit = (note) => {
        setEditId(note._id);
        setTitle(note.title);
        setContent(note.content);
        setSuccess("");
        setError("");
    };

    const deleteNote = async (id) => {
        try {
            await API.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n._id !== id));
        } catch (err) {
            setError("Failed to delete note");
        }
    };

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

    const inviteUser = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/tenants/${tenantSlug}/invite`, {
                email: inviteEmail,
                role: inviteRole,
            });
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
        <div className="max-w-3xl mx-auto my-12 px-4 font-sans">
            <Header role={role} tenantPlan={tenantPlan} onUpgrade={upgradeTenant} onLogout={logout} />

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Notes</h2>

            {tenantPlan === "free" && notes.length >= 3 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 font-semibold mb-4"
                >
                    Free plan limit reached. Upgrade to Pro to add more notes.
                </motion.p>
            )}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-100 text-red-700 p-3 rounded mb-4 shadow"
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-100 text-green-700 p-3 rounded mb-4 shadow"
                    >
                        {success}
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleNoteSubmit} className="mb-6 space-y-3">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full p-3 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                >
                    {editId ? "Update Note" : "Add Note"}
                </button>
            </form>

            {role === "Admin" && tenantPlan === "free" && (
                <button
                    onClick={upgradeTenant}
                    className="mb-6 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all"
                >
                    Upgrade to Pro
                </button>
            )}

            {role === "Admin" && (
                <div className="mb-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Invite User</h3>
                    <form onSubmit={inviteUser} className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="User Email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                        >
                            Invite
                        </button>
                    </form>
                </div>
            )}

            <ul className="space-y-3">
                {notes.map((note) => (
                    <NoteItem key={note._id} note={note} onDelete={deleteNote} onEdit={startEdit} />
                ))}
            </ul>
        </div>
    );
};

export default Notes;