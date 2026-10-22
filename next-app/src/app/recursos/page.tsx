import Link from "next/link";
import style from "../../styles/recursos.module.css";
import Cabecalho from "@/components/Cabecalho";

interface DadosDosRecursos {
    codigo: number;
    nome: string;
    tipo: string;
    capacidade: number;
    localidade: string;
}

export default async function Recursos() {
    const response = await fetch("http://localhost:8080/recurso");
    const dados: DadosDosRecursos[] = await response.json();

    return (
        <>
            <Cabecalho />

            <main className={style.container}>
                <h1 className={style.titulo}>Recursos disponíveis</h1>

                <div className={style.lista}>
                    {dados.map((recurso) => (
                        <div className={style.recurso} key={recurso.codigo}>
                            <h2>{recurso.nome}</h2>

                            <p>
                                <strong>Tipo:</strong>{" "}
                                {recurso.tipo === "S" ? "Sala" : "Laboratório"}
                            </p>

                            <p>
                                <strong>Capacidade:</strong>{" "}
                                {recurso.capacidade} pessoas
                            </p>

                            <p>
                                <strong>Local:</strong> {recurso.localidade}
                            </p>

                            <Link className={style.botao} href={`/reserva/${recurso.codigo}`}>
                                Reservar
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}