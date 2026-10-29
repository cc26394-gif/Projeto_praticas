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

interface Usuario {
    id: number;
    nome: string;
}

interface Recurso {
    codigo: number;
    nome: string;
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
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [usuarioSelecionado, setUsuarioSelecionado] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function buscarDados() {
            try {
                const respostaUsuarios = await fetch(`${API}/usuario`);
                const respostaRecursos = await fetch(`${API}/recurso`);

                if (!respostaUsuarios.ok || !respostaRecursos.ok) {
                    throw new Error("Erro ao buscar dados.");
                }

                const dadosUsuarios: Usuario[] = await respostaUsuarios.json();
                const dadosRecursos: Recurso[] = await respostaRecursos.json();

                setUsuarios(dadosUsuarios);
                setRecursos(dadosRecursos);
            } catch {
                setMensagem("Não foi possível carregar os usuários ou recursos.");
            }
        }

        buscarDados();
    }, []);

    async function buscarReservas() {
        setMensagem("");
        setReservas([]);
        setUsuarioSelecionado("");

        if (nomeUsuario.trim() === "") {
            setMensagem("Digite o nome do usuário.");
            return;
        }

        const usuario = usuarios.find(
            usuario =>
                usuario.nome.toLowerCase() === nomeUsuario.trim().toLowerCase()
        );

        if (!usuario) {
            setMensagem("Nenhum usuário encontrado com esse nome.");
            return;
        }

        try {
            const resposta = await fetch(`${API}/reserva`);

            if (!resposta.ok) {
                throw new Error("Erro ao buscar reservas.");
            }

            const dados: Reserva[] = await resposta.json();

            const reservasUsuario = dados.filter(
                reserva => Number(reserva.usuario_id) === Number(usuario.id)
            );
            setReservas(reservasUsuario);
            setUsuarioSelecionado(usuario.nome);

            if (reservasUsuario.length === 0) {
                setMensagem("Esse usuário ainda não possui reservas.");
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
                    Consultar Reservas por Usuário
                </h1>

                <div className={style.filtros}>
                    <div className={style.campo}>
                        <label>Nome do usuário</label>
                        <input
                            type="text"
                            placeholder="Digite o nome do usuário"
                            value={nomeUsuario}
                            onChange={e => setNomeUsuario(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className={style.limpar}
                        onClick={buscarReservas}
                    >
                        Buscar
                    </button>
                </div>

                {usuarioSelecionado && (
                    <p className={style.subtitulo}>
                        Reservas de {usuarioSelecionado}
                    </p>
                )}

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
                                </tr>
                            </thead>

                            <tbody>
                                {reservas.map(reserva => {
                                    const recurso = recursos.find(
                                        item => item.codigo === reserva.recurso_cod
                                    );

                                    return (
                                        <tr key={reserva.id}>
                                            <td>
                                                {recurso
                                                    ? recurso.nome
                                                    : `Recurso ${reserva.recurso_cod}`}
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}
            </main>
        </>
    );
}