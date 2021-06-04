//HAY QUE CAMBIAR TODO ESTO A LA NUEVA BASE DE DATOS CON LAS NUEVAS CONSULTAS


const db = require('../DB/FirebaseConnection');
const express = require('express');
const profileObject= require("../models/profileObject");
const router = express.Router();  // llama a la conexion con la base de datos



router.get('/ApiProfileGet', async function (req, res) {  // para entrar a esta ruta
    try { // prueba si lo que esta adentro tiene un error
        const Usuarios = db.collection('User');
        const snapshot = await Usuarios.get();
           snapshot.forEach((doc) => {  // por cada fila muestra todos sus datos
            console.log(doc.id, '=>', doc.data());

});

    } catch (err) {  // muestra el error que salio antes si es que hubo
        res.status(500)  
        res.send(err.message)  
    }  
})

router.get('/ApiProfileGet/Name', async (req, res) =>{ // para entrar a esa ruta, qué va a hacer
    try {
            const user = await getUsers();
            user.forEach(documento =>{
                const Usuario = createProfileObject(documento.data());
                if (Usuario) {
                    console.log(Usuario.name);
                    res.json(Usuario.name+ ", el mismisimo "+ Usuario.lastName)
                } else {
                    console.log('No such Document');
                }
            })
        
       
    } catch (err){
            res.status(500);
            res.send(err.message);
        }
})



async function getUsers() {
    const snapshot = await db.collection("User").get();
    
    if(snapshot.docs.length > 0) {
        return snapshot.docs
    }else{
        return undefined
    }
  }  

  function createProfileObject(User){
    const user = new profileObject(User.id, User.name, User.lastName, User.userName, User.password, User.email, User.suscripcion, User.tipoDeTarjeta, User.nombreDeTarjeta, User.bancoDeTarjeta, User.numeroDeTarjeta, User.codDeSeg, User.VencTarjeta);
    return user;
  }

/*router.get('/UserDataGet', async (req, res) => {
    try{
            config.query('SELECT name, password FROM tblProfile', (err, rows) =>{
                if(err) throw err;
                res.json(rows);
                const objectX = Object.values(JSON.parse(JSON.stringify(rows)));

                    objectX.forEach(element => {
                    console.log(element["name"]+" tiene como contrseña "+element["password"]);
                 });
            })
        }
        catch(err) {
             res.status(500);
            res.send(err.message);
        }
})

*/

module.exports = router ;

