import Link from "next/link";
import style from "../styles/Cabecalho.module.css";
import Menudeopcoes from "./menudeopcoes";
export default function Cabecalho() {
    return (
        <div>
            <nav className={style.nav}>
                <Link href="/inicio" className={style.Link}>Inicio</Link>

                <Link href="/recursos" className={style.Link}>
                    Sistema de Reserva
                </Link>

                <Menudeopcoes/>

                <Link href="/sair" className={style.Link}>
                    Sair do login
                </Link>
            </nav>
        </div>
    );
}