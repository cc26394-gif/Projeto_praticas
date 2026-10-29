"use client";

import { useState } from "react";
import Link from "next/link";
import style from "../../styles/cadastrodesala.module.css";

export default function CadastroDeRecursos() {

    const [codigo, setCodigo] = useState("");
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("S");
    const [capacidade, setCapacidade] = useState("");
    const [localidade, setLocalidade] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function cadastrar(event: React.FormEvent) {
        event.preventDefault();

        try {
            const resposta = await fetch("http://localhost:8080/recurso", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codigo: Number(codigo),
                    nome,   
                    tipo,
                    capacidade: Number(capacidade),
                    localidade
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem("Sala cadastrada com sucesso!");

                setCodigo("");
                setNome("");
                setTipo("S");
                setCapacidade("");
                setLocalidade("");
            } else {
                setMensagem(dados.message || "Não foi possível cadastrar a sala.");
            }

        } catch {
            setMensagem("Não foi possível conectar com a API.");
        }
    }

    return (
        <main className={style.main}>

            <h1>Cadastrar sala</h1>

            <form onSubmit={cadastrar}>

                <label>Código:</label>
                <br />

                <input
                    type="number"
                    value={codigo}
                    onChange={(event) => setCodigo(event.target.value)}
                    required
                />

                <br />
                <br />

                <label>Nome:</label>
                <br />

                <input
                    type="text"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                />

                <br />
                <br />

                <label>Tipo:</label>
                <br />

                <select
                    value={tipo}
                    onChange={(event) => setTipo(event.target.value)}
                    required
                >
                    <option value="S">Sala</option>
                    <option value="L">Laboratório</option>
                </select>

                <br />
                <br />

                <label>Capacidade:</label>
                <br />

                <input
                    type="number"
                    value={capacidade}
                    onChange={(event) => setCapacidade(event.target.value)}
                    min="1"
                    required
                />

                <br />
                <br />

                <label>Localidade:</label>
                <br />

                <input
                    type="text"
                    value={localidade}
                    onChange={(event) => setLocalidade(event.target.value)}
                    required
                />

                <br />
                <br />

                <button className={style.button} type="submit">
                    Cadastrar sala
                </button>

                <br />
                <br />

                <Link href="/recursos">
                    Voltar para recursos
                </Link>

            </form>

            <p>{mensagem}</p>

        </main>
    );
}