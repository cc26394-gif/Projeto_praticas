"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import style from "../../styles/recursos.module.css";
import Cabecalho from "@/components/Cabecalho";

interface DadosDosRecursos {
    codigo: number;
    nome: string;
    tipo: string;
    capacidade: number;
    localidade: string;
    status: string;
}

const statusDisponiveis = [
    "Livre",
    "Ocupado",
    "Em manutenção",
    "Reservado"
];

export default function Recursos() {
    const [dados, setDados] = useState<DadosDosRecursos[]>([]);
    const [statusSelecionado, setStatusSelecionado] = useState<Record<number, string>>({});
    const [mensagens, setMensagens] = useState<Record<number, string>>({});
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarRecursos() {
            try {
                const response = await fetch("http://localhost:8080/recurso");

                if (!response.ok) {
                    throw new Error();
                }

                const recursos: DadosDosRecursos[] = await response.json();

                setDados(recursos);

                const selecoes: Record<number, string> = {};

                recursos.forEach(recurso => {
                    selecoes[recurso.codigo] = recurso.status || "";
                });

                setStatusSelecionado(selecoes);
            } catch {
                setErro("Não foi possível carregar os recursos.");
            } finally {
                setCarregando(false);
            }
        }

        buscarRecursos();
    }, []);

    async function alterarStatus(codigo: number) {
        const novoStatus = statusSelecionado[codigo];

        if (!novoStatus) {
            setMensagens({
                ...mensagens,
                [codigo]: "Selecione um status."
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/recurso/${codigo}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: novoStatus
                })
            });

            const resultado = await response.json();

            if (!response.ok) {
                setMensagens({
                    ...mensagens,
                    [codigo]: resultado.message || "Não foi possível alterar o status."
                });
                return;
            }

            setDados(dadosAtuais =>
                dadosAtuais.map(recurso =>
                    recurso.codigo === codigo
                        ? { ...recurso, status: novoStatus }
                        : recurso
                )
            );

            setMensagens({
                ...mensagens,
                [codigo]: "Status alterado com sucesso!"
            });
        } catch {
            setMensagens({
                ...mensagens,
                [codigo]: "Não foi possível conectar ao servidor."
            });
        }
    }

    return (
        <>
            <Cabecalho />

            <main className={style.container}>
                <h1 className={style.titulo}>Recursos disponíveis</h1>

                <Link className={style.botao} href="/cadastroderecursos">
                    Cadastrar Recurso
                </Link>

                {carregando && <p>Carregando recursos...</p>}

                {erro && <p>{erro}</p>}

                <div className={style.lista}>
                    {dados.map(recurso => (
                        <div className={style.recurso} key={recurso.codigo}>
                            <h2>{recurso.nome}</h2>

                            <p>
                                <strong>Código:</strong> {recurso.codigo}
                            </p>

                            <p>
                                <strong>Tipo:</strong>{" "}
                                {recurso.tipo === "S" ? "Sala" : "Laboratório"}
                            </p>

                            <p>
                                <strong>Capacidade:</strong> {recurso.capacidade} pessoas
                            </p>

                            <p>
                                <strong>Local:</strong> {recurso.localidade}
                            </p>

                            <p>
                                <strong>Status atual:</strong> {recurso.status || "Não informado"}
                            </p>

                            <Link
                                className={style.botao}
                                href={`/reserva/${recurso.codigo}`}
                            >
                                Reservar
                            </Link>

                            <div className={style.alterarStatus}>
                                <button
                                    className={style.botao}
                                    type="button"
                                    onClick={() => alterarStatus(recurso.codigo)}
                                >
                                    Alterar status
                                </button>

                                <select
                                    id={`status-${recurso.codigo}`}
                                    value={statusSelecionado[recurso.codigo] || ""}
                                    onChange={event =>
                                        setStatusSelecionado({
                                            ...statusSelecionado,
                                            [recurso.codigo]: event.target.value
                                        })
                                    }
                                >
                                    <option value="" disabled>
                                        Selecione um status
                                    </option>

                                    {statusDisponiveis.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {mensagens[recurso.codigo] && (
                                <p>{mensagens[recurso.codigo]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}