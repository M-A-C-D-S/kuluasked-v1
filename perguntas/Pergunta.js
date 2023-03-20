const Sequelize = require('sequelize')
const connection = require('../database/database')
const Users = require('../users/User.js')

const Pergunta = connection.define('perguntas',{ //Cria um item na tabela, caso não exista a tabela, ele criará
    titulo:{
        type: Sequelize.STRING,
        allowNull: false //Não permite dados nulos
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Users.hasMany(Pergunta)
Pergunta.belongsTo(Users)

Pergunta.sync({force: true}) 

module.exports = Pergunta