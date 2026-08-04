const express = require('express')
const router = express.Router()
const usuarioController = require('../controllers/usuarioController')

router.get('/usuarios', usuarioController.listar)
router.get('/usuarios/:id', usuarioController.buscarPorId)
router.post('/usuarios', usuarioController.criar)
router.put('/usuarios/:id', usuarioController.atualizar)
router.delete('/usuarios/:id', usuarioController.deletar)

router.post('/login', usuarioController.login)

module.exports = router