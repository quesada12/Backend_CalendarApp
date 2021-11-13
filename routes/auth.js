/*

    Rutas de Usuarios/Auth
    host + /api/auth

*/

const {Router} = require('express');
const router = Router();

const {check} =require('express-validator') //Para validar los campos que vienen en el body

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')


//Crear Usuario
router.post(
    '/new', 
    [
        //middlewares
        check('name','El nombre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe ser de 6 caracteres').isLength({min:6}),
        validarCampos
    ] ,
    crearUsuario,
);


//Login
router.post(
    '/',
    [
        check('email','El email es obligatorio').isEmail(),
        check('password','El password debe ser de 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario)


//Renew Token
router.get('/renew',validarJWT,revalidarToken) //si es un solo middleware se puede poner como param sino se tiene q crear un []


module.exports = router