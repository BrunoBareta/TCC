const express = require('express')
const router = express.Router()

const deslocamentoController = require('../controllers/deslocamentoController')

router.get('/', deslocamentoController.listar)
router.get('/:id', deslocamentoController.buscarPorId)
router.post('/', deslocamentoController.criar)
router.put('/:id', deslocamentoController.atualizar)
router.delete('/:id', deslocamentoController.deletar)

module.exports = router