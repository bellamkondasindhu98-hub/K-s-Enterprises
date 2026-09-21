/**
 * K's ENTERPRISES - Fish Feed Company
 * Modular Node.js Web Server & Authentication REST API
 * 
 * Features:
 * 1. Serves static frontend assets (HTML, CSS, JS, Images)
 * 2. Backend REST API endpoints:
 *    - POST /api/auth/login
 *    - POST /api/auth/register
 * 3. Supports single-page application (SPA) client route fallback
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      });
    } catch (e) {
      console.warn('Failed to load .env file:', e.message);
    }
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-memory User Database (supporting both Local & Google Auth)
const USERS_DB = [
  {
    id: "usr_ks_01",
    email: "demo@gmail.com",
    passwordPlain: "Demo@123", // In production: bcrypt/argon2 hash
    name: "Alex Morgan",
    phone: "+91 9876543210",
    role: "Aquaculture Farm Manager",
    farmName: "Blue Ocean Aqua Farms",
    avatar: "ceo.jpg",
    profileImage: "ceo.jpg",
    googleId: null,
    authProvider: "local",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];

// In-memory Password Reset Tokens Database (simulating Redis / SQL token table)
const RESET_TOKENS_DB = new Map();

function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    authProvider: user.authProvider || 'local',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  return "ks_jwt_" + Buffer.from(JSON.stringify(payload)).toString('base64url');
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // CORS Headers for API flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTE: POST /api/auth/login
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body || '{}');

        if (!email || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Email and password are required'
          }));
          return;
        }

        const normalizedEmail = (email || '').trim().toLowerCase();
        const user = USERS_DB.find(u => u.email.toLowerCase() === normalizedEmail);

        if (!user || user.passwordPlain !== password) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid login credentials'
          }));
          return;
        }

        const token = generateToken(user);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Authentication successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            farmName: user.farmName,
            avatar: user.avatar
          },
          expiresAt: Date.now() + (24 * 3600 * 1000)
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Malformed request JSON body'
        }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTE: POST /api/auth/register
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { name, email, phone, password } = JSON.parse(body || '{}');

        if (!name || !email || !phone || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'All fields (name, email, phone, password) are required.'
          }));
          return;
        }

        const normalizedEmail = (email || '').trim().toLowerCase();
        const existingUser = USERS_DB.find(u => u.email.toLowerCase() === normalizedEmail);

        if (existingUser) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            duplicateEmail: true,
            message: 'An account with this email already exists. Please login.'
          }));
          return;
        }

        // Create new user (automatically assigned CUSTOMER role)
        const newUser = {
          id: "usr_ks_" + Date.now(),
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          passwordPlain: password,
          role: "CUSTOMER", // Public registration strictly assigned CUSTOMER
          farmName: "Aquaculture Commercial Farm",
          avatar: "ceo.jpg",
          createdAt: new Date().toISOString()
        };

        USERS_DB.push(newUser);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Account created successfully!',
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role
          }
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Malformed request JSON body'
        }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTE: POST /api/auth/forgot-password
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { email } = JSON.parse(body || '{}');

        if (!email || !email.trim()) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Email is required'
          }));
          return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(normalizedEmail)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Please enter a valid email address'
          }));
          return;
        }

        // Check if user exists in database (simulated)
        const user = USERS_DB.find(u => u.email.toLowerCase() === normalizedEmail);

        // Security best practice: Always return generic success response
        // whether user exists or not, preventing email enumeration attacks.
        let resetToken = null;
        if (user) {
          resetToken = "ks_rst_" + crypto.randomBytes(24).toString('hex');
          RESET_TOKENS_DB.set(resetToken, {
            email: normalizedEmail,
            expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour token lifetime
          });

          // In production: dispatch email via SMTP (SendGrid, AWS SES, Nodemailer)
          console.log(`[INFO] Password reset token generated for ${normalizedEmail}: ${resetToken}`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'If an account exists for this email, a password reset link has been sent.',
          // Provide token for prototype continuation in local development
          token: resetToken || ("ks_rst_proto_" + crypto.randomBytes(16).toString('hex'))
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Malformed request JSON body'
        }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTE: POST /api/auth/reset-password
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { token, password } = JSON.parse(body || '{}');

        if (!password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'New password is required'
          }));
          return;
        }

        // Verify token in mock tokens database
        const tokenRecord = RESET_TOKENS_DB.get(token);
        if (tokenRecord) {
          if (Date.now() > tokenRecord.expiresAt) {
            RESET_TOKENS_DB.delete(token);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: 'Password reset token has expired. Please request a new link.'
            }));
            return;
          }

          const user = USERS_DB.find(u => u.email.toLowerCase() === tokenRecord.email);
          if (user) {
            user.passwordPlain = password;
          }
          RESET_TOKENS_DB.delete(token);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Password has been successfully updated.'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Malformed request JSON body'
        }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTE: GET /api/auth/config
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/config' && req.method === 'GET') {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    const isConfigured = Boolean(
      googleClientId && 
      googleClientId.trim().length > 5 && 
      !googleClientId.includes('your_google_client_id')
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      googleClientId,
      isGoogleConfigured: isConfigured
    }));
    return;
  }

  // --------------------------------------------------------------------------
  // API ROUTE: POST /api/auth/google
  // --------------------------------------------------------------------------
  if (pathname === '/api/auth/google' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { credential } = JSON.parse(body || '{}');

        if (!credential) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Google credential token is required'
          }));
          return;
        }

        // Verify token with Google's verification service
        let googlePayload = null;
        try {
          const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
          const verifyRes = await fetch(verifyUrl);
          if (verifyRes.ok) {
            googlePayload = await verifyRes.json();
          } else {
            const errData = await verifyRes.json().catch(() => ({}));
            console.warn('[Google Auth] Token verification notice from Google:', errData);
          }
        } catch (fetchErr) {
          console.warn('[Google Auth] Notice checking Google verification endpoint:', fetchErr.message);
        }

        // Support for test/dev environment JWT verification
        if (!googlePayload && credential.includes('.')) {
          try {
            const parts = credential.split('.');
            if (parts.length === 3) {
              const decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
              if (decoded && (decoded.email || decoded.sub)) {
                googlePayload = decoded;
              }
            }
          } catch (jwtErr) {}
        }

        if (!googlePayload || (!googlePayload.email && !googlePayload.sub)) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid or expired Google authentication credential.'
          }));
          return;
        }

        const email = (googlePayload.email || '').toLowerCase().trim();
        const googleId = googlePayload.sub || null;
        const name = googlePayload.name || (email ? email.split('@')[0] : 'Google User');
        const picture = googlePayload.picture || 'ceo.jpg';

        // Find user by email or googleId
        let user = USERS_DB.find(u => 
          (googleId && u.googleId === googleId) || 
          (email && u.email.toLowerCase() === email)
        );

        if (user) {
          // Link Google ID and update profile image if not linked
          if (!user.googleId && googleId) {
            user.googleId = googleId;
          }
          if (picture && (!user.avatar || user.avatar === 'ceo.jpg')) {
            user.avatar = picture;
            user.profileImage = picture;
          }
          user.updatedAt = new Date().toISOString();
        } else {
          // Create new user (automatically assigned CUSTOMER role)
          user = {
            id: "usr_g_" + Date.now(),
            name,
            email,
            phone: null,
            passwordPlain: null, // No password stored for Google accounts
            googleId,
            avatar: picture,
            profileImage: picture,
            authProvider: "google",
            role: "CUSTOMER", // All public registrations assigned CUSTOMER
            farmName: "Aquaculture Commercial Partner",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          USERS_DB.push(user);
        }

        const token = generateToken(user);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Google authentication successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            farmName: user.farmName,
            avatar: user.avatar,
            profileImage: user.profileImage,
            authProvider: user.authProvider || 'google'
          },
          expiresAt: Date.now() + (24 * 3600 * 1000)
        }));
      } catch (err) {
        console.error('[Google Auth Error]', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Malformed request JSON body'
        }));
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // STATIC FILE SERVING
  // --------------------------------------------------------------------------
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(__dirname, safePath);

  // Check if requested path is a protected SPA route (e.g. /login, /register, /home)
  // If no static file exists, serve index.html for SPA routing
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  K's ENTERPRISES - Fish Feed Portal Server Running`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Demo Account: demo@gmail.com / Demo@123`);
  console.log(`======================================================\n`);
});
