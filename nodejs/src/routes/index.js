import statusRotas from './statusRotas.js'
import usuarioRotas from './usuarioRotas.js'
import recursoRotas from './recursoRotas.js'
import loginRotas from './loginRotas.js'
import reservaRotas from './reservaRotas.js'

const routes = (app) => {
    app.route("/").get((req, res) => 
        res.status(200).json({ message: "API rodando" })
    )

    app.use(statusRotas)
    app.use(usuarioRotas)
    app.use(recursoRotas)
    app.use(loginRotas)
    app.use(reservaRotas)
}

export default routes