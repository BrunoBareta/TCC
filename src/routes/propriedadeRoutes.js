const express = require('express')

const router = express.Router()

const propriedadeController = require('../controllers/propriedadeController')

router.get('/', propriedadeController.listar)

router.get('/:id', propriedadeController.buscarPorId)

router.post('/', propriedadeController.criar)

router.put('/:id', propriedadeController.atualizar)

router.delete('/:id', propriedadeController.deletar)

module.exports = router