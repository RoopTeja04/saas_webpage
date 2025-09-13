const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true }
});

module.exports = mongoose.model('User', userSchema);