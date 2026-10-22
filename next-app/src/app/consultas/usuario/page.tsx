import Link from "next/link";
import style from "../../../styles/consulta.module.css";
import Cabecalho from "@/components/Cabecalho";

const API = "http://localhost:8080";

interface Reserva {
    id: number;
    recurso_codigo: number;
    recurso_nome: string;
    usuario: string;
    status: string;
    data_inicial: string;
    data_final: string;
}

const classesStatus: Record<string, string> = {
    Livre: style.livre,
    Reservado: style.reservado,
    Ocupado: style.ocupado,
    Bloqueado: style.bloqueado,
    "Em manutenção": style.bloqueado,
};

// timeZone UTC mostra a data e hora exatamente como estão no banco
function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function formatarHora(iso: string) {
    return new Date(iso).toLocaleTimeString("pt-BR", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default async function ConsultaPorUsuario({
    searchParams,
}: {
    searchParams: Promise<{ nome?: string }>;
}) {
    const { nome = "" } = await searchParams;

    let reservas: Reserva[] = [];
    let erro = false;

    try {
        const response = await fetch(
            `${API}/reserva/usuario?nome=${encodeURIComponent(nome)}`,
            { cache: "no-store" }
        );
        if (!response.ok) throw new Error("falha");
        reservas = await response.json();
    } catch {
        erro = true;
    }

    return (
        <>
            <Cabecalho />

            <main className={style.pagina}>
                <h1 className={style.titulo}>Consultar por usuário</h1>
                <p className={style.subtitulo}>
                    Digite o nome da pessoa para ver todas as reservas dela.
                </p>

                <form action="/usuario" method="get" className={style.filtros}>
                    <label className={style.campo}>
                        Nome do usuário
                        <input
                            name="nome"
                            defaultValue={nome}
                            placeholder="Ex.: Ana"
                        />
                    </label>

                    <button type="submit" className={style.limpar}>
                        Buscar
                    </button>
                    <Link href="/usuario" className={style.limpar}>
                        Limpar
                    </Link>
                </form>

                {erro && (
                    <p className={style.vazio}>
                        Não foi possível carregar as reservas.
                    </p>
                )}

                {!erro && reservas.length === 0 && (
                    <p className={style.vazio}>
                        {nome
                            ? `Nenhuma reserva encontrada para "${nome}".`
                            : "Nenhuma reserva cadastrada."}
                    </p>
                )}

                {!erro && reservas.length > 0 && (
                    <>
                        <p className={style.subtitulo}>
                            {reservas.length}{" "}
                            {reservas.length === 1 ? "reserva encontrada" : "reservas encontradas"}
                        </p>

                        <table className={style.tabela}>
                            <thead>
                                <tr>
                                    <th>Usuário</th>
                                    <th>Recurso</th>
                                    <th>Data</th>
                                    <th>Horário</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.usuario}</td>
                                        <td>{r.recurso_codigo} - {r.recurso_nome}</td>
                                        <td>
                                            {formatarData(r.data_inicial)}
                                            {formatarData(r.data_final) !==
                                                formatarData(r.data_inicial) &&
                                                ` a ${formatarData(r.data_final)}`}
                                        </td>
                                        <td>
                                            {formatarHora(r.data_inicial)} às{" "}
                                            {formatarHora(r.data_final)}
                                        </td>
                                        <td>
                                            <span
                                                className={`${style.status} ${classesStatus[r.status] ?? ""}`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </>
    );
}