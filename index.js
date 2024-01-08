const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');  
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const password = process.env.DB_PASSWORD;
const DB = `mongodb+srv://rs1220525:${password}@cluster0.0b2xl7d.mongodb.net/expense?retryWrites=true&w=majority`;
mongoose.connect(DB).then(() => {
    console.log('Successful Connection...');
}).catch((err) => console.log(err));
const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
});
app.use(cors());
app.use(bodyParser.json()); 
const Expense = mongoose.model('Expense', expenseSchema);
// Fetch expenses from MongoDB
app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Store new expense in MongoDB
app.post('/api/expenses', async (req, res) => {
    console.log(req.body);

    if (!req.body || !req.body.title || !req.body.amount || isNaN(req.body.amount)) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }S
    const { title, amount } = req.body;
    const newExpense = new Expense({ title, amount });

    try {
        const savedExpense = await newExpense.save();
        console.log('New expense added:', savedExpense);
        res.status(201).json(savedExpense);
    } catch (err) {
        console.error('Error storing expense:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

var PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
