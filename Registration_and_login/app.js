const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gatherandgo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Create a schema for users
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Route to handle registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user document
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Route to handle login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).send('Invalid credentials');
        }

        // If login is successful
        res.status(200).send('Login successful');
    } catch (err) {
        res.status(500).send('Error during login');
    }
});
// Route to handle contact form submissions
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // For simplicity, we're just logging the contact form data to the console.
        // You could also store this in a database, send an email, etc.
        console.log('Contact Form Submission:', { name, email, message });

        res.status(200).send('Message received');
    } catch (err) {
        res.status(500).send('Error sending message');
    }
});
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadPath = path.join(__dirname, 'uploads');
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdirSync(uploadPath);
//         }
//         cb(null, uploadPath);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // Route to handle file uploads
// app.post('/upload', upload.single('media'), (req, res) => {
//     try {
//         // Save file information to the database
//         const mediaFile = {
//             filename: req.file.filename,
//             path: req.file.path,
//             mimetype: req.file.mimetype,
//         };

//         // You can save the file info in your database (like MongoDB)
//         // For example: await Media.create(mediaFile);

//         res.status(201).send('File uploaded successfully');
//     } catch (err) {
//         res.status(500).send('Error uploading file');
//     }
// });

// // Route to get all uploaded media files
// app.get('/media', async (req, res) => {
//     try {
//         // Fetch all media files from the database
//         // For example: const mediaFiles = await Media.find({});
        
//         // Send the media file information as a response
//         res.json(mediaFiles);
//     } catch (err) {
//         res.status(500).send('Error fetching media files');
//     }
// });


