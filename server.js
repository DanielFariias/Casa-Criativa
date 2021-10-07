//CRIAR E CONFIGURAR O SERVIDOR
const express = require("express")
const server = express()

const db = require("./db")

// const ideas = [
//   {
//     img: "https://image.flaticon.com/icons/svg/2621/2621018.svg",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//     url: "https://rocketseat.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2741/2741162.svg",
//     title: "Exercícios",
//     category: "Saúde",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//     url: "https://fitdance.com/"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2770/2770487.svg",
//     title: "Devocional Diário",
//     category: "Leitura",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//     url: "https://devocionaldiario.com.br/"
//   },
//   {
//     img: "https://image.flaticon.com/icons/svg/2663/2663838.svg",
//     title: "Lavar as mãos",
//     category: "Higiene",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//     url: "https://protex-soap.com.br"
//   },
//   {
//     img: "https://image.flaticon.com/icons/png/512/2755/2755310.png",
//     title: "Receitas de bolos",
//     category: "Culinária",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//     url: "https://tudogostoso.com.br/categorias/1000-bolos-e-tortas-doces"
//   },
//   {
//     img: "https://image.flaticon.com/icons/png/512/822/822174.png",
//     title: "Mantas de crochê para bebê",
//     category: "Casa",
//     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
//     url: "https://dicasdemulher.com.br/manta-de-croche-para-bebe/"
//   }
// ]

//CONFIGURAR ARQUIVOS ESTATICOS
server.use(express.static("public"))

//HABILITAR USO DO REQ.BODY
server.use(express.urlencoded({ extended: true }))

//CONFIGURAÇÃO DO NUNJUCKS
const nunjucks = require("nunjucks")
const { title } = require("process")
nunjucks.configure("views", {
  express: server,
  noCache: true,
})



//ROTA PARA INDEX
server.get("/", function (req, res) {

  //consultar dados na tabela
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      console.log(err)
      return res.send("ERRO NO BANCO DE DADOS!!!")
    }

    const reversedIdeas = [...rows].reverse()

    let lastIdeas = []
    for (let idea of reversedIdeas) {
      if (lastIdeas.length < 3) {
        lastIdeas.push(idea)
      }
    }

    return res.render("index.html", { ideas: lastIdeas })

  })
})

server.get("/ideias", function (req, res) {

  //consultar dados na tabela
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      console.log(err)
      return res.send("ERRO NO BANCO DE DADOS!!!")
    }

    const reversedIdeas = [...rows].reverse()

    return res.render("ideias.html", { ideas: reversedIdeas })


  })
})

server.post("/", function (req, res) {

  //inserir dado na tabela
  const query = `INSERT INTO ideas(
    image,
    title,
    category,
    description,
    link
  ) VALUES(?,?,?,?,?)`
  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link
  ]

  db.run(query, values, function (err) {
    if (err) {
      console.log(err)
      return res.send("ERRO NO BANCO DE DADOS!!!")
    }

    return res.redirect("/ideias")
  })

})

//SERVIDOR LIGADO NA PORTA 3000
server.listen(3000)