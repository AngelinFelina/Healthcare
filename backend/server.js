import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MediScan Rural API' });
});

// Diagnostic endpoint (Mock AI)
app.post('/api/diagnose', (req, res) => {
  const { symptoms } = req.body;
  
  if (!symptoms || symptoms.length === 0) {
    return res.status(400).json({ error: 'No symptoms provided' });
  }

  // Simplified rule-based AI logic
  const symptomStr = symptoms.join(' ').toLowerCase();
  
  let diagnosis = "Mild Condition";
  let severity = "🟢 Mild";
  let advice = "Rest and drink fluids. See a doctor if symptoms persist.";
  
  if (symptomStr.includes('fever') && symptomStr.includes('cough')) {
    diagnosis = "Possible Viral Infection";
    severity = "🟡 Moderate";
    advice = "Rest, stay hydrated, and monitor temperature. Consult a doctor if fever lasts over 3 days.";
  }
  if (symptomStr.includes('chest pain') || symptomStr.includes('breathing')) {
    diagnosis = "Critical Condition detected";
    severity = "🔴 Immediate Hospital needed";
    advice = "Seek immediate emergency medical attention.";
  }
  
  res.json({
    diagnosis,
    severity,
    advice
  });
});

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mediscan_rural';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
