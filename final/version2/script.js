(function(){
    'use strict';
    console.log("reading js");

    let gameStarted = false;

    // Default settings are all on
    let toggleValues = {
        singlePlayer: true,
        soundOn: true,
        animationOn: true
    }

    // Sound effects
    const plantSound = new Audio('sounds/plant.wav');
    const buttonSound = new Audio('sounds/click.wav');
    const flipPage = new Audio('sounds/flip-page.wav');

    const healthColors = ['663C37', '8A463C', 'C05D47', 'DA7E56', 'E1B050', 'EECB4F', 'EBEE4F', 'D8EE4F', '9FEE4F', '55E452'];
    const healthText = ['Um...', 'Uh Oh...', 'Meh','OK','Good','Great!']
    const depletionRate = {
        water: 0.6,
        sun: 0.5,
        fertilizer: 0.4
    };
    const optimalHealth = {
        water: [10, 15],
        sun: [15, 20],
        fertilizer: [5,15]
    };

    // Overlay
    const overlay = document.getElementById('overlay');
    const startGameBtns = document.querySelectorAll('.start-game');
    const settingBtns = document.querySelectorAll('.settings-btn');
    const infoBtn = document.querySelector('.info-btn');
    const closeSettingBtn = document.querySelector('#close');
    const settings = document.getElementById('settingsPage');
    const intro = document.getElementById('introduction');
    const toggles = document.querySelectorAll('.switch');

    // Plant Visual
    const plant = document.getElementById('plant');
    const healthBar = document.getElementById('health-bar');
    const healthFill = document.getElementById('bar-fill');
    const healthOverlay = document.getElementById('health-overlay');

    // Action Area
    const resourceCardsFront = document.querySelectorAll('#resources .front');
    const resourceCardsBack = document.querySelectorAll('#resources .back');

    const dateCardsFront= document.querySelectorAll('#date .front');
    const dateCardsBack= document.querySelectorAll('#date .back');

    // Buttons
    const startDayBtn = document.getElementById('start-btn');
    const rollBtn = document.getElementById('roll');
    const passBtn = document.getElementById('pass');

    // Gameplay data
    let health = 0;
    const gameData = {
        resources: [['water', 1], ['water', 2], ['water', 3], ['sun', 1], ['sun', 2], ['sun', 3], ['fertilizer', 1], ['fertilizer', 2], ['fertilizer', 3]],
        currentResources: [0, 0],
        health: {
            water: 0,
            sun: 0,
            fertilizer: 0
        },
        day: 1,
        gameEnd: 14
    }

    window.addEventListener('load', function () { 
        const optimalRanges = document.querySelectorAll('.fill');
        optimalRanges.forEach( (range, i) => {
            range.width = optimalHealth[i][1] - optimalHealth[i][0];
        });

        showOverlay(intro);

        // Add event listeners
        // Overlay Event listeners
        startGameBtns.forEach((btn) => {
            btn.addEventListener('click', function() {
                hideOverlay();
                if (btn.id == 'start') {
                    startGame();
                }
                if (toggleValues.soundOn) {
                    buttonSound.play();
                }
            });
        });

        settingBtns.forEach((btn) => {
            btn.addEventListener('click', function() {
                showOverlay(settings);
                if (toggleValues.soundOn) {
                    buttonSound.play();
                }
            });
        });

        closeSettingBtn.addEventListener('click', function() {
            if (gameStarted) {
                hideOverlay();
            }
            intro.className = 'showing';
            fadeOut(settings);
           
            console.log(toggleValues);
            if (toggleValues.soundOn) {
                buttonSound.play();
            }
        });

        // .switch 
        toggles.forEach( (toggle) => {
            let checkbox = document.querySelector(`#${toggle.id} input`);
            checkbox.addEventListener('change', () => {
                toggleValues[toggle.id] = !checkbox.checked;

                if (toggleValues.soundOn) {
                    buttonSound.play();
                }
            });
        });

        infoBtn.addEventListener('click', function() {
            let startGame = document.getElementById('start');
            if (gameStarted && startGame) {
                startGame.textContent = 'Continue Game';
                startGame.id = 'continue';
            }
            showOverlay(intro);
            if (toggleValues.soundOn) {
                buttonSound.play();
            }
        });

        // Game event listeners
        startDayBtn.addEventListener('click', function() {
            if (gameData.day == gameData.gameEnd) {
                startDayBtn.textContent = 'Return Plant';
            } else {
                startDayBtn.textContent = 'Start Day';
            }

            startDayBtn.className = 'hidden';
            passBtn.className = 'showing';
            rollBtn.className = 'showing';

            if (toggleValues.soundOn) {
                buttonSound.play();
            }
            setUpDay();
        });

        rollBtn.addEventListener('click', function() {
            for (let r in gameData.health) {
                document.querySelector(`#${r}-stat span`).textContent = gameData.health[r];
            }
            throwDice(); 

            startDayBtn.className = 'showing';

            passBtn.className = 'hidden';
            rollBtn.className = 'hidden';
            if (toggleValues.soundOn) {
                buttonSound.play();
            }
        });

        passBtn.addEventListener('click', function() {
            startDayBtn.className = 'showing';
            passBtn.className = 'hidden';
            rollBtn.className = 'hidden';
            if (toggleValues.soundOn) {
                buttonSound.play();
            }
        });

        plant.addEventListener('mouseover', (event) => {
            healthOverlay.className = 'showing';
        });
        plant.addEventListener('mouseout', (event) => {
            healthOverlay.className = 'hidden';
        });


        // Usability Testing Code:
        let userBtn = document.getElementById('user-testing-btn');
        let userOverlay = document.querySelector('#user-testing article');
        userBtn.addEventListener('click', () => {
            if (userOverlay.className == 'user-show') {
                userOverlay.className = 'user-hide';
            } else if (userOverlay.className == 'user-hide') {
                userOverlay.className = 'user-show';
            } 
        });
        
        
    });

    function startGame() {
        // Set initial value of each resource randomly within optimal health
        for (let resource in gameData.health) {
            gameData.health[resource] = randomInt(optimalHealth[resource]);
        }
        // Reset the day to 1
        gameData.day = 1;
        dateCardsFront.forEach ((card, i) => {
            flipDate(card, dateCardsBack[i]);
        });   

        updateHealth();   
          

        gameStarted = true;


    }

    function flipDate(front, back) {
        // console.log("Flip date: ", front, back);
        front.style.animation = 'flipDown 0.5s linear forwards';
        if (toggleValues.soundOn) {
            flipPage.play();
        }
        front.addEventListener('animationend', (e) => {
            front.textContent = back.textContent;
            front.style.animation = '';
        })
    }

    function clearResource(front, back) {
        // console.log("Flip resource: ", front, back);
       
        front.style.animation = '0.5s flipUp 0.5s linear forwards'

        front.addEventListener('animationend', (e) => {
            if (back.firstChild) {
                back.removeChild(back.firstChild);
            }

            front.style.animation = '';
        });
    }

    function setUpDay() {
        // Update calendar to new day
        if (gameData.day < 10) {
            dateCardsBack[0].textContent = 0;
        } else {
            dateCardsBack[0].textContent = Math.floor(gameData.day / 10);
        }
        dateCardsBack[1].textContent = Math.floor(gameData.day % 10);

        dateCardsFront.forEach ((card, i) => {
            flipDate(card, dateCardsBack[i]);
        });


        // Remove images for resource cards
        resourceCardsFront.forEach( (card, i) => {
            // resourceCardsBack[i].appendChild(card.firstChild);
            clearResource(card, resourceCardsBack[i]);
        })

        // Each resource has a probability of depleting by 1 or 2 (See depletionRate for exact probabilities)
        for (let r in gameData.health) {
            document.querySelector(`#${r}-stat span`).textContent = gameData.health[r];

            if (gameData.health[r] > 0 && (Math.random() < depletionRate[r])) {
                gameData.health[r] -= randomInt([1,3]);
                if (gameData.health[r] < 0) {
                    gameData.health[r] = 0;
                }
            }
        }
        updateHealth();

        // Check if game has ended
        // Plant survived the 30 days
        if (gameData.day > gameData.gameEnd) {
            showOverlay(document.getElementById('end-survive'));
            // document.getElementById('end-survive').className = 'showing';
            endGame();
        }
        // Plant died before the 30 days
        if (calculateHealthVal() == 0) {
            showOverlay(document.getElementById('end-dead'));

            // document.getElementById('end-dead').className = 'showing';
            endGame();
        }
        gameData.day++;

    }

    function throwDice() {
        // Randomly select 2 resources
        gameData.currentResources.forEach((r, i) => {
            gameData.currentResources[i] = Math.floor(Math.random() * gameData.resources.length);
        });

        // Get resource type and amount
        let resourceType = gameData.currentResources.map((r) => {
            return gameData.resources[r][0];
        })
        let resourceAmount = gameData.currentResources.map((r) => {
            return gameData.resources[r][1];
        })
        console.log("Health", gameData.health);
        console.log(resourceType, resourceAmount);


        for (let i = 0; i < 2; i++ ){
            console.log(resourceType[i], resourceAmount[i])
            // Update Plant health with corresponding resource type and amount
            gameData.health[resourceType[i]] += resourceAmount[i];

            let img = document.createElement('img');
            img.src = `images/${resourceType[i]}${resourceAmount[i]}.png`;

            resourceCardsBack[i].appendChild(img);
            console.log("back", resourceCardsBack[i])
        }

        console.log(resourceCardsBack)

        updateHealth();
    }

    function calculateHealthVal() {
        let health = 30;

        // If resource amount within optimal range => no health deduction
        // Otherwise, deduct the difference
        for (let r in gameData.health) {
            if (gameData.health[r] < optimalHealth[r][0]) {
                health -= optimalHealth[r][0] - gameData.health[r];
            } else if (gameData.health[r] > optimalHealth[r][1]) {
                health -= gameData.health[r] - optimalHealth[r][1];
            }
        }
        return health > 0 ? health : 0;
    }

    function updateHealth() {
        console.log("update health", health);

        let healthVal = calculateHealthVal() / 30;
        // console.log(healthVal);
        updatePlantVisuals(healthVal);
        updateHealthColor(healthVal);

        let width = window.innerWidth * 0.25;
        // console.log("BAR WIDTH: ", document.getElementById('health-overlay').style);
        // console.log(window.innerWidth);

        // Health bar styling 
        if (healthVal * width < 50) {
            healthFill.style.width = `30px`;
        } else if (healthVal * width > width - 25) {
            healthFill.style.width = `${width}px`;
        } else {
            healthFill.style.width = `${width * healthVal}px`;
        }

        // Stats overlay styling
        for (let r in gameData.health) {
            healthOverlay.className = 'showing';

            if (gameStarted) {
                iterateStat(r);
            } else {
                document.querySelector(`#${r}-stat span`).textContent = gameData.health[r];
            }
        }
    }

    function iterateStat(resource) {
        let stat = document.getElementById(`${resource}-stat`);
        let statValue = document.querySelector(`#${resource}-stat span`);

        if (gameStarted && gameData.health[resource] != stat.textContent) {
            setTimeout(() => {
                if (statValue.textContent < gameData.health[resource]) {
                    stat.style.animation = 'increment 0.75s ease forwards';
                } else {
                    stat.style.animation = 'decrement 0.75s ease forwards';
                }

                stat.addEventListener('animationend', () => {
                    stat.style.animation = ''
                })

                if (statValue.textContent < gameData.health[resource]) {
                    statValue.textContent = parseInt(statValue.textContent) + 1;
                } else {
                    statValue.textContent = parseInt(statValue.textContent) - 1;
                }
                iterateStat(resource);
            }, 1000)
        }
    }

    function updatePlantVisuals(healthVal) {
        // Update plant image
        let index = Math.ceil(healthVal * 5);
        console.log("Img: ", index);

        const plant = document.querySelector('#plant-visual img');

        if (!plant.src.includes(`plant${index}.png`) && toggleValues.soundOn) {
            plantSound.play();
        }

        plant.src = `images/plant${index}.png`;

        // Update Health Bar Text
        document.getElementById('bar-outline').textContent = healthText[index];

    }

    // Set the style of the health bar to match the current health status
    function updateHealthColor(healthVal) {
        let colorIndex = Math.floor(healthVal * 10);
        console.log("color", colorIndex, healthColors[colorIndex-1]);
        healthFill.style.backgroundColor = '#' + healthColors[colorIndex-1];
    }

    // The maximum is exclusive and the minimum is inclusive
    function randomInt(range) {
        let min = Math.ceil(range[0]);
        let max = Math.floor(range[1]);
        return Math.floor(Math.random() * (max - min) + min); 
    }

    function fadeOut(element) {
        console.log("fade out: ", element);
        element.className = 'hidden';
        element.addEventListener('animationend', () => {
            // element.style.display = 'none';
        })
    }

    function showOverlay(page) {
        document.querySelector('main').className = 'hidden';
        page.className = 'showing';
        overlay.className = 'showing';
    }

    function hideOverlay() {
        document.querySelector('main').className = 'showing';

        overlay.className = 'hidden';

    }

    window.addEventListener('resize', function () {
        updateHealth();
    });

    function endGame() {
        gameStarted = false;
        overlay.style.display = 'flex';
        overlay.className = 'showing;'
        healthBar.style.display = 'none'
        console.log("END GAME");
        document.getElementById('end-survive').className = 'showing';
    }
})(); 
    