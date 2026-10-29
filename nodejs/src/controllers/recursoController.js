import Recurso from "../models/Recurso.js";

class recursoController {

    static async listarRecurso(req, res) {
        try {
            const lista = await Recurso.buscarTodos();
            res.status(200).json(lista);
        } catch (error) {
            res.status(500).json({
                message: `${error} - falha na requisição`
            });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const codigo = req.params.id;
            const recurso = await Recurso.buscarPorId(codigo);

            res.status(200).json(recurso);
        } catch (error) {
            res.status(500).json({
                message: `${error} - falha na requisição`
            });
        }
    }

    static async removerRecurso(req, res) {
        try {
            const codigo = req.params.id;
            const resultado = await Recurso.removerRecurso(codigo);

            res.status(200).json({
                message: "Recurso removido com sucesso!",
                resultado
            });
        } catch (error) {
            res.status(500).json({
                message: `${error} - falha na requisição`
            });
        }
    }

    static async inserirRecurso(req, res) {
        try {
            const recurso = req.body;
            const resultado = await Recurso.inserirRecurso(recurso);

            res.status(201).json({
                message: "Recurso cadastrado com sucesso!",
                resultado
            });
        } catch (error) {
            res.status(500).json({
                message: `${error} - falha na requisição`
            });
        }
    }

    static async alterarRecurso(req, res) {
        try {
            const recurso = {
                ...req.body,
                codigo: req.params.id
            };

            const resultado = await Recurso.alterarRecurso(recurso);

            if (!resultado || resultado[0] === 0) {
                return res.status(404).json({
                    message: "Recurso não encontrado ou status inválido."
                });
            }

            res.status(200).json({
                message: "Status alterado com sucesso!",
                resultado
            });
        } catch (error) {
            res.status(500).json({
                message: `${error} - falha na requisição`
            });
        }
    }
}

export default recursoController;