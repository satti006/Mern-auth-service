const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'week-six-demo-secret';
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const users = [
  { id: 1, name: 'Avery Chen', email: 'admin@northstar.dev', passwordHash: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { id: 2, name: 'Maya Brooks', email: 'user@northstar.dev', passwordHash: bcrypt.hashSync('user123', 10), role: 'member' },
];
let services = [
  { id: 1, name: 'Cloud infrastructure', category: 'Operations', status: 'Healthy', uptime: '99.99%', owner: 'Platform team', color: 'teal' },
  { id: 2, name: 'Billing API', category: 'Finance', status: 'Healthy', uptime: '99.95%', owner: 'Revenue team', color: 'coral' },
  { id: 3, name: 'Customer dashboard', category: 'Product', status: 'Degraded', uptime: '98.72%', owner: 'Experience team', color: 'gold' },
  { id: 4, name: 'Email automation', category: 'Growth', status: 'Healthy', uptime: '99.90%', owner: 'Lifecycle team', color: 'blue' },
];
function signToken(user) { return jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '2h' }); }
function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'A valid session is required.' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); } catch { res.status(401).json({ message: 'Your session has expired. Please sign in again.' }); }
}
function requireAdmin(req, res, next) { if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access is required for this action.' }); next(); }
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, role: user.role }; }

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'northstar-api' }));
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ message: 'Name, email, and a 6+ character password are required.' });
  if (users.some((user) => user.email === email.toLowerCase())) return res.status(409).json({ message: 'An account with that email already exists.' });
  const user = { id: users.length + 1, name, email: email.toLowerCase(), passwordHash: bcrypt.hashSync(password, 10), role: 'member' };
  users.push(user); res.status(201).json({ token: signToken(user), user: publicUser(user) });
});
app.post('/api/auth/login', (req, res) => {
  const user = users.find((candidate) => candidate.email === req.body.email?.toLowerCase());
  if (!user || !bcrypt.compareSync(req.body.password || '', user.passwordHash)) return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ token: signToken(user), user: publicUser(user) });
});
app.get('/api/me', authenticate, (req, res) => res.json({ user: req.user }));
app.get('/api/services', authenticate, (_req, res) => res.json({ services }));
app.get('/api/analytics', authenticate, requireAdmin, (_req, res) => res.json({ analytics: { activeUsers: 1284, apiCalls: '2.4M', conversion: '18.6%', incidentFreeDays: 47 } }));
app.delete('/api/services/:id', authenticate, requireAdmin, (req, res) => {
  const id = Number(req.params.id); const service = services.find((item) => item.id === id);
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  services = services.filter((item) => item.id !== id); res.json({ message: `${service.name} was removed.`, services });
});
app.listen(PORT, () => console.log(`Northstar API running at http://localhost:${PORT}`));
