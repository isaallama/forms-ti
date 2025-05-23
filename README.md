
# Sistema de Registro de Entrada e Saída de Máquinas

Este é um sistema simples para registrar a entrada e saída de máquinas em um depósito. O sistema permite preencher um formulário com informações sobre o responsável, data, descrição, lista de patrimônios, local, telefone de contato e assinatura digital. Após o preenchimento, é possível gerar um PDF com todas as informações.

## Funcionalidades

- Formulário completo para registro de entrada e saída
- Adição dinâmica de múltiplos itens na lista de patrimônios
- Campo para assinatura digital usando mouse/touch
- Geração de PDF com todas as informações preenchidas
- Design responsivo com cores neutras similar ao Google Forms

## Como usar

1. Abra o arquivo `index.html` em um navegador web
2. Preencha todos os campos do formulário
3. Adicione os itens de patrimônio necessários usando o botão "Adicionar Patrimônio"
4. Assine no campo de assinatura digital
5. Clique no botão "Gerar PDF" para criar e baixar o relatório

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript puro
- Bibliotecas:
  - [Signature Pad](https://github.com/szimek/signature_pad) - Para assinatura digital
  - [html2canvas](https://html2canvas.hertzen.com/) - Para captura de elementos HTML
  - [jsPDF](https://github.com/parallax/jsPDF) - Para geração de PDF

## Licença

Este projeto está disponível como código aberto sob os termos da [Licença MIT](https://opensource.org/licenses/MIT).
