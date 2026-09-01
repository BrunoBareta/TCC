const propriedadeModel = require(
  '../models/propriedadeModels'
)

/* =====================================================
   LISTAR
===================================================== */

const listar = async (
  req,
  res
) => {
  try {
    const propriedades =
      await propriedadeModel.listar()

    res.json(propriedades)
  } catch (error) {
    console.error(
      'Erro ao listar propriedades:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

/* =====================================================
   BUSCAR POR ID
===================================================== */

const buscarPorId = async (
  req,
  res
) => {
  try {
    const id =
      Number(req.params.id)

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message:
          'ID da propriedade inválido.'
      })
    }

    const propriedade =
      await propriedadeModel
        .buscarPorId(id)

    if (!propriedade) {
      return res.status(404).json({
        message:
          'Propriedade não encontrada.'
      })
    }

    res.json(propriedade)
  } catch (error) {
    console.error(
      'Erro ao buscar propriedade:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

/* =====================================================
   BUSCAR PROPRIEDADE DO PRODUTOR
===================================================== */

const buscarPorUsuario = async (
  req,
  res
) => {
  try {
    const idUsuario =
      Number(
        req.params.idUsuario
      )

    if (
      !Number.isInteger(
        idUsuario
      ) ||
      idUsuario <= 0
    ) {
      return res.status(400).json({
        message:
          'Produtor inválido.'
      })
    }

    const propriedade =
      await propriedadeModel
        .buscarPorUsuario(
          idUsuario
        )

    /*
      Se o produtor ainda não possuir
      propriedade, retornamos null.

      Isso facilita o tratamento
      no frontend.
    */

    if (!propriedade) {
      return res.json(null)
    }

    res.json(propriedade)
  } catch (error) {
    console.error(
      'Erro ao buscar propriedade do produtor:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

/* =====================================================
   CRIAR
===================================================== */

const criar = async (
  req,
  res
) => {
  try {
    const idUsuario =
      Number(
        req.body.id_usuario
      )

    if (
      !Number.isInteger(
        idUsuario
      ) ||
      idUsuario <= 0
    ) {
      return res.status(400).json({
        message:
          'Produtor não identificado.'
      })
    }

    const nomePropriedade =
      String(
        req.body.nome_propriedade ||
        ''
      ).trim()

    if (!nomePropriedade) {
      return res.status(400).json({
        message:
          'Informe o nome da propriedade.'
      })
    }

    const propriedade =
      await propriedadeModel.criar({
        ...req.body,

        id_usuario:
          idUsuario,

        nome_propriedade:
          nomePropriedade
      })

    res.status(201).json({
      message:
        'Propriedade cadastrada com sucesso.',

      propriedade
    })
  } catch (error) {
    console.error(
      'Erro ao cadastrar propriedade:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

/* =====================================================
   ATUALIZAR
===================================================== */

const atualizar = async (
  req,
  res
) => {
  try {
    const id =
      Number(req.params.id)

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message:
          'ID da propriedade inválido.'
      })
    }

    const propriedadeAnterior =
      await propriedadeModel
        .buscarPorId(id)

    if (!propriedadeAnterior) {
      return res.status(404).json({
        message:
          'Propriedade não encontrada.'
      })
    }

    const dados = {
      nome_propriedade:
        req.body.nome_propriedade ??
        propriedadeAnterior
          .nome_propriedade,

      cultura_principal:
        req.body.cultura_principal ??
        propriedadeAnterior
          .cultura_principal,

      quantidade_galpoes:
        req.body.quantidade_galpoes ??
        propriedadeAnterior
          .quantidade_galpoes,

      endereco:
        req.body.endereco ??
        propriedadeAnterior.endereco,

      cidade:
        req.body.cidade ??
        propriedadeAnterior.cidade,

      estado:
        req.body.estado ??
        propriedadeAnterior.estado,

      cep:
        req.body.cep ??
        propriedadeAnterior.cep,

      latitude:
        req.body.latitude ??
        propriedadeAnterior.latitude,

      longitude:
        req.body.longitude ??
        propriedadeAnterior.longitude,

      ativo:
        req.body.ativo ??
        propriedadeAnterior.ativo
    }

    const propriedade =
      await propriedadeModel
        .atualizar(
          id,
          dados
        )

    res.json({
      message:
        'Propriedade atualizada com sucesso.',

      propriedade
    })
  } catch (error) {
    console.error(
      'Erro ao atualizar propriedade:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

/* =====================================================
   DESATIVAR
===================================================== */

const deletar = async (
  req,
  res
) => {
  try {
    const id =
      Number(req.params.id)

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        message:
          'ID da propriedade inválido.'
      })
    }

    const propriedade =
      await propriedadeModel
        .deletar(id)

    if (!propriedade) {
      return res.status(404).json({
        message:
          'Propriedade não encontrada.'
      })
    }

    res.json({
      message:
        'Propriedade desativada com sucesso.',

      propriedade
    })
  } catch (error) {
    console.error(
      'Erro ao desativar propriedade:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

/* =====================================================
   EXPORTAÇÕES
===================================================== */

module.exports = {
  listar,
  buscarPorId,
  buscarPorUsuario,
  criar,
  atualizar,
  deletar
}