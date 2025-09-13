import React from "react";

const NoteItem = ({ note, onDelete }) => {
    return (
        <li
            style={{
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
            }}
        >
            <strong>{note.title}</strong>
            <p>{note.content}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
            <br />
            <button
                onClick={() => onDelete(note._id)}
                style={{ marginTop: "5px", background: "red", color: "white" }}
            >
                Delete
            </button>
        </li>
    );
};

export default NoteItem;