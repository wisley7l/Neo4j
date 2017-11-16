var express = require('express');
var router = express.Router();

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');// cria conexão com o Banco NEO4J local, com a  porta de comunicação 7474

/* GET */

router.get('/', function(req, res, next) { // get para todas as cidades
  db.cypher({
				query: 'MATCH (c:Cidades)  RETURN c', // Query para consulta onde buscara os node Cidades 
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
				    }
	});
});

router.get('/:id', function(req, res, next) { // get para um cidade especifica pelo id  
  	var str = req.params.id 						// caputura o paramentro :id 
  	var parametro = str.replace(":",'');			// elimina da string o valor de : 
	
  db.cypher({
				query: 'MATCH (c:Cidades)  WHERE ID(c) ='+ parametro +' RETURN c', // Query para consulta onde buscara o node Cidades pelo ID
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
					    }
	});
});

/*POST*/

function criarCidade(res, cidade){// função na qual será chamada para criar um node do tipo cidade
	//propriedade do node Cidades
	//cidade : 
	// uf:
	//estado:
		db.cypher({
					query: 'CREATE (c:Cidades { uf : {uf}, estado : {estado}, cidade : {cidade}}) RETURN c', // Query para consulta onde buscara o node Cidades pelo ID
					params: {
						     // paramentro de busca. 	         
						    uf : cidade.uf,
						    estado : cidade.estado,
						    cidade : cidade.cidade,
					},
				}, function (err, results) {
					    if (err) throw err;
					    var result = results[0]; 		// pega a primeira posição do vetor result para verificar se houve alguma resposta
					    if (!result) {					// verifica se encontrou algum resultado 					        
						        console.log("404"); 		//envia mensagem de erro 
					    } else { 						// caso encontre algum resultado 
						    	var user = results; 		// armazena todas as respostas na variavél user
						    	res.json(user);
						    	console.log("201");			//envia de ok
						    }
		});

}


router.post('/', function (req, res, next) { // metodo post usado para criar uma nova cidade no BD, ou seja criar um node cidades
	var cidade = { 						// variaviel cidade
		uf : req.body.uf,				// propriedade uf do node cidades
		estado : req.body.estado,		// propriedade estado do node cidades
		cidade : req.body.cidade,		// propriedade cidade do node cidades
	};
	
	/*
	Afim de não criar um novo node com as mesmas propriedades, ou seja , evitar a redundância de dados
	se faz uma busca pelo node com os valores de propriedade que se deseja adicionar, 
	caso ja exista esse node responde que ja existe
	caso contrario chama a fuñção que irá criar esse node com suas respectivas propriedade e responde ok 
	*/
	db.cypher({
				query: 'MATCH (c:Cidades { uf : {uf}, estado : {estado}, cidade : {cidade}}) RETURN c', // Query para consulta onde buscara os node Cidades 
				params: {
						// paramentro de busca.
						uf : cidade.uf,
						estado : cidade.estado,
						cidade : cidade.cidade, 
					    },
				}, function (err, results) {
				    if (err) throw err;
				    var result = results[0]; 		// pega a primeira posição do vetor result para verificar se houve alguma resposta
				    if (!result) {					// verifica se encontrou algum resultado 					        
				        console.log("204"); 		//envia mensagem de nenhum conteudo 
				        criarCidade(res,cidade);
				    } else { 						// caso encontre algum resultado 
				        	var user = results; 	// armazena todas as respostas na variavél user
				        	res.json(user);			
				        	//res.json("Já Existe o NODE");
				        	console.log(" Já exite o NODE");			//envia de que ja existe o NODE
				    }
	});
});
	/*
			tentar criar os relacionamentos, após a inserção de um novo node Cidades 
	*/


/*DELETE*/

router.delete('/:id', function(req, res, next) { // get para um cidade especifica pelo id  
  	var str = req.params.id 						// caputura o paramentro :id 
  	var parametro = str.replace(":",'');			// elimina da string o valor de : 
	
  db.cypher({
				query: 'MATCH (c:Cidades)  WHERE ID(c) ='+ parametro +' DELETE c', // Query para consulta onde buscara o node Cidades pelo ID
				params: {
				     // paramentro de busca. 	         
				},
			}, function (err, results) {
				    if (err) throw err;
				    var result = results[0]; 		// pega a primeira posição do vetor result para verificar se houve alguma resposta
				    if (!result) {					// verifica se encontrou algum resultado 					        
					        console.log("204"); 		//envia mensagem de erro 
					        res.json("Deletado com Sucesso");
				    } else { 						// caso encontre algum resultado 
					    	var user = results; 		// armazena todas as respostas na variavél user
					    	res.json(user);
					    	console.log("Houve algum erro");			//envia de ok
					    }
	});
});




module.exports = router;