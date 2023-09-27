
# Script de Votação TikTok Live

Este projeto permite que você crie uma votação em tempo real usando os presentes e comentários de uma live do TikTok.

## Requisitos

- Node.js
- NPM (geralmente já vem com o Node.js)
- VLC Media Player

## Instalação

1. Clone este repositório ou baixe-o como arquivo ZIP.
2. Extraia o arquivo ZIP (se necessário).
3. Abra um terminal ou prompt de comando e navegue até a pasta do projeto.
4. Execute `npm install` para instalar todas as dependências necessárias.
5. Certifique-se de ter o VLC Media Player instalado e acessível através da linha de comando.

## Uso

1. No arquivo `voting_tiktokLive.js`, atualize a variável `tiktokUsername` para o nome de usuário do TikTok da live que você deseja monitorar.
2. No mesmo arquivo, você pode atualizar o mapeamento de presentes para times e pontos conforme necessário.
3. Execute `node voting_tiktokLive.js` para iniciar o servidor e começar a monitorar a live do TikTok.
4. Abra um navegador e acesse `http://localhost:3000` para ver os resultados da votação em tempo real.

## Customização

- Você pode adicionar mais times ao objeto `teamPoints` e ao mapeamento de presentes conforme necessário.
- Os áudios correspondentes aos times devem ser colocados na pasta `audio` e devem ser nomeados de acordo com o nome do time (por exemplo, `flamengo.mp3`).

## Suporte

Se você encontrar problemas ou tiver dúvidas, abra uma issue neste repositório.
