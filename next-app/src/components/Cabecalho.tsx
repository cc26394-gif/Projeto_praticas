import Link from "next/link";
import style from "../styles/Cabecalho.module.css";

export default function Cabecalho() {
    return (
        <div>
            <nav className={style.nav}>
                <Link href="/inicio" className={style.Link}>Inicio</Link>

                <Link href="/recursos" className={style.Link}>
                    Sistema de Reserva
                </Link>

                <Link href="/consultasDeReservas" className={style.Link}>
                    Consultar Reservas
                </Link>

                <Link href="/sair" className={style.Link}>
                    Sair do login
                </Link>
            </nav>
        </div>
    );
}