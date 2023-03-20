/*

NPMS instalados:
npm init Para iniciar um projeto
npm install express --save Para instalar o express
npm install nodemon --save Para reiniciar o serviço automaticamente
npm install ejs --save Para modular o HTML com ejs
npm install body-parser --save Para capturar dados de um formulário
npm install --save sequelize Para manipular dados com js no DB
npm install --save mysql2 Para conectar o sequelize com o DB do tipo SQL


*/


const express = require('express') //Importanto express
const app = express() //Rodando express
const bodyParser = require('body-parser') //Importanto bodyParser
const connection = require('./database/database') //Importando arquivo de conexão com a db
const session = require('express-session')

const usersController = require('./users/usersController')
const adminAuth = require('./middlewares/adminAuth')

const Pergunta = require('./perguntas/Pergunta') //Importa o model Pergunta para realizar criação/sincronização de dados com o DB
const Resposta = require('./respostas/Resposta') //Importando o model Resposta
const User = require('./users/User')

connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o banco de dados realizada com sucesso")
    })
    .catch((error) => {
        console.log("Erro ao conectar no banco de dados")
})

app.get('/session',(req,res)=>{
    res.session.test = 1
})

app.use("/",usersController)

app.set('view engine','ejs') //Aplicando ejs como view engine
app.use(express.static('public')) //Indicando repositório de pastas estáticas

app.use(session({ //Criando sessões
    secret: "Ruanda", //Palavra para aumentar a segurança das sessões (palavra aleatória)
    cookie: {maxAge: 60000}///Valor de tempo da sessão(Valor em milissegundos) 
//Forma que o cookie será salvo. Os dados ficam salvos no servidor, porém o cookie indica que o usuário tem uma sessão ativa no server

}))

app.use(bodyParser.urlencoded({entended: false})) //Rodando bodyParser para decodificar dados do formulário
app.use(bodyParser.json()) //Permitir leitura dos dados via JSON

app.get("/",(req,res) => { //Criando rota inicial
    Pergunta.findAll({raw:/* pesquisa crua, traz somente os dados */ true, order:[
        ['id','DESC'] //DESC: DECRESCENTE. PARA CRESCENTE, USE ASC
    ]}).then(perguntas => { //Procura todas as perguntas da tabela e retorna
        res.render("index",{ //,{} serve para passar dados/variáveis
            perguntas: perguntas
        }) //Renderizar arquivo index.ejs
    })
}) 

app.get("/perguntar",(req,res)=> {
    res.render("perguntar")
})

app.post("/save",(req,res)=>{ //APP.POST DEVIDO AO FORMULÁRIO SER POST
    
    var title = req.body.title
    var description = req.body.description
    var user = req.body.user
    
    //res.send(`Sua pergunta "${title}" foi enviada!`)
    Pergunta.create({ //Responsável por salvar as perguntas no banco de dados | Equivalente a INSERT INTO perguntas ...
        titulo: title,
        descricao: description,
        userId: user
    }) .then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id",(req,res) => { //Criando rota para página de uma pergunta
    var id = req.params.id
    Pergunta.findOne({ //Cria um json para busca no banco de dados com o model Pergunta
        where: {id: id} //Procura no banco uma pergunta que tenha um id igual a variável id. Ex: Pergunta #1 tem o id 1
    }).then(pergunta => {
        if (pergunta != undefined){ //Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas //Passando respostas para a página de pergunta
                })
            })
        } else { //Pergunta não encontrada
            res.redirect("/")
        }
    })
})

app.post("/responder", adminAuth,(req,res) => {
    var corpo = req.body.corpo //Requisitando variáveis do EJS
    var perguntaId = req.body.pergunta
    var user = req.body.user
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId,
        userId: user
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })
})

app.listen(8081,() => {console.log("Servidor iniciado")}) //Rodando servidor na porta 8080

