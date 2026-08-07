const unidadePropriedadeModel = require(
  '../models/unidadePropriedadeModels'
)

const listar = async (req, res) => {
  try {
    const unidades =
      await unidadePropriedadeModel.listar()

    res.json(unidades)
  } catch (error) {
    console.error(
      'Erro ao listar unidades:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const unidade =
      await unidadePropriedadeModel.buscarPorId(
        req.params.id
      )

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.'
      })
    }

    res.json(unidade)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const listarPorPropriedade = async (req, res) => {
  try {
    const unidades =
      await unidadePropriedadeModel.listarPorPropriedade(
        req.params.idPropriedade
      )

    res.json(unidades)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const criar = async (req, res) => {
  try {
    const {
      id_propriedade,
      nome_unidade,
      tipo_unidade
    } = req.body

    if (!id_propriedade) {
      return res.status(400).json({
        message: 'A propriedade é obrigatória.'
      })
    }

    if (!nome_unidade?.trim()) {
      return res.status(400).json({
        message: 'O nome da unidade é obrigatório.'
      })
    }

    if (!tipo_unidade?.trim()) {
      return res.status(400).json({
        message: 'O tipo da unidade é obrigatório.'
      })
    }

    const unidade =
      await unidadePropriedadeModel.criar(
        req.body
      )

    res.status(201).json(unidade)
  } catch (error) {
    console.error(
      'Erro ao criar unidade:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const atualizar = async (req, res) => {
  try {
    const unidade =
      await unidadePropriedadeModel.atualizar(
        req.params.id,
        req.body
      )

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.'
      })
    }

    res.json(unidade)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const desativar = async (req, res) => {
  try {
    const unidade =
      await unidadePropriedadeModel.desativar(
        req.params.id
      )

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.'
      })
    }

    res.json({
      message: 'Unidade desativada com sucesso.',
      unidade
    })
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

module.exports = {
  listar,
  buscarPorId,
  listarPorPropriedade,
  criar,
  atualizar,
  desativar
}