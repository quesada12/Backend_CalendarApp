const {response} = require('express');
const {validationResult} =require('express-validator') //Resultado de la validacion

const validarCampos = (req,res=response, next) => {
    
    //manejo de errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok:false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports={validarCampos}