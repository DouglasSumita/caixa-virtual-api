const mongoose = require('mongoose')
const Categoria = require('../entidades/Categoria')
const Movimentacao = require('../entidades/Movimentacao')
const { stringPreenchida } = require('../util/strings')
require('../models/movimentacao')
const modelMovimentacao = mongoose.model('Movimentacao')
require('../models/categoria')
const modelCategoria = mongoose.model('Categoria')
const { getCategoriaById } = require('./categoriaController')
const { getCategoria } = require('./categoriaController')
const { getCategorias } = require('./categoriaController')
const Resposta = require('../entidades/Resposta')

async function getObjetoMovimentacao(obj) {
    try {
        const categoria = await getCategoriaById(obj.categoria.toString())
        return new Movimentacao(obj.descricao, obj.valor, obj.tipo, categoria, obj._id, obj.email, obj.data)
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
            const movimentacoesAux = movimentacoes.map((obj) => new Movimentacao(obj.descricao, obj.valor, obj.tipo, getCategoria(obj.categoria.toString(), categorias), obj._id, email, obj.data))
            const creditos = movimentacoesAux.filter(obj => obj.tipo == "CREDITO").map(obj => obj.valor)
            const debitos = movimentacoesAux.filter(obj => obj.tipo != "CREDITO").map(obj => obj.valor)
            
            if (creditos.length) {
                totalCredito = creditos.reduce((total, valor) => total += valor)
            }  
            if (debitos.length) {
                totalDebito = debitos.reduce((valor, total) => total += valor)
            }

            result.saldoTotal = totalCredito - totalDebito
            result.movimentacoes = movimentacoesAux
        }
    } catch (e) {
        console.log(e)
    } finally {
        return result
    }
}

async function getErrosNovaMovimentacao(obj) {
    const erros = []
    try {
        const movimentacoes = await getMovimentacoes(obj.getEmail())
        const categoriaExistente = await modelCategoria.findById(obj.categoria).limit(1)

        if (!categoriaExistente) {
            erros.push(`Categoria não existe, Id: ${obj.getCategoria()}`)
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
            erros.push(`O valor da Operação é maior que o valor disponível no caixa: ${movimentacoes.saldoTotal}`)
        }
    } catch (e) {
        erros.push(`Erro ao consultar a movimentação: ${e.message}`)
    }
    return erros
}

async function novo(req, res) {
    const objMovimentacao = new Movimentacao(req.body.descricao, req.body.valor, req.body.tipo, req.body.categoria, req.body.id, req.headers.authorization)
    const erros = await getErrosNovaMovimentacao(objMovimentacao)
    if (erros.length) {
        return res.status(400).send(new Resposta(erros.join(',\n')))
    }

    try {
        const novaMovimentacao = await modelMovimentacao(objMovimentacao).save()
        return res.status(201).send(await getObjetoMovimentacao(novaMovimentacao))
    } catch (e) {
        return res.status(400).send(new Resposta(e.message))
    }
}

async function listagem(req, res) {
    try {
        const movimentacoes = await getMovimentacoes(req.headers.authorization)
        return res.status(200).send(movimentacoes)
    } catch (e) {
        return res.status(400).send(new Resposta(e.message))
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
        return res.status(400).send(new Resposta(e.message))
    }
}

async function exclui(req, res) {
    try {
        const movimentacao = await modelMovimentacao.find({
            _id: req.params.id,
            email: req.headers.authorization
        }).populate()
         
        if (!movimentacao.length) {
            return res.status(400).send(new Resposta("Movimentação não encontrada!"))
        }
        await modelMovimentacao.findByIdAndDelete(req.params.id).lean()
        res.status(200).send(new Resposta("Movimentação deletada com sucesso!"))
    } catch (e) {
        res.status(400).send(new Resposta(e.message))
    }
}

async function atualiza(req, res) {
    if (!req.body.valor || req.body.valor < 0) {
        res.status(400).send(new Resposta(`Valor inválido: ${req.body.valor}`))
    }
    try {
        const movimentacaAtualizada = await modelMovimentacao.findOneAndUpdate({
            _id: req.params.id, 
            email: req.headers.authorization
        }, req.body, {
            new: true
        }).lean()
        
        res.status(200).send(await getObjetoMovimentacao(movimentacaAtualizada))
    } catch (e) {
        res.status(400).send(new Resposta(e.message))
    }
}

module.exports = {
    novo,
    listagem,
    listagemById,
    exclui,
    atualiza
}