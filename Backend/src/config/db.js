import mysql from 'mysql2/promise'
import { createUsersTable } from '../models/user.model.js'
import { createPropertyTable } from '../models/property.model.js';
import { createBookingTable } from '../models/booking.model.js';
import { createPaymentTable } from '../models/payment.model.js';
import { createReviewTable } from '../models/review.model.js';

let db;

const connectDB = async () => {
  try {
    db = await mysql.createConnection({

      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      port: 3306

    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
  await createUsersTable(db)
  await createPropertyTable(db)
  await createBookingTable(db)
  await createPaymentTable(db)
  await createReviewTable(db)


  console.log(process.env.DB_NAME);


};
export { db, connectDB };