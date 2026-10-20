
import conectaBD from "../config/dbConnect.js";

class Reserva {

    constructor(id, recurso_cod, usuario_id, status_cod, data_inicial, data_final) {
        this.id = id;
        this.recurso_cod = recurso_cod;
        this.usuario_id = usuario_id;
        this.status_cod = status_cod;
        this.data_inicial = data_inicial;
        this.data_final = data_final;
    }

    static async buscarTodos() {
        try {
            const conexao = await conectaBD();
            const result = await conexao.query("SELECT * FROM reserva");

            return result.recordset;

        } catch (error) {
            throw new Error(`Erro na consulta ao banco de dados: ${error.message}`);
        }
    }

    static async buscarPorId(id) {
        try {
            const conexao = await conectaBD();

            const result = await conexao.query(
                `SELECT * FROM reserva WHERE id=${id}`
            );

            return result.recordset.map(
                row => new Reserva(
                    row.id,
                    row.recurso_cod,
                    row.usuario_id,
                    row.status_cod,
                    row.data_inicial,
                    row.data_final
                )
            );

        } catch (error) {
            throw new Error(`Erro na consulta ao banco de dados: ${error.message}`);
        }
    }

    static async removerReserva(id) {
        try {
            const conexao = await conectaBD();

            const result = await conexao.query(
                `DELETE FROM reserva WHERE id=${id}`
            );

            return result;

        } catch (error) {
            throw new Error(`Erro na remoção no banco de dados: ${error.message}`);
        }
    }

    static async inserirReserva(reserva) {
        const {
            recurso_cod,
            usuario_id,
            status_cod,
            data_inicial,
            data_final
        } = reserva;

        try {
            const conexao = await conectaBD();

            // Verifica se já existe uma reserva conflitante
            const conflito = await conexao.query(
                `SELECT *
                 FROM reserva
                 WHERE recurso_cod = ${recurso_cod}
                 AND data_inicial < '${data_final}'
                 AND data_final > '${data_inicial}'`
            );

            if (conflito.recordset.length > 0) {
                throw new Error(
                    "Já existe uma reserva para esse recurso nesse período."
                );
            }

            const result = await conexao.query(
                `INSERT INTO reserva
                (recurso_cod, usuario_id, status_cod, data_inicial, data_final)
                VALUES
                (${recurso_cod}, ${usuario_id}, ${status_cod},
                 '${data_inicial}', '${data_final}')`
            );

            return result;

        } catch (error) {
            throw new Error(
                `Erro na inserção no banco de dados: ${error.message}`
            );
        }
    }

    static async alterarReserva(reserva) {
        const {
            id,
            recurso_cod,
            usuario_id,
            status_cod,
            data_inicial,
            data_final
        } = reserva;

        try {
            const conexao = await conectaBD();

            // Verifica se existe outra reserva conflitante
            const conflito = await conexao.query(
                `SELECT *
                 FROM reserva
                 WHERE recurso_cod = ${recurso_cod}
                 AND id <> ${id}
                 AND data_inicial < '${data_final}'
                 AND data_final > '${data_inicial}'`
            );

            if (conflito.recordset.length > 0) {
                throw new Error(
                    "Já existe uma reserva para esse recurso nesse período."
                );
            }

            const result = await conexao.query(
                `UPDATE reserva
                 SET recurso_cod=${recurso_cod},
                     usuario_id=${usuario_id},
                     status_cod=${status_cod},
                     data_inicial='${data_inicial}',
                     data_final='${data_final}'
                 WHERE id=${id}`
            );

            return result;

        } catch (error) {
            throw new Error(
                `Erro na alteração no banco de dados: ${error.message}`
            );
        }
    }
}

export default Reserva;
