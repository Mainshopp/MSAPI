var express = require('express');
const app = express();


app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.set("PORT", process.env.PORT || 8000)
/* app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');  
    next();  
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }); */

app.get("/api", (req, res) => {
    res.send("Hola")
})


const ProfileData = require('./Controller/Profile.js')  
const Factory = require('./Controller/Factory.js')
const MarcaData = require('./Controller/Marca.js')
const UsuariosData = require('./Controller/Usuarios.js')


app.use('/', ProfileData)  
app.use('/', Factory)
app.use('/', MarcaData)
app.use('/', UsuariosData)


app.listen(app.get("PORT"), () => {
    console.log('API RUNNING AT: localhost:${app.get("PORT")}')
})
