#!/usr/bin/env bash
# Roda isso DENTRO da raiz do seu projeto (onde estão o Dockerfile e o docker-compose.yml do frontend,
# e onde você já colocou a pasta mercado-api/)
# Uso: ./aplicar-tudo.sh
set -e

OK="\033[1;32m[OK]\033[0m"
INFO="\033[1;34m[INFO]\033[0m"
SKIP="\033[1;33m[JA TINHA]\033[0m"
ERRO="\033[1;31m[ERRO]\033[0m"

if [ ! -f "Dockerfile" ] || [ ! -f "docker-compose.yml" ]; then
  echo -e "$ERRO Não achei Dockerfile e/ou docker-compose.yml aqui. Rode isso na raiz do projeto."
  exit 1
fi

if [ ! -d "mercado-api" ]; then
  echo -e "$ERRO Não achei a pasta mercado-api/ aqui. Copie ela pra raiz do projeto antes de rodar este script."
  exit 1
fi

echo "========================================"
echo " 1. Dockerfile do frontend"
echo "========================================"
if grep -q "VITE_MERCADO_API_URL" Dockerfile; then
  echo -e "$SKIP Dockerfile já tem o ARG/ENV da API"
else
  cp Dockerfile Dockerfile.bak
  sed -i '/^RUN npm run build/i ARG VITE_MERCADO_API_URL\nENV VITE_MERCADO_API_URL=$VITE_MERCADO_API_URL' Dockerfile
  echo -e "$OK Adicionei ARG/ENV antes do 'npm run build' (backup em Dockerfile.bak)"
fi

echo ""
echo "========================================"
echo " 2. docker-compose.yml"
echo "========================================"
if grep -q "mercado-api" docker-compose.yml; then
  echo -e "$SKIP docker-compose.yml já tem o serviço mercado-api"
else
  cp docker-compose.yml docker-compose.yml.bak
  cat > docker-compose.yml << 'COMPOSE_END'
services:
  calculadora:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_MERCADO_API_URL: http://100.89.81.37:3011
    container_name: calculadora-mercado
    restart: unless-stopped
    ports:
      - "3019:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - mercado-api

  mercado-api:
    build:
      context: ./mercado-api
    container_name: mercado-api
    restart: unless-stopped
    ports:
      - "3011:3011"
    volumes:
      - ./mercado-api/data:/app/data
COMPOSE_END
  echo -e "$OK Substituí o docker-compose.yml (backup em docker-compose.yml.bak)"
fi

echo ""
echo -e "$INFO Tudo ajustado. Agora roda:"
echo "   docker compose up -d --build"
echo ""
echo -e "$INFO Confere no final com:"
echo "   docker compose ps"
echo "   ./verificar-setup.sh . http://localhost:3011"
