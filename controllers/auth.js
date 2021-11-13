const {response} = require('express') //para tener el IntelliSense
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs'); //Encrypt el password
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req,res = response) => {

    const {password,email} = req.body;

    try {
        let usuario = await Usuario.findOne({email:email}); //Busca en la DB si existe el usuario

        if (usuario) {
            return res.status(400).json({
                ok:false,
                msg:'Un usuario existe con ese correo'
            })
        }

        usuario = new Usuario(req.body);  //Se crea el obj de DB

        //Encryptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);


        await usuario.save(); //Guarda en DB

        //Generar JWT para logearse una vez registrado
        const token = await generarJWT(usuario.id,usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario.id, //Se devuelve la informacion
            name: usuario.name,
            token
        });

    } catch (error) {
        //Si falla la escritura en DB
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


const loginUsuario = async (req,res = response ) => {

    const {email,password} = req.body;

    try {

        const usuario = await Usuario.findOne({email:email}); //Se hace const para tener todos los datos de la DB de una vez

        if (!usuario) {
            return res.status(400).json({
                ok:false,
                msg:'Un usuario no existe con ese email'
            })
        }

        //Confirmar passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg:'Password incorrecto'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id,usuario.name);

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name:usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
  
}


const revalidarToken = async (req,res = response) => {

    //Al validar el token agregamos los campos para que puedan ser accesados en cualquier momento
    const uid = req.uid;
    const name = req.name;

    //GENERAR UN NUEVO JWT

    const token =  await generarJWT(uid,name)


    res.json({
        ok: true,
        token,
        uid,
        name
    })
}






module.exports = {crearUsuario,loginUsuario,revalidarToken}
