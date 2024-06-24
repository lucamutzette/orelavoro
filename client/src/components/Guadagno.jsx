import './guadagno.css'
import { Link } from 'react-router-dom';
function Guadano(props){
    return (
        <>    
        <Link className='linkGuadagno' to={props.meseIndi}>
        <div className='div-guadagano-comp'>
                <button className='button-guadagno-com'>
                    <p>{props.mese}: {props.dato}€</p>
                </button>
            </div>
        </Link>

        </>
    )

}

export default Guadano;