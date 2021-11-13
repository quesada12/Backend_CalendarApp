const {Schema, model} = require('mongoose');

const EventoSchema = Schema({

    title: {
        type: String,
        required: true
    },

    notes:{
        type: String,
    },

    start:{
        type: Date,
        required: true
    },

    end:{
        type: Date,
        required: true
    },

    user:{
        type: Schema.Types.ObjectId, //Referencia o relacion al otro modelo
        ref: 'Usuario',
        required: true
    },

});

//Cambiar el nombre a un campo y eliminar otro en la respuesta
EventoSchema.method('toJSON',function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Evento',EventoSchema);