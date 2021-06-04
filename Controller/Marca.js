const db = require('../DB/FirebaseConnection');
const express = require('express');
const bodyParser = require("body-parser");
const marcaObject= require("../models/marcaObject");
const router = express.Router();  

var parser = express.json();
parser = express.urlencoded({extended: true});

router.post('/MarcaRegistro', parser, async (req, res) =>{
    try{
        const idMarca = req.body.idMarca;
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

        
        
       const validacion = await validate(name);
        console.log(validacion);
        if(validacion == true){
            setMarca(idMarca, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla );
            res.json("Se registro correctamente");
        }
        else{
            res.json ("La marca ya existe");
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


async function setMarca(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantilla ){
    
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

async function getMarca() {
    const snapshot = await db.collection("Marca").get();
    
    if(snapshot.docs()) {
        return snapshot.docs()
    }else{
        return undefined
    }
}

 async function validate(name) {
     console.log(name);
    const snapshot = await db.collection("Marca").where('name','==', name).get();
    let validacion = false;
    if(snapshot.exists){
         console.log("Ya existe esta marca");
    }
    else{
        validacion = true;
    }
    return validacion;

}

  
module.exports = router ;


//http://localhost:1437/?idMarca=1&name=valtito&password=jasjahsjash&email=valto&categoria=jorge&cuit=uriel&razonSocial=jorgito&condicionFrenteAlIva=ok&numeroIngresosBrutos=3&suscripcion=jorgelin&idPlantilla=1

  /* snapshot.forEach((doc) => {  
        if (doc.name == name){
            console.log("Ya existe esta marca");
        }
        else{
            validacion = true;
        }
        return validacion;
});
*/