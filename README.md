# 🌸 Studio Di Catarina — WebApp Oficial

> **Salão de Beleza especializado em Cabelo, Unhas e Sobrancelhas**  
> Parque Imperial, Barueri - SP · WhatsApp: [(11) 91061-8237](https://wa.me/5511910618237)

[![PWA](https://img.shields.io/badge/PWA-Enabled-purple?logo=googlechrome)](https://studiodicatarina.com.br)
[![SEO](https://img.shields.io/badge/SEO-Otimizado-green?logo=google)](https://studiodicatarina.com.br)
[![Schema.org](https://img.shields.io/badge/Schema.org-BeautySalon-orange)](https://studiodicatarina.com.br)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📋 Sobre o Projeto

Site institucional e **WebApp PWA** do Studio Di Catarina, desenvolvido com foco em:

- 📱 **Mobile-First** — design responsivo para todos os dispositivos
- ⚡ **Performance** — Core Web Vitals otimizados (LCP, FID, CLS)
- 🔍 **Super SEO Local** — Schema.org, FAQPage, BreadcrumbList, AggregateRating
- 🤖 **GEO** — Otimizado para IAs (ChatGPT, Gemini, Perplexity) com `llms.txt`
- 📦 **PWA/WebApp** — Instalável na tela inicial, funciona offline
- 🗺️ **Navegação** — Botões diretos para Google Maps, Waze, Uber e 99

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|-----------|-----|
| HTML5 semântico | Estrutura + SEO |
| CSS3 + Variáveis | Design System com identidade da marca |
| JavaScript Vanilla | Interatividade + PWA Engine |
| Service Worker | Cache offline + instalação |
| Web App Manifest | Instalação na tela inicial |
| Schema.org JSON-LD | SEO estruturado |
| Node.js | Servidor HTTPS local para desenvolvimento |

---

## 🚀 Rodando Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org) v18+ instalado
- OpenSSL (já incluído no Node.js no Windows)

### Iniciar o servidor HTTPS (necessário para PWA)

```bash
# Clonar o repositório
git clone https://github.com/maykonlong/studio_di_catarina.git
cd studio_di_catarina

# Iniciar servidor HTTPS
node server.js
```

Ou simplesmente executar o **`iniciar.bat`** no Windows.

O servidor abrirá em:
- 🔒 **HTTPS (PWA)**: `https://localhost:3001`
- 🔄 **HTTP (redirect)**: `http://localhost:3000`

> ⚠️ Na primeira vez, aceite o certificado autoassinado: clique **"Avançado" → "Continuar para localhost"**

---

## 📁 Estrutura do Projeto

```
studio_di_catarina/
├── index.html              # Página principal (PWA + SEO completo)
├── styles.css              # Design System + layout responsivo
├── script.js               # Lógica, PWA install, Bottom Sheet
├── sw.js                   # Service Worker (cache offline)
├── manifest.json           # Web App Manifest (instalação PWA)
├── server.js               # Servidor HTTPS local para dev
├── sitemap.xml             # Sitemap para Google/Bing
├── robots.txt              # Permissões para crawlers + bots de IA
├── llms.txt                # Otimização para IAs (GEO)
├── iniciar.bat             # Launcher Windows
├── iniciar.sh              # Launcher Linux/Mac
├── .well-known/
│   └── ai-plugin.json      # Metadata para assistentes de IA
└── assets/
    └── images/
        ├── logo.png
        ├── hero_studio.png
        ├── cabelo_service.png
        ├── unha_service.png
        ├── sobrancelha_service.png
        ├── icon-192.png
        └── icon-512.png
```

---

## 📱 Funcionalidades PWA

- ✅ Instalável na tela inicial (Android, iOS, Windows, Mac)
- ✅ Funciona offline com página de fallback elegante
- ✅ Bottom Navigation Bar nativa para mobile
- ✅ Bottom Sheet de agendamento rápido
- ✅ Banner de instalação do app
- ✅ Shortcuts de tela inicial (Agendar, Mapa, Serviços)
- ✅ Suporte a iOS Safari (apple-mobile-web-app-capable)

---

## 🔍 SEO & GEO

### SEO Técnico
- Schema.org: `BeautySalon`, `FAQPage`, `BreadcrumbList`, `OfferCatalog`, `AggregateRating`
- Meta tags completas: Open Graph, Twitter Cards, Geo, robots
- `sitemap.xml` com imagens | `robots.txt` completo
- Preconnect, Preload (LCP otimizado)

### GEO — Para IAs Recomendarem
- `llms.txt` — Contexto estruturado para ChatGPT, Gemini, Perplexity
- `.well-known/ai-plugin.json` — Descoberta automática por LLMs
- `robots.txt` com permissão explícita para GPTBot, ClaudeBot, PerplexityBot, Google-Extended

---

## 🗺️ Navegação e Transporte

Botões diretos para levar clientes ao salão:

| App | Deep Link |
|-----|-----------|
| Google Maps | Link oficial do negócio |
| Waze | GPS com coordenadas `-23.5041, -46.8048` |
| Uber | Deep link com destino pré-definido |
| 99 Pop | Link direto para o app |

---

## 📍 Informações do Studio

| | |
|-|-|
| **Endereço** | R. Frei Henrique Soares de Coimbra, 251 - Parque Imperial, Barueri - SP, 06462-190 |
| **WhatsApp** | [(11) 91061-8237](https://wa.me/5511910618237) |
| **Instagram** | [@studiodicatarina](https://www.instagram.com/studiodicatarina/) |
| **Facebook** | [Studio Di Catarina](https://www.facebook.com/studiodicatarina/) |
| **Horário** | Terça a Sábado, 09h às 19h |

---

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para o **Studio Di Catarina**.  
© 2026 Studio Di Catarina — Todos os direitos reservados.
