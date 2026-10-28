import conectaBD from '../config/dbConnect.js';

class Usuario {

    constructor(id, cpf, nome, nascimento, celular, email, data_cadastro, data_acesso) {
        this.id = id;
        this.cpf = cpf;
        this.nome = nome;
        this.nascimento = nascimento;
        this.celular = celular;
        this.email = email;
        this.data_cadastro = data_cadastro;
        this.data_acesso = data_acesso;
    }

    static async buscarTodos() {
        try {
            const conexao = await conectaBD();
            const result = await conexao.query("SELECT * FROM cadastro_usuario");

            return result.recordset.map(
                row => new Usuario(
                    row.id,
                    row.cpf,
                    row.nome,
                    row.nascimento,
                    row.celular,
                    row.email,
                    row.data_cadastro,
                    row.data_acesso
                )
            );

        } catch (error) {
            throw new Error(`Erro na consulta ao banco de dados: ${error.message}`);
        }
    }

    static async buscarPorId(id) {
        try {
            const conexao = await conectaBD();

            const result = await conexao.query(
                `SELECT * FROM cadastro_usuario WHERE id=${id}`
            );

            return result.recordset.map(
                row => new Usuario(
                    row.id,
                    row.cpf,
                    row.nome,
                    row.nascimento,
                    row.celular,
                    row.email,
                    row.data_cadastro,
                    row.data_acesso
                )
            );

        } catch (error) {
            throw new Error(`Erro na consulta ao banco de dados: ${error.message}`);
        }
    }

    static async removerUsuario(id) {
        try {
            const conexao = await conectaBD();

            const result = await conexao.query(
                `DELETE FROM cadastro_usuario WHERE id=${id}`
            );

            return result;

        } catch (error) {
            throw new Error(`Erro na remoção no banco de dados: ${error.message}`);
        }
    }

    static async inserirUsuario(cadastro_usuario) {

        const cpf = cadastro_usuario.cpf;
        const nome = cadastro_usuario.nome;
        const nascimento = cadastro_usuario.nascimento;
        const celular = cadastro_usuario.celular;
        const email = cadastro_usuario.email;

        try {
            const conexao = await conectaBD();

            const result = await conexao.query(
                `INSERT INTO cadastro_usuario 
                (cpf, nome, nascimento, celular, email) 
                OUTPUT INSERTED.id
                VALUES ('${cpf}', '${nome}', '${nascimento}', '${celular}', '${email}')`
            );

            return result.recordset[0].id;

        } catch (error) {
            throw new Error(`Erro na inserção no banco de dados: ${error.message}`);
        }
    }

    static async alterarUsuario(usuario) {

        const {
            id,
            cpf,
            nome,
            nascimento,
            celular,
            email
        } = usuario;

        console.log(usuario);

        try {
            const conexao = await conectaBD();

            const result = await conexao.query(
                `UPDATE cadastro_usuario 
                 SET cpf='${cpf}',
                     nome='${nome}',
                     nascimento='${nascimento}',
                     celular='${celular}',
                     email='${email}'
                 WHERE id=${id}`
            );

            return result;

        } catch (error) {
            throw new Error(`Erro na alteração no banco de dados: ${error.message}`);
        }
    }
}

export default Usuario;

