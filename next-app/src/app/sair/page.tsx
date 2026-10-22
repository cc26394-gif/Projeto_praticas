"use client";

import { useRouter } from "next/navigation";
import style from "../../styles/sair.module.css";

export default function Sair() {
    const router = useRouter();

    function sair() {
        localStorage.removeItem("usuario_id");
        router.push("/login");
    }

    function cancelar() {
        router.push("/inicio");
    }

    return (
        <main className={style.container}>
            <div className={style.card}>
                <h1>Você deseja realmente sair?</h1>

                <button className={`${style.botao} ${style.sair}`} onClick={sair}>Sim, sair</button>
                <button className={`${style.botao} ${style.cancelar}`} onClick={cancelar}>Cancelar</button>
            </div>
        </main>
    );
}