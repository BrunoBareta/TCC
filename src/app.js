const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./database/db')

const usuariosRoutes = require('./routes/usuariosRoutes')
const propriedadeRoutes = require('./routes/propriedadeRoutes')
const chamadoRoutes = require('./routes/chamadoRoutes')
const materialRoutes = require('./routes/materialRoutes')
const historicoRoutes = require('./routes/historicoRoutes')
const deslocamentoRoutes = require('./routes/deslocamentoRoutes')
const path = require('path')

const anexoRoutes = require(
  './routes/anexoRoutes'
)

const chamadoFuncionarioRoutes = require(
  './routes/chamadoFuncionarioRoutes'
)

const unidadePropriedadeRoutes = require(
  './routes/unidadePropriedadeRoutes'
)

const app = express()

app.use(cors())
app.use(express.json())
app.use(
  '/uploads',
  express.static(
    path.join(
      process.cwd(),
      'uploads'
    )
  )
)

app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando'
  })
})

app.get('/teste-banco', async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT NOW()'
    )

    res.json({
      message: 'Banco conectado com sucesso',
      data: resultado.rows[0]
    })
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao conectar no banco',
      erro: error.message
    })
  }
})

app.use(usuariosRoutes)


app.use(
  '/propriedades',
  propriedadeRoutes
)

app.use(
  '/chamados',
  chamadoRoutes
)

app.use(
  '/materiais',
  materialRoutes
)

app.use(
  '/historicos',
  historicoRoutes
)

app.use(
  '/deslocamentos',
  deslocamentoRoutes
)

app.use(
  '/chamado-funcionarios',
  chamadoFuncionarioRoutes
)

app.use(
  '/unidades-propriedade',
  unidadePropriedadeRoutes
)

app.use(
  '/anexos',
  anexoRoutes
)

module.exports = app