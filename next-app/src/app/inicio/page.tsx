import Cabecalho from "@/components/Cabecalho";
import style from "../../styles/inicio.module.css";
export default function inicio() {
    return (
        <>
            <div>
                <Cabecalho />
            </div>

            <h1 className={style.msginicio}>Bem-Vindo ao sistema de reserva de recursos</h1>

            <div className={style.conteudoInicio}>
                <div className={style.cardInicio}>
                    <h2>Recursos</h2>
                    <p>Encontre salas e laboratórios disponíveis e confira todas as informações antes de realizar sua reserva.</p>
                </div>

                <div className={style.cardInicio}>
                    <h2>Reservas</h2>
                    <p>Escolha o recurso, a data e o horário que deseja utilizar e faça sua reserva de forma rápida e prática.</p>
                </div>

                <div className={style.cardInicio}>
                    <h2>Consultas</h2>
                    <p>Acompanhe suas reservas e consulte os detalhes dos horários e recursos reservados.</p>
                </div>

                <div className={style.cardInicio}>
                    <h2>Tudo em um só lugar</h2>
                    <p>Tenha acesso fácil às informações sobre salas, laboratórios e reservas em um único sistema.  </p>
                </div>
            </div>



        </>
    )
}