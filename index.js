//Es como un import
const express = require('express');
require('dotenv').config(); //para poder usar variables de entorno
const cors = require('cors')
const {dbConnection} = require('./database/config')


//Crear Servidor de Express
const app = express();

//DB
dbConnection();

//Middleware's cada vez q solicitan pasa por aca

//CORS
app.use(cors());

//Directorio publico
app.use( express.static('public') );

//Lectura y parseo del Body
app.use(express.json());

//Rutas
app.use('/api/auth',require('./routes/auth'));  //Decirle al archivo auth la ruta que va a tener en el endpoint
app.use('/api/events',require('./routes/events'));


// TODO: CRUD:Eventos

// app.get('/',(req,res) => {
//     res.json({
//         ok: true
//     })
// })



//Escuchar peticiones
// 1.Puerto
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
})