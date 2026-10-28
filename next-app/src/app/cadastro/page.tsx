"use client";

import style from "../../styles/cadastro.module.css";
import Link from "next/link";
import { useState } from "react";

export default function Cadastro() {

    const [cpf, setCpf] = useState("");
    const [nome, setNome] = useState("");
    const [nascimento, setNascimento] = useState("");
    const [celular, setCelular] = useState("");
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

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
                email,
                login,
                senha
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
            setLogin("");
            setSenha("");
        } else {
            setMensagem(dados.message);
        }
    }

    return (
        <div className={style.main}>

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

                <label>Login:</label>
                <br />

                <input
                    type="text"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    required
                />

                <br />
                <br />

                <label>Senha:</label>
                <br />

                <input
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                />

                <br />
                <br />

                <button className={style.button} type="submit">
                    Cadastrar
                </button>

                <br />

                <Link href="/login">
                    voltar para a pagina inicial
                </Link>

            </form>

            <p>{mensagem}</p>

        </div>
    );
}