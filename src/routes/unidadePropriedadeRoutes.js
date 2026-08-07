const express = require('express')

const router = express.Router()

const unidadePropriedadeController = require(
  '../controllers/unidadePropriedadeController'
)

router.get(
  '/',
  unidadePropriedadeController.listar
)

router.get(
  '/propriedade/:idPropriedade',
  unidadePropriedadeController.listarPorPropriedade
)

router.get(
  '/:id',
  unidadePropriedadeController.buscarPorId
)

router.post(
  '/',
  unidadePropriedadeController.criar
)

router.put(
  '/:id',
  unidadePropriedadeController.atualizar
)

router.patch(
  '/:id/desativar',
  unidadePropriedadeController.desativar
)

module.exports = router