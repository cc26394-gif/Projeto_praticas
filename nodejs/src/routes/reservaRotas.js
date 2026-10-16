
import express from 'express';
import reservaController from '../controllers/reservaController.js';

const routes = express.Router();

routes.get("/reserva", reservaController.listarReserva);
routes.get("/reserva/:id", reservaController.buscarPorId);
routes.delete("/reserva/:id", reservaController.removerReserva);
routes.post("/reserva", reservaController.inserirReserva);
routes.patch("/reserva/:id", reservaController.alterarReserva);

export default routes;