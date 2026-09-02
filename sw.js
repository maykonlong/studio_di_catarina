/* ============================================================
   STUDIO DI CATARINA — SERVICE WORKER (PWA WEBAPP)
   Cache-First para assets | Network-First para páginas
   ============================================================ */

const APP_VERSION = 'v3';
const CACHE_STATIC = `studio-di-catarina-static-${APP_VERSION}`;
const CACHE_DYNAMIC = `studio-di-catarina-dynamic-${APP_VERSION}`;

// Recursos críticos pré-cacheados na instalação
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/assets/images/logo.png',
  '/assets/images/hero_studio.png',
  '/assets/images/cabelo_service.png',
  '/assets/images/unha_service.png',
  '/assets/images/sobrancelha_service.png',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
];

// ---------------------------------------------------------------
// INSTALL — Pré-cachear todos os assets críticos
// ---------------------------------------------------------------
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Studio Di Catarina WebApp...');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => {
        console.log('[SW] Pré-cacheando assets...');
        // Adicionar um por um para não falhar tudo se um arquivo não existe
        return Promise.allSettled(
          PRECACHE_ASSETS.map(url =>
            cache.add(url).catch(err => console.warn(`[SW] Não cacheado: ${url}`, err))
          )
        );
      })
      .then(() => {
        console.log('[SW] Instalação concluída!');
        return self.skipWaiting(); // Ativar imediatamente
      })
  );
});

// ---------------------------------------------------------------
// ACTIVATE — Limpar caches antigos
// ---------------------------------------------------------------
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Studio Di Catarina WebApp...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name =>
              name.startsWith('studio-di-catarina-') &&
              name !== CACHE_STATIC &&
              name !== CACHE_DYNAMIC
            )
            .map(name => {
              console.log('[SW] Removendo cache antigo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Controle assumido de todos os clientes');
        return self.clients.claim();
      })
  );
});

// ---------------------------------------------------------------
// FETCH — Estratégia de cache por tipo de recurso
// ---------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests que não sejam GET
  if (request.method !== 'GET') return;

  // Ignorar extensões do Chrome e URLs externas de analytics
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname !== self.location.hostname && !url.hostname.includes('cdn.jsdelivr.net')) return;

  // HTML/JSON: Network-First (sempre tenta buscar versão atualizada)
  if (request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets estáticos (CSS, JS, Imagens, Fontes): Cache-First
  if (
    url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)$/) ||
    url.hostname.includes('cdn.jsdelivr.net')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Padrão: Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ---------------------------------------------------------------
// ESTRATÉGIAS DE CACHE
// ---------------------------------------------------------------

// Cache-First: Serve do cache, busca rede em background se não estiver
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Cache-First falhou:', request.url);
    return new Response('Recurso não disponível offline', { status: 503 });
  }
}

// Network-First: Tenta rede, usa cache como fallback
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Fallback: servir a página principal do cache
    const fallback = await caches.match('/index.html') || await caches.match('/');
    if (fallback) return fallback;

    return new Response(offlinePage(), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      status: 503
    });
  }
}

// Stale-While-Revalidate: Serve do cache E atualiza em background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_DYNAMIC);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Página offline de fallback
function offlinePage() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio Di Catarina — Sem Conexão</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #121010;
      color: #FAF7F5;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 24px;
    }
    .offline-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(196,123,117,0.3);
      border-radius: 24px;
      padding: 40px 32px;
      max-width: 400px;
    }
    .logo { font-size: 2.5rem; margin-bottom: 16px; }
    h1 { font-size: 1.4rem; color: #C47B75; margin-bottom: 12px; }
    p { color: #ABA3A1; font-size: 0.92rem; line-height: 1.6; margin-bottom: 24px; }
    a {
      display: inline-block;
      background: #25D366;
      color: #fff;
      padding: 14px 28px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>
  <div class="offline-card">
    <div class="logo">🌸</div>
    <h1>Studio Di Catarina</h1>
    <p>Você está sem conexão com a internet.<br>Para agendar, entre em contato pelo WhatsApp!</p>
    <a href="https://wa.me/5511910618237?text=Ol%C3%A1!%20Quero%20agendar%20um%20hor%C3%A1rio.">
      📱 WhatsApp (11) 91061-8237
    </a>
  </div>
</body>
</html>`;
}
