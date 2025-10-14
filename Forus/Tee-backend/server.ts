import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const userKeys = new Map<string, { publicKey: string; encryptedPrivateKey: string }>();
const detectedPayments = new Map<string, any[]>();

/**
 * GET /attestation
 * Returns TEE attestation report
 */
app.get('/attestation', (req: Request, res: Response) => {
  // In production, this would return real attestation from TEE
  const attestation = {
    valid: true,
    teePublicKey: 'mock-tee-public-key-for-encryption',
    measurements: [
      'mock-pcr0-measurement',
      'mock-pcr1-measurement',
      'mock-pcr2-measurement'
    ],
    timestamp: Date.now()
  };

  res.json(attestation);
});

/**
 * POST /register
 * Register user's encrypted private key
 */
app.post('/register', (req: Request, res: Response) => {
  const { publicKey, encryptedPrivateKey } = req.body;

  if (!publicKey || !encryptedPrivateKey) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // Generate unique user ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Store user data
  userKeys.set(userId, { publicKey, encryptedPrivateKey });
  detectedPayments.set(userId, []);

  console.log(`User registered: ${userId}`);

  res.json({
    userId,
    success: true
  });
});

/**
 * GET /payments/:userId
 * Get detected payments for a user
 */
app.get('/payments/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userKeys.has(userId)) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  const payments = detectedPayments.get(userId) || [];
  res.json(payments);
});

/**
 * POST /sign
 * Sign a transaction using stored private key
 */
app.post('/sign', (req: Request, res: Response) => {
  const { userId, stealthAddress, unsignedTx } = req.body;

  if (!userId || !stealthAddress || !unsignedTx) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  if (!userKeys.has(userId)) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // In production, this would:
  // 1. Retrieve encrypted private key from TEE
  // 2. Compute stealth private key
  // 3. Sign transaction inside TEE
  // 4. Return signed transaction

  const mockSignedTx = '0x' + 'f'.repeat(200); // Mock signed transaction

  console.log(`Transaction signed for user ${userId}`);

  res.json({
    signedTx: mockSignedTx,
    success: true
  });
});

/**
 * DELETE /user/:userId
 * Delete user's private key from TEE
 */
app.delete('/user/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userKeys.has(userId)) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  userKeys.delete(userId);
  detectedPayments.delete(userId);

  console.log(`User deleted: ${userId}`);

  res.json({
    success: true
  });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now()
  });
});

/**
 * Background scanner simulation
 * In production, this would be in the TEE
 */

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend API server running on port ${PORT}`);
  console.log(`📍 Attestation endpoint: http://localhost:${PORT}/attestation`);
  console.log(`📍 Register endpoint: http://localhost:${PORT}/register`);
  

});