const mongoose = require('mongoose')

const oreLavoroSchema = new mongoose.Schema({
    oraInizio :{
        type: Date,
        required: true,
    },
    oraFine :{
        type: Date,
        required: true,
    },
    oraInizioSpezzato :{
        type: Date,
        required: false,
    },
    oraFineSpezzato :{
        type: Date,
        required: false,
    },
    spezzato :{
        type: Boolean,
        required: true,
    },
    riposo :{
        type: Boolean,
        required: true,
    }
})

const oreLavoroModel = new mongoose.model('ores', oreLavoroSchema)
module.exports = oreLavoroModel;