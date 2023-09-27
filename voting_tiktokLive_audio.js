const express = require('express');
const app = express();
const PORT = 3000;
const { exec } = require('child_process');
const { WebcastPushConnection } = require('tiktok-live-connector');

let tiktokUsername = "hypegames.oficial"; // Nome do usuário fazendo transmissão ao vivo (LIVE)
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Mapeamento dos presentes para times e pontos
// Lista de presentes https://streamdps.com/tiktok-widgets/gifts/?br=1
const giftToTeamMap = {
    '5655': { team: 'Flamengo', points: 100, giftAudio: './audio/hino-flamengo.mp3', commentAudio: './audio/flamengo.mp3' }, //Rosa
    '7812': { team: 'Vasco', points: 100, giftAudio: './audio/hino-vasco.mp3', commentAudio: './audio/vasco.mp3' }, //Brabo
    '7096': { team: 'Fluminense', points: 100, giftAudio: './audio/hino-fluminense.mp3', commentAudio: './audio/fluminense.mp3' },
    '5630': { team: 'Botafogo', points: 100, giftAudio: './audio/hino-botafogo.mp3', commentAudio: './audio/botafogo.mp3' },
    '8239': { team: 'São Paulo', points: 100, giftAudio: './audio/hino-saopaulo.mp3', commentAudio: './audio/saopaulo.mp3' },
    '7934': { team: 'Corinthians', points: 100, giftAudio: './audio/hino-corinthians.mp3', commentAudio: './audio/corinthians.mp3' }, // Heart-me

    //Presentes +300 pontos
    '5879': { team: 'Flamengo', points: 300, giftAudio: './audio/hino-flamengo.mp3', commentAudio: './audio/flamengo.mp3' }, //Rosquinha
    '5780': { team: 'Vasco', points: 300, giftAudio: './audio/hino-vasco.mp3', commentAudio: './audio/vasco.mp3' }, // Buquê
    '5740': { team: 'Fluminense', points: 300, giftAudio: './audio/hino-fluminense.mp3', commentAudio: './audio/fluminense.mp3' }, // Headphone
    '5657': { team: 'Botafogo', points: 300, giftAudio: './audio/hino-botafogo.mp3', commentAudio: './audio/botafogo.mp3' }, // Pirulito
    '5919': { team: 'São Paulo', points: 300, giftAudio: './audio/hino-saopaulo.mp3', commentAudio: './audio/saopaulo.mp3' }, // LoveYou
    '5658': { team: 'Corinthians', points: 300, giftAudio: './audio/hino-corinthians.mp3', commentAudio: './audio/corinthians.mp3' }, // Perfume
    // Adicione outros presentes conforme necessário
};

const teamPoints = {
    'Flamengo': 0,
    'Vasco': 0,
    'Fluminense': 0,
    'Botafogo': 0,
    'São Paulo': 0,
    'Corinthians': 0,
    // Inicialize outros times aqui
};

// Presente que reseta a votação
const RESET_GIFT_ID = '6104'; // Chapéu

let lastAudioPlayTimestamp = 0;

function playAudio(audioFile) {
    const now = Date.now();
    if (now - lastAudioPlayTimestamp > 4000) {
        lastAudioPlayTimestamp = now;
        exec(`"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe" "${audioFile}" --intf=dummy --play-and-exit`, (error) => {
            if (error) {
                console.error('Erro ao tocar o áudio:', error);
            }
        });
    }
}

tiktokLiveConnection.connect().then(state => {
    console.info(`Connected to roomId ${state.roomId}`);
}).catch(err => {
    console.error('Failed to connect', err);
});

tiktokLiveConnection.on('gift', data => {
    if (String(data.giftId) === RESET_GIFT_ID) {
        for (let team in teamPoints) {
            teamPoints[team] = 0;
        }
        console.log("Votação resetada!");
    } else {
        const giftMapping = giftToTeamMap[data.giftId];
        if (giftMapping) {
            const quantity = data.quantity || 1;
            teamPoints[giftMapping.team] += giftMapping.points * quantity;
            console.log(`Presente recebido! ${giftMapping.team} agora tem ${teamPoints[giftMapping.team]} pontos.`);
            playAudio(giftMapping.giftAudio);
        }
    }
});

tiktokLiveConnection.on('chat', data => {
    const comment = data.comment.toLowerCase();
    for (let team in teamPoints) {
        if (comment.includes(team.toLowerCase())) {
            teamPoints[team]++;
            console.log(`Comentário recebido! ${team} agora tem ${teamPoints[team]} pontos.`);
            const giftMapping = Object.values(giftToTeamMap).find(mapping => mapping.team === team);
            if (giftMapping) {
                playAudio(giftMapping.commentAudio);
            }
        }
    }
});

tiktokLiveConnection.on('disconnect', () => {
    console.error('Desconectado da live.');
});

app.get('/points', (req, res) => {
    const sortedTeams = Object.entries(teamPoints)
        .map(([team, points]) => ({ team, points }))
        .sort((a, b) => b.points - a.points);
    res.json(sortedTeams);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/script.js');
});

app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/styles.css');
});

// Define uma rota GET para servir as imagens
app.use('/images', express.static(__dirname + '/images'));
