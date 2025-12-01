const express = require('express'); // Trigger restart
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const migrate = require('./utils/migrate');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/gallery', require('./routes/gallery'));

app.get('/', (req, res) => {
    res.send('Fifty Villagers API is running');
});

// Start Server with Migration
const startServer = async () => {
    try {
        // Run migrations before starting the server
        await migrate();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
