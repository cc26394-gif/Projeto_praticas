
import Link from "next/link";

interface DadosDosRecursos {
    codigo: number;
    nome: string;
    tipo: string;
    capacidade: number;
    localidade: string;
}

export default async function Recursos() {
    const response = await fetch("http://localhost:8080/recurso");

    const dados: DadosDosRecursos[] = await response.json();

    return (
        <>
            <h1>Área de Recursos</h1>

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>codigo</th>
                            <th>Nome</th>
                            <th>tipo</th>
                            <th>capacidade</th>
                            <th>localidade</th>
                            <th>reserva</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dados.map((recurso) => (
                            <tr key={recurso.codigo}>
                                <td>{recurso.codigo}</td>
                                <td>{recurso.nome}</td>
                                <td>{recurso.tipo}</td>
                                <td>{recurso.capacidade}</td>
                                <td>{recurso.localidade}</td>
                                <td>
                                    <Link href={`/reserva/${recurso.codigo}`}>
                                        reserva
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
