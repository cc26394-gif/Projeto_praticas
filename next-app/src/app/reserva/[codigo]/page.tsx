"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function Reserva() {

    const params = useParams<{ codigo: string }>();
    const codigo = params?.codigo;

    const [usuarioId, setUsuarioId] = useState("");
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function reservar(event: React.FormEvent) {
        event.preventDefault();

        if (dataFinal <= dataInicial) {
            setMensagem("A data final deve ser depois da data inicial.");
            return;
        }

        const resposta = await fetch("http://localhost:8080/reserva", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recurso_cod: Number(codigo),
                usuario_id: Number(usuarioId),
                status_cod: 4,
                data_inicial: dataInicial,
                data_final: dataFinal
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            setMensagem("Reserva realizada com sucesso!");
        } else {
            setMensagem(dados.message);
        }
    }

    return (
        <>
            <h1>Reserva do recurso {codigo}</h1>

            <form onSubmit={reservar}>

                <label>Usuário:</label>

                <input
                    type="number"
                    value={usuarioId}
                    onChange={(event) => setUsuarioId(event.target.value)}
                    required
                />

                <br />

                <label>Data inicial:</label>

                <input
                    type="datetime-local"
                    value={dataInicial}
                    onChange={(event) => setDataInicial(event.target.value)}
                    required
                />

                <br />

                <label>Data final:</label>

                <input
                    type="datetime-local"
                    value={dataFinal}
                    onChange={(event) => setDataFinal(event.target.value)}
                    required
                />

                <br />

                <button type="submit">
                    Reservar
                </button>

            </form>

            <p>{mensagem}</p>
        </>
    );
}