const db = require('../DB/FirebaseConnection');
const express = require('express');
const bodyParser = require("body-parser");
const marcaObject= require("../models/marcaObject");
const router = express.Router();  

var parser = express.json();
parser = express.urlencoded({extended: true});

router.get('/MarcaRegistro', parser, async (req, res) =>{
    try{
        const id = req.query.id;
        const name = req.query.name;
        const password = req.query.password;
        const email = req.query.email;
        const categoria = req.query.categoria;
        const cuit = req.query.cuit;
        const razonSocial = req.query.razonSocial;
        const condicionFrenteAlIva = req.query.condicionFrenteAlIva;
        const numeroIngresosBrutos = req.query.numeroIngresosBrutos;
        const suscripcion = req.query.suscripcion;
        const idPlantilla = req.query.idPlantilla;


        
        
       const validacion = await validate(email);
        console.log(validacion);
        if(validacion == true){
            setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla);
            res.json("Se registro correctamente");
        }
        else{
            res.json ("La marca ya existe");
        }
        }catch(error){
        console.log(error);
    }

})


router.get('/AgregarProducto', parser, async (req, res) =>{
    try{

        const id = req.query.id;
        const categoriaProducto = req.query.categoriaProducto;
        const nameProducto = req.query.nameProducto;
        const precioProducto = req.query.precioProducto;
        const tipoDeProducto = req.query.tipoDeProducto;
        const idProducto = req.query.idProducto;

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

router.get('/BorrarProducto', parser, async (req, res) =>{
    try{

        const id = req.body.id;
        const idProducto = req.body.idProducto;

        deleteProducto(id, idProducto);
        res.json("Se elimino el producto");
        }catch(error){
        console.log(error);
    }

})


router.get('/ListadoProducto', parser, async (req, res) =>{
    try{

        const id = req.body.id;

        getProducto(id, res);
    
        
        }catch(error){
        console.log(error);
    }

})

router.get('/ModificarProducto', parser, async (req, res) =>{
    try{

        const id = req.body.id;
        const categoriaProducto = req.body.categoriaProducto;
        const nameProducto = req.body.nameProducto;
        const precioProducto = req.body.precioProducto;
        const tipoDeProducto = req.body.tipoDeProducto;
        const idProducto = req.body.idProducto;
        

        validacion = await encontreProducto(nameProducto, id);
        console.log(validacion);

        if(validacion==false){
            modifyProducto(id, categoriaProducto, nameProducto, precioProducto, tipoDeProducto, idProducto);
            res.json("Se modifico el producto");
        } 
        else{
            res.json("Ya existe el nombre de este producto");
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


async function setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla){
    
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
            idPlantilla: idPlantilla
    })
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
    db.collection("Marca").doc(id).collection("Productos").doc(idProducto).set({
        categoriaProducto: categoriaProducto,
        nameProducto : nameProducto,
        precioProducto : precioProducto,
        tipoDeProducto : tipoDeProducto
    });
}

async function modifyProducto(id, categoriaProducto, nameProducto, precioProducto, tipoDeProducto, idProducto){
    db.collection("Marca").doc(id).collection("Productos").doc(idProducto).update({
        categoriaProducto: categoriaProducto,
        nameProducto : nameProducto,
        precioProducto : precioProducto,
        tipoDeProducto : tipoDeProducto
    });
}


async function deleteProducto(id, idProducto){
    
    db.collection("Marca").doc(id).collection("Productos").doc(idProducto).delete();
}

async function getProducto(id, res){

    const productosRef = db.collection('Marca').doc(id).collection("Productos");
    const snapshot = await productosRef.get();
    const arrayProductos = [];
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        arrayProductos.push(doc.data());
});
    res.json(arrayProductos);
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


/*

- Cambiar todo a req.body




*/


  
module.exports = router;




// 

//http://localhost:7000/BorrarProducto/?id=634643643&nameProducto=remeraceleste

//http://localhost:7000/ListadoProducto/?id=634643643

//http://localhost:7000/AgregarProducto/?id=653656563&categoriaProducto=ropa&nameProducto=remerabasica&precioProducto=500&tipoDeProducto=remera

//http://localhost:7000/ModificarProducto/?id=634643643&categoriaProducto=ropa&nameProducto=remerabasica&precioProducto=500&tipoDeProducto=remera&idProducto=aNV4JhIYw07hU8RxTwNA
