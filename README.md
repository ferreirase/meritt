#### Subindo o servidor
  1. Clone/Baixe este repositório na sua máquina;
  2. Abra o terminal na raiz da pasta do projeto e rode o comando *``` docker-compose up --build ```* para subir os containers do projeto;
  3. Pronto, seu servidor backend e banco de dados estão no ar e prontos pra serem acessados no endereço "http://localhost:3333" ou na porta setada no arquivo *``` .env ```*.

## Rotas e Parâmetros

#### /exams
```
- Verbo: GET
- Rota para visualizar todas as provas cadastradas;
- Parâmetros: nenhum;
- Retorno: um array de provas ou um array vazio;
```

#### /exams
```
- Verbo: POST
- Rota para cadastrar uma nova prova;
- Parâmetros: 
  body {
    name: string,
    description: string,
    type: string
  }
- Retorno: um objeto com os dados da nova prova cadastrada;
```

#### /exams
```
- Verbo: PUT
- Rota para alterar/atualizar uma prova;
- Parâmetros: 
  body {
    exam_id: string,
    name: string,
    description: string,
    type: string
  }
- Retorno: um objeto com os novos dados da prova alterada;
```

#### /exams
```
- Verbo: DELETE
- Rota para deletar uma prova;
- Parâmetros: 
  body {
    exam_id: string
  }
- Retorno: um objeto com os dados da nova prova deletada;
```

#### /questions
```
- Verbo: GET
- Rota para visualizar todas as questões cadastradas;
- Parâmetros: nenhum;
- Retorno: um array todas as questões cadastradas;
```

#### /questions/id
```
- Verbo: GET
- Rota para visualizar uma determinada questão com suas opções randomizadas a cada chamada;
- Parâmetros: id(route param);
- Retorno: um objeto com informações da questão selecionada por id;
```

#### /questions
```
- Verbo: POST
- Rota para cadastrar uma nova questão;
- Parâmetros: 
  body {
      exam_id: string,
      statement: string
  }
- Retorno: um objeto com os dados da nova questão cadastrada;
```

#### /questions
```
- Verbo: PUT
- Rota para alterar/atualizar uma nova questão;
- Parâmetros: 
  body {
    question_id: string,
    exam_id: string,
    statement: string
  }
- Retorno: um objeto com os dados da questão alterada/atualizada;
```

#### /questions
```
- Verbo: DELETE
- Rota para deletar uma questão;
- Parâmetros: 
  body {
    question_id: string
  }
- Retorno: um objeto com os dados da questão deletada;
```

#### /options
```
- Verbo: GET
- Rota para visualizar todas as opções cadastradas;
- Parâmetros: nenhum;
- Retorno: um array com todas as opções cadastradas;
```

#### /options
```
- Verbo: POST
- Rota para cadastrar uma nova opção;
- Parâmetros: 
   body {
      question_id: string, 
      key: string, 
      value: string, 
      correct: boolean
    }
- Retorno: um objeto com os dados da opção cadastrada;
```

#### /options
```
- Verbo: PUT
- Rota para atualizar/alterar uma opção;
- Parâmetros: 
   body {
      option_id: string,
      question_id: string, 
      key: string, 
      value: string, 
      correct: boolean
    }
- Retorno: um objeto com os dados da opção alterada/atualizada;
```

#### /options
```
- Verbo: DELETE
- Rota para deletar uma opção;
- Parâmetros: 
   body {
      option_id: string
    }
- Retorno: um objeto com os dados da opção deletada;
```

## Tecnologias Utilizadas no Projeto

| **Backend**|
|----------- |
| *NodeJS*   |
| *Express*    |
| *TypeScript* |
| *TypeORM*    |
| *PostgreSQL* |
| *Eslint*     |
| *Prettier*  |
| *Docker*    |
