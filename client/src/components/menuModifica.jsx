import './menuModifica.css'
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Axios from 'axios';
import {ArrowCircleLeft} from "@phosphor-icons/react";

function MenuModifica (props){
    const[data, setData] = useState()
    const[oraInizio, setOraInizio] = useState();
    const[oraFine, setOraFine] = useState();
    const[oraInizioSpezzato, setOraInizioSpezzato] = useState();
    const[oraFineSpezzato, setOraFineSpezzato] = useState();
    const[spezzato , setSpezzato] = useState(false);
    const[riposo, setRiposo] = useState(false);

    const formatTime = (timeString) => {
        return timeString ? timeString.slice(11, 16) : ''; // Extracts "HH:mm" from "YYYY-MM-DDTHH:mm:ss.sssZ"
    };
    useEffect(()=>{
        Axios.get('http://localhost:3001/getData/'+props.id).then((response)=>{
            console.log(response)
            setOraInizio(formatTime(response.data.oraInizio))
            setOraFine(formatTime(response.data.oraFine))
            setOraInizioSpezzato(formatTime(response.data.oraInizioSpezzato))
            setOraFineSpezzato(formatTime(response.data.oraFineSpezzato))
            setSpezzato(response.data.spezzato)
            setRiposo(response.data.riposo)
            setData(formatDateToYYMMDD(response.data.oraInizio))
        })
    },[props.id])


    function setDataToTime(data, time) {
        const [year, month, day] = data.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        return date.toISOString();
    }

    function formatDateToYYMMDD(isoString) {
        const date = new Date(isoString);
    
        const year = date.getFullYear().toString().slice(2); // Estrai le ultime due cifre dell'anno
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // I mesi sono 0-indexed, quindi aggiungi 1
        const day = date.getDate().toString().padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }

    function aggiornaDati(id){
        if(spezzato){
            Axios.post("http://localhost:3001/aggiorna/"+id, {
                oraInizio : setDataToTime(data, oraInizio),
                oraFine : setDataToTime(data, oraFine),
                oraInizioSpezzato : setDataToTime(data, oraInizioSpezzato),
                oraFineSpezzato : setDataToTime(data, oraFineSpezzato),
                spezzato: spezzato,
                riposo: riposo
            }).then((response) => {
                props.change()
            })
        }else{
            Axios.post("http://localhost:3001/aggiorna/"+id, {
                oraInizio : setDataToTime(data, oraInizio),
                oraFine : setDataToTime(data, oraFine),
                spezzato: spezzato,
                riposo: riposo
            }).then((response) => {
                props.change()
            })
        }
    }
  
        return (
            <>
                <div className="navBarUp">
                    <Link className="go-to-home" to={'/'}><ArrowCircleLeft size={32} /></Link>
                    <h2>Modifica</h2>
                </div>
                <div className="form">
    
                    <p>Ora ingresso</p>
                    <input className="input-f-m" type="time" value={oraInizio} onChange={(event)=>{
                        setOraInizio(event.target.value)
                    }}/>
                    <p>Ora Uscita</p>
                    <input className="input-f-m" type="time" value={oraFine} onChange={(event)=>{
                        setOraFine(event.target.value)
                    }}/>
                    <div>
                        <br />
                        <p>------------Spezzato------------</p>
                    </div>
                    <p>Ora ingresso</p>
                    <input className="input-f-m" type="time"value={spezzato ? oraInizioSpezzato : NaN}   onChange={(event)=>{
                        setOraInizioSpezzato(event.target.value)
                    }}/>
                    <p>Ora Uscita</p>
                    <input className="input-f-m" type="time" value={spezzato ? oraFineSpezzato : NaN} onChange={(event)=>{
                        setOraFineSpezzato(event.target.value)
                    }}/>
                    <br />
                    <br />
                    <label htmlFor="spezzato">Spezzato</label>
                    <input type="checkbox" checked={spezzato} name="spezzato" id="spezzato" onChange={(event)=>{
                        setSpezzato(event.target.checked)
                    }}/>
                    <br />
    
                     <label htmlFor="riposo">Riposo</label>
    
                    <input type="checkbox" checked={riposo}  name="riposo" id="riposo" onChange={(event)=>{
                        setRiposo(event.target.checked)
                    }}/>
    
                    <br />
                    <br />
    
                    <button  className="but-send-f" onClick={()=>{aggiornaDati(props.id)}} >Aggiorna</button>
                    <button  className="but-send-f"onClick={()=>{props.change()}}>Annulla</button>
    
                </div>
            </>
        )
    

}

export default MenuModifica;