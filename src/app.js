const express = require('express')
const cors = require('cors')
require('dotenv').config()

const db = require('./database/db')
const usuariosRoutes = require('./routes/usuarios.routes')
const propriedadeRoutes = require('./routes/propriedadeRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' })
})

app.get('/teste-banco', async (req, res) => {
  try {
    const resultado = await db.query('SELECT NOW()')
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
app.use('/propriedades', propriedadeRoutes)

module.exports = app