const mongoose = require('mongoose')
const Categoria = require('../entidades/Categoria')
const Resposta = require('../entidades/Resposta')
require('../models/categoria')
const modelCategoria = mongoose.model('Categoria')
require('../entidades/Categoria')
const { stringPreenchida } = require('../util/strings')

async function getCategoriaById(id) {
    try {
        const categorias = await getCategorias()
        return getCategoria(id, categorias)
    } catch (e) {
        console.log(e.message)
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
        return res.status(400).send(new Resposta("Categoria com nome inválido!")) 
    } else if (listaCategoriaExistente.length) {
        return res.status(400).send(new Resposta(`Categoria já existe, Id: ${listaCategoriaExistente[0]._id}`)) 
    } 
    
    try {
        novaCategoria = await modelCategoria(novaCategoria).save()
        return res.status(201).send(new Catgoria(novaCategoria.name, novaCategoria._id))
    } catch(e) {
        return res.status(400).send(new Resposta(e.message))
    }
}

async function listagem(req, res) {
    try {
        const categorias = await getCategorias()
        return res.status(200).send(categorias)
    } catch(e) {
        return res.status(400).send(new Resposta(e.message))
    }
}

async function listagemById(req, res) {
    try {
        return res.status(200).send(await getCategoriaById(req.params.id))
    } catch(e) {
        return res.status(400).send(new Resposta(e.message))
    }
}

async function exclui(req, res) {
    try {
        const categoria = await modelCategoria.findById(req.params.id).populate()
        if (!categoria) {
            return res.status(400).send(new Resposta(`Id: ${req.params.id} da Categoria não existe!`))
        }
    
        await modelCategoria.findByIdAndDelete(req.params.id).lean()
        res.status(200).send("Categoria deletada com sucesso!")
    } catch(e) {
        res.status(400).send(new Resposta(e.message))
    }
}

async function atualiza(req, res) {
    const categoria = new Categoria(req.body.name, req.params.id)

    try {
        const categoriaAtualizada = await modelCategoria.findByIdAndUpdate(categoria.getId(), categoria, {new: true}).populate()
        res.status(200).send(new Categoria(categoriaAtualizada.name, categoriaAtualizada._id))
    } catch(e) {
        res.status(400).send(new Resposta(e.message))
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