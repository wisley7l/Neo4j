/* Funções em cypher para adicionar elementos em um banco de dados

LOAD CSV WITH HEADERS FROM "file:/estados.csv" AS row
CREATE (e:Estados)
SET e = row


LOAD CSV WITH HEADERS FROM "file:/cidades.csv" AS row
CREATE (c:Cidades)
SET c = row


MATCH (e:Estados),(c:Cidades)
WHERE e.uf = c.uf
CREATE (c)-[r:Pertence]->(e)

*/

