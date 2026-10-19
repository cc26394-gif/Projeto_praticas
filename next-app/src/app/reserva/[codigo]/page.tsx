export default async function Reserva({
    params
}: {
    params: Promise<{ codigo: string }>
}) {
    const codigo = ((await params).codigo)


    return (
        <>
            <h1>Reserva</h1>
            <h1>Reserva do recurso { codigo}</h1>
        </>
    );
}