
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
    status?: string;
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
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function buscarRecurso() {
            setCarregando(true);

            try {
                const resposta = await fetch(`http://localhost:8080/recurso/${codigo}`);

                if (!resposta.ok) {
                    setRecurso(null);
                    setMensagem("Não foi possível encontrar esse recurso.");
                    return;
                }

                const dados = await resposta.json();
                const recursoEncontrado = Array.isArray(dados) ? dados[0] : dados;

                if (!recursoEncontrado) {
                    setRecurso(null);
                    setMensagem("Não foi possível encontrar esse recurso.");
                    return;
                }

                setRecurso(recursoEncontrado);
                setMensagem("");
            } catch {
                setRecurso(null);
                setMensagem("Não foi possível carregar os dados do recurso.");
            } finally {
                setCarregando(false);
            }
        }

        buscarRecurso();
    }, [codigo]);

    const status = recurso?.status?.trim();
    const disponivel = status?.toLowerCase() === "livre";
    const indisponivel = !disponivel;

    async function reservar(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagem("");

        if (!recurso) {
            setMensagem("Não foi possível carregar o recurso.");
            return;
        }

        if (!disponivel) {
            setMensagem("Este recurso não está disponível para reserva.");
            return;
        }

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

        const agora = new Date();

        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, "0");
        const dia = String(agora.getDate()).padStart(2, "0");
        const dataAtual = `${ano}-${mes}-${dia}`;

        if (data < dataAtual) {
            setMensagem("Não é possível reservar em uma data passada.");
            return;
        }

        const horarioAtual = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;

        if (data === dataAtual && horarioEscolhido.inicio <= horarioAtual) {
            setMensagem("Esse horário já passou. Escolha outro horário.");
            return;
        }

        const dataInicial = `${data}T${horarioEscolhido.inicio}:00`;
        const dataFinal = `${data}T${horarioEscolhido.fim}:00`;

        try {
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
                setData("");
                setHorario("");
            } else {
                setMensagem(dados.message || "Não foi possível realizar a reserva.");
            }
        } catch {
            setMensagem("Não foi possível conectar ao servidor.");
        }
    }

    return (
        <>
            <Cabecalho />

            <main className={style.container}>
                <h1 className={style.titulo}>Reserva de recurso</h1>

                {carregando && <p>Carregando recurso...</p>}

                {!carregando && recurso && (
                    <div className={style.recurso}>
                        <h2>{recurso.nome}</h2>

                        <p><strong>Código:</strong> {recurso.codigo}</p>
                        <p>
                            <strong>Tipo:</strong>{" "}
                            {recurso.tipo === "S" ? "Sala" : "Laboratório"}
                        </p>
                        <p><strong>Capacidade:</strong> {recurso.capacidade} pessoas</p>
                        <p><strong>Local:</strong> {recurso.localidade}</p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {status ? (
                                <span className={disponivel ? style.statusLivre : style.statusIndisponivel}>
                                    {status}
                                </span>
                            ) : (
                                <span className={style.statusDesconhecido}>
                                    Não informado
                                </span>
                            )}
                        </p>
                    </div>
                )}

                {!carregando && recurso && (
                    <div className={style.formulario}>
                        <h2>Escolha o período</h2>

                        {indisponivel ? (
                            <p className={style.aviso}>
                                {status
                                    ? `Este recurso está com status "${status}" e não pode ser reservado.`
                                    : "Não foi possível confirmar o status deste recurso. A reserva está bloqueada."}
                            </p>
                        ) : (
                            <form onSubmit={reservar}>
                                <label htmlFor="data">Data:</label>

                                <input
                                    id="data"
                                    type="date"
                                    value={data}
                                    min={(() => {
                                        const hoje = new Date();
                                        const ano = hoje.getFullYear();
                                        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
                                        const dia = String(hoje.getDate()).padStart(2, "0");
                                        return `${ano}-${mes}-${dia}`;
                                    })()}
                                    onChange={event => {
                                        setData(event.target.value);
                                        setMensagem("");
                                    }}
                                    required
                                />

                                <label htmlFor="horario">Horário:</label>

                                <select
                                    id="horario"
                                    value={horario}
                                    onChange={event => {
                                        setHorario(event.target.value);
                                        setMensagem("");
                                    }}
                                    required
                                >
                                    <option value="">Selecione um horário</option>

                                    {horarios.map(item => (
                                        <option key={item.inicio} value={item.inicio}>
                                            {item.nome} — {item.inicio} às {item.fim}
                                        </option>
                                    ))}
                                </select>

                                <button className={style.botaoReservar} type="submit">
                                    Confirmar reserva
                                </button>
                            </form>
                        )}

                        {mensagem && <p className={style.mensagem}>{mensagem}</p>}
                    </div>
                )}

                {!carregando && !recurso && mensagem && (
                    <p className={style.mensagem}>{mensagem}</p>
                )}
            </main>
        </>
    );
}
