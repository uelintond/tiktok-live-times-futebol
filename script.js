document.addEventListener('DOMContentLoaded', function () {
    const resultsDiv = document.getElementById('voting-results');

    function updatePointsDisplay(data) {
        let content = '<h2>Resultado da Votação</h2>';
        data.forEach((entry, index) => {
            content += `
                <div class="team-result">
                    <img src="/images/${entry.team}.png" alt="${entry.team} logo" class="team-logo">
                    <span class="team-name"><span class="position-rank">${index + 1}º </span>${entry.team}</span>: 
                    <span class="team-points">${entry.points} Pontos</span>
                </div>`;
        });

        resultsDiv.innerHTML = content;
    }


    function updatePoints() {
        fetch('/points')
            .then(response => response.json())
            .then(data => {
                updatePointsDisplay(data);
            });
    }

    // Atualiza os pontos a cada 5 segundos
    setInterval(updatePoints, 5000);
});
