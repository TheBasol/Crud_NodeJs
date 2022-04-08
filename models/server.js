const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        //rutas principales
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios',
        }

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
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'))
        this.app.use( this.paths.categorias, require('../routes/categorias'))
        this.app.use( this.paths.productos, require('../routes/productos'))
        this.app.use( this.paths.usuarios, require('../routes/user'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}


module.exports = Server;