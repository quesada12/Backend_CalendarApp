const {response} = require('express');
const Evento = require('../models/Evento');


const crearEvento = async (req,res=response) => {
    
    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save()

        res.status(201).json({
            ok:true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador"
        });
    }


}

const getEventos = async (req,res=response) => {

    const eventos = await Evento.find()
                                .populate('user','name') //Como en el modelo User es una referencia se puede pedir que complete esos campos


    res.status(200).json({
        ok:true,
        eventos
    })
}


const actualizarEvento = async (req,res=response) => {

    const eventoId = req.params.id; //Obtener el id que viene en el URL

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe con ese id'
            })
            
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true}); // el new en true hace que retorne el evento actualizado sino devuelve el anterior para poder compararlo

        res.json({
            ok:true,
            evento: eventoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador"
        });
    }
    
}

const eliminarEvento = async (req,res=response) => {
    
    const eventoId = req.params.id; //Obtener el id que viene en el URL

    try {

        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe con ese id'
            })
            
        }

        if (evento.user.toString() !== req.uid) {
            return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio para eliminar este evento'
            })
        }

        await Evento.findByIdAndDelete(eventoId); 

        res.json({
            ok:true
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrador"
        });
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}