class Component {
    constructor (id, type){
        this.id = id;
        this.type = type;
    }
}



class textComponent extends Component {
    constructor (id, type, text){
            super(id, type)
            this.text = text;
        }
}

class imageCarouselComponent extends Component {
    constructor(id, type, images){
        super(id, type)
        this.images = images
    }
}

module.exports = Component;