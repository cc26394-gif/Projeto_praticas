"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "../../../styles/reserva.module.css";
import Cabecalho from "@/components/Cabecalho";

interface Recurso {
    codigo: number;
    nome: string;
    tipo: string;
    capacidade: number;
    localidade: string;
}

const horarios = [
    { nome: "1ª aula", inicio: "07:00", fim: "08:00" },
    { nome: "2ª aula", inicio: "08:00", fim: "09:00" },
    { nome: "3ª aula", inicio: "09:00", fim: "10:00" },
    { nome: "4ª aula", inicio: "10:00", fim: "11:00" },
    { nome: "5ª aula", inicio: "13:00", fim: "14:00" },
    { nome: "6ª aula", inicio: "14:00", fim: "15:00" },
    { nome: "7ª aula", inicio: "15:00", fim: "16:00" },
    { nome: "8ª aula", inicio: "16:00", fim: "17:00" }
];

export default function Reserva() {
    const params = useParams<{ codigo: string }>();
    const codigo = params.codigo;

    const [recurso, setRecurso] = useState<Recurso | null>(null);
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function buscarRecurso() {
            const resposta = await fetch(`http://localhost:8080/recurso/${codigo}`);
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

        if (!data || !horario) {
            setMensagem("Escolha a data e o horário.");
            return;
        }

        const horarioEscolhido = horarios.find(item => item.inicio === horario);

        if (!horarioEscolhido) {
            setMensagem("Escolha um horário válido.");
            return;
        }

        const dataInicial = `${data}T${horarioEscolhido.inicio}`;
        const dataFinal = `${data}T${horarioEscolhido.fim}`;

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
            setMensagem(dados.message || "Não foi possível realizar a reserva.");
        }
    }

    return (
        <>
            <Cabecalho />

            <main className={style.container}>
                <h1 className={style.titulo}>Reserva</h1>

                {recurso && (
                    <div className={style.recurso}>
                        <h2>{recurso.nome}</h2>

                        <p><strong>Código:</strong> {recurso.codigo}</p>

                        <p>
                            <strong>Tipo:</strong>{" "}
                            {recurso.tipo === "S" ? "Sala" : "Laboratório"}
                        </p>

                        <p><strong>Capacidade:</strong> {recurso.capacidade} pessoas</p>

                        <p><strong>Local:</strong> {recurso.localidade}</p>
                    </div>
                )}

                <div className={style.formulario}>
                    <h2>Escolha o período</h2>

                    <form onSubmit={reservar}>
                        <label htmlFor="data">Data:</label>

                        <input id="data" type="date" value={data} onChange={(event) => setData(event.target.value)} required />

                        <label htmlFor="horario">Horário:</label>

                        <select id="horario" value={horario} onChange={(event) => setHorario(event.target.value)} required>
                            <option value="">Selecione um horário</option>

                            {horarios.map((item) => (
                                <option key={item.inicio} value={item.inicio}>
                                    {item.nome} — {item.inicio} às {item.fim}
                                </option>
                            ))}
                        </select>

                        <button type="submit">Confirmar reserva</button>
                    </form>

                    <p className={style.mensagem}>{mensagem}</p>
                </div>
            </main>
        </>
    );
}