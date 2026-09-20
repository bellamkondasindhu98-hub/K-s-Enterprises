/**
 * K's ENTERPRISES - Fish Feed Company
 * Modular Node.js Web Server & Authentication REST API
 * 
 * Features:
 * 1. Serves static frontend assets (HTML, CSS, JS, Images)
 * 2. Provides backend REST API endpoint: POST /api/auth/login
 * 3. Supports single-page application (SPA) client route fallback
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Demo user store (can be easily replaced with PostgreSQL / MongoDB / MySQL)
const USERS_DB = [
  {
    id: "usr_ks_01",
    email: "demo@gmail.com",
    // In production, this would be a bcrypt/argon2 hashed password
    passwordPlain: "Demo@123",
    name: "Alex Morgan",
    role: "Aquaculture Farm Manager",
    farmName: "Blue Ocean Aqua Farms",
    avatar: "ceo.jpg"
  }
];

function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
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
  // STATIC FILE SERVING
  // --------------------------------------------------------------------------
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(__dirname, safePath);

  // Check if requested path is a protected SPA route (e.g. /login, /home, /products)
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
