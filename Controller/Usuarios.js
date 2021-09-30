const db = require('../DB/FirebaseConnection');
const express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require("body-parser");
const router = express.Router();  
//const marca = require("Marca.js");

app.use(cors());

var parser = express.json();
parser = express.urlencoded({extended: true});


//RUTAS


router.get('/UsuarioRegistro', parser, async (req, res) =>{
    try{
        const id = req.query.id;
        const name = req.query.name;
        const password = req.query.password;
        const email = req.query.email;
        const tipoCuenta = req.query.tipoCuenta;

        let validacion = await validate(email);

        if (validacion==true) {
            if(tipoCuenta=="usuario") {
                setUsuario(id, name, password, email, tipoCuenta);
                res.json("El usuario se ha registrado correctamente");
            }/*else{
                marca.setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla);
            }*/
        
        }else{
            res.json ("El usuario ya existe");
        }
    
        }catch(error){
        console.log(error);
    }

})


router.get('/BorrarUsuario', parser, async (req, res) =>{
    try{

        const id = req.query.id;
        

        deleteProducto(id);
        res.json("Se elimino el usuario");
        }catch(error){
        console.log(error);
    }

})



router.get('/ModificarUsuario', parser, async (req, res) =>{
    try{

        const id = req.query.id;
        const name = req.query.name;
        const password = req.query.password;
        

        validacion = await validacionModificar(id);
        console.log(validacion);

        if(validacion==true){
            modifyProducto(id, name,password);
            res.json("Se modifico el producto");
        } 
        else{
            res.json("No existe el producto");
        }
        }catch(error){
        console.log(error);
    }

})




router.get('/AgregarAlCarrito', parser, async (req, res) =>{
    try{

        const idMarca = req.query.idMarca;
        const idProducto = req.query.idProducto;
        const idUsuario=req.query.idUsuario;
        const idCarrito = req.query.idCarrito;
        
        const productoAgregar=agregarAlCarrito(idMarca, idProducto, idUsuario, idCarrito)
        console.log(productoAgregar);
        res.json("Se agrego el producto al carrito");
        

        }catch(error){
        console.log(error);
    }

})



//FUNCIONES

async function setUsuario(id, name, password, email, tipoCuenta){
    db.collection("Usuarios").doc(id).set({
            name: name,
            password: password,
            email: email,
            tipoCuenta: tipoCuenta
    })
}

async function deleteProducto(id){
    
    db.collection("Usuarios").doc(id).delete();
}


async function modifyProducto(id, name, password){
    db.collection("Usuarios").doc(id).update({
        name: name,
        password : password,
    });
}



async function agregarAlCarrito(idMarca,idProducto, idUsuario, idCarrito){

    const productoAgregar=db.collection("Marca").doc(idMarca).collection("Productos").doc(idProducto).get();

    db.collection("Usuarios").doc(idUsuario).collection("Carrito").doc(idCarrito).set({
        categoria: productoAgregar.categoriaProducto,
        nombre: productoAgregar.nameProducto,
        precio: productoAgregar.precioProducto,
        tipoDeProducto: productoAgregar.tipoDeProducto
    });
    return productoAgregar;
}






//VALIDACIONES


async function validate(email) {
    console.log(email);
   const snapshot = await db.collection("Usuarios").where('email','==', email).get();
   console.log(snapshot.empty)
   if(!snapshot.empty){
       console.log("Ya existe este usuario");
       return validacion = false;
   } else {
       return validacion = true;
   }

}

async function validacionModificar(id) {
    const snapshot = await db.collection("Usuarios").doc(id).where('id', '==', id).get();
    let validacion = false;
    if(!snapshot.empty){
        console.log("Existe el usuario");
        validacion = true;
        return validacion;
    } else {
     return validacion;
    }
 }
  
module.exports = router;


/* LINKS:
http://localhost:8000/UsuarioRegistro/?name=Juan%20Pablo%20Susel&password=ilovejuanpa&email=juanpisus@gmail.com&tipoCuenta=usuario

*/


/*

Usuarios:

- Registrar usuario
- Carrito: agregar al carrito, vaciar carrito
- Consulta para traer todos los logos
- Validacion de tipo de usuario

-Probar que este bien la validacion de registrar marca si es usuario o una marca

*/


