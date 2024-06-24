import { useState, useEffect } from 'react'
import Axios from 'axios'
import { useLocation, Link } from 'react-router-dom';
import Guadano from './components/Guadagno';



import './App.css'

function App() {

  const [guadagni, setGuadagni] = useState([])
  const location = useLocation();

  useEffect(()=>{
    Axios.get('http://localhost:3001/getGuadagni').then((response) =>{
      setGuadagni(response.data)
    })
  },[])


  return (
    <>
      <div>
        <h1 className='benevenuto-text'>Benvenuto <span className='nome-b'>Luca</span></h1>
      </div>
      <div className='guadagni-stim-div'>
        <h2 className='guadagni-stimati-text'>Guadagni stimati:</h2>

      </div>
      <div>
        <Guadano mese="Giungo" dato={guadagni[0]?.totale} meseIndi="/giugno"/>
        <Guadano mese="Luglio" dato={guadagni[1]?.totale} meseIndi="/luglio"/>
        <Guadano mese="Agosto" dato={guadagni[2]?.totale} meseIndi="/agosto"/>


      </div>

      <div className='firma-area-div'>
        <Link className='firma-link' to="/firma">Firma</Link>
      </div>
    </>
  )
}

export default App




