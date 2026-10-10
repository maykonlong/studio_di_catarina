# Studio Di Catarina

Site institucional responsivo para o salão de beleza no Parque Imperial, Barueri. HTML, CSS e JavaScript, sem dependências de execução ou etapa de build.

## Executar

Com Node.js 18 ou superior:

```sh
npm start
```

Abra http://127.0.0.1:3000. Também é possível usar `node server.js` ou `iniciar.bat`. O servidor fica restrito ao computador local por padrão; `PORT` e `HOST` permitem configurar o endereço. O modo offline funciona em localhost, sem instalar certificados. Em produção, use HTTPS.

```sh
npm run check
```

## Experiência

- Layout editorial em creme, cobre e marrom, com versões para celular e desktop.
- Serviços organizados por cabelo, unhas e sobrancelhas/cílios, com filtros.
- Agendamento acessível em diálogo nativo, com escolha de procedimento e mensagem personalizada no WhatsApp. A equipe confirma valores e disponibilidade; o site não efetua reservas automaticamente.
- Instagram, Google Maps, Waze, endereço, horários e perguntas frequentes.
- PWA com cache offline e instalação quando suportada pelo navegador.
- Imagens WebP locais, carregamento tardio e ícones SVG sem bibliotecas externas.
- Navegação por teclado, links de contato sem JavaScript e suporte a movimento reduzido.

## Conteúdo e publicação

Os contatos, serviços, endereço e horários foram preservados do repositório original. Fotos reais das publicações públicas do Instagram e Facebook foram integradas à capa, aos serviços de cabelo e sobrancelhas e à galeria. Cada foto leva à publicação original; as fontes estão em `assets/images/real/sources.json`. A foto de fachada é identificada como registro de outubro de 2023. Somente a imagem de unhas permanece ilustrativa. Endereço e WhatsApp do repositório foram confirmados pelo usuário, apesar das informações diferentes no Facebook. Não são exibidos depoimentos, preços ou avaliações sem comprovação.

O domínio canônico e as URLs sociais preservam `https://studiodicatarina.com.br/`; ajuste-os se o domínio de publicação for outro. Google Fonts e o mapa dependem de conexão, com fontes de sistema e links de rota como alternativas.

Publique os arquivos estáticos em um host HTTPS. O `server.js` é apenas para desenvolvimento local. Ao alterar CSS ou JavaScript, atualize o parâmetro `v` dos respectivos links em `index.html` e na lista `ASSETS` de `sw.js`, além da versão do cache. Os parâmetros devem coincidir nos dois arquivos. Isso evita misturar HTML novo com recursos antigos mesmo quando o service worker original ainda controla a primeira navegação após a publicação.

## Arquivos principais

- `index.html`: conteúdo, SEO e diálogo de agendamento.
- `styles.css`: identidade visual e responsividade.
- `script.js`: menu, filtros, agendamento e instalação.
- `sw.js` / `manifest.json`: PWA.
- `assets/images/`: identidade original e imagens otimizadas.

© Studio Di Catarina. Todos os direitos reservados.
