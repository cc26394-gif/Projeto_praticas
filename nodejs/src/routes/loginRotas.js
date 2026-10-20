import express from 'express';
import loginController from '../controllers/loginController.js';

const routes = express.Router();

routes.get("/login", loginController.listarLogin);
routes.get("/login/:id", loginController.buscarPorId);
routes.delete("/login/:id", loginController.removerLogin);
routes.post("/login", loginController.inserirLogin);
routes.post("/login/autenticar", loginController.autenticar);
routes.patch("/login/:id", loginController.alterarLogin);

export default routes;