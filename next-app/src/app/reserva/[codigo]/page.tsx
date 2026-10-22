"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "../../../styles/reserva.module.css";

interface Recurso {
    codigo: number;
    nome: string;
    tipo: string;
    capacidade: number;
    localidade: string;
}

export default function Reserva() {

    const params = useParams<{ codigo: string }>();
    const codigo = params.codigo;

    const [recurso, setRecurso] = useState<Recurso | null>(null);

    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {

        async function buscarRecurso() {

            const resposta = await fetch(
                `http://localhost:8080/recurso/${codigo}`
            );

            const dados = await resposta.json();

            setRecurso(dados[0]);
        }

        buscarRecurso();

    }, [codigo]);

    async function reservar(event: React.FormEvent) {

        event.preventDefault();

        const usuarioId = localStorage.getItem("usuario_id");

        if (!usuarioId) {
            setMensagem("Você precisa estar logado.");
            return;
        }

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
        <main className={style.container}>

            <h1 className={style.titulo}>
                Reserva
            </h1>

            {recurso && (
                <div className={style.recurso}>

                    <h2>{recurso.nome}</h2>

                    <p>
                        <strong>Código:</strong> {recurso.codigo}
                    </p>

                    <p>
                        <strong>Tipo:</strong>{" "}
                        {recurso.tipo === "S"
                            ? "Sala"
                            : "Laboratório"}
                    </p>

                    <p>
                        <strong>Capacidade:</strong>{" "}
                        {recurso.capacidade} pessoas
                    </p>

                    <p>
                        <strong>Local:</strong>{" "}
                        {recurso.localidade}
                    </p>

                </div>
            )}

            <div className={style.formulario}>

                <h2>Escolha o período</h2>

                <form onSubmit={reservar}>

                    <label>Data inicial:</label>

                    <input
                        type="datetime-local"
                        value={dataInicial}
                        onChange={(event) =>
                            setDataInicial(event.target.value)
                        }
                        required
                    />

                    <label>Data final:</label>

                    <input
                        type="datetime-local"
                        value={dataFinal}
                        onChange={(event) =>
                            setDataFinal(event.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Confirmar reserva
                    </button>

                </form>

                <p className={style.mensagem}>
                    {mensagem}
                </p>

            </div>

        </main>
    );
}