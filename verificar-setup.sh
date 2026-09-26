#!/usr/bin/env bash
# Uso: ./verificar-setup.sh [caminho-do-projeto-frontend] [url-da-mercado-api]
# Exemplo: ./verificar-setup.sh ~/projetos/mercado-calc http://100.x.x.x:3010

FRONT_DIR="${1:-.}"
API_URL="${2:-http://localhost:3011}"

OK="\033[1;32m[OK]\033[0m"
FAIL="\033[1;31m[FALTA]\033[0m"
INFO="\033[1;34m[INFO]\033[0m"

total=0
falhas=0

checar_arquivo() {
  total=$((total+1))
  if [ -f "$1" ]; then
    echo -e "$OK $1"
  else
    echo -e "$FAIL $1 (não encontrado)"
    falhas=$((falhas+1))
  fi
}

checar_comando() {
  total=$((total+1))
  if command -v "$1" >/dev/null 2>&1; then
    echo -e "$OK $1 instalado ($($1 --version 2>&1 | head -n1))"
  else
    echo -e "$FAIL $1 não encontrado no PATH"
    falhas=$((falhas+1))
  fi
}

echo "========================================"
echo " 1. FERRAMENTAS NECESSÁRIAS"
echo "========================================"
checar_comando node
checar_comando npm
checar_comando curl
checar_comando docker

total=$((total+1))
NODE_MAJOR=$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 22 ]; then
  echo -e "$OK node v$NODE_MAJOR suporta node:sqlite (recomendado 24+, sem warning nenhum)"
else
  echo -e "$FAIL node:sqlite precisa de Node 22+ — você tem v$NODE_MAJOR"
  falhas=$((falhas+1))
fi

echo ""
echo "========================================"
echo " 2. ARQUIVOS DO BACKEND (mercado-api/)"
echo "========================================"
checar_arquivo "mercado-api/server.js"
checar_arquivo "mercado-api/package.json"
checar_arquivo "mercado-api/Dockerfile"

echo ""
echo "========================================"
echo " 3. ARQUIVOS DO FRONTEND (em: $FRONT_DIR)"
echo "========================================"
checar_arquivo "$FRONT_DIR/src/lib/productApi.js"
checar_arquivo "$FRONT_DIR/src/components/BarcodeScanner.svelte"
checar_arquivo "$FRONT_DIR/src/components/ProductLookupCard.svelte"
checar_arquivo "$FRONT_DIR/src/components/PriceChart.svelte"

total=$((total+1))
if [ -f "$FRONT_DIR/.env" ] && grep -q "VITE_MERCADO_API_URL" "$FRONT_DIR/.env"; then
  echo -e "$OK $FRONT_DIR/.env tem VITE_MERCADO_API_URL"
else
  echo -e "$FAIL $FRONT_DIR/.env sem VITE_MERCADO_API_URL (crie o arquivo com essa linha)"
  falhas=$((falhas+1))
fi

echo ""
echo "========================================"
echo " 4. BACKEND ESTÁ NO AR? ($API_URL)"
echo "========================================"
total=$((total+1))
resp=$(curl -s -m 5 "$API_URL/" 2>/dev/null)
if echo "$resp" | grep -q '"status":"ok"'; then
  echo -e "$OK Respondeu: $resp"
else
  echo -e "$FAIL Não respondeu em $API_URL"
  echo -e "$INFO Rode 'npm start' dentro de mercado-api/ (ou suba o container) e tente de novo."
  falhas=$((falhas+1))
fi

echo ""
echo "========================================"
echo " 5. TESTE DE PONTA A PONTA NA SUA API"
echo "========================================"
CODIGO_TESTE="0000000000000"

total=$((total+1))
r=$(curl -s -m 5 -X POST "$API_URL/produto" -H "Content-Type: application/json" \
  -d "{\"codigo_barras\":\"$CODIGO_TESTE\",\"nome\":\"Produto Teste\",\"categoria\":\"Teste\"}")
if echo "$r" | grep -q '"ok":true'; then
  echo -e "$OK POST /produto (cadastro)"
else
  echo -e "$FAIL POST /produto -> $r"
  falhas=$((falhas+1))
fi

total=$((total+1))
r=$(curl -s -m 5 "$API_URL/produto/$CODIGO_TESTE")
if echo "$r" | grep -q "Produto Teste"; then
  echo -e "$OK GET /produto/:codigo (busca)"
else
  echo -e "$FAIL GET /produto/:codigo -> $r"
  falhas=$((falhas+1))
fi

total=$((total+1))
r=$(curl -s -m 5 -X POST "$API_URL/produto/$CODIGO_TESTE/preco" -H "Content-Type: application/json" \
  -d "{\"preco\":9.90,\"data\":\"$(date +%F)\"}")
if echo "$r" | grep -q '"ok":true'; then
  echo -e "$OK POST /produto/:codigo/preco (registro de preço)"
else
  echo -e "$FAIL POST /produto/:codigo/preco -> $r"
  falhas=$((falhas+1))
fi

total=$((total+1))
r=$(curl -s -m 5 "$API_URL/produto/$CODIGO_TESTE/media-mensal")
if echo "$r" | grep -q "media"; then
  echo -e "$OK GET /produto/:codigo/media-mensal -> $r"
else
  echo -e "$FAIL GET /produto/:codigo/media-mensal -> $r"
  falhas=$((falhas+1))
fi

echo ""
echo "========================================"
echo " 6. APIs EXTERNAS (precisa de internet)"
echo "========================================"
total=$((total+1))
r=$(curl -s -m 8 "https://world.openfoodfacts.org/api/v2/product/3017620422003.json")
if echo "$r" | grep -q '"status":1'; then
  echo -e "$OK Open Food Facts respondendo"
else
  echo -e "$FAIL Open Food Facts não respondeu (verifique internet/firewall do servidor)"
  falhas=$((falhas+1))
fi

total=$((total+1))
r=$(curl -s -m 8 "https://openlibrary.org/api/books?bibkeys=ISBN:9780140449136&format=json&jscmd=data")
if echo "$r" | grep -q "ISBN:9780140449136"; then
  echo -e "$OK Open Library respondendo"
else
  echo -e "$FAIL Open Library não respondeu"
  falhas=$((falhas+1))
fi

echo ""
echo "========================================"
echo " RESULTADO: $((total-falhas))/$total checks passaram"
echo "========================================"
if [ "$falhas" -eq 0 ]; then
  echo -e "$OK Tudo certo, pode integrar no App.svelte."
else
  echo -e "$FAIL $falhas coisa(s) pra ajustar antes de seguir (veja os [FALTA] acima)."
fi
