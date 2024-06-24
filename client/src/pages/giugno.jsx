import { Link } from "react-router-dom"
import Axios from 'axios'
import { useEffect, useState } from "react"
import {PencilSimple, Backspace, ArrowCircleLeft} from "@phosphor-icons/react";
import MenuModifica from "../components/menuModifica";
import './giugno.css';

function Giugno(){

    const [data, setData] = useState([])
    const [showMenu, setShowMenu] = useState(false)

    const [idDaModificare, setIdDaModificare] = useState('')

    const fetchData = () =>{
        Axios.get('http://localhost:3001/getGiugno').then((response)=>{
            setData(response.data)
            console.log(response.data)

        }).catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{fetchData()},[showMenu])

    function elimina(id){
        if(window.confirm('Conferma')){
            Axios.post('http://localhost:3001/deleteElement', {
                id: id
            }).then((response) => {
                console.log(response)
                fetchData()
        
            }).catch((error)=>{
                alert(error)
            })
        }

    }

    function modificaElemento(id){
        setShowMenu(true)
        setIdDaModificare(id)
    }

    function gestisciMenu(){
        setShowMenu(false)
    }


    if(showMenu){
        return(        <MenuModifica change={gestisciMenu} id={idDaModificare}/>
        )
    }else{
        return (
            <>
                <div className="navBarUp">
                    <Link className="go-to-home" to={'/'}><ArrowCircleLeft size={32} /></Link>
                    <h2>Giugno</h2>
                </div>

                <div className="gestione-dati">
                    <h3>Gestione dati</h3>
                </div>

                <div className="areaTable">
                    <table>
                        <thead>
                        <tr>

                        </tr>
                        </thead>
                        <tbody>
                            {data.map((dati, indice)=>{

                                return(
                                    <tr key={indice}>
                                        <td>
                                            {dati.giorno}
                                        </td>
                                        <td>
                                            
                                            {dati.oraInizio} <br />
                                            {dati.oraFine} 
                                            
                                            {dati.spezzato && (
                                                <>
                                                    <br /><br /> {dati.oraInizioSpezzato} <br />
                                                    {dati.oraFineSpezzato}
                                                </>
                                            )}
                                        </td>
                                        <td>
                                            {dati.ore}h
                                        </td>
                                        <td>
                                            {dati.guadagnoExtra}€
                                        </td>
                                        <td>
                                            <button className="button-e-m" onClick={()=>modificaElemento(dati.id)}>
                                                <PencilSimple size={23} />
                                            </button>
                                        </td>

                                        <td>
                                            <button className="button-e-m" onClick={()=>elimina(dati.id)}>
                                                <Backspace size={23} color="#e10e0e" />
                                            </button>
                                        </td>


                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}


export default Giugno