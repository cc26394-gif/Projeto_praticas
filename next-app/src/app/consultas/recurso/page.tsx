"use client";

import { useEffect, useState } from "react";
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
    tipo: string;
    capacidade: number;
    localidade: string;
}

function formatarData(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

function formatarHora(iso: string) {
    return new Date(iso).toLocaleTimeString("pt-BR", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function ConsultaPorRecurso() {
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [recursoCodigo, setRecursoCodigo] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function buscarRecursos() {
            try {
                const resposta = await fetch(`${API}/recurso`);

                if (!resposta.ok) {
                    throw new Error("Erro ao buscar recursos.");
                }

                const dados: Recurso[] = await resposta.json();
                setRecursos(dados);
            } catch {
                setMensagem("Não foi possível carregar os recursos.");
            }
        }

        buscarRecursos();
    }, []);

    async function buscarReservas(event: React.FormEvent) {
        event.preventDefault();

        setMensagem("");
        setReservas([]);

        if (!recursoCodigo) {
            setMensagem("Selecione um recurso.");
            return;
        }

        try {
            const resposta = await fetch(`${API}/reserva`);

            if (!resposta.ok) {
                throw new Error("Erro ao buscar reservas.");
            }

            const dados: Reserva[] = await resposta.json();

            const reservasDoRecurso = dados.filter(
                (reserva) => reserva.recurso_cod === Number(recursoCodigo)
            );

            setReservas(reservasDoRecurso);

            if (reservasDoRecurso.length === 0) {
                setMensagem("Não existem reservas para esse recurso.");
            }
        } catch {
            setMensagem("Não foi possível consultar as reservas.");
        }
    }

    async function excluirReserva(id: number) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta reserva?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(`${API}/reserva/${id}`, {
                method: "DELETE"
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                setMensagem(
                    resultado.message || "Não foi possível excluir a reserva."
                );
                return;
            }

            setReservas(
                reservasAtuais =>
                    reservasAtuais.filter(reserva => reserva.id !== id)
            );

            setMensagem("Reserva excluída com sucesso!");
        } catch {
            setMensagem("Não foi possível conectar ao servidor.");
        }
    }

    return (
        <>
            <Cabecalho />

            <main className={style.pagina}>
                <h1 className={style.titulo}>
                    Consultar Reservas por Recurso
                </h1>

                <p className={style.subtitulo}>
                    Selecione uma sala ou laboratório para consultar suas reservas.
                </p>

                <form onSubmit={buscarReservas} className={style.filtros}>
                    <label className={style.campo} htmlFor="recurso">
                        Recurso

                        <select
                            id="recurso"
                            value={recursoCodigo}
                            onChange={(event) =>
                                setRecursoCodigo(event.target.value)
                            }
                            required
                        >
                            <option value="">
                                Selecione um recurso
                            </option>

                            {recursos.map((recurso) => (
                                <option
                                    key={recurso.codigo}
                                    value={recurso.codigo}
                                >
                                    {recurso.nome} - Código {recurso.codigo}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button
                        type="submit"
                        className={style.limpar}
                    >
                        Buscar
                    </button>
                </form>

                {mensagem && (
                    <p className={style.vazio}>{mensagem}</p>
                )}

                {reservas.length > 0 && (
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
                                    <th>Ação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id}>
                                        <td>
                                            {recursos.find(
                                                (recurso) =>
                                                    recurso.codigo ===
                                                    reserva.recurso_cod
                                            )?.nome ?? reserva.recurso_cod}
                                        </td>

                                        <td>
                                            {formatarData(
                                                reserva.data_inicial
                                            )}
                                        </td>

                                        <td>
                                            {formatarHora(
                                                reserva.data_inicial
                                            )}
                                            {" às "}
                                            {formatarHora(
                                                reserva.data_final
                                            )}
                                        </td>

                                        <td>
                                            {reserva.status_cod === 4
                                                ? "Reservado"
                                                : reserva.status_cod}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className={style.limpar}
                                                onClick={() =>
                                                    excluirReserva(reserva.id)
                                                }
                                            >
                                                Excluir
                                            </button>
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