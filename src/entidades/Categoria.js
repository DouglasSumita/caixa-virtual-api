class Categoria {
    constructor(name, id) {
        this.name = name
        this.id = id
    }

    getId() {
        return this.id
    }

    setId(id) {
        this.id = id
    }

    getName() {
        return this.name
    }

    setName(name) {
        this.name = name
    }
}

module.exports = Categoria