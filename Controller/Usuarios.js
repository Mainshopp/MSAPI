const db = require('../DB/FirebaseConnection');
const express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require("body-parser");
const router = express.Router();  
const marca = require("./Marca");

app.use(cors());

var parser = express.json();
parser = express.urlencoded({extended: true});


//RUTAS


router.post('/UsuarioRegistro', parser, async (req, res) =>{
    try{
        const id = req.body.id;
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        const tipoCuenta = req.body.tipoDeCuenta;
        const categoria = req.body.categoria;
        const cuit = req.body.cuit;
        const razonSocial = req.body.razonSocial;
        const condicionFrenteAlIva = req.body.condicionFrenteAlIva;
        const numeroIngresosBrutos = req.body.numeroIngresosBrutos;
        const suscripcion = req.body.suscripcion;
        const idPlantilla = req.body.idPlantilla;
        const logo = req.body.logo;

        let validacion = await validate(email);

        if (validacion==true) {
            if(tipoCuenta=="Usuario") {
                setUsuario(id, name, password, email, tipoCuenta);
                res.json("El usuario se ha registrado correctamente");
            }else{
                const validacion = await validateMarca(email);

                setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla, logo, tipoCuenta);
            }
        
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

router.get('/ListadoMarcas', parser, async (req, res) =>{
    try{
    const arrayMarcas = await getMarcas();
    res.json(arrayMarcas);
    console.log(arrayMarcas);
    
    
    
    
    }catch(error){
    console.log(error);
    }
    
    })


router.get('/AgregarAlCarrito', parser, async (req, res) =>{
    try{

        const idMarca = req.query.idMarca;
        const idProducto = req.query.idProducto;
        const idUsuario=req.query.idUsuario;
        
        const productoAgregar= await agregarAlCarrito(idMarca, idProducto, idUsuario);
        console.log(productoAgregar);
        res.json("Se agrego el producto al carrito");
        

        }catch(error){
        console.log(error);
    }

})

router.get('/TraerTipo', parser, async (req, res) =>{
    try{

        const id = req.query.id;
        const tipo = await validarTipo(id);
        res.json(tipo);

        }catch(error){
        console.log(error);
    }

})



//FUNCIONES

async function setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla, logo){
    
    db.collection("Marca").doc(id).set({
            name: name,
            password: password,
            email: email,
            categoria: categoria,
            cuit: cuit,
            razonSocial: razonSocial,
            condicionFrenteAlIva: condicionFrenteAlIva,
            numeroIngresosBrutos: numeroIngresosBrutos,
            suscripcion: suscripcion,
            idPlantilla: idPlantilla,
            logo: logo,
            tipoCuenta: tipoCuenta
    })
}

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


async function getMarcas(){

    const marcasRef = db.collection('Marca');
    const snapshot = await marcasRef.get();
    const arrayMarcas = [];
    console.log(snapshot);
    snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    arrayMarcas.push({...doc.data(), id: doc.id});
    });
    return(arrayMarcas);
    }



async function agregarAlCarrito(idMarca, idProducto, idUsuario){

    const snapshot= await db.collection("Marca").doc(idMarca).collection("Productos").doc(idProducto).get();
    console.log(snapshot.data());
    const productoAgregar = snapshot.data();

    let validacion=validateProdCarrito(idUsuario, idProducto);
    console.log(validacion);

    if(!validacion){
        db.collection("Usuarios").doc(idUsuario).collection("Carrito").doc(idProducto).set({
            categoria: productoAgregar.categoriaProducto,
            nombre: productoAgregar.nameProducto,
            precio: productoAgregar.precioProducto,
            tipoDeProducto: productoAgregar.tipoDeProducto,
            idProducto: productoAgregar.idProducto,
            cantidad: 1
        });
    }else {
        db.collection("Usuarios").doc(idUsuario).collection("Carrito").doc(idProducto).update({
            cantidad: cantidad + 1
        })
    }
    
    return productoAgregar;
}

async function validarTipo(id){
    const snapshot = await db.collection("Marca").doc(id).get();
    console.log(snapshot.data());
    let tipo = "Usuario";
    if(snapshot.data() != undefined) {
        tipo = "Marca";
    } else {
        tipo = "Usuario";
    }

    return tipo;
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

async function validateMarca(email) {
    console.log(email);
   const snapshot = await db.collection("Marca").where('email','==', email).get();
   console.log(snapshot.empty)
   if(!snapshot.empty){
       console.log("Ya existe esta marca");
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

 async function validateProdCarrito(idUsuario, idProducto) {
    const snapshot = await db.collection("Usuarios").doc(idUsuario).collection("Carrito").doc(idProducto).where('idProducto', '==', idProducto).get();
    let validacion = false;
    if(!snapshot.empty){
        console.log("Ya hay un producto");
        validacion = true;
        return validacion;
    } else {
        console.log("No está este producto en el carrito")
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


