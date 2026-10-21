"use client";

import style from "../../styles/login.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const router = useRouter();

    async function entrar(event: React.FormEvent) {
        event.preventDefault();

        setMensagem("");
        setCarregando(true);

        try {
            const resposta = await fetch(
                "http://localhost:8080/login/autenticar",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        login,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagem(dados.message || "Não foi possível entrar.");
                return;
            }

            localStorage.setItem(
                "usuario_id",
                String(dados.usuario_id)
            );

            setMensagem("Login realizado com sucesso!");

            router.push("/recursos");

        } catch {
            setMensagem(
                "Não foi possível conectar à API. Verifique se ela está funcionando."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className={style.main}>
            <h1>Login</h1>

            <form onSubmit={entrar}>
               
                <div> <label htmlFor="login">Login:</label></div>

                <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    required
                />

                <br />
                <br />

                <label htmlFor="senha">Senha:</label>
                <br />

                <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                />

                <br />
                <div>
                    <h4>sem login?<Link href="/">clique aqui</Link></h4>
                </div>
              
                <br />

                <button type="submit" disabled={carregando} className={style.button}>
                    {carregando ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p>{mensagem}</p>
        </main>
    );
}