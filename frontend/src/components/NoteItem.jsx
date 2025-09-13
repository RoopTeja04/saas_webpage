import React from "react";
import { motion } from "framer-motion";

const NoteItem = ({ note, onDelete, onEdit }) => {
    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border p-4 rounded shadow hover:shadow-lg transition-all bg-white"
        >
            <h4 className="font-semibold text-gray-800">{note.title}</h4>
            <p className="text-gray-700">{note.content}</p>
            <small className="text-gray-500">{new Date(note.createdAt).toLocaleString()}</small>
            <div className="mt-2 space-x-2">
                <button
                    onClick={() => onDelete(note._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                >
                    Delete
                </button>
                <button
                    onClick={() => onEdit(note)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                >
                    Edit
                </button>
            </div>
        </motion.li>
    );
};

export default NoteItem;