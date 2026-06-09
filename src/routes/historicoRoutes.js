const express = require('express')
const router = express.Router()

const historicoController = require('../controllers/historicoController')

router.get('/', historicoController.listar)

router.get('/:id', historicoController.buscarPorId)

router.get('/chamado/:idChamado', historicoController.buscarPorChamado)

router.post('/', historicoController.criar)

module.exports = router
