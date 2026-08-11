const propriedadeModel = require(
  '../models/propriedadeModels'
)

/* =========================
   AUXILIARES
========================= */

function converterCoordenada(
  valor
) {
  if (
    valor === null ||
    valor === undefined ||
    String(valor).trim() === ''
  ) {
    return null
  }

  const numero =
    Number(
      String(valor)
        .trim()
        .replace(',', '.')
    )

  return Number.isFinite(numero)
    ? numero
    : null
}

function coordenadasValidas(
  latitude,
  longitude
) {
  if (
    latitude === null &&
    longitude === null
  ) {
    return true
  }

  if (
    latitude === null ||
    longitude === null
  ) {
    return false
  }

  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(
      latitude === 0 &&
      longitude === 0
    )
  )
}

/* =========================
   LISTAR
========================= */

const listar = async (
  req,
  res
) => {
  try {
    const propriedades =
      await propriedadeModel
        .listar()

    res.json(
      propriedades
    )
  } catch (error) {
    console.error(
      'Erro ao listar propriedades:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   BUSCAR POR ID
========================= */

const buscarPorId = async (
  req,
  res
) => {
  try {
    const propriedade =
      await propriedadeModel
        .buscarPorId(
          req.params.id
        )

    if (!propriedade) {
      return res
        .status(404)
        .json({
          message:
            'Propriedade não encontrada.'
        })
    }

    res.json(
      propriedade
    )
  } catch (error) {
    console.error(
      'Erro ao buscar propriedade:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   BUSCAR POR USUÁRIO
========================= */

const buscarPorUsuario =
  async (
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
        return res
          .status(400)
          .json({
            message:
              'Usuário inválido.'
          })
      }

      const propriedade =
        await propriedadeModel
          .buscarPorUsuario(
            idUsuario
          )

      /*
        NÃO ter propriedade
        não é erro.

        Retorna null para o frontend
        mostrar "Cadastrar propriedade".
      */
      res.json(
        propriedade ||
        null
      )
    } catch (error) {
      console.error(
        'Erro ao buscar propriedade do usuário:',
        error
      )

      res.status(500).json({
        erro:
          error.message
      })
    }
  }

/* =========================
   CRIAR
========================= */

const criar = async (
  req,
  res
) => {
  try {
    const idUsuario =
      Number(
        req.body.id_usuario
      )

    const nomePropriedade =
      String(
        req.body
          .nome_propriedade ||
        ''
      ).trim()

    if (
      !Number.isInteger(
        idUsuario
      ) ||
      idUsuario <= 0
    ) {
      return res
        .status(400)
        .json({
          message:
            'Produtor não identificado.'
        })
    }

    if (!nomePropriedade) {
      return res
        .status(400)
        .json({
          message:
            'Informe o nome da propriedade.'
        })
    }

    /*
      PROTÓTIPO:
      UMA PROPRIEDADE ATIVA
      POR PRODUTOR.
    */
    const propriedadeExistente =
      await propriedadeModel
        .buscarPorUsuario(
          idUsuario
        )

    if (propriedadeExistente) {
      return res
        .status(409)
        .json({
          message:
            'Este produtor já possui uma propriedade cadastrada.'
        })
    }

    const latitude =
      converterCoordenada(
        req.body.latitude
      )

    const longitude =
      converterCoordenada(
        req.body.longitude
      )

    if (
      !coordenadasValidas(
        latitude,
        longitude
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            'Localização da propriedade inválida.'
        })
    }

    const propriedade =
      await propriedadeModel
        .criar({
          id_usuario:
            idUsuario,

          nome_propriedade:
            nomePropriedade,

          /*
            Como o projeto atualmente
            trabalha com Avioeste,
            mantemos AVES como padrão.
          */
          cultura_principal:
            req.body
              .cultura_principal ||
            'AVES',

          quantidade_galpoes:
            Number(
              req.body
                .quantidade_galpoes ||
              0
            ),

          endereco:
            req.body.endereco
              ? String(
                  req.body.endereco
                ).trim()
              : null,

          cidade:
            req.body.cidade
              ? String(
                  req.body.cidade
                ).trim()
              : null,

          estado:
            req.body.estado
              ? String(
                  req.body.estado
                )
                  .trim()
                  .toUpperCase()
              : null,

          cep:
            req.body.cep
              ? String(
                  req.body.cep
                ).trim()
              : null,

          latitude,

          longitude
        })

    res.status(201).json(
      propriedade
    )
  } catch (error) {
    console.error(
      'Erro ao criar propriedade:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   ATUALIZAR
========================= */

const atualizar = async (
  req,
  res
) => {
  try {
    const propriedadeAnterior =
      await propriedadeModel
        .buscarPorId(
          req.params.id
        )

    if (!propriedadeAnterior) {
      return res
        .status(404)
        .json({
          message:
            'Propriedade não encontrada.'
        })
    }

    const nomePropriedade =
      String(
        req.body
          .nome_propriedade ||
        propriedadeAnterior
          .nome_propriedade ||
        ''
      ).trim()

    if (!nomePropriedade) {
      return res
        .status(400)
        .json({
          message:
            'Informe o nome da propriedade.'
        })
    }

    const latitude =
      converterCoordenada(
        req.body.latitude ??
        propriedadeAnterior.latitude
      )

    const longitude =
      converterCoordenada(
        req.body.longitude ??
        propriedadeAnterior.longitude
      )

    if (
      !coordenadasValidas(
        latitude,
        longitude
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            'Localização da propriedade inválida.'
        })
    }

    const propriedade =
      await propriedadeModel
        .atualizar(
          req.params.id,
          {
            nome_propriedade:
              nomePropriedade,

            cultura_principal:
              req.body
                .cultura_principal ||
              propriedadeAnterior
                .cultura_principal ||
              'AVES',

            quantidade_galpoes:
              Number(
                req.body
                  .quantidade_galpoes ??
                propriedadeAnterior
                  .quantidade_galpoes ??
                0
              ),

            endereco:
              req.body.endereco ??
              propriedadeAnterior
                .endereco,

            cidade:
              req.body.cidade ??
              propriedadeAnterior
                .cidade,

            estado:
              req.body.estado
                ? String(
                    req.body.estado
                  )
                    .trim()
                    .toUpperCase()
                : propriedadeAnterior
                    .estado,

            cep:
              req.body.cep ??
              propriedadeAnterior
                .cep,

            latitude,

            longitude,

            ativo:
              true
          }
        )

    res.json(
      propriedade
    )
  } catch (error) {
    console.error(
      'Erro ao atualizar propriedade:',
      error
    )

    res.status(500).json({
      erro:
        error.message
    })
  }
}

/* =========================
   DESATIVAR
========================= */

const deletar = async (
  req,
  res
) => {
  try {
    const propriedade =
      await propriedadeModel
        .deletar(
          req.params.id
        )

    if (!propriedade) {
      return res
        .status(404)
        .json({
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
      erro:
        error.message
    })
  }
}

module.exports = {
  listar,
  buscarPorId,
  buscarPorUsuario,
  criar,
  atualizar,
  deletar
}