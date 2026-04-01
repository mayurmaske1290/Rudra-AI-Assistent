require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Publisher = require('./models/Publisher');
const Book = require('./models/Book');
const Student = require('./models/Student');

(async () => {
  await connectDB();
  await Admin.deleteMany({});
  await Publisher.deleteMany({});
  await Book.deleteMany({});
  await Student.deleteMany({});

  await Admin.create({ name: 'Main Admin', email: 'admin@library.com', password: 'admin123' });
  await Publisher.insertMany([
    { publisher_id: 'PUB001', publisher_name: 'Penguin', publisher_address: 'NY, USA' },
    { publisher_id: 'PUB002', publisher_name: 'OReilly', publisher_address: 'CA, USA' }
  ]);
  await Book.insertMany([
    { book_id: 'BK001', title: 'Clean Code', author: 'Robert Martin', price: 45, publisher: 'OReilly', category: 'Programming', available_copies: 3 },
    { book_id: 'BK002', title: 'Atomic Habits', author: 'James Clear', price: 22, publisher: 'Penguin', category: 'Self Help', available_copies: 4 }
  ]);
  await Student.insertMany([
    { student_id: 'ST001', name: 'Alice Johnson', department: 'CSE', email: 'alice@uni.edu', phone: '1111111111' },
    { student_id: 'ST002', name: 'Bob Smith', department: 'ECE', email: 'bob@uni.edu', phone: '2222222222' }
  ]);

  console.log('Seed data inserted');
  process.exit(0);
})();
