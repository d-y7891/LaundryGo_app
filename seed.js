require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./app/models/user');
const { faker } = require('@faker-js/faker');

const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL || 'mongodb://localhost:27017/laundrygo';

async function seedData() {
  try {
    await mongoose.connect(MONGO_CONNECTION_URL);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    console.log('Creating 20 Service Providers...');
    const providers = [];
    for (let i = 0; i < 20; i++) {
      providers.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: 'provider',
        businessName: faker.company.name() + ' Laundry',
        description: faker.company.catchPhrase(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress() + ', ' + faker.location.city(),
        rating: faker.number.float({ min: 3, max: 5, multipleOf: 0.1 }),
        totalRatings: faker.number.int({ min: 50, max: 1000 }),
        ratingCount: faker.number.int({ min: 10, max: 200 }),
        services: [
          { name: 'Wash & Fold', pricePerKg: faker.number.int({ min: 50, max: 150 }), unit: 'kg' },
          { name: 'Dry Clean', pricePerItem: faker.number.int({ min: 100, max: 300 }), unit: 'item' },
          { name: 'Ironing', pricePerItem: faker.number.int({ min: 10, max: 50 }), unit: 'item' }
        ],
        isAvailable: true
      });
    }

    console.log('Creating 20 Customers...');
    const customers = [];
    for (let i = 0; i < 20; i++) {
      customers.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: 'customer'
      });
    }

    await User.insertMany([...providers, ...customers]);
    
    console.log('Successfully seeded 20 providers and 20 customers.');
    console.log('Default password for all users is: password123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedData();
