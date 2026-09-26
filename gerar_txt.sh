#!/usr/bin/env bash
#
# gerar_txt.sh — Seleciona arquivos e diretórios via fzf e concatena
# o conteúdo de tudo num único .txt, com cabeçalhos indicando a origem.
#
# Uso:
#   ./gerar_txt.sh [diretório_inicial]
#
# Dependências: fzf, fd (opcional, mais rápido) ou find
#
# Controles no fzf:
#   TAB          -> marcar/desmarcar item
#   ENTER        -> confirmar seleção
#   CTRL-A       -> marcar todos
#   CTRL-D       -> desmarcar todos

set -euo pipefail

# --- checagens -----------------------------------------------------------
if ! command -v fzf &>/dev/null; then
    echo "Erro: fzf não encontrado. Instale com: sudo pacman -S fzf" >&2
    exit 1
fi

BASE_DIR="${1:-.}"
if [[ ! -d "$BASE_DIR" ]]; then
    echo "Erro: '$BASE_DIR' não é um diretório válido." >&2
    exit 1
fi

# --- pastas ignoradas por padrão -------------------------------------------
EXCLUDES=(
    .git node_modules dist build target venv .venv env
    __pycache__ .cache .next .nuxt .parcel-cache .turbo
    .idea .vscode coverage vendor .pytest_cache .mypy_cache
)

# --- listar arquivos e diretórios para seleção ----------------------------
listar() {
    if command -v fd &>/dev/null; then
        local fd_excludes=()
        for e in "${EXCLUDES[@]}"; do
            fd_excludes+=(--exclude "$e")
        done
        fd . "$BASE_DIR" --hidden "${fd_excludes[@]}"
    else
        local find_prune=()
        for e in "${EXCLUDES[@]}"; do
            find_prune+=(-path "*/$e" -o)
        done
        # remove o último -o solto
        unset 'find_prune[${#find_prune[@]}-1]'
        find "$BASE_DIR" \( "${find_prune[@]}" \) -prune -o -print | sed 's|^\./||'
    fi
}

echo "Selecione arquivos e/ou diretórios (TAB p/ marcar, ENTER p/ confirmar)..."

HEADER=$(cat <<'EOF'
 TAB        marcar/desmarcar item
 ENTER      confirmar seleção
 CTRL-A     marcar todos
 CTRL-D     desmarcar todos
 CTRL-/     mostrar/ocultar preview
EOF
)

SELECIONADOS=$(listar | fzf \
    --multi \
    --height=90% \
    --layout=reverse \
    --border=rounded \
    --preview 'if [ -d {} ]; then ls -la --color=always {}; else bat --color=always --style=numbers {} 2>/dev/null || cat {}; fi' \
    --preview-window=right:55%:wrap \
    --bind 'ctrl-a:select-all,ctrl-d:deselect-all,ctrl-/:toggle-preview' \
    --prompt="Selecionar > " \
    --header="$HEADER" \
    --marker="✓ " \
    --pointer="▶")

if [[ -z "$SELECIONADOS" ]]; then
    echo "Nada selecionado. Saindo."
    exit 0
fi

# --- expandir diretórios selecionados em arquivos --------------------------
ARQUIVOS_FINAIS=()
while IFS= read -r item; do
    [[ -z "$item" ]] && continue
    if [[ -d "$item" ]]; then
        while IFS= read -r f; do
            ARQUIVOS_FINAIS+=("$f")
        done < <(find "$item" -type f)
    elif [[ -f "$item" ]]; then
        ARQUIVOS_FINAIS+=("$item")
    fi
done <<< "$SELECIONADOS"

if [[ ${#ARQUIVOS_FINAIS[@]} -eq 0 ]]; then
    echo "Nenhum arquivo válido encontrado na seleção."
    exit 0
fi

# --- nome do arquivo de saída ---------------------------------------------
read -rp "Nome do arquivo de saída [saida.txt]: " NOME_SAIDA
NOME_SAIDA="${NOME_SAIDA:-saida.txt}"
[[ "$NOME_SAIDA" != *.txt ]] && NOME_SAIDA="${NOME_SAIDA}.txt"

# --- gerar o txt -------------------------------------------------------
> "$NOME_SAIDA"
TOTAL=${#ARQUIVOS_FINAIS[@]}
ATUAL=0

for f in "${ARQUIVOS_FINAIS[@]}"; do
    ATUAL=$((ATUAL + 1))
    printf "\r-> Processando (%d/%d): %s" "$ATUAL" "$TOTAL" "$f"
    {
        echo "================================================================"
        echo "ARQUIVO: $f"
        echo "================================================================"
        cat "$f" 2>/dev/null || echo "[erro ao ler arquivo]"
        echo -e "\n"
    } >> "$NOME_SAIDA"
done

echo -e "\n\nConcluído: $TOTAL arquivo(s) -> $NOME_SAIDA ($(du -h "$NOME_SAIDA" | cut -f1))"
