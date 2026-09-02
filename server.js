const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT_HTTPS = 3001;
const PORT_HTTP = 3000;
const BASE_DIR = __dirname;

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function serveRequest(req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  const filePath = path.join(BASE_DIR, urlPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Try index.html for SPA fallback
      const indexPath = path.join(BASE_DIR, 'index.html');
      fs.readFile(indexPath, (err2, data) => {
        if (err2) { res.writeHead(404); return res.end('Not Found'); }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          ...pwaHeaders()
        });
        res.end(data);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err2, data) => {
      if (err2) { res.writeHead(500); return res.end('Server Error'); }

      const headers = { 'Content-Type': mimeType, ...pwaHeaders() };

      // Service Worker must be served from root scope
      if (urlPath === '/sw.js') {
        headers['Service-Worker-Allowed'] = '/';
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      }

      // Manifest needs correct MIME
      if (urlPath === '/manifest.json') {
        headers['Content-Type'] = 'application/manifest+json';
      }

      res.writeHead(200, headers);
      res.end(data);
    });
  });
}

function pwaHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Permissions-Policy': 'geolocation=(), microphone=()',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

// Generate self-signed cert for HTTPS (for PWA testing)
function getCertificates() {
  const certDir = path.join(BASE_DIR, '.cert');
  const keyPath  = path.join(certDir, 'key.pem');
  const certPath = path.join(certDir, 'cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  }

  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

  console.log('🔐 Gerando certificado SSL autoassinado para HTTPS...');
  try {
    execSync(
      `openssl req -x509 -newkey rsa:2048 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=localhost/O=Studio Di Catarina/C=BR"`,
      { stdio: 'pipe' }
    );
    console.log('✅ Certificado gerado com sucesso!');
    return { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) };
  } catch (e) {
    return null;
  }
}

// HTTP server (redirect to HTTPS)
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://localhost:${PORT_HTTPS}${req.url}` });
  res.end();
}).listen(PORT_HTTP);

// Try HTTPS first (required for PWA)
const certs = getCertificates();

if (certs) {
  https.createServer(certs, serveRequest).listen(PORT_HTTPS, () => {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║    🌸 STUDIO DI CATARINA — WEBAPP SERVER         ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  🔒 HTTPS (PWA): https://localhost:${PORT_HTTPS}          ║`);
    console.log(`║  🔄 HTTP (redir): http://localhost:${PORT_HTTP}           ║`);
    console.log('╠══════════════════════════════════════════════════╣');
    console.log('║  ⚠️  Ao abrir, aceite o certificado autoassinado  ║');
    console.log('║     Clique em "Avançado" → "Continuar para..."   ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log('║  📱 PWA/WebApp vai funcionar no Chrome/Edge:     ║');
    console.log('║     Procure o ícone ⊕ na barra de endereço       ║');
    console.log('║  ⛔ Pressione Ctrl+C para encerrar               ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
  });
} else {
  // Fallback: HTTP only (SW won't work, but site renders)
  http.createServer(serveRequest).listen(PORT_HTTP + 2, () => {
    console.log('\n⚠️  OpenSSL não encontrado — rodando em HTTP (PWA limitado)');
    console.log(`🌐 Site: http://localhost:${PORT_HTTP + 2}`);
    console.log('💡 Para PWA completo, instale o OpenSSL\n');
  });
}
