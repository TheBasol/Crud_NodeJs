const { Router } =  require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRol} = require('../middlewares')

const router = Router();

//obtener todas las categorias  - publico
router.get('/',obtenerCategorias)

//obtener una categoria por id  - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
] ,obtenerCategoria)

//Crear categoria - privado - cualquiera con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria)

//Actualizar - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check("id").custom( existeCategoria ),
    validarCampos
] ,actualizarCategoria)

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un id valido').isMongoId(),
    check("id").custom( existeCategoria  ),
    validarCampos
],borrarCategoria)


module.exports = router;