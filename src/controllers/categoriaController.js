const mongoose = require('mongoose')
require('../models/categoria')
const modelCategoria = mongoose.model('Categoria')

async function novo(req, res) {
    try {
        const novaCategoria = await modelCategoria(req.body).save()
        return res.status(201).send(novaCategoria)
    } catch(e) {
        return res.status(400).send(e)
    }
}

async function listagem(req, res) {
    try {
        const categorias = await modelCategoria.find().sort({name: 'asc'}).populate()
        return res.status(200).send(categorias)
    } catch(e) {
        return res.status(400).send(e)
    }
}

async function listagemById(req, res) {
    try {
        const categoria = await modelCategoria.findById(req.params.id).populate()
        return res.status(200).send(categorias)
    } catch(e) {
        return res.status(400).send(e)
    }
}

async function exclui(req, res) {
    try {
        await modelCategoria.findByIdAndDelete(req.params.id).lean()
        res.status(204).send()
    } catch(error) {
        res.status(400).send(error)
    }
}

async function atualiza(req, res) {
    try {
        const categoriaAtualizada = await modelCategoria.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean()
        res.status(204).send(categoriaAtualizada)
    } catch(error) {
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