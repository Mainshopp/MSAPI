var express = require('express');

const app = express()

app.set("PORT", process.env.PORT || 8000)
app.use(function (req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');  
    next();  
});

app.get("/api", (req, res) => {
    res.send("Hola")
})


const ProfileData = require('./Controller/Profile.js')  
const Factory = require('./Controller/Factory.js')
const MarcaData = require('./Controller/Marca.js')


app.use('/', ProfileData)  
app.use('/', Factory)
app.use('/', MarcaData)

app.listen(app.get("PORT"), () => {
    console.log('API RUNNING AT: localhost:${app.get("PORT")}')
})
