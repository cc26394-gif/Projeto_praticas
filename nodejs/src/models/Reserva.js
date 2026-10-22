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

            const result = await conexao.query(
                "SELECT * FROM reserva"
            );

            return result.recordset;

        } catch (error) {
            throw new Error(
                `Erro na consulta ao banco de dados: ${error.message}`
            );
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
            throw new Error(
                `Erro na consulta ao banco de dados: ${error.message}`
            );
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
            throw new Error(
                `Erro na remoção no banco de dados: ${error.message}`
            );
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

            const dataInicial = data_inicial
                .replace("T", " ")
                .replaceAll("-", "") + ":00";

            const dataFinal = data_final
                .replace("T", " ")
                .replaceAll("-", "") + ":00";

            const conflito = await conexao.query(
                `SELECT *
                FROM reserva
                WHERE recurso_cod = ${recurso_cod}
                AND data_inicial < '${dataFinal}'
                AND data_final > '${dataInicial}'`
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
                '${dataInicial}', '${dataFinal}')`
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

            const dataInicial = data_inicial.replace("T", " ") + ":00";
            const dataFinal = data_final.replace("T", " ") + ":00";

            const conflito = await conexao.query(
                `SELECT *
                 FROM reserva
                 WHERE recurso_cod = ${recurso_cod}
                 AND id <> ${id}
                 AND data_inicial < '${dataFinal}'
                 AND data_final > '${dataInicial}'`
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
                     data_inicial='${dataInicial}',
                     data_final='${dataFinal}'
                 WHERE id=${id}`
            );

            return result;

        } catch (error) {
            throw new Error(
                `Erro na alteração no banco de dados: ${error.message}`
            );
        }
    }
    static async buscarPorUsuario(nome) {
        try {
            const conexao = await conectaBD();

            const result = await conexao
                .request()
                .input("nome", nome)
                .query(`
                    SELECT
                        r.id,
                        rc.codigo AS recurso_codigo,
                        rc.nome   AS recurso_nome,
                        u.nome    AS usuario,
                        s.status,
                        r.data_inicial,
                        r.data_final
                    FROM reserva r
                    JOIN cadastro_usuario u ON u.id = r.usuario_id
                    JOIN recurso rc         ON rc.codigo = r.recurso_cod
                    JOIN status_reserva s   ON s.codigo = r.status_cod
                    WHERE @nome = ''
                       OR u.nome COLLATE Latin1_General_CI_AI LIKE '%' + @nome + '%'
                    ORDER BY u.nome, r.data_inicial DESC
                `);

            return result.recordset;

        } catch (error) {
            throw new Error(
                `Erro na consulta ao banco de dados: ${error.message}`
            );
        }
    }    
}

export default Reserva;