
import express, { Router } from 'express';
import reservaController from '../controllers/reservaController.js';

const routes = express.Router();

routes.get("/reserva", reservaController.listarReserva);
routes.get("/reserva/:id", reservaController.buscarPorId);
routes.delete("/reserva/:id", reservaController.removerReserva);
routes.post("/reserva", reservaController.inserirReserva);
routes.patch("/reserva/:id", reservaController.alterarReserva);
routes.get("/reserva/usuario", async (req, res) => {
  const nome = (req.query.nome ?? "").toString().trim();

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("nome", sql.VarChar(100), nome)
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
    res.json(result.recordset);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao consultar reservas" });
  }
});

export default routes;