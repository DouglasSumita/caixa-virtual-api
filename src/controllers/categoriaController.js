const mongoose = require('mongoose')
const Categoria = require('../entidades/Categoria')
const Resposta = require('../entidades/Resposta')
require('../models/categoria')
const modelCategoria = mongoose.model('Categoria')
require('../entidades/Categoria')
const { stringPreenchida } = require('../util/strings')
const Logger = require('../util/Logger')
const { StatusCodes } = require('http-status-codes')

async function getCategoriaById(id) {
    try {
        const categorias = await getCategorias()
        return getCategoria(id, categorias)
    } catch (e) {
        Logger.log(e.message)
    }
    return null
}

function getCategoria(id, categorias) {
    const categoriaEncontrada = categorias.filter(obj => obj.id == id)
    if (categoriaEncontrada.length) {
        return categoriaEncontrada[0]
    }
    return null
}

async function getCategorias() {
    try {
        const categorias = await modelCategoria.find().sort({name: 'asc'}).populate()
        return categorias.map(obj => new Categoria(obj.name, obj._id))
    } catch (e) {
        return []
    }
}

async function novo(req, res) {
    let novaCategoria = new Categoria(req.body.name)
    const listaCategoriaExistente = await modelCategoria.find({name: novaCategoria.getName()})
    
    if (!stringPreenchida(novaCategoria.getName())) {
        return res.status(StatusCodes.BAD_REQUEST).send(new Resposta("Categoria com nome inválido!")) 
    } else if (listaCategoriaExistente.length) {
        return res.status(StatusCodes.BAD_REQUEST).send(new Resposta(`Categoria já existe, Id: ${listaCategoriaExistente[0]._id}`)) 
    } 
    
    try {
        novaCategoria = await modelCategoria(novaCategoria).save()
        return res.status(StatusCodes.CREATED).send(new Categoria(novaCategoria.name, novaCategoria._id))
    } catch(e) {
        return res.status(StatusCodes.BAD_REQUEST).send(new Resposta(e.message))
    }
}

async function listagem(req, res) {

    Logger.log(`Requisição: Buscar categorias.`)

    try {
        const categorias = await getCategorias()
        return res.status(StatusCodes.OK).send(categorias)
    } catch(e) {
        return res.status(StatusCodes.BAD_REQUEST).send(new Resposta(e.message))
    }
}

async function listagemById(req, res) {

    Logger.log(`Requisição: Buscar categoria por Id: ${id}`)

    try {
        return res.status(StatusCodes.OK).send(await getCategoriaById(req.params.id))
    } catch(e) {
        return res.status(StatusCodes.BAD_REQUEST).send(new Resposta(e.message))
    }
}

async function exclui(req, res) {

    let mensagem;
    Logger.log(`Requisição: Deletar categoria por Id: ${req.params.id}`)
    
    try {
        const categoria = await modelCategoria.findById(req.params.id).populate()
        if (!categoria) {
            return res.status(StatusCodes.BAD_REQUEST).send(new Resposta(`Id: ${req.params.id} da Categoria não existe!`))
        }
        await modelCategoria.findByIdAndDelete(req.params.id).lean()
        mensagem = `Deletado categoria Id: ${req.params.id} com sucesso!`
        res.status(StatusCodes.OK).send(mensagem)

    } catch(e) {
        mensagem = `Erro ao deletar categoria Id: ${req.params.id}`
        res.status(StatusCodes.BAD_REQUEST).send(new Resposta(e.message))
    } finally {
        Logger.log(mensagem)
    }
}

async function atualiza(req, res) {

    const categoria = new Categoria(req.body.name, req.params.id)
    Logger.log(`Requisição: Atualizar categoria por Id: ${id}`)

    try {
        const categoriaAtualizada = await modelCategoria.findByIdAndUpdate(categoria.getId(), categoria, {new: true}).populate()
        res.status(StatusCodes.OK).send(new Categoria(categoriaAtualizada.name, categoriaAtualizada._id))
    } catch(e) {
        res.status(StatusCodes.BAD_REQUEST).send(new Resposta(e.message))
    }
}

module.exports = {
    novo,
    listagem,
    listagemById,
    exclui,
    atualiza,
    getCategorias,
    getCategoria,
    getCategoriaById
}