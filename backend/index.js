require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Note = require('./models/Note'); // make sure you have a Note model

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    // Clear previous data
    await Tenant.deleteMany({});
    await User.deleteMany({});
    await Note.deleteMany({});

    // Create tenants (both start with free plan)
    const acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });
    const globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });

    const passwordHash = await bcrypt.hash('password', 10);

    // Create users for Acme
    const acmeAdmin = await User.create({
        email: 'admin@acme.test',
        passwordHash,
        role: 'Admin',
        tenantId: acme._id
    });

    const acmeUser = await User.create({
        email: 'user@acme.test',
        passwordHash,
        role: 'Member',
        tenantId: acme._id
    });

    // Create users for Globex
    const globexAdmin = await User.create({
        email: 'admin@globex.test',
        passwordHash,
        role: 'Admin',
        tenantId: globex._id
    });

    const globexUser = await User.create({
        email: 'user@globex.test',
        passwordHash,
        role: 'Member',
        tenantId: globex._id
    });

    // Seed some sample notes (belongs to Acme + Globex separately)
    await Note.create([
        { title: 'Acme Admin Note', content: 'This is Acme admin note', tenantId: acme._id, userId: acmeAdmin._id },
        { title: 'Acme User Note', content: 'This is Acme user note', tenantId: acme._id, userId: acmeUser._id },
        { title: 'Globex Admin Note', content: 'This is Globex admin note', tenantId: globex._id, userId: globexAdmin._id },
        { title: 'Globex User Note', content: 'This is Globex user note', tenantId: globex._id, userId: globexUser._id },
    ]);

    console.log('Seed completed successfully!');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error(err);
    mongoose.connection.close();
});
