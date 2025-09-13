const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');
const Tenant = require('../models/Tenant');

// ---------- CREATE NOTE ----------
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { tenantId, userId } = req.user;

    try {
        const tenant = await Tenant.findById(tenantId);

        if (tenant.plan === 'free') {
            const tenantNotesCount = await Note.countDocuments({ tenantId });
            if (tenantNotesCount >= 3) {
                return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro.' });
            }
        }

        const note = await Note.create({ title, content, tenantId, createdBy: userId });
        res.status(201).json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- GET ALL NOTES ----------
router.get('/', authMiddleware, async (req, res) => {
    const { tenantId } = req.user;

    try {
        const notes = await Note.find({ tenantId });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- GET NOTE BY ID ----------
router.get('/:id', authMiddleware, async (req, res) => {
    const { tenantId } = req.user;
    const { id } = req.params;

    try {
        const note = await Note.findOne({ _id: id, tenantId });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- UPDATE NOTE ----------
router.put('/:id', authMiddleware, async (req, res) => {
    const { tenantId } = req.user;
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const note = await Note.findOneAndUpdate(
            { _id: id, tenantId },
            { title, content },
            { new: true }
        );
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------- DELETE NOTE ----------
router.delete('/:id', authMiddleware, async (req, res) => {
    const { tenantId } = req.user;
    const { id } = req.params;

    try {
        const note = await Note.findOneAndDelete({ _id: id, tenantId });
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;    