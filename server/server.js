const express = require('express')
const app = express()
const mongoose = require('mongoose')
const oreLavoroModel = require('./models/ore-collections')
const cors = require('cors')



app.use(express.json())
app.use(cors())

require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT

mongoose.connect(MONGO_URL)

function getGiornoFromDate(data){
    let giorno = data.getUTCDate()
    let mese = data.getUTCMonth()+1

    return giorno+"/"+mese;
}

function getMeseFromDate(data){
    let mese = data.getUTCMonth()+1

    return mese;
}

function getOraFromDate(data){
    let ora = data.getUTCHours();
    let minuti = (data.getMinutes() < 10 ? '0' : '') + data.getMinutes() ;

    return ora+":"+minuti;
}

function calcolaOreLavoro(spezzato, oraInizio, oraFine, oraInizioSpezzato, oraFineSpezzato){
    const oraIngresso = new Date(oraInizio)
    const oraUscita = new Date(oraFine)

    let oreLavoro = oraUscita-oraIngresso;

    if(spezzato === true){
        const oraIngressoSpezzato = new Date(oraInizioSpezzato)
        const oraUscitaSpezzato = new Date(oraFineSpezzato)

        let oreLavoroSpezzato = oraUscitaSpezzato-oraIngressoSpezzato;
        oreLavoro += oreLavoroSpezzato
    }



    oreLavoro = new Date(oreLavoro)
    let oreLavorate = oreLavoro.getUTCHours();
    let minutiLavorati = oreLavoro.getUTCMinutes();

    let minutiLavoratiDec = minutiLavorati/60;
    let oreLavorareDec = minutiLavoratiDec+oreLavorate;

    return oreLavorareDec;

}

function calcolaOreExtra(riposo, oreDec){
    let lavoroExtra = 0;
    if(riposo){
        lavoroExtra = oreDec;
    }else{
        if(oreDec>oreBase){
            lavoroExtra = oreDec-oreBase;
        }else{
            lavoroExtra = 0;
        }
    }

    return lavoroExtra;
}

function calcolaGuadagno(oreLavoroExtra){
    let guadagnoParziale = oreLavoroExtra*pagaBase;
    return guadagnoParziale;
}

const pagaBase = 10;
const oreBase = 6.66;
let sommaGuadagniExtra = [
    {
        mese:"giugno",
        meseNumerico: 6,
        totale: 0,
    },
    {
        mese:"luglio",
        meseNumerico: 7,
        totale: 0,
    },
    {
        mese:"agosto",
        meseNumerico: 8,
        totale: 0,
    }
];


app.get("/getGuadagni", async (req, res)=>{
    try{
        const result = await oreLavoroModel.find({});
        sommaGuadagniExtra[0].totale = 0;
        sommaGuadagniExtra[1].totale = 0;
        sommaGuadagniExtra[2].totale = 0;
        result.forEach(element => {
            let dec = 0;
            dec = calcolaOreLavoro(element.spezzato, element.oraInizio, element.oraFine, element.oraInizioSpezzato, element.oraFineSpezzato);
            const oraIngresso = new Date(element.oraInizio)


            let meseElemento = oraIngresso.getMonth()+1;

            let lavoroExtra = calcolaOreExtra(element.riposo, dec)
           
        

            let guadagnoParziale = calcolaGuadagno(lavoroExtra)

            switch(meseElemento){
                case 6:
                    sommaGuadagniExtra[0].totale += guadagnoParziale;
                    sommaGuadagniExtra[0].totale = Math.round(sommaGuadagniExtra[0].totale)
                    break;
                case 7:
                    sommaGuadagniExtra[1].totale += guadagnoParziale;
                    sommaGuadagniExtra[1].totale = Math.round(sommaGuadagniExtra[1].totale)

                    break;

                case 8:
                    sommaGuadagniExtra[2].totale += guadagnoParziale;
                    sommaGuadagniExtra[2].totale = Math.round(sommaGuadagniExtra[2].totale)

                    break;

            }
            
        });
        
        res.json(sommaGuadagniExtra)
    }catch (err){
        res.json(err)
    }
})

app.get('/getGiugno', async (req, res)=>{
    try{
        const result = await oreLavoroModel.find({});

        let dataToSend = [

        ]



        result.forEach((element) =>{
            if(getMeseFromDate(element.oraInizio)==6){
                let nuovoOggeto = {}

                let oreLavoro =  calcolaOreLavoro(element.spezzato, element.oraInizio, element.oraFine, element.oraInizioSpezzato, element.oraFineSpezzato);
                let oreExtra = (calcolaOreExtra(element.riposo, oreLavoro));
                let guadagnoExtra = Math.round(calcolaGuadagno(oreExtra))
    
                if(element.spezzato){
                    nuovoOggeto = {
                        id: element._id,
                        giorno: getGiornoFromDate(element.oraInizio),
                        oraInizio: getOraFromDate(element.oraInizio),
                        oraFine: getOraFromDate(element.oraFine),
                        oraInizioSpezzato: getOraFromDate(element.oraInizioSpezzato),
                        oraFineSpezzato: getOraFromDate(element.oraFineSpezzato),
                        ore: oreLavoro,
                        guadagnoExtra: guadagnoExtra,
                        spezzato: element.spezzato
                    }
                }else{
                    nuovoOggeto = {
                        id: element._id,
                        giorno: getGiornoFromDate(element.oraInizio),
                        oraInizio: getOraFromDate(element.oraInizio),
                        oraFine: getOraFromDate(element.oraFine),
                        ore: oreLavoro,
                        guadagnoExtra: guadagnoExtra,
                        spezzato: element.spezzato
    
                    }
                }
                dataToSend.push(nuovoOggeto);
            }
            
        })
        res.json(dataToSend)
    }catch(err){
        res.json(err)
    }
})

