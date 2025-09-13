require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Tenant = require('./models/Tenant');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('Connected to DB');

    // Clear previous data
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // Create tenants
    const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });
    const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });

    const passwordHash = await bcrypt.hash('password', 10);

    // Create users
    await User.create([
        { email: 'admin@acme.test', passwordHash, role: 'Admin', tenantId: acme._id },
        { email: 'user@acme.test', passwordHash, role: 'Member', tenantId: acme._id },
        { email: 'admin@globex.test', passwordHash, role: 'Admin', tenantId: globex._id },
        { email: 'user@globex.test', passwordHash, role: 'Member', tenantId: globex._id }
    ]);

    console.log('Seed completed!');
    mongoose.connection.close();
}

seed();