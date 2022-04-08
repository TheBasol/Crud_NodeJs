//los nombres de los modelos deben estar en plural

const Categoria = require('./categoria')
const Role = require('./roles')
const Server = require('./server')
const Usuario = require('./usuario')
const Producto = require('./producto')

module.exports = {
    Categoria,
    Role,
    Server,
    Usuario,
    Producto
}