app.get('/getLuglio', async (req, res)=>{
    try{
        const result = await oreLavoroModel.find({});

        let dataToSend = [

        ]



        result.forEach((element) =>{
            if(getMeseFromDate(element.oraInizio)==7){
                let nuovoOggeto = {}

                let oreLavoro =  calcolaOreLavoro(element.spezzato, element.oraInizio, element.oraFine, element.oraInizioSpezzato, element.oraFineSpezzato);
                let oreExtra = (calcolaOreExtra(element.riposo, oreLavoro));
                let guadagnoExtra = Math.round(calcolaGuadagno(oreExtra))
    
                if(element.spezzato){
                    nuovoOggeto = {
                        id: element._id,
                        giorno: getGiornoFromDate(element.oraInizio),
                        oraInizio: getOraFromDate(element.oraInizio),
                        oraFine: getOraFromDate(element.oraFine),
                        oraInizioSpezzato: getOraFromDate(element.oraInizioSpezzato),
                        oraFineSpezzato: getOraFromDate(element.oraFineSpezzato),
                        ore: oreLavoro,
                        guadagnoExtra: guadagnoExtra,
                        spezzato: element.spezzato
                    }
                }else{
                    nuovoOggeto = {
                        id: element._id,
                        giorno: getGiornoFromDate(element.oraInizio),
                        oraInizio: getOraFromDate(element.oraInizio),
                        oraFine: getOraFromDate(element.oraFine),
                        ore: oreLavoro,
                        guadagnoExtra: guadagnoExtra,
                        spezzato: element.spezzato
    
                    }
                }
                dataToSend.push(nuovoOggeto);
            }
            
        })
        res.json(dataToSend)
    }catch(err){
        res.json(err)
    }
})

app.get('/getAgosto', async (req, res)=>{
    try{
        const result = await oreLavoroModel.find({});

        let dataToSend = [

        ]



        result.forEach((element) =>{
            if(getMeseFromDate(element.oraInizio)==8){
                let nuovoOggeto = {}

                let oreLavoro =  calcolaOreLavoro(element.spezzato, element.oraInizio, element.oraFine, element.oraInizioSpezzato, element.oraFineSpezzato);
                let oreExtra = (calcolaOreExtra(element.riposo, oreLavoro));
                let guadagnoExtra = Math.round(calcolaGuadagno(oreExtra))
    
                if(element.spezzato){
                    nuovoOggeto = {
                        id: element._id,
                        giorno: getGiornoFromDate(element.oraInizio),
                        oraInizio: getOraFromDate(element.oraInizio),
                        oraFine: getOraFromDate(element.oraFine),
                        oraInizioSpezzato: getOraFromDate(element.oraInizioSpezzato),
                        oraFineSpezzato: getOraFromDate(element.oraFineSpezzato),
                        ore: oreLavoro,
                        guadagnoExtra: guadagnoExtra,
                        spezzato: element.spezzato
                    }
                }else{
                    nuovoOggeto = {
                        id: element._id,
                        giorno: getGiornoFromDate(element.oraInizio),
                        oraInizio: getOraFromDate(element.oraInizio),
                        oraFine: getOraFromDate(element.oraFine),
                        ore: oreLavoro,
                        guadagnoExtra: guadagnoExtra,
                        spezzato: element.spezzato
    
                    }
                }
                dataToSend.push(nuovoOggeto);
            }
            
        })
        res.json(dataToSend)
    }catch(err){
        res.json(err)
    }
})


app.get('/getData/:id', async (req, res)=>{
    const id = req.params.id;
    try{
        const response = await oreLavoroModel.findOne({_id: id})
        console.log(response)
        res.json(response)
    }catch(error){
        res.json(error)
    }
})



//AGGIUNGERE CONFERMA FIRMA

app.post("/nuovaFirma", async (req, res)=>{
    try{
        const data = req.body
        const nuovaFirma = new oreLavoroModel(data);
        await nuovaFirma.save()
        res.json(data)

    } catch(err){
        res.json(err)

    }


})


app.post('/aggiorna/:id', async (req, res)=>{
    const id = req.params.id;
    const data = req.body;
    console.log(data)
    const response = await oreLavoroModel.updateOne({_id:id}, data).then((response)=>{
        res.sendStatus(200)
    }).catch((error)=>{
        res.sendStatus(400)
    })
})

app.post('/deleteElement', async (req, res)=>{
    const {id} = req.body;
    await oreLavoroModel.deleteOne({_id: id}).then((result)=>{
        console.log(result);
        res.sendStatus(200);
    }).catch((error)=>{
        res.sendStatus(400)
    })
})


app.listen(PORT, ()=>{
    console.log('server is runnig')
})