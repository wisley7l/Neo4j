var express = require('express');
var router = express.Router();

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');// cria conexão com o Banco NEO4J local, com a  porta de comunicação 7474

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  db.cypher({
					    query: 'MATCH (e:Estados)  RETURN e', // Query para consulta onde buscara o node User pela propriedade email
					    params: {
					         // paramentro de busca. 
					    },
					}, function (err, results) {
					    if (err) throw err;
					    var result = results[0]; 		// pega a primeira posição do vetor result para verificar se houve alguma resposta
					    if (!result) {					// verifica se encontrou algum resultado 					        
					        console.log("404"); 		//envia mensagem de erro 
					    } else { 						// caso encontre algum resultado 
					        var user = results; 		// armazena todas as respostas na variavél user
					        res.json(user);
					        console.log("200");			//envia de ok  
					        //console.log(JSON.stringify(user, null, 4));
					    }
					});
});









module.exports = router;