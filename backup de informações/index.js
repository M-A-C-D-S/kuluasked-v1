const express = require("express") //Importanto express
const app = express() //Rodando express

app.set('view engine','ejs') //Aplicando ejs como view engine
app.use(express.static('public'))

app.get("/:nome/:lang",(req,res) => {
    var nome = req.params.nome //Requisição de parâmetros da URL da rota
    var lang = req.params.lang
    var exibirMsg = false
    var produtos = [
        {nome: "Item 1",preco: 25},
        {nome: "Item 2",preco: 22},
        {nome: "Item 3",preco: 144}
    ]
    res.render("index",{ //,{} serve para passar dados/variáveis
        nome: nome,
        lang: lang,
        empresa: "Kuluniana",
        msg: exibirMsg,
        produtos: produtos
    }) //Renderizar arquivo index.ejs
}) //Criando rota inicial

app.listen(8080,() => {console.log("Servidor iniciado")}) //Rodando servidor na porta 8080

