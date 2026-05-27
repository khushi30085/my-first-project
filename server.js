const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Form se data read karne ke liye middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. LOCAL MONGODB CONNECTION (Isme koi internet ya IP whitelist nahi chahiye)
const localDB = 'mongodb://localhost:27017/ranchi_university_db';

mongoose.connect(localDB)
    .then(() => console.log("🔋 Local MongoDB Connected Successfully! 🎉"))
    .catch((err) => console.log("❌ Database connection error:", err));

// 2. Schema (Structure) banana
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// Model banana
const User = mongoose.model('User', userSchema);

// Frontend file (index.html) ko server par dikhane ke liye
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Data catch karke Database me save karne wala Route
app.post('/auth', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Naya user create karna
        const newUser = new User({
            email: email,
            password: password
        });

        // Data ko hamesha ke liye Database me save karna
        await newUser.save();

        console.log("-----------------------------------");
        console.log("🎉 DATA DATABASE ME SAVE HO GAYA!");
        console.log("Saved Email:", email);
        console.log("-----------------------------------");

        res.send("<h1>Badhai ho! Aapka account ban gaya aur data database me safe hai.</h1>");

    } catch (error) {
        console.log("Data save karne me dikkat aayi:", error);
        res.status(500).send("Kuch error aaya!");
    }
});

// Server Configuration
app.listen(3000, () => {
    console.log("🚀 Server is running on http://localhost:3000");
});
