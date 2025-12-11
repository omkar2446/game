import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Serve static assets with proper caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y', // Cache assets for 1 year (they have hash in filename)
  etag: false,
  index: false, // Don't serve index.html for directory requests
}));

// Explicitly handle CSS, JS, and other assets
app.use((req, res, next) => {
  // If request is for a file with extension, don't fall through to SPA
  if (/\.\w+$/.test(req.path)) {
    return res.status(404).send('Not found');
  }
  next();
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve sitemap, robots.txt, and other root-level files
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'robots.txt'));
});

app.get('/_redirects', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', '_redirects'));
});

// SPA fallback - serve index.html for all routes (except API)
app.get('*', (req, res) => {
  // Block API calls
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
