const db = require('../DB/FirebaseConnection');
const express = require('express');
var cors = require('cors');
var app = express();
const bodyParser = require("body-parser");
const marcaObject= require("../models/marcaObject");
const router = express.Router();

app.use(cors());

var parser = express.json();
parser = express.urlencoded({extended: true});

router.post('/MarcaRegistro', parser, async (req, res) =>{
    try{
        const id = req.body.id;
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        const categoria = req.body.categoria;
        const cuit = req.body.cuit;
        const razonSocial = req.body.razonSocial;
        const condicionFrenteAlIva = req.body.condicionFrenteAlIva;
        const numeroIngresosBrutos = req.body.numeroIngresosBrutos;
        const suscripcion = req.body.suscripcion;
        const idPlantilla = req.body.idPlantilla;


        
        
       const validacion = await validate(email);
        console.log(validacion);
        if(validacion == true){
            setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla);
            res.json("Se registro correctamente");
        }
        else{
            res.json("La marca ya existe");
        }
        }catch(error){
        console.log(error);
    }

})


router.post('/AgregarProducto', parser, async (req, res) =>{
    try{

        const id = req.body.id;
        const categoriaProducto = req.body.categoriaProducto;
        const nameProducto = req.body.nameProducto;
        const precioProducto = req.body.precioProducto;
        const tipoDeProducto = req.body.tipoDeProducto;
        const idProducto = req.body.idProducto;

        validacion = await encontreProducto(nameProducto, id);
        console.log(validacion);

        if(validacion == false) {
            setProducto(id, categoriaProducto, nameProducto, precioProducto, tipoDeProducto, idProducto);
            res.json("Se agregó el producto");
        } else {
            res.json("El nombre del producto que quiere agregar ya existe");
        }
       
        }catch(error){
        console.log(error);
    }

})

router.get('/ping', parser, async (req, res) =>{
    res.send("pong");
})

router.post('/BorrarProducto', parser, async (req, res) =>{
    try{

        const id = req.body.id;
        const idProducto = req.body.idProducto;
        console.log(id);
        deleteProducto(id, idProducto);
        res.json("Se elimino el producto");
        }catch(error){
        console.log(error);
    }

})


router.get('/ListadoProducto', parser, async (req, res) =>{
    try{

        const id = req.query.id;

        const arrayProductos = await getProducto(id, res);
        res.json(arrayProductos);
        console.log(arrayProductos);

        
    
        
        }catch(error){
        console.log(error);
    }

})

router.put('/ModificarProducto', parser, async (req, res) =>{
    try{

        const id = req.body.id;
        const categoriaProducto = req.body.categoriaProducto;
        const nameProducto = req.body.nameProducto;
        const precioProducto = req.body.precioProducto;
        const tipoDeProducto = req.body.tipoDeProducto;
        const idProducto = req.query.idProducto;
        

        validacion = await validacionModificar(id, idProducto);
        console.log(validacion);

        if(validacion==true){
            modifyProducto(id, categoriaProducto, nameProducto, precioProducto, tipoDeProducto, idProducto);
            res.json("Se modifico el producto");
        } 
        else{
            res.json("No existe el producto");
        }
        }catch(error){
        console.log(error);
    }

})

//Funciones

function createMarcaObject(Marca){
    const marca = new MarcaObject(Marca.id, Marca.name, Marca.password, Marca.email, Marca.categoria, Marca.cuit, Marca.razonSocial, Marca.condicionFrenteAlIva, Marca.numeroIngresosBrutos, Marca.suscripcion, Marca.idPlantlla);
    return marca;
  }








async function getMarcaById(id) {
    const snapshot = await db.collection("Marca").doc(id).get();
    
    if(snapshot.data()) {
        return snapshot.data()
    }else{
        return undefined
    }
}

async function setProducto(id, categoriaProducto, nameProducto, precioProducto, tipoDeProducto, idProducto){
    console.log(id);
    db.collection("Marca").doc(id).collection("Productos").doc(idProducto).set({
        categoriaProducto: categoriaProducto,
        nameProducto : nameProducto,
        precioProducto : precioProducto,
        tipoDeProducto : tipoDeProducto,
        idProducto : idProducto
    });
}

async function modifyProducto(id, categoriaProducto, nameProducto, precioProducto, tipoDeProducto, idProducto){
    db.collection("Marca").doc(id).collection("Productos").doc(idProducto).update({
        categoriaProducto: categoriaProducto,
        nameProducto : nameProducto,
        precioProducto : precioProducto,
        tipoDeProducto : tipoDeProducto,
        idProducto : idProducto
    });
}


async function deleteProducto(id, idProducto){
    console.log(id);
    console.log(idProducto);
    
    db.collection("Marca").doc(id).collection("Productos").doc(idProducto).delete();
}
async function getProducto(id){

    const productosRef = db.collection('Marca').doc(id).collection("Productos");
    const snapshot = await productosRef.get();
    const arrayProductos = [];
    console.log(snapshot);
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        arrayProductos.push(doc.data());
});
    return(arrayProductos);
}





async function getMarca() {
    const snapshot = await db.collection("Marca").get();
    
    if(snapshot.docs()) {
        return snapshot.docs()
    }else{
        return undefined
    }
}



//VALIDACIONES


async function validate(email) {
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



async function encontreProducto(nameProducto, id) {
    console.log(nameProducto);
   const snapshot = await db.collection("Marca").doc(id).collection("Productos").where('nameProducto', '==', nameProducto).get();
   let validacion = false;
   if(!snapshot.empty){
       console.log("El nombre ya existe");
       validacion = true;
       return validacion;
   } else {
    console.log("El nombre no existe y se puede agregar!!!!!!");
    return validacion;
   }
}


async function validacionModificar(id, idProducto) {
    const snapshot = await db.collection("Marca").doc(id).collection("Productos").where('idProducto', '==', idProducto).get();
    let validacion = false;
    if(!snapshot.empty){
        console.log("");
        validacion = true;
        return validacion;
    } else {
     return validacion;
    }
 }
 
 


/*

- Cambiar todo a req.query
- Ver Heroku
- Validar cada tipo de producto (indumentaria, tecnologia, deportes), que dependiendo del tipo de producto que sea, tenga unos campos u otros.
- Empezar con usuarios (log in, registrarse)



*/


  
module.exports = router;
/*module.exports = {
    "setMarca": setMarca
}*/




// 

//https://mainshop-nodejs.herokuapp.com/BorrarProducto/?id=634643643&nameProducto=remeraceleste

//https://mainshop-nodejs.herokuapp.com/ListadoProducto/?id=634643643

//https://mainshop-nodejs.herokuapp.com/AgregarProducto/?id=634643643&categoriaProducto=ropa&nameProducto=remeraprueba&precioProducto=500&tipoDeProducto=remera&idProducto=jfbsdfbsd

//https://mainshop-nodejs.herokuapp.com/ModificarProducto/?id=634643643&categoriaProducto=ropa&nameProducto=remerabasica&precioProducto=500&tipoDeProducto=remera&idProducto=aNV4JhIYw07hU8RxTwNA

//http://localhost:8000/ModificarProducto/?id=634643643&categoriaProducto=ropa&nameProducto=remerabasica&precioProducto=500&tipoDeProducto=remera&idProducto=aNV4JhIYw07hU8RxTwNA
