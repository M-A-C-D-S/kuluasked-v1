const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users',(req,res)=>{
    User.findAll().then(users=>{
        res.render('users/index',{users: users})
    })
})

router.get('/admin/users/create',(req,res)=>{
    res.render('users/create')
})

router.post('/users/create',(req,res)=>{
    var email = req.body.email
    var username = req.body.username
    var password = req.body.password

    res.json({email, username, password})

    /*User.findOne({where:{email: email}}).then(user=>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10) //Serve para aumentar a segurança do hash
            var hash = bcrypt.hashSync(password, salt) //Serve para hashear a senha

            User.create({
                email: email,
                username: username,
                password: hash
            }).then(()=>{
                res.redirect('/')
            }).catch((err)=>{
                res.redirect('/')
            })
        } else {
            res.redirect('/admin/users/create')
        }
    })*/
})

router.get('/login',(req,res)=>{ //Página de login
    res.render('users/login')
})

router.post('/authenticate',(req,res)=>{ //Autenticando login
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email: email}}).then(user=>{
        if(user != undefined){ //Caso exista um usuário com esse email
            //Valide a senha
            var correct = bcrypt.compareSync(password,user.password)
            if(correct){//Se a senha estiver correta
                req.session.user = { //Valida id e email na sessão
                    id: user.id,
                    email: user.email
                }
                res.redirect('/')
            } else {
                res.redirect('/login')//Se não, redirecione
            }
        } else {
            res.redirect('/login') //Caso não, redireciona
        }
    })
})

router.get('/logout',(req,res)=>{
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router