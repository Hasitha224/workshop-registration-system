import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { User } from '../models/user.model.js';
import { Workshop } from '../models/workshop.model.js';
import { Registration } from '../models/registration.model.js';
import { day, emailFor } from '../utils/helpers.js';

async function seed() {
  await connectDatabase();

  // Wipe old data so the seed can be re-run safely
  await Promise.all([User.deleteMany({}), Workshop.deleteMany({}), Registration.deleteMany({})]);
  // Make sure indexes exist (the unique and partial-unique ones)
  await Promise.all([User.init(), Workshop.init(), Registration.init()]);

  // Create the three users
  const hash = (p: string) => bcrypt.hash(p, 10);
  const [admin, manager, staff] = await User.create([
    { name: 'Alex Admin', email: 'admin@example.com', passwordHash: await hash('Admin123!'), role: 'admin' },
    { name: 'Maya Manager', email: 'manager@example.com', passwordHash: await hash('Manager123!'), role: 'manager' },
    { name: 'Sam Staff', email: 'staff@example.com', passwordHash: await hash('Staff123!'), role: 'staff' },
  ]);
  if (!admin || !manager || !staff) throw new Error('Seed: user creation failed');

  // Create the workshops
  const base = { createdBy: manager._id };
  const workshops = await Workshop.create([
    { ...base, code: 'POT-101', title: 'Intro to Pottery', instructor: 'Nimali Perera', location: 'Matara', startsAt: day(2, 10), capacity: 12, status: 'open' },
    { ...base, code: 'COD-201', title: 'Web Coding Basics', instructor: 'Kasun Silva', location: 'Galle', startsAt: day(3, 14), capacity: 20, status: 'open' },
    { ...base, code: 'FIT-110', title: 'Saturday Bootcamp', instructor: 'Ruwan Fernando', location: 'Matara', startsAt: day(1, 8), capacity: 5, activeCount: 4, status: 'open' },
    { ...base, code: 'ART-050', title: 'Watercolour Studio', instructor: 'Dilani Jay', location: 'Colombo', startsAt: day(10, 11), capacity: 8, status: 'draft' },
    { ...base, code: 'YOG-120', title: 'Morning Yoga', instructor: 'Priya Nair', location: 'Galle', startsAt: day(5, 7), capacity: 15, status: 'open' },
    { ...base, code: 'PHO-300', title: 'Photography Walk', instructor: 'Chamara Dias', location: 'Colombo', startsAt: day(-7, 9), capacity: 10, status: 'completed' },
  ]);

  // Look the bootcamp up by code instead of by array position
  const bootcamp = workshops.find((w) => w.code === 'FIT-110');
  if (!bootcamp) throw new Error('Seed: bootcamp workshop missing');

  // 5. Registrations for the bootcamp
  const reg = (name: string, status: 'active' | 'cancelled' = 'active') => ({
    workshopId: bootcamp._id,
    attendeeName: name,
    attendeeEmail: emailFor(name),
    status,
    registeredBy: staff._id,
    ...(status === 'cancelled' && { cancelledBy: staff._id, cancelledAt: new Date() }),
  });
  await Registration.create([
    reg('Anna Perera'), reg('Binu Silva'), reg('Chathu Kumari'), reg('Dinesh Raj'),
    reg('Eshan Wijay', 'cancelled'),
  ]);

  console.log('Seeded. Logins: admin@example.com / Admin123!, manager@example.com / Manager123!, staff@example.com / Staff123!');
  await disconnectDatabase();
}

try {
  await seed();
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}