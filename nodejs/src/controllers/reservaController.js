import Reserva from "../models/Reserva.js";

class reservaController {

    static async listarReserva(req, res) {
        try {
            const lista = await Reserva.buscarTodos();
            res.status(200).json(lista);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição` });
        }
    }

    static async buscarPorId(req, res) {
        const idProcurado = req.params.id;
        try {
            const listaReserva = await Reserva.buscarPorId(idProcurado);
            res.status(200).json(listaReserva);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição` });
        }
    }

    static async removerReserva(req, res) {
        const idProcurado = req.params.id;
        try {
            await Reserva.removerReserva(idProcurado);
            res.status(200).json({ message: "Removido com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição` });
        }
    }

    static async inserirReserva(req, res) {
        try {
            await Reserva.inserirReserva(req.body);
            res.status(201).json({ message: "Cadastrado com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição` });
        }
    }

    static async alterarReserva(req, res) {
        const id = req.params.id;
        const { recurso_cod, usuario_id, status_cod, data_inicial, data_final } = req.body;
        try {
            await Reserva.alterarReserva({ id, recurso_cod, usuario_id, status_cod, data_inicial, data_final });
            res.status(200).json({ message: "Alterado com sucesso" });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha na requisição` });
        }
    }
}

export default reservaController;