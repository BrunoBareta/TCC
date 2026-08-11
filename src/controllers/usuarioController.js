const usuarioModel = require(
  '../models/usuarioModels'
)

const listar = async (
  req,
  res
) => {
  try {
    const usuarios =
      await usuarioModel.listar()

    res.json(usuarios)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const buscarPorId = async (
  req,
  res
) => {
  try {
    const usuario =
      await usuarioModel.buscarPorId(
        req.params.id
      )

    if (!usuario) {
      return res.status(404).json({
        message:
          'Usuário não encontrado.'
      })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const criar = async (
  req,
  res
) => {
  try {
    const nome =
      String(
        req.body.nome || ''
      ).trim()

    const email =
      String(
        req.body.email || ''
      )
        .trim()
        .toLowerCase()

    const senha =
      String(
        req.body.senha || ''
      )

    if (!nome) {
      return res.status(400).json({
        message:
          'Informe o nome.'
      })
    }

    if (!email) {
      return res.status(400).json({
        message:
          'Informe o e-mail.'
      })
    }

    if (!senha) {
      return res.status(400).json({
        message:
          'Informe a senha.'
      })
    }

    if (senha.length < 6) {
      return res.status(400).json({
        message:
          'A senha deve possuir pelo menos 6 caracteres.'
      })
    }

    const usuarioExistente =
      await usuarioModel.buscarPorEmail(
        email
      )

    if (usuarioExistente) {
      return res.status(409).json({
        message:
          'Já existe uma conta cadastrada com este e-mail.'
      })
    }

    /*
      Cadastro aberto pelo Login sempre
      cria um PRODUTOR.

      Não confiamos no frontend para
      escolher FUNCIONARIO ou ADMIN.
    */
    const usuario =
      await usuarioModel.criar({
        nome,

        telefone:
          req.body.telefone
            ? String(
                req.body.telefone
              ).trim()
            : null,

        email,

        cpf_cnpj:
          req.body.cpf_cnpj
            ? String(
                req.body.cpf_cnpj
              ).trim()
            : null,

        senha,

        tipo_usuario:
          'PRODUTOR',

        foto_perfil:
          null
      })

    res.status(201).json(
      usuario
    )
  } catch (error) {
    console.error(
      'Erro ao criar usuário:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const atualizar = async (
  req,
  res
) => {
  try {
    const usuarioAnterior =
      await usuarioModel.buscarPorId(
        req.params.id
      )

    if (!usuarioAnterior) {
      return res.status(404).json({
        message:
          'Usuário não encontrado.'
      })
    }

    const usuario =
      await usuarioModel.atualizar(
        req.params.id,
        {
          nome:
            req.body.nome ??
            usuarioAnterior.nome,

          telefone:
            req.body.telefone ??
            usuarioAnterior.telefone,

          email:
            req.body.email ??
            usuarioAnterior.email,

          cpf_cnpj:
            req.body.cpf_cnpj ??
            usuarioAnterior.cpf_cnpj,

          senha:
            req.body.senha ??
            usuarioAnterior.senha,

          tipo_usuario:
            usuarioAnterior.tipo_usuario,

          foto_perfil:
            req.body.foto_perfil ??
            usuarioAnterior.foto_perfil,

          ativo:
            req.body.ativo ??
            usuarioAnterior.ativo
        }
      )

    res.json(usuario)
  } catch (error) {
    console.error(
      'Erro ao atualizar usuário:',
      error
    )

    res.status(500).json({
      erro: error.message
    })
  }
}

const deletar = async (
  req,
  res
) => {
  try {
    const usuario =
      await usuarioModel.deletar(
        req.params.id
      )

    if (!usuario) {
      return res.status(404).json({
        message:
          'Usuário não encontrado.'
      })
    }

    res.json({
      message:
        'Usuário desativado com sucesso.',

      usuario
    })
  } catch (error) {
    res.status(500).json({
      erro: error.message
    })
  }
}

const login = async (
  req,
  res
) => {
  try {
    const email =
      String(
        req.body.email || ''
      )
        .trim()
        .toLowerCase()

    const senha =
      String(
        req.body.senha || ''
      )

    if (
      !email ||
      !senha
    ) {
      return res.status(400).json({
        message:
          'Informe o e-mail e a senha.'
      })
    }

    const usuario =
      await usuarioModel.login(
        email,
        senha
      )

    if (!usuario) {
      return res.status(401).json({
        message:
          'E-mail ou senha inválidos.'
      })
    }

    res.json({
      message:
        'Login realizado com sucesso.',

      usuario
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
  criar,
  atualizar,
  deletar,
  login
}