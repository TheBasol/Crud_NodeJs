const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        //conexion a mongodb
        mongoose.connect( process.env.MONGODB_CNN);

        console.log("Base de datos en linea");


    } catch (error) {
        console.log(error)
        throw new Error('Error al iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}