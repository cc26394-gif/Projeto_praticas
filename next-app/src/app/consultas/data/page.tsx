"use client";

import { useState, type FormEvent } from "react";
import style from "../../../styles/consulta.module.css";
import Cabecalho from "@/components/Cabecalho";

const API = "http://localhost:8080";

interface Reserva {
    id: number;
    recurso_cod: number;
    usuario_id: number;
    status_cod: number;
    data_inicial: string;
    data_final: string;
}

interface Recurso {
    codigo: number;
    nome: string;
}

function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

function formatarHora(data: string) {
    return new Date(data).toLocaleTimeString("pt-BR", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function ConsultaPorData() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [data, setData] = useState("");
    const [reservasEncontradas, setReservasEncontradas] = useState(false);
    const [mensagem, setMensagem] = useState("");

    async function buscarReservas(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensagem("");
        setReservasEncontradas(false);
        setReservas([]);

        const usuarioId = localStorage.getItem("usuario_id");

        if (!usuarioId) {
            setMensagem("Você precisa estar logado.");
            return;
        }

        if (!data) {
            setMensagem("Selecione uma data.");
            return;
        }

        try {
            const respostaReservas = await fetch(`${API}/reserva`);
            const respostaRecursos = await fetch(`${API}/recurso`);

            if (!respostaReservas.ok || !respostaRecursos.ok) {
                throw new Error("Erro ao buscar dados.");
            }

            const dadosReservas: Reserva[] = await respostaReservas.json();
            const dadosRecursos: Recurso[] = await respostaRecursos.json();

            setRecursos(dadosRecursos);

            const minhasReservas = dadosReservas.filter((reserva) => {
                const dataReserva = new Date(reserva.data_inicial)
                    .toLocaleDateString("en-CA", {
                        timeZone: "UTC"
                    });

                return reserva.usuario_id === Number(usuarioId)
                    && dataReserva === data;
            });

            setReservas(minhasReservas);
            setReservasEncontradas(true);

            if (minhasReservas.length === 0) {
                setMensagem("Você não possui reservas nessa data.");
            }
        } catch {
            setMensagem("Não foi possível carregar as reservas.");
        }
    }

    return (
        <>
            <Cabecalho />

            <main className={style.pagina}>
                <h1 className={style.titulo}>
                    Consultar Reservas por Data
                </h1>

                <p className={style.subtitulo}>
                    Selecione uma data para consultar suas reservas.
                </p>

                <form onSubmit={buscarReservas} className={style.filtros}>
                    <label className={style.campo} htmlFor="data">
                        Data da reserva
                        <input
                            id="data"
                            type="date"
                            value={data}
                            onChange={(event) => setData(event.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" className={style.limpar}>
                        Buscar
                    </button>
                </form>

                {mensagem && (
                    <p className={style.vazio}>{mensagem}</p>
                )}

                {reservasEncontradas && reservas.length > 0 && (
                    <>
                        <p className={style.subtitulo}>
                            {reservas.length}{" "}
                            {reservas.length === 1
                                ? "reserva encontrada"
                                : "reservas encontradas"}
                        </p>

                        <table className={style.tabela}>
                            <thead>
                                <tr>
                                    <th>Recurso</th>
                                    <th>Data</th>
                                    <th>Horário</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id}>
                                        <td>
                                            {recursos.find(
                                                (recurso) =>
                                                    recurso.codigo === reserva.recurso_cod
                                            )?.nome ?? reserva.recurso_cod}
                                        </td>

                                        <td>
                                            {formatarData(reserva.data_inicial)}
                                        </td>

                                        <td>
                                            {formatarHora(reserva.data_inicial)}
                                            {" às "}
                                            {formatarHora(reserva.data_final)}
                                        </td>

                                        <td>
                                            {reserva.status_cod === 4
                                                ? "Reservado"
                                                : reserva.status_cod}
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