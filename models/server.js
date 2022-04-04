const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        //rutas principales
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth'

        //conexion a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    //llamado a la conexion
    async conectarDB(){
        await dbConnection();
    }

    middlewares() {

        // Directorio Público
        this.app.use( express.static('public') );

        //restringir direcciones
        this.app.use( cors() );

        //parse y lectura del body
        this.app.use( express.json() );

    }

    routes() {
        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.usuariosPath, require('../routes/user'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}


module.exports = Server;