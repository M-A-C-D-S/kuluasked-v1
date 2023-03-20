const Sequelize = require('sequelize') //Importando sequeliza

const connection = new Sequelize('kuluasked','root','admin',{ //Criando conexão com um db (no caso, MySQL Workbench)
    host: 'localhost',
    dialect:'mysql',
    timezone: '-03:00'
})

module.exports = connection //Exportando conexão para linkar ao index.js
