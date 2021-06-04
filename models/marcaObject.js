class Marca { 
    constructor(id, name, password, email, categoria, cuit, razonSocial, condicionFrenteAlIva, numeroIngresosBrutos, suscripcion, idPlantlla){
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.categoria = categoria;
        this.cuit = cuit;
        this.razonSocial = razonSocial;
        this.condicionFrenteAlIva = condicionFrenteAlIva;
        this.numeroIngresosBrutos = numeroIngresosBrutos;
        this.suscripcion = suscripcion;
        this.plantilla = idPlantlla;
    }
}

module.exports = Marca;