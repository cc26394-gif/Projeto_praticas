import Usuario from "../models/Usuario.js";
import Login from "../models/login.js";

class usuarioController {

    static async listarUsuario(req, res) {
        try {
            const lista = await Usuario.buscarTodos();
            res.status(200).json(lista);

        } catch (error) {
            res.status(500).json({
                message: `${error} - falha na requisição`
            });
        }
    }

    static async buscarPorId(req, res) {
        const idProcurado = req.params.id;

        try {
            const listaUsuario = await Usuario.buscarPorId(idProcurado);

            res.status(200).json(listaUsuario);

        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na requisição`
            });
        }
    }

    static async removerUsuario(req, res) {
        const idProcurado = req.params.id;

        try {
            const result = await Usuario.removerUsuario(idProcurado);

            res.status(200).json({
                message: "Removido com sucesso"
            });

        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na requisição`
            });
        }
    }

    static async inserirUsuario(req, res) {
        try {
            console.log(req.body);

            const usuario_id = await Usuario.inserirUsuario(req.body);

            await Login.inserirLogin({
                usuario_id: usuario_id,
                login: req.body.login,
                senha: req.body.senha
            });

            res.status(201).json({
                message: "Cadastrado com sucesso"
            });

        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na requisição`
            });
        }
    }

    static async alterarUsuario(req, res) {

        const id = req.params.id;
        const cpf = req.body.cpf;
        const nome = req.body.nome;
        const nascimento = req.body.nascimento;
        const celular = req.body.celular;
        const email = req.body.email;

        try {

            const result = await Usuario.alterarUsuario({
                id: id,
                cpf: cpf,
                nome: nome,
                nascimento: nascimento,
                celular: celular,
                email: email
            });

            res.status(200).json({
                message: "Alterado com sucesso"
            });

        } catch (erro) {
            res.status(500).json({
                message: `${erro.message} - falha na requisição`
            });
        }
    }
}

export default usuarioController;