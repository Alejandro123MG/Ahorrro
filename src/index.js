require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const savingGoalRoutes = require('./routes/savingGoal.routes');
const investmentRoutes = require('./routes/investment.routes');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/saving-goals', savingGoalRoutes);
app.use('/api/investments', investmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API de Gestion Financiera Personal' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salio mal en el servidor' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
