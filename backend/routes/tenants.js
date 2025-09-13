const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/:slug/upgrade', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
    const { slug } = req.params;

    try {
        const tenant = await Tenant.findOne({ slug });
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

        tenant.plan = 'pro';
        await tenant.save();

        res.json({ message: `Tenant ${tenant.name} upgraded to Pro` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.user.tenantId);
        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

        res.json({ slug: tenant.slug, plan: tenant.plan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/:slug/invite', authMiddleware, async (req, res) => {
    try {
        const { slug } = req.params;
        const { email, role } = req.body;

        if (!['Admin', 'Member'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const tenant = await Tenant.findOne({ slug });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        if (req.user.role !== 'Admin' || req.user.tenantId.toString() !== tenant._id.toString()) {
            return res.status(403).json({ message: 'Only Admins can invite users in this tenant' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const passwordHash = await bcrypt.hash('password', 10);

        const newUser = await User.create({
            email,
            passwordHash,
            role,
            tenantId: tenant._id
        });

        res.status(201).json({
            message: 'User invited successfully',
            user: { email: newUser.email, role: newUser.role, tenant: tenant.slug }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;