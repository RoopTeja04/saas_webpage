const express = require('express');
const router = express.Router();

const Tenant = require('../models/Tenant');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ---------- UPGRADE TENANT ----------
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

// GET /tenants/me
router.get("/tenants/me", authMiddleware, async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.user.tenantId);
        if (!tenant) return res.status(404).json({ message: "Tenant not found" });

        res.json({ slug: tenant.slug, plan: tenant.plan });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /tenants/me
router.get("/tenants/me", authMiddleware, async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenantId);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  res.json({ slug: tenant.slug, plan: tenant.plan });
});

module.exports = router;