const db = require('../DB/FirebaseConnection');
const express = require('express');
var cors = require('cors');
const ComponentObject = require("../models/ComponentObject");
const router = express.Router();

router.get('/FactoryComponentsGet', async function (req, res) {
    const arrayComponents = [];
    try {
        const Components = await getComponents(); 
    if (Components) {
        Components.forEach(component => {
             arrayComponents.push(renderComponent(component.data()));
        });
        console.log(arrayComponents);
        res.json(arrayComponents);
        return arrayComponents;
    }
    } catch (error) {
        console.log(error)
    }
    return undefined
    });



    router.get('/FactoryComponentsAdd', async (req, res) =>{
        try{
            const idPlantilla = req.query.idPlantilla;
            const idComponent = req.query.id;
            
            setComponents(idComponent, idPlantilla);
        }catch(error){
            console.log(error);
        }

    })


    /*router.get('/FactoryComponentsRender', async (req, res) =>{
        try{
            const arrayComponents=[];
            const idPlantilla = req.query.idPlantilla;
            const snapchot = await getPlantillaById(idPlantilla);
            console.log(snapchot.ComponentsId[0]);
            snapchot.ComponentsId.forEach(componentId=>{
              arrayComponents[componentId] = await getComponentsbyId(componentId);
            })
            res.json(arrayComponents);

        }catch(error){
            console.log(error);
        }
    })*/

//FUNCIONES DE LAS RUTAS:






    async function getComponents() {
        const snapshot = await db.collection("Components").get();
        
        if(snapshot.docs.length > 0) {
            return snapshot.docs
        }else{
            return undefined
        }
      }  
    
    async function setComponents(idComponent, idPlantilla){
        const snapshot = await getPlantillaById(idPlantilla);
        const arrayComponentsId = snapshot.ComponentsId;
        arrayComponentsId.push(idComponent);
        db.collection("Plantilla").doc(idPlantilla).set({
            
            ComponentsId: arrayComponentsId
        }) 
    }

    async function getPlantillaById(idPlantilla) {
        const snapshot = await db.collection("Plantilla").doc(idPlantilla).get();
        
        if(snapshot.data()) {
            return snapshot.data()
        }else{
            return undefined
        }
    }

    async function getComponentsbyId(componentId){
        const ComponentData = await db.collection("Components").doc(componentId).get();
        if(ComponentData.data()) {
            return ComponentData.data()
        }else{
            return undefined
        }
    }

    function renderComponent(component) {
        switch (component.type) {
            case "imageCarousel" :
                const imageCarosuelComponent = new ComponentObject(component.id, component.type, component.images);
                return imageCarosuelComponent;
            break;
    
            case "text":
                const textComponent = new ComponentObject(component.id, component.type, component.text);
                return textComponent;
            break;
        }
    }

module.exports = router;


