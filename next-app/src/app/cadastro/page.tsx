"use client";

import { useState } from "react";

export default function Cadastro() {

    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [celular, setCelular] = useState("");
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function cadastrar(event: React.FormEvent) {
        event.preventDefault();

        const resposta = await fetch("http://localhost:8080/usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpf,
                nome,
                nascimento,
                celular,
                email
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            setMensagem("Usuário cadastrado com sucesso!");

            setCpf("");
            setNome("");
            setNascimento("");
            setCelular("");
            setEmail("");
        } else {
            setMensagem(dados.message);
        }
    }

    return (
        <>
            <h1>Criar usuário</h1>

            <form onSubmit={cadastrar}>

                <label>CPF:</label>
                <br />

                <input
                    type="text"
                    value={cpf}
                    onChange={(event) => setCpf(event.target.value)}
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

                <label>Data de nascimento:</label>
                <br />

                <input
                    type="date"
                    value={nascimento}
                    onChange={(event) => setNascimento(event.target.value)}
                    required
                />

                <br />
                <br />

                <label>Celular:</label>
                <br />

                <input
                    type="text"
                    value={celular}
                    onChange={(event) => setCelular(event.target.value)}
                />

                <br />
                <br />

                <label>E-mail:</label>
                <br />

                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <br />
                <br />

                <button type="submit">
                    Cadastrar
                </button>

            </form>

            <p>{mensagem}</p>
        </>
    );
}