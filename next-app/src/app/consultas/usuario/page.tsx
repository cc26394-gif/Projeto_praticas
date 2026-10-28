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

export default function ConsultaPorUsuario() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function buscarReservas() {
            const usuarioId = localStorage.getItem("usuario_id");

            if (!usuarioId) {
                setMensagem("Você precisa estar logado.");
                return;
            }

            try {
                const response = await fetch(`${API}/reserva`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar reservas.");
                }

                const dados: Reserva[] = await response.json();

                const minhasReservas = dados.filter(
                    (reserva) => reserva.usuario_id === Number(usuarioId)
                );

                setReservas(minhasReservas);
            } catch {
                setMensagem("Não foi possível carregar suas reservas.");
            }
        }

        buscarReservas();
    }, []);

    return (
        <>
            <Cabecalho />

            <main className={style.pagina}>
                <h1 className={style.titulo}>Minhas Reservas</h1>

                {mensagem && (
                    <p className={style.vazio}>{mensagem}</p>
                )}

                {!mensagem && reservas.length === 0 && (
                    <p className={style.vazio}>
                        Você ainda não possui reservas.
                    </p>
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
                                </tr>
                            </thead>

                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id}>
                                        <td>{reserva.recurso_cod}</td>

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