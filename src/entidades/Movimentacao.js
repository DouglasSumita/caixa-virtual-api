class Movimentacao {
    constructor(descricao, valor, tipo, categoria, id, email, data) {
        this.descricao = descricao
        this.valor = valor
        this.categoria = categoria
        this.tipo = tipo.toUpperCase()
        this.id = id
        this.email = email
        this.data = data
    }

    getId() {
        return this.id
    }
    setId(id) {
        this.id = id
    }
    getDescricao() {
        return this.descricao
    }
    setDescricao(descricao) {
        this.descricao = descricao
    }
    getValor() {
        return this.valor
    }
    setValor(valor) {
        this.valor = valor
    }
    getCategoria() {
        return this.categoria
    }
    setCategoria(categoria) {
        this.categoria = categoria
    }
    getTipo() {
        return this.tipo
    }
    setTipo(tipo) {
        this.tipo = tipo.toUpperCase()
    }
    getEmail() {
        return this.email
    }
    setEmail(email) {
        this.email = email
    }
    getData() {
        return this.data
    }
    setData(data) {
        this.data = data
    }
}

module.exports = Movimentacao