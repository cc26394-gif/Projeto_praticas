import Link from "next/link";
import style from "../styles/Cabecalho.module.css";

export default function Cabecalho() {
    return (
        <div>
            <nav className={style.nav}>
                <Link href="/" className={style.Link}>Inicio</Link>

                <Link href="/recursos" className={style.Link}>
                    Área de reservas
                </Link>

                <Link href="/consultasDeReservas" className={style.Link}>
                    Consultar reservas
                </Link>

                <Link href="/login" className={style.Link}>
                    Login
                </Link>

                <Link href="/cadastro" className={style.Link}>
                    Cadastro
                </Link>
            </nav>
        </div>
    );
}