import { useState } from "react"
import Axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import {ArrowCircleLeft} from "@phosphor-icons/react";
import './firma.css'


function Firma(){

    const[data, setData] = useState()
    const[oraInizio, setOraInizio] = useState();
    const[oraFine, setOraFine] = useState();
    const[oraInizioSpezzato, setOraInizioSpezzato] = useState();
    const[oraFineSpezzato, setOraFineSpezzato] = useState();
    const[spezzato , setSpezzato] = useState(false);
    const[riposo, setRiposo] = useState(false);


    const navigate = useNavigate();


    function setDataToTime(data, time) {
        const [year, month, day] = data.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        return date.toISOString();
    }
    

    const sendFirma = () =>{
        if(spezzato){
            Axios.post("http://localhost:3001/nuovaFirma", {
                oraInizio : setDataToTime(data, oraInizio),
                oraFine : setDataToTime(data, oraFine),
                oraInizioSpezzato : setDataToTime(data, oraInizioSpezzato),
                oraFineSpezzato : setDataToTime(data, oraFineSpezzato),
                spezzato: spezzato,
                riposo: riposo
            }).then((response) => {
                console.log(response)
                navigate('/')
            })
        }else{
            Axios.post("http://localhost:3001/nuovaFirma", {
                oraInizio : setDataToTime(data, oraInizio),
                oraFine : setDataToTime(data, oraFine),
                spezzato: spezzato,
                riposo: riposo
            }).then((response) => {
                console.log(response)
                navigate('/')

            })
        }

    }
    return (
        <>

            <div className="navBarUp">
                <Link className="go-to-home" to={'/'}><ArrowCircleLeft size={32} /></Link>
                <h2>Firma</h2>
            </div>


            <div className="form">
                <p>Data</p>
                <input className="input-f-m" type="date" onChange={(event)=>{
                    setData(event.target.value)
                }} />
                <p>Ora ingresso</p>
                <input className="input-f-m"  type="time" onChange={(event)=>{
                    setOraInizio(event.target.value)
                }}/>
                <p>Ora Uscita</p>
                <input className="input-f-m"  type="time" onChange={(event)=>{
                    setOraFine(event.target.value)
                }}/>
                <div>
                    <br />
                    <p>------------Spezzato------------</p>
                </div>
                <p>Ora ingresso</p>
                <input  className="input-f-m" type="time" onChange={(event)=>{
                    setOraInizioSpezzato(event.target.value)
                }}/>
                <p>Ora Uscita</p>
                <input className="input-f-m"  type="time" onChange={(event)=>{
                    setOraFineSpezzato(event.target.value)
                }}/>
                <br />
                <br />
                <label htmlFor="spezzato">Spezzato</label>
                <input type="checkbox" name="spezzato" id="spezzato" onChange={(event)=>{
                    setSpezzato(event.target.checked)
                }}/>
                <br />

                 <label htmlFor="riposo">Riposo</label>

                <input type="checkbox" name="riposo" id="riposo" onChange={(event)=>{
                    setRiposo(event.target.checked)
                }}/>

                <br />
                <br />

                <button className="but-send-f" onClick={sendFirma}>Firma</button>
            </div>
        </>
    )
}


export default Firma;