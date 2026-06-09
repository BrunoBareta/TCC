const express = require('express')
const router = express.Router()

const materialController = require('../controllers/materialController')

router.get('/', materialController.listar)
router.get('/chamado/:id_chamado', materialController.listarPorChamado)
router.get('/:id', materialController.buscarPorId)
router.post('/', materialController.criar)
router.put('/:id', materialController.atualizar)
router.delete('/:id', materialController.deletar)

module.exports = router