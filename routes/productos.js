const { Router } =  require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { existeCategoria, existeProducto } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRol} = require('../middlewares')

const router = Router();

//obtener todos los productos - publico
router.get('/',obtenerProductos)

//obtener un producto por id  - publico
router.get('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
],obtenerProducto)

//Crear producto - privado - cualquiera con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es una id de mongo db').isMongoId(),
    check('categoria').custom( existeCategoria),
    validarCampos
] ,crearProducto)

//Actualizar - privado - cualquiera con un token valido
router.put('/:id',[
    validarJWT,
    check('categoria','No es una id de mongo db').isMongoId(),
    check('categoria').custom( existeCategoria),
    check('id').custom( existeProducto ),
    validarCampos
],actualizarProducto)

router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un id valido').isMongoId(),
    check("id").custom( existeProducto  ),
],borrarProducto)

module.exports = router;