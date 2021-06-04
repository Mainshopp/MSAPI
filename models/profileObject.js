class profileObject { // EL PARAMETRO PROF ES LO QUE VIENE DEL JSON DE PROFILE
    constructor(id, name, lastName, userName, password, email, suscripcion, tipo, nombre, banco, numero, codDeSeg, fechaDeVencimiento ){
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.suscripcion = suscripcion;
        this.tarjeta = {
            tipo:  tipo,
            nombre: nombre,
            banco: banco,
            numero: numero,
            codDeSeg : codDeSeg,
            fechaDeVencimiento : fechaDeVencimiento,
    }
   
    };
}

module.exports = profileObject;


/* Los objetos son para manejar los datos. Por ejemplo en el Profile.js, si queremos hacer 
un insert del nombre de un usuario, la consulta va a ser: INSERT Perfil.id INTO tblProfile */