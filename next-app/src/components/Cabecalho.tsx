import Link from "next/link"
import style from "../styles/Cabecalho.module.css"
export default function Cabecalho() {
    return (
        <div>
            <nav className={style.nav}>
                <Link href="/perfil" className={style.Link}>perfil</Link>
                <Link href="/recursos" className={style.Link}>Aréa de recursos</Link>
                <Link href="/sobre" className={style.Link}>sobre nós</Link>
                <Link href="/ajuda" className={style.Link}>ajuda</Link>
            </nav>
        </div>
    )
}