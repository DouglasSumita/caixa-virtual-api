<h1>
Caixa Virtual - API 
</h1> 

Projeto desenvolvido em Javascript utilizando Node JS para execução e banco de dados MongoDB.
Hospedado na Umbler.

## Objetivo: 
Solução para gravar/listar movimentações de caixa.

## Requisitos:
* Noções básicas para utilizar Postman.
* Endpoint: `http://caixa-virtual-api-com.umbler.net/`

<hr>

### Movimentações
*Todos os métodos referente as movimentações é necessário enviar no cabeçalho da requisição um 'email' passado como conteúdo do Header "Authorization".


| Campo       | Tipo      | Obrigatório |
|:-----------:|:---------:|:-----------:|
| id          | string    | Não         |
| descricao   | string    | Sim         | 
| data        | date      | Não         |
| categoria   | ID String | Sim         | 
| tipo        | string    | Sim         | 
| valor       | number    | Sim         | 
| email       | string    | Sim         |

### JSON:

```
{
    "descricao": "Aluguel de veículos",
    "valor": 40.99,
    "categoria": {
        "name": "USO E CONSUMO",
        "id": "5f7b58d2e621b23568c324e7"
    },
    "tipo": "DEBITO",
    "id": "5f7ba0ee6462fe197c96f2a6",
    "email": "douglas.sumita@gmail.com",
    "data": "2020-10-05T22:40:12.084Z"
}
```

#### Validação dos campos:
* descricao: Não pode estar vazio ou com apenas espaços em brancos.
* categoria: Obrigatório o ID da Categoria existir no cadastro de Categorias.
* tipo: "CREDITO" ou "DEBITO"
* valor: Maior que 0.


<hr>
## Métodos Movimentações:
* Obrigatório sempre enviar no Header das requisições referente a movimentação o atributo "Authorization" contendo o email para listar as movimentações.

### GET /movimentacoes
* Retorna um objeto contendo saldoTotal e um array de objetos contendo os dados das movimentações.

#### Sucesso:
* Status: 200 - OK
```
{
  "saldoTotal": 1399.78,
  "movimentacoes": [
    {
      "descricao": "Vendas",
      "valor": 1500.01,
      "categoria": {
        "name": "PRODUTOS",
        "id": "5f7b58d2e621b23568c324e7"
      },
      "tipo": "CREDITO",
      "id": "5f7babbcfaf66f20a09cebb7",
      "email": "thais@gmail.com",
      "data": "2020-10-05T23:23:43.970Z"
    },
    {
      "descricao": "Compras",
      "valor": 100.23,
      "categoria": {
        "name": "USO E CONSUMO",
        "id": "5f7b58d2e621b23568c324e7"
      },
      "tipo": "DEBITO",
      "id": "5f7babd3faf66f20a09cebb8",
      "email": "thais@gmail.com",
      "data": "2020-10-05T23:23:43.970Z"
    }
  ]
}
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```


### GET /movimentacao/:id
* Retorna um objeto contendo a movimentação referente a id.
* A movimentação deve estar atrelado ao email passado no Header.

#### Sucesso:
* Status: 200 - OK
```
{
    "descricao": "Compras",
    "valor": 100.23,
    "categoria": {
      "name": "USO E CONSUMO",
      "id": "5f7b58d2e621b23568c324e7"
    },
    "tipo": "DEBITO",
    "id": "5f7babd3faf66f20a09cebb8",
    "email": "thais@gmail.com",
    "data": "2020-10-05T23:23:43.970Z"
}
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```
### POST /movimentacao
* Adiciona uma nova movimentação:
* Necessário passar no Body da requisição um JSON:
```
{
    "descricao": "Compras",
    "valor": 100.23,
    "categoria": "5f7b58d2e621b23568c324e7",
    "tipo": "DEBITO"
}
```
#### Sucesso:
* Status: 201 - Created
```
{
    "descricao": "Compras",
    "valor": 100.23,
    "categoria": {
        "name": "USO E CONSUMO",
        "id": "5f7b58d2e621b23568c324e7"
    },
    "tipo": "DEBITO",
    "id": "5f7babd3faf66f20a09cebb8",
    "email": "thais@gmail.com",
    "data": "2020-10-05T23:23:43.970Z"
}
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```

### DELETE /movimentacao/:id
* Deleta uma movimentação referente ao ID


#### Sucesso:
* Status: 200 - OK
```
{
    "mensagem": "Movimentação deletada com sucesso!"
}
```	

#### Erro: 
* Status: 400 - Bad Request
* Se não existir retornara mensagem:
```
{
    "mensagem": "Movimentação não encontrada!"
}
```	

### PUT /movimentacao/:id
* Necessário passar os campos a serem atualizados no corpo (Body) da requisição:
```
{
    "valor": 1995.99
}
```
#### Sucesso:
* Status: 200 - OK
```
{
    "descricao": "Compras",
    "valor": 100.23,
    "categoria": {
        "name": "USO E CONSUMO",
        "id": "5f7b58d2e621b23568c324e7"
    },
    "tipo": "DEBITO",
    "id": "5f7babd3faf66f20a09cebb8",
    "email": "thais@gmail.com",
    "data": "2020-10-05T23:23:43.970Z"
}
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```

<hr>

### Categorias

| Campo       | Tipo   | Obrigatório |
|:-----------:|:------:|:-----------:|
| id          | string | Não         |
| name        | string | Sim         |

### JSON:

```
{
    "name": "USO E CONSUMO",
    "id": "5f7b58d2e621b23568c324e7"
}
```

#### Validação dos campos:
* name: Não pode estar vazio ou com apenas espaços em brancos.

<hr>

### GET /categorias
* Retorna um array de objetos contendo as categorias cadastradas.

#### Sucesso:
* Status: 200 - OK
```
[
  {
    "name": "VENDAS DE PRODUTOS",
    "id": "5f7a8f95f52f4034ec406cd0"
  },
  {
    "name": "USO E CONSUMO",
    "id": "5f7b58d2e621b23568c324e7"
  }
]
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```


### GET /categoria/:id
* Retorna um objeto contendo a categoria referente a id.

#### Sucesso:
* Status: 200 - OK
```
{
    "name": "TESTE D",
    "id": "5f7a8af598ec5a36d0e22338"
}
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```
### POST /categoria
* Adiciona uma nova categoria:
* Necessário passar no Body da requisição um JSON:
```
{
    "name": "Compras",
}
```
#### Sucesso:
* Status: 201 - Created

```
{
    "name": "Compras",
    "id": "5f7a8af598ec5a36d0e22338"
}
```

#### Erro:
 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```

### DELETE /categoria/:id
* Deleta uma categoria referente ao ID


#### Sucesso:
* Status: 200 - OK
```
{
    "mensagem": "Categoria deletada com sucesso!"
}	
```


#### Erro: 
* Status: 400 - Bad Request
* Se não existir retornara mensagem:
```
{
    "mensagem": "Movimentação não encontrada!"
}
```	

### PUT /categoria/:id
* Necessário passar o campo a ser atualizado no corpo (Body) da requisição:
```
{ 
	"name": "Atualizado"
}
```
#### Sucesso:
* Status: 200 - OK
```
{
    "name": "Atualizado",
    "id": "5f7a8b2771f1f0028c73b00f"
}
```

#### Erro: 
* Status: 400 - Bad Request
```
{
    "mensagem": "mensagem de erro"
}	
```


