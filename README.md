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

- CSS mobile first: layout de celular como base e melhorias progressivas para tablet e desktop com media queries de largura mínima.
- Controles principais com pelo menos 44 px de altura, campos de formulário com fonte de 16 px e espaço para a área segura do celular.
- Serviços organizados por cabelo, unhas e sobrancelhas, com filtros.
- Agendamento acessível em diálogo nativo, com escolha de procedimento e mensagem personalizada no WhatsApp. A equipe confirma valores e disponibilidade; o site não efetua reservas automaticamente.
- Instagram, Google Maps, Waze, endereço, horários e perguntas frequentes.
- PWA com cache offline e instalação quando suportada pelo navegador.
- Imagens WebP locais, carregamento tardio e ícones SVG sem bibliotecas externas.
- Navegação por teclado, links de contato sem JavaScript e suporte a movimento reduzido.

## Conteúdo e publicação

Os serviços e horários vieram do repositório original e foram revisados pelo responsável: atendimento de segunda a sábado, das 7h às 19h, mediante agendamento; cabelo inclui coloração, cortes, tratamentos e alisamento personalizado sem formol, liberado pela Anvisa; as unhas são mão tradicional, pé tradicional, blindagem e spa dos pés. O responsável confirmou o WhatsApp (11) 91061-8237 e o endereço no Parque Imperial, corrigindo o número da rua para 77. Fotos reais das publicações públicas do Instagram e Facebook foram integradas à capa, aos serviços de cabelo e sobrancelhas e à galeria. A galeria aparece após a capa e permite iniciar uma conversa com a publicação escolhida como referência. O botão de agendamento permanece visível no celular. Cada foto leva à publicação original; as fontes estão em `assets/images/real/sources.json`. Somente a imagem de unhas permanece ilustrativa. Endereço e WhatsApp do repositório foram confirmados pelo usuário, apesar das informações diferentes no Facebook. Não são exibidos depoimentos, preços ou avaliações sem comprovação.

O endereço canônico, os metadados sociais e o sitemap usam a publicação em `https://maykonlong.github.io/studio_di_catarina/`. Google Fonts e o mapa dependem de conexão, com fontes de sistema e links de rota como alternativas.

Publique os arquivos estáticos em um host HTTPS. O `server.js` é apenas para desenvolvimento local. Ao alterar CSS ou JavaScript, atualize o parâmetro `v` dos respectivos links em `index.html` e na lista `ASSETS` de `sw.js`, além da versão do cache. Os parâmetros devem coincidir nos dois arquivos. Isso evita misturar HTML novo com recursos antigos mesmo quando o service worker original ainda controla a primeira navegação após a publicação.

## Verificação e busca

`npm run check` verifica a sintaxe e executa testes de regressão para links e arquivos locais, contatos, referências das fotos, versões do cache e comportamento online/offline do service worker. A revisão visual foi feita em larguras de 320, 375, 390, 600, 768, 960, 1024, 1280 e 1440 px, incluindo navegação por teclado, filtros e diálogo em tela baixa. Isso é emulação de viewport, não teste em aparelhos físicos nem auditoria certificada de acessibilidade.

SEO: título, descrição, URL canônica, metadados sociais, sitemap e dados estruturados BeautySalon com contatos e serviços. As perguntas frequentes e o conteúdo local respondem dúvidas de clientes; `llms.txt` resume as informações. Esses recursos não garantem posição no Google ou recomendações por IA. O antigo arquivo `ai-plugin.json` não correspondia a uma integração funcional e foi removido.

No GitHub Pages de projeto, `robots.txt` está em uma subpasta e não controla o rastreamento do domínio. O arquivo só se aplica quando servido na raiz, conforme a [documentação do Google](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt). O sitemap pode ser enviado ao Search Console por quem administra a propriedade. A verificação e o envio não foram feitos nesta revisão.

## Arquivos principais

- `index.html`: conteúdo, SEO e diálogo de agendamento.
- `styles.css`: identidade visual e responsividade.
- `script.js`: menu, filtros, agendamento e instalação.
- `sw.js` / `manifest.json`: PWA.
- `assets/images/`: identidade original e imagens otimizadas.

© Studio Di Catarina. Todos os direitos reservados.
