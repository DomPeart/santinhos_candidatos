# Gerador de santinhos de candidatos

Aplicacao web estatica para criar imagens de apoio a uma campanha eleitoral. A pessoa escolhe uma foto, ajusta o enquadramento sobre a arte da campanha e baixa o resultado em PNG. Todo o processamento acontece localmente no navegador: a foto nao e enviada a um servidor.

## Funcionalidades

- dois formatos de exportacao: adesivo circular (1080 x 1080) e story (1080 x 1920);
- upload de fotos pelo dispositivo;
- zoom de 100% a 300%;
- reposicionamento da foto por mouse ou toque;
- restauracao do enquadramento central;
- troca temporaria da moldura oficial por outro PNG;
- exportacao da composicao em alta resolucao.

## Requisitos

- navegador moderno com suporte a Canvas, Pointer Events e `URL.createObjectURL`;
- conexao com a internet para carregar as fontes do Google Fonts. Sem conexao, a aplicacao usa as fontes alternativas configuradas no CSS.

O projeto nao possui dependencias para instalar. Ele nao usa pacotes Python, Node.js, `requirements.txt` ou `package.json`.

## Executar localmente

Como o projeto e estatico, voce pode abrir `index.html` diretamente no navegador. Durante o desenvolvimento, tambem pode servi-lo com uma extensao como Live Server no VS Code.

Caso ja tenha Python instalado, uma alternativa opcional e:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador. Encerre o servidor com `Ctrl+C`.

Servir a pagina por HTTP e preferivel durante o desenvolvimento, pois reproduz melhor as regras de seguranca e carregamento de recursos dos navegadores. Nao e necessario criar uma venv para isso.

## Como usar

1. Selecione `Adesivo redondo` ou `Story`.
2. Clique em `Selecionar foto` e escolha uma imagem.
3. Ajuste o zoom e arraste a foto sobre a previa.
4. Clique em `Baixar minha foto` para gerar o PNG.

A secao `Usar a arte oficial da campanha` permite testar uma moldura PNG diferente durante a sessao. O arquivo nao e salvo no projeto nem enviado para fora do dispositivo.

## Estrutura do projeto

```text
.
|-- assets/
|   |-- moldura-julio-cesar.png
|   `-- moldura-story-sem-instrucao.png
|-- app.js
|-- index.html
|-- styles.css
`-- README.md
```

- `index.html`: estrutura, textos e controles da interface;
- `styles.css`: identidade visual e comportamento responsivo;
- `app.js`: estado do editor, composicao no Canvas, gestos e download;
- `assets/`: molduras transparentes aplicadas sobre a foto.

## Personalizacao

As configuracoes dos formatos ficam no objeto `formats`, no inicio de `app.js`:

```javascript
const formats = {
  feed: {
    src: 'assets/moldura-julio-cesar.png',
    width: 1080,
    height: 1080,
    filename: 'adesivo-julio-cesar-555.png'
  },
  story: {
    src: 'assets/moldura-story-sem-instrucao.png',
    width: 1080,
    height: 1920,
    filename: 'to-com-julio-cesar-555-story.png'
  }
};
```

Para substituir uma arte permanentemente, coloque o novo PNG transparente em `assets/` e atualize `src`, dimensoes e nome de download. A moldura deve ter a mesma proporcao definida para o formato. Textos institucionais e dados eleitorais ficam em `index.html`; cores e tipografia ficam nas variaveis do inicio de `styles.css`.

Antes de publicar, revise todos os nomes, numeros, dados de coligacao, CNPJ eleitoral e imagens oficiais presentes na pagina e nas molduras.

## Privacidade

O editor usa APIs nativas do navegador e nao possui backend, analytics ou chamadas de upload. A unica requisicao externa prevista e o carregamento das fontes declaradas no Google Fonts.
