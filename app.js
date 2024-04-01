const express = require('express');
const app = express();
const axios = require('axios');

const path = require('path');

port = 8083;

const bodyParser = require('body-parser');

const exphbs = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',
    exphbs.engine({

        defaultLayout: 'main',
        extname: 'hbs',
        layoutsDir: path.join(__dirname, 'views/layout')

    })
);

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));

//GET produtos cadastrados na API
const produtos = [];

function checkBase(){

    axios.get('http://localhost:3000/produto')
    .then(function (response) {

        response.data.forEach(produto => {

            const item = { nome: produto.nome, descricao: produto.descricao, valor: produto.valor, disponivel: produto.disponivel }

            produtos.push(item);

        });

    }).catch(function (error) {

        console.log(error)

    })

}

//rota - cadastro de produto
app.get('/cadastro', (req, res) => {

    checkBase();
    res.render('cad-produto', { produtos: produtos });

});

//rota - inserindo produto na API
app.post('/cadastrado', (req, res) => {

    //POST com axios
    axios.post('http://localhost:3000/produto', {
        nome: req.body.nome,
        descricao: req.body.descricao,
        valor: parseFloat(req.body.valor),
        disponivel: req.body.disponibilidade
    })
        .then(function (response) {
            console.log("Cadastrado")
            console.log(response)
            res.render('cad-produto');


        }).catch(function (error) {

            console.log(error)

        })
        checkBase();
        res.render('cad-produto', { produtos: produtos });
        
});

app.listen(port, function () {
    console.log('Servidor funcionando na url "localhost:8083"');
});

