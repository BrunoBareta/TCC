const fs = require('fs')
const path = require('path')

const anexoModel = require(
  '../models/anexoModels'
)

const listarPorChamado = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    const anexos =
      await anexoModel.listarPorChamado(
        idChamado
      )

    res.json(anexos)
  } catch (error) {
    console.error(
      'Erro ao listar anexos:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const enviar = async (req, res) => {
  try {
    const idChamado = Number(
      req.params.idChamado
    )

    if (
      !Number.isInteger(idChamado) ||
      idChamado <= 0
    ) {
      apagarArquivosRecebidos(req.files)

      return res.status(400).json({
        message: 'ID do chamado inválido.'
      })
    }

    const chamadoExiste =
      await anexoModel.verificarChamado(
        idChamado
      )

    if (!chamadoExiste) {
      apagarArquivosRecebidos(req.files)

      return res.status(404).json({
        message: 'Chamado não encontrado.'
      })
    }

    if (
      !Array.isArray(req.files) ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        message:
          'Selecione pelo menos um arquivo.'
      })
    }

    const anexosCriados = []

    for (const arquivo of req.files) {
      const anexo =
        await anexoModel.criar({
          id_chamado: idChamado,

          nome_arquivo:
            arquivo.originalname,

          caminho_arquivo:
            `/uploads/chamados/${arquivo.filename}`,

          tipo_arquivo:
            arquivo.mimetype
        })

      anexosCriados.push(anexo)
    }

    res.status(201).json({
      message:
        anexosCriados.length === 1
          ? 'Arquivo enviado com sucesso.'
          : 'Arquivos enviados com sucesso.',

      anexos: anexosCriados
    })
  } catch (error) {
    console.error(
      'Erro ao enviar anexos:',
      error
    )

    /*
      Se aconteceu algum erro durante
      o cadastro, removemos os arquivos
      físicos que acabaram de chegar.
    */
    apagarArquivosRecebidos(req.files)

    res.status(500).json({
      erro: error.message
    })
  }
}

const deletar = async (req, res) => {
  try {
    const idAnexo = Number(
      req.params.idAnexo
    )

    if (
      !Number.isInteger(idAnexo) ||
      idAnexo <= 0
    ) {
      return res.status(400).json({
        message: 'ID do anexo inválido.'
      })
    }

    const anexo =
      await anexoModel.buscarPorId(
        idAnexo
      )

    if (!anexo) {
      return res.status(404).json({
        message: 'Anexo não encontrado.'
      })
    }

    const anexoRemovido =
      await anexoModel.deletar(
        idAnexo
      )

    removerArquivoDoDisco(
      anexo.caminho_arquivo
    )

    res.json({
      message:
        'Anexo removido com sucesso.',

      anexo: anexoRemovido
    })
  } catch (error) {
    console.error(
      'Erro ao remover anexo:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

function apagarArquivosRecebidos(arquivos) {
  if (!Array.isArray(arquivos)) {
    return
  }

  arquivos.forEach((arquivo) => {
    try {
      if (
        arquivo?.path &&
        fs.existsSync(arquivo.path)
      ) {
        fs.unlinkSync(arquivo.path)
      }
    } catch (error) {
      console.error(
        'Erro ao limpar arquivo:',
        error
      )
    }
  })
}

function removerArquivoDoDisco(
  caminhoArquivo
) {
  try {
    if (!caminhoArquivo) {
      return
    }

    /*
      Usamos somente o nome final
      para evitar caminhos indevidos.
    */
    const nomeArquivo =
      path.basename(caminhoArquivo)

    const caminhoCompleto =
      path.join(
        process.cwd(),
        'uploads',
        'chamados',
        nomeArquivo
      )

    if (
      fs.existsSync(
        caminhoCompleto
      )
    ) {
      fs.unlinkSync(
        caminhoCompleto
      )
    }
  } catch (error) {
    console.error(
      'Erro ao remover arquivo físico:',
      error
    )
  }
}

module.exports = {
  listarPorChamado,
  enviar,
  deletar
}