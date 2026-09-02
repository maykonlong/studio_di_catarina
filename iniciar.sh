#!/bin/bash
echo "========================================================"
echo "       STUDIO DI CATARINA - SERVIDOR LOCAL"
echo "========================================================"
echo ""
echo "Iniciando servidor web para testar o site..."
echo "Pressione Ctrl+C para encerrar o servidor."
echo ""

if command -v npx &> /dev/null
then
    npx -y serve . -l 3000
elif command -v python3 &> /dev/null
then
    python3 -m http.server 3000
else
    echo "[AVISO] Nem Node/npx nem Python foram encontrados. Abrindo index.html..."
    xdg-open index.html 2>/dev/null || open index.html 2>/dev/null
fi
