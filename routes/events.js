/*

    Rutas de Eventos/Events
    host+ /api/events

*/

const {Router} = require('express');
const router = Router();
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt')
const {getEventos,crearEvento,actualizarEvento,eliminarEvento} = require('../controllers/events')
const {isDate} = require('../helpers/isDate')

//Middleware general para todas las rutas
router.use(validarJWT);


//Obtener evento
router.get('/', getEventos);

//Crear evento
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatoria').custom(isDate),
        check('end','La fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ], 
    crearEvento
);

//Actualizar evento
router.put(
    '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','La fecha de inicio es obligatoria').custom(isDate),
        check('end','La fecha de finalización es obligatoria').custom(isDate),
        validarCampos
    ], 
    actualizarEvento
);

//Eliminar evento
router.delete('/:id', eliminarEvento);


module.exports = router;