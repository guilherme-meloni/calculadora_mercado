import express from 'express'
import cors from 'cors'
import { DatabaseSync } from 'node:sqlite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, 'data')
fs.mkdirSync(dataDir, { recursive: true })

const db = new DatabaseSync(path.join(dataDir, 'mercado.db'))
db.exec('PRAGMA journal_mode = WAL;')

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    codigo_barras TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT,
    marca TEXT,
    imagem_url TEXT,
    nutri_score TEXT,
    nova_group TEXT,
    alergenos TEXT,
    origem TEXT,
    fonte TEXT,
    criado_em TEXT NOT NULL
  );
`)
db.exec(`
  CREATE TABLE IF NOT EXISTS precos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_barras TEXT NOT NULL,
    preco REAL NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (codigo_barras) REFERENCES produtos(codigo_barras)
  );
`)
db.exec(`CREATE INDEX IF NOT EXISTS idx_precos_produto_data ON precos(codigo_barras, data);`)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'ok', servico: 'mercado-api' }))

// Lista todos os produtos já cadastrados na base própria, com o último preço visto
app.get('/produtos', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*,
      (SELECT preco FROM precos WHERE codigo_barras = p.codigo_barras ORDER BY data DESC LIMIT 1) as ultimo_preco,
      (SELECT COUNT(*) FROM precos WHERE codigo_barras = p.codigo_barras) as qtd_registros
    FROM produtos p
    ORDER BY criado_em DESC
  `).all()
  res.json(rows)
})

// Busca um produto salvo (rápido, sem depender de rede externa)
app.get('/produto/:codigo', (req, res) => {
  const produto = db.prepare('SELECT * FROM produtos WHERE codigo_barras = ?').get(req.params.codigo)
  if (!produto) return res.status(404).json({ erro: 'não encontrado' })
  res.json(produto)
})

// Cadastra ou atualiza os dados descritivos de um produto
app.post('/produto', (req, res) => {
  const { codigo_barras, nome, categoria, marca, imagem_url, nutri_score, nova_group, alergenos, origem, fonte } = req.body
  if (!codigo_barras || !nome) return res.status(400).json({ erro: 'codigo_barras e nome são obrigatórios' })

  db.prepare(`
    INSERT INTO produtos (codigo_barras, nome, categoria, marca, imagem_url, nutri_score, nova_group, alergenos, origem, fonte, criado_em)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(codigo_barras) DO UPDATE SET
      nome=excluded.nome, categoria=excluded.categoria, marca=excluded.marca,
      imagem_url=excluded.imagem_url, nutri_score=excluded.nutri_score,
      nova_group=excluded.nova_group, alergenos=excluded.alergenos, origem=excluded.origem
  `).run(
    codigo_barras, nome,
    categoria || null, marca || null, imagem_url || null,
    nutri_score || null, nova_group || null,
    alergenos || null, origem || null,
    fonte || 'manual', new Date().toISOString()
  )

  res.json({ ok: true })
})

// Registra um preço (append-only — nunca sobrescreve o anterior)
// 'data' vem do celular no formato ISO (ex: 2026-09-22)
app.post('/produto/:codigo/preco', (req, res) => {
  const { preco, data } = req.body
  if (typeof preco !== 'number' || !data) return res.status(400).json({ erro: 'preco (número) e data são obrigatórios' })

  const produto = db.prepare('SELECT codigo_barras FROM produtos WHERE codigo_barras = ?').get(req.params.codigo)
  if (!produto) return res.status(404).json({ erro: 'cadastre o produto antes de registrar preço' })

  db.prepare('INSERT INTO precos (codigo_barras, preco, data) VALUES (?, ?, ?)')
    .run(req.params.codigo, preco, data)

  res.json({ ok: true })
})

// Histórico bruto de preços de um produto
app.get('/produto/:codigo/historico', (req, res) => {
  const rows = db.prepare('SELECT id, preco, data FROM precos WHERE codigo_barras = ? ORDER BY data DESC')
    .all(req.params.codigo)
  res.json(rows)
})

// Apaga um registro de preço específico (ex: um teste que você fez)
app.delete('/produto/:codigo/preco/:id', (req, res) => {
  const info = db.prepare('DELETE FROM precos WHERE id = ? AND codigo_barras = ?')
    .run(req.params.id, req.params.codigo)
  if (info.changes === 0) return res.status(404).json({ erro: 'registro de preço não encontrado' })
  res.json({ ok: true })
})

// Apaga o produto inteiro e todo o histórico de preço dele
app.delete('/produto/:codigo', (req, res) => {
  db.prepare('DELETE FROM precos WHERE codigo_barras = ?').run(req.params.codigo)
  const info = db.prepare('DELETE FROM produtos WHERE codigo_barras = ?').run(req.params.codigo)
  if (info.changes === 0) return res.status(404).json({ erro: 'produto não encontrado' })
  res.json({ ok: true })
})

// Série mensal pronta pra gráfico: preço médio por mês
app.get('/produto/:codigo/media-mensal', (req, res) => {
  const rows = db.prepare(`
    SELECT substr(data, 1, 7) as mes, ROUND(AVG(preco), 2) as media, COUNT(*) as amostras
    FROM precos WHERE codigo_barras = ?
    GROUP BY mes ORDER BY mes ASC
  `).all(req.params.codigo)
  res.json(rows)
})

const PORT = process.env.PORT || 3011
app.listen(PORT, () => console.log(`mercado-api rodando na porta ${PORT}`))
