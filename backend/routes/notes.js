const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');
const Tenant = require('../models/Tenant');

router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { tenantId, userId } = req.user;

    try {
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) return res.status(400).json({ message: 'Tenant not found' });

        if (tenant.plan === 'free') {
            const tenantNotesCount = await Note.countDocuments({ tenantId });
            if (tenantNotesCount >= 3) {
                return res.status(403).json({ message: 'Free plan limit reached. Upgrade to Pro.' });
            }
        }

        const note = await Note.create({
            title,
            content,
            tenantId,
            userId,
            createdBy: userId
        });

        res.status(201).json(note);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    const { tenantId } = req.user;
    try {
        const notes = await Note.find({ tenantId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

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