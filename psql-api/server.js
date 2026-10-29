const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); 
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// ডাটাবেজ কানেকশন পুল তৈরি
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

// ডাটাবেজ কানেকশন চেক
pool.connect((err, client, release) => {
    if (err) {
        return console.error('ডাটাবেজ কানেক্ট করতে সমস্যা হয়েছে:', err.stack);
    }
    console.log('PostgreSQL ডাটাবেজ সফলভাবে কানেক্ট হয়েছে!');
    release();
});

// 🔴 এই রুটটি সরাসরি ব্রাউজারে টেবিলসহ ইন্টারফেসটি তৈরি করে দেবে (কোনো এক্সটার্নাল ফাইল লাগবে না)
app.get('/', async (req, res) => {
    try {
        const queryText = "SELECT * FROM customers WHERE city = 'Dhaka';";
        const result = await pool.query(queryText);
        
        // কাস্টমারদের ডেটা দিয়ে টেবিলের রো (Rows) তৈরি করা
        let tableRows = '';
        result.rows.forEach(customer => {
            tableRows += `
                <tr>
                    <td>${customer.customer_id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.city}</td>
                </tr>
            `;
        });

        // পুরো এইচটিএমএল পেজটি রেসপন্স আকারে পাঠানো
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Customer Dashboard</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background-color: #f4f4f9; }
                h2 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; }
                th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #007bff; color: white; }
                tr:hover { background-color: #f1f1f1; }
            </style>
        </head>
        <body>
            <h2>ঢাকা শহরের কাস্টমারদের তালিকা (Frontend via Express)</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows ? tableRows : '<tr><td colspan="4">কোনো ডেটা পাওয়া যায়নি</td></tr>'}
                </tbody>
            </table>
        </body>
        </html>
        `;
        
        res.send(htmlContent);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('সার্ভার অথবা ডাটাবেজ এরর');
    }
});

// কাস্টমার ডেটা পাওয়ার ব্যাকএন্ড API এন্ডপয়েন্ট
app.get('/api/customers/dhaka', async (req, res) => {
    try {
        const queryText = "SELECT * FROM customers WHERE city = 'Dhaka';";
        const result = await pool.query(queryText);
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('সার্ভার এরর');
    }
});

// সার্ভার চালু করা
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`সার্ভার চলছে http://localhost:${PORT} পোর্টে`);
});