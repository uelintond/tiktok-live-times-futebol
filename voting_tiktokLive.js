const express = require('express');
const app = express();
const PORT = 3000;

const { WebcastPushConnection } = require('tiktok-live-connector');

let tiktokUsername = "larahoenen"; //Seu username aqui (Necessário estar em live para funcionamento do script)
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Mapeamento dos presentes para times e pontos
const giftToTeamMap = {

    //Presentes +100 pontos
    '5655': { team: 'Flamengo', points: 100 }, //Rosa
    '5333': { team: 'Vasco', points: 100 }, // Café
    '7812': { team: 'Fluminense', points: 100 }, // Brabo
    '5630': { team: 'Botafogo', points: 100 }, // Chocolate
    '5269': { team: 'São Paulo', points: 100 }, // TikTok
    '7934': { team: 'Corinthians', points: 100 }, // Heart-me

    //Presentes +300 pontos
    '5879': { team: 'Flamengo', points: 300 }, //Rosquinha
    '5780': { team: 'Vasco', points: 300 }, // Buquê
    '5740': { team: 'Fluminense', points: 300 }, // Headphone
    '5657': { team: 'Botafogo', points: 300 }, // Pirulito
    '5919': { team: 'São Paulo', points: 300 }, // LoveYou
    '5658': { team: 'Corinthians', points: 300 }, // Perfume
    // Adicione outros presentes conforme necessário
};

// Objeto para armazenar os pontos dos times
const teamPoints = {
    'Flamengo': 0,
    'Vasco': 0,
    'Fluminense': 0,
    'Botafogo': 0,
    'São Paulo': 0,
    'Corinthians': 0,
};

// ID do presente que redefinirá a votação
const RESET_GIFT_ID = '6104';

// Captura erros globais não tratados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Captura exceções globais não tratadas
process.on('uncaughtException', (err) => {
    console.error('Caught exception: ', err);
});

tiktokLiveConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
}).catch(err => {
    console.error('Failed to connect', err);
});

tiktokLiveConnection.on('gift', data => {
    if (String(data.giftId) === RESET_GIFT_ID) {
        // Reset team points
        for (let team in teamPoints) {
            teamPoints[team] = 0;
        }
        console.log("Votação resetada!");
    } else {
        const giftMapping = giftToTeamMap[data.giftId];
        if (giftMapping) {
            // Leva em consideração a quantidade de presentes enviados
            const quantity = data.quantity || 1;  // Suposição de que o campo seja 'quantity'
            teamPoints[giftMapping.team] += giftMapping.points * quantity;
            console.log(`Presente recebido! ${giftMapping.team} agora tem ${teamPoints[giftMapping.team]} pontos.`);
        }
    }
});

// Ouvinte para comentários do chat
tiktokLiveConnection.on('chat', data => {
    const comment = data.comment.toLowerCase(); // Convertendo o comentário para lowercase para facilitar a comparação

    for (let team in teamPoints) {
        if (comment.includes(team.toLowerCase())) { // Verifica se o comentário contém o nome do time
            teamPoints[team]++;
            console.log(`Comentário recebido! ${team} agora tem ${teamPoints[team]} pontos.`);
        }
    }
});

// Ouvinte para desconexão
tiktokLiveConnection.on('disconnect', () => {
    console.error('Desconectado da live.');
});

// Rota para fornecer os pontos dos times
app.get('/points', (req, res) => {
    // Convertendo o objeto teamPoints para um array e classificando com base nos pontos
    const sortedTeams = Object.entries(teamPoints)
        .map(([team, points]) => ({ team, points }))
        .sort((a, b) => b.points - a.points);

    res.json(sortedTeams);
});

// Rota para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Inicia o servidor Express na porta especificada (variável PORT)
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

// Define uma rota GET para servir o arquivo JavaScript "script.js"
app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript'); // Define o tipo MIME correto
    res.sendFile(__dirname + '/script.js');
});

// Define uma rota GET para servir o arquivo CSS "styles.css"
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/styles.css');
});

// Define uma rota GET para servir as imagens
app.use('/images', express.static(__dirname + '/images'));
