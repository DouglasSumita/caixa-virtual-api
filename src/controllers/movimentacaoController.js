const mongoose = require('mongoose')
const Categoria = require('../entidades/Categoria')
const Movimentacao = require('../entidades/Movimentacao')
const { stringPreenchida } = require('../util/strings')
require('../models/movimentacao')
const modelMovimentacao = mongoose.model('Movimentacao')
require('../models/categoria')
const modelCategoria = mongoose.model('Categoria')
require('../entidades/Movimentacao')
const { getCategoriaById } = require('./categoriaController')
const { getCategoria } = require('./categoriaController')
const { getCategorias } = require('./categoriaController')

async function getObjetoMovimentacao(obj) {
    try {
        const categoria = await getCategoriaById(obj.categoria.toString())
        return new Movimentacao(obj.descricao, obj.valor, obj.tipo, categoria, obj._id, obj.email)
    } catch (e) {
        return {}
    }
}

async function getMovimentacoes(email = "") {
    const result = {
        saldoTotal: 0,
        movimentacoes: []
    }

    try {
        let totalCredito = 0
        let totalDebito = 0
        const categorias = await getCategorias()
        const movimentacoes = await modelMovimentacao.find({email: email}).sort({data: 'desc'}).populate()

        if (movimentacoes.length) {
            const movimentacoesAux = movimentacoes.map((obj) => new Movimentacao(obj.descricao, obj.valor, obj.tipo, getCategoria(obj.categoria.toString(), categorias), obj._id, email))
            totalCredito = movimentacoesAux.filter(obj => obj.tipo == "CREDITO").map(obj => obj.valor).reduce((valor, total) => total += valor)
            totalDebito = movimentacoesAux.filter(obj => obj.tipo != "CREDITO").map(obj => obj.valor).reduce((valor, total) => total += valor)
            result.saldoTotal = (totalCredito - totalDebito)
            result.movimentacoes = movimentacoesAux
        }
    } catch (e) {
        console.log(e)
    } finally {
        return result
    }
}

async function getErrosNovaMovimentacao(obj) {
    let categoriaExistente
    const erros = []
    try {
        const movimentacoes = await getMovimentacoes(obj.getEmail())
        categoriaExistente = await modelCategoria.findById(obj.categoria).limit(1)

        if (!categoriaExistente) {
            erros.push("Categoria não existe, Id: " + obj.getCategoria())
        }
        if (!stringPreenchida(obj.getDescricao())) {
            erros.push("Movimentação com 'descricao' inválida!")
        }
        if (!obj.getValor() || obj.getValor() <= 0) {
            erros.push("Movimentação com 'valor' inválido!")
        }
        if (!obj.getTipo() || (obj.getTipo() != "CREDITO" && obj.getTipo() != "DEBITO")) {
            erros.push("Movimentação com 'tipo' inválido, use 'CREDITO' ou 'DEBITO'.")
        } else if (obj.getTipo() == "DEBITO" && (movimentacoes.saldoTotal - obj.getValor()) < 0) {
            erros.push("O valor da Operação é maior que o valor disponível no caixa: " + movimentacoes.saldoTotal)
        }
    } catch (e) {
        erros.push("Erro ao consultar a movimentação: " + e)
    }
    return erros
}

async function novo(req, res) {
    const objMovimentacao = new Movimentacao(req.body.descricao, req.body.valor, req.body.tipo, req.body.categoria, req.body.id, req.headers.authorization)
    const erros = await getErrosNovaMovimentacao(objMovimentacao)
    if (erros.length) {
        return res.status(400).send(erros.join(',\n'))
    }

    try {
        const novaMovimentacao = await modelMovimentacao(objMovimentacao).save()
        return res.status(201).send(await getObjetoMovimentacao(novaMovimentacao))
    } catch (e) {
        return res.status(400).send(e)
    }
}

async function listagem(req, res) {
    try {
        const movimentacoes = await getMovimentacoes(req.headers.authorization)
        return res.status(200).send(movimentacoes)
    } catch (e) {
        return res.status(400).send(e)
    }
}

async function listagemById(req, res) {
    try {
        const movimentacao = await modelMovimentacao.find({
            _id: req.params.id,
            email: req.headers.authorization
        }).populate()
        return res.status(200).send(await getObjetoMovimentacao(movimentacao[0]))
    } catch (e) {
        return res.status(400).send(e)
    }
}

async function exclui(req, res) {
    try {
        const movimentacao = await modelMovimentacao.find({
            _id: req.params.id,
            email: req.headers.authorization
        }).populate()
         
        if (!movimentacao.length) {
            return res.status(400).send("Movimentação não encontrada!")
        }
        await modelMovimentacao.findByIdAndDelete(req.params.id).lean()
        res.status(200).send("Movimentação deletada com sucesso!")
    } catch (error) {
        res.status(400).send(error)
    }
}

async function atualiza(req, res) {
    try {
        const movimentacaAtualizada = await modelMovimentacao.findOneAndUpdate({_id: req.params.id, email: req.headers.authorization}, req.body, {
            new: true
        }).lean()
        
        res.status(200).send(await getObjetoMovimentacao(movimentacaAtualizada))
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = {
    novo,
    listagem,
    listagemById,
    exclui,
    atualiza
}