
import express from "express";
import recursoController from "../controllers/recursoController.js";

const routes = express.Router();

routes.get("/recurso", recursoController.listarRecurso);
routes.get("/recurso/:id", recursoController.buscarPorId);
routes.delete("/recurso/:id", recursoController.removerRecurso);
routes.post("/recurso", recursoController.inserirRecurso);
routes.patch("/recurso/:id", recursoController.alterarRecurso);

export default routes;
