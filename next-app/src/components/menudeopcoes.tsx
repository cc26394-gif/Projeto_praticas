"user client";
import Link from "next/link";
import style from "../../styles/menudeopcoes.module.css";
import {useState, useRef, useEffect} from "react";

const opcoes=[
    { texto:"por recurso",href:""},
    { texto:"",href:""},
    { texto:"",href:""}
]   

export default function menudeopcoes(){
    const [aberto, setAberto] = useState(false)
    const ref = useRef <HTMLDivElement>(null)
    useEffect(() => {
        function fecharFora(e:MouseEvent){
            if(ref.current && !ref.current.contains(e.target as Node)) {
                setAberto(false)
            }
        }
        document.addEventListener("mousedown", fecharFora)
        return() => document.removeEventListener("mousedown",fecharFora)
    },[])
    return(
        <div ref={ref}>
            <button onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
                consultar reservas <span>{aberto?"▲":"▼"}</span>
            </button>
            {aberto &&(
                <ul>
                    {opcoes.map((o) => (
                        <li key={o.href}><Link href={o.href} onClick={() => setAberto(false)}>{o.texto}</Link></li>
                    
                    ))}
                </ul>
            )}        
        </div>
    )
}