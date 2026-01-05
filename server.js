const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbURI = 'mongodb+srv://ruzman:ruzman225@cluster0.e9rjhhh.mongodb.net/barristerDB?appName=Cluster0';
mongoose.connect(dbURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((err) => console.error('❌ Connection Error:', err));

// --- SCHEMAS ---

// 1. User Schema (Advocate)
const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, required: true, unique: true },
    password: String // In real apps, you'd hash this!
});
const User = mongoose.model('User', userSchema);

// 2. Case Schema (Linked to Advocate via email)
const caseSchema = new mongoose.Schema({
    advocate_email: String, // <--- This links the case to the user
    cnr_number: String,
    case_type: String,
    petitioner: String,
    respondent: String,
    section: String,
    next_hearing: String
});
const Case = mongoose.model('Case', caseSchema);

// --- API ROUTES ---

// Route 1: Register New Advocate
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        res.status(400).json({ error: "Email might already exist" });
    }
});

// Route 2: Login (Checks if user exists)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
        res.json({ message: "Login Success", user: user });
    } else {
        res.status(401).json({ message: "Invalid Credentials" });
    }
});

// Route 3: Add Case (Linked to logged-in user)
app.post('/add-case', async (req, res) => {
    try {
        const newCase = new Case(req.body);
        await newCase.save();
        console.log("Case Saved:", req.body); // Check terminal to see if it works
        res.json({ message: "Case Saved Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save case" });
    }
});

app.listen(3000, () => {
    console.log('🚀 Server running on port 3000');
});