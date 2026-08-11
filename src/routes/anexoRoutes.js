const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const anexoController = require(
  '../controllers/anexoController'
)

const router = express.Router()

const pastaUploads = path.join(
  process.cwd(),
  'uploads',
  'chamados'
)

/*
  Cria automaticamente a pasta
  caso ela ainda não exista.
*/
if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(
    pastaUploads,
    {
      recursive: true
    }
  )
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(
      null,
      pastaUploads
    )
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const extensao =
      path.extname(
        file.originalname
      ).toLowerCase()

    const nomeUnico =
      `${Date.now()}-${crypto.randomUUID()}${extensao}`

    cb(
      null,
      nomeUnico
    )
  }
})

const tiposPermitidos = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',

  'video/mp4',
  'video/webm',
  'video/quicktime'
]

const fileFilter = (
  req,
  file,
  cb
) => {
  if (
    tiposPermitidos.includes(
      file.mimetype
    )
  ) {
    return cb(
      null,
      true
    )
  }

  cb(
    new Error(
      'Formato de arquivo não permitido. Envie imagens ou vídeos.'
    )
  )
}

const upload = multer({
  storage,

  fileFilter,

  limits: {
    /*
      Máximo de 30 MB por arquivo.
    */
    fileSize:
      30 * 1024 * 1024,

    /*
      Máximo de 5 arquivos.
    */
    files: 5
  }
})

/*
  GET
  /anexos/chamado/15
*/
router.get(
  '/chamado/:idChamado',
  anexoController.listarPorChamado
)

/*
  POST
  /anexos/chamado/15

  Campo multipart:
  arquivos
*/
router.post(
  '/chamado/:idChamado',

  upload.array(
    'arquivos',
    5
  ),

  anexoController.enviar
)

/*
  DELETE
  /anexos/3
*/
router.delete(
  '/:idAnexo',
  anexoController.deletar
)

/*
  Tratamento dos erros
  vindos do Multer.
*/
router.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        'LIMIT_FILE_SIZE'
      ) {
        return res.status(400).json({
          message:
            'O arquivo excede o limite de 30 MB.'
        })
      }

      if (
        error.code ===
        'LIMIT_FILE_COUNT'
      ) {
        return res.status(400).json({
          message:
            'É permitido enviar no máximo 5 arquivos.'
        })
      }

      return res.status(400).json({
        message:
          'Erro ao enviar arquivo.',
        erro: error.message
      })
    }

    if (error) {
      return res.status(400).json({
        message:
          error.message ||
          'Arquivo inválido.'
      })
    }

    next()
  }
)

module.exports = router