
import conectaBD from "../config/dbConnect.js";

class Recurso {
    constructor(codigo, nome, tipo, capacidade, localidade, status) {
        this.codigo = codigo;
        this.nome = nome;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.localidade = localidade;
        this.status = status;
    }

    static async buscarTodos() {
        const conexao = await conectaBD();

        const result = await conexao.query(`
            SELECT
                recurso.codigo,
                recurso.nome,
                recurso.tipo,
                recurso.capacidade,
                recurso.localidade,
                status_reserva.status
            FROM recurso
            INNER JOIN status_reserva
                ON recurso.status_cod = status_reserva.codigo
        `);

        return result.recordset.map(recurso =>
            new Recurso(
                recurso.codigo,
                recurso.nome,
                recurso.tipo,
                recurso.capacidade,
                recurso.localidade,
                recurso.status
            )
        );
    }

    static async buscarPorId(codigo) {
        const conexao = await conectaBD();

        const result = await conexao.query(`
            SELECT
                recurso.codigo,
                recurso.nome,
                recurso.tipo,
                recurso.capacidade,
                recurso.localidade,
                status_reserva.status
            FROM recurso
            INNER JOIN status_reserva
                ON recurso.status_cod = status_reserva.codigo
            WHERE recurso.codigo = ${codigo}
        `);

        return result.recordset.map(recurso =>
            new Recurso(
                recurso.codigo,
                recurso.nome,
                recurso.tipo,
                recurso.capacidade,
                recurso.localidade,
                recurso.status
            )
        );
    }

    static async removerRecurso(codigo) {
        const conexao = await conectaBD();

        const result = await conexao.query(`
            DELETE FROM recurso
            WHERE codigo = ${codigo}
        `);

        return result.rowsAffected;
    }

    static async inserirRecurso(recurso) {
        const conexao = await conectaBD();

        const { nome, tipo, capacidade, localidade } = recurso;

        const result = await conexao.query(`
            INSERT INTO recurso (nome, tipo, capacidade, localidade)
            VALUES (
                '${nome}',
                '${tipo}',
                ${capacidade},
                '${localidade}'
            )
        `);

        return result.rowsAffected;
    }

    static async alterarRecurso(recurso) {
        const conexao = await conectaBD();

        const { codigo, nome, tipo, capacidade, localidade, status } = recurso;

        if (status !== undefined) {
            const statusSeguro = String(status).replace(/'/g, "''");

            const result = await conexao.query(`
                UPDATE recurso
                SET status_cod = (
                    SELECT codigo
                    FROM status_reserva
                    WHERE status = '${statusSeguro}'
                )
                WHERE codigo = ${codigo}
                AND EXISTS (
                    SELECT 1
                    FROM status_reserva
                    WHERE status = '${statusSeguro}'
                )
            `);

            return result.rowsAffected;
        }

        const result = await conexao.query(`
            UPDATE recurso
            SET
                nome = '${nome}',
                tipo = '${tipo}',
                capacidade = ${capacidade},
                localidade = '${localidade}'
            WHERE codigo = ${codigo}
        `);

        return result.rowsAffected;
    }
}

export default Recurso;
