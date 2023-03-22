(function(){
    'use strict';
    console.log("reading js");

    // GAME SETTINGS
    let gameStarted = false;
    let gameStartDay = 14;

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

    // GAME MECHANICS
    const plantTypes = ['succulent', 'plant', 'snake'];
    let plantTypeIndex = 1;
    const healthColors = ['663C37', '8A463C', 'C05D47', 'DA7E56', 'E1B050', 'EECB4F', 'EBEE4F', 'D8EE4F', '9FEE4F', '55E452'];
    const healthText = ['Um...', 'Uh Oh...', 'Meh','OK','Good','Great!']
    const depletionRate = {
        water: 0.6,
        sun: 0.5,
        fertilizer: 0.4
    };
    const optimalHealth = {
        plant: {
            water: [10, 20],
            sun: [15, 25],
            fertilizer: [5,15]
        },
        snake: {
            water: [5, 20],
            sun: [10, 25],
            fertilizer: [5,20]
        },
        succulent: {
            water: [10, 15],
            sun: [20, 30],
            fertilizer: [5,15]
        } 
    };

    // OVERLAY
    const overlay = document.getElementById('overlay');
    const intro = document.getElementById('introduction');
    const instructions = document.getElementById('instructions');
    const plantSelection = document.getElementById('plant-selection');
    const settings = document.getElementById('settingsPage');
    // Buttons within overlay
    const startGameBtns = document.querySelectorAll('.start-game, .continue-game, .restart-game');
    const backBtns = document.querySelectorAll('.back-btn');
    const instructionBtn = document.querySelector('.instruction-btn');
    const plantBtn = document.querySelector('.select-plant');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');

    const closeSettingBtn = document.querySelector('#settingsPage .close-btn');
    const toggles = document.querySelectorAll('.switch');
    // Buttons that open overlay
    const infoBtn = document.querySelector('.info-btn');
    const settingBtns = document.querySelectorAll('.settings-btn');
    const settingBtnsInOverlay = document.querySelectorAll('article .settings-btn');
    const restartGameBtns = document.querySelectorAll('.restart-game');


    // Plant Visual
    const plant = document.getElementById('plant');
    const healthBar = document.getElementById('health-bar');
    const healthFill = document.getElementById('bar-fill');
    const healthOverlay = document.getElementById('health-overlay');
    const stats = document.querySelectorAll('.stat');

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
        day: gameStartDay
    }

    window.addEventListener('load', function () { 
        showOverlay(intro);
        displayStat('plant');
        // Hide all the restart buttons initially
        restartGameBtns.forEach( (btn) => {
            btn.style.display = 'none';
        });
        document.getElementById('settings-page-btns').style.display = 'none';

        // EVENT LISTENERS
        // Overlay Event listeners
        console.log(startGameBtns)
        startGameBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.className == 'restart-game') {
                    // Reset all the close buttons to settings buttons
                    settingBtnsInOverlay.forEach((btn) => {
                        btn.style.display = 'block';
                        btn.nextElementSibling.style.display = 'none';
                    });

                    prev.style.display = 'block';
                    next.style.display = 'block';
                    hideOverlay();
                    showOverlay();

                    intro.style.transition = 'all 1s ease';
                    setTimeout(() => {
                        showOverlay(intro);
                    }, 500)
                    setTimeout(() => {
                        intro.style.transition = '';
                    }, 1000)

                    restartGameBtns.forEach( (btn) => {
                        btn.style.display = 'none';
                    }); 
                    document.getElementById('settings-page-btns').style.display = 'none';

                }
                if (btn.className == 'start-game') {
                    startGame();
                }
                hideOverlay();

                if (toggleValues.soundOn) { buttonSound.play(); }
            });
        });

        // Located on welcome overlay -> opens instruction overlay
        instructionBtn.addEventListener('click', () => {
            showOverlay(instructions);
            if (toggleValues.soundOn) { buttonSound.play(); }
        });

        plantBtn.addEventListener('click', () => {
            showOverlay(plantSelection);
            if (toggleValues.soundOn) { buttonSound.play(); }
        });

        backBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.id == 'back-to-instructions') {
                    showOverlay(instructions);
                } else {
                    showOverlay(intro);
                }
                if (toggleValues.soundOn) { buttonSound.play(); }
            });
        });

        // Buttons for plant selection 
        let plantImg = document.querySelector('#plant-select img');
        next.addEventListener('click',  () => {
            if (plantTypeIndex == 0) {
                plantTypeIndex = plantTypes.length;
            }
            plantTypeIndex--;

            slidePlant('next');

            if (toggleValues.soundOn) { plantSound.play(); }

        });

        prev.addEventListener('click',  () => {
            plantTypeIndex++;
            if (plantTypeIndex == plantTypes.length) {
                plantTypeIndex = 0;
            }

            slidePlant('prev');
            
            if (toggleValues.soundOn) { plantSound.play(); }
        });

        function slidePlant(direction) {
            if (toggleValues.animationOn) {
                setTimeout(() => {
                    plantImg.style.animation = '';
                }, 500);
                if (direction == 'prev') {
                    plantImg.style.animation = 'slide-next 0.25s ease-in, 0.25s slide-prev 0.25s ease-in reverse';
                } else if (direction == 'next') {
                    plantImg.style.animation = 'slide-prev 0.25s ease-in, 0.25s slide-next 0.25s ease-in reverse';
                }
                plantImg.addEventListener('animationend', () => {
                    plantImg.src = `images/${plantTypes[plantTypeIndex]}.png`;
                    displayStat(plantTypes[plantTypeIndex]);
                });
            } else {
                plantImg.src = `images/${plantTypes[plantTypeIndex]}.png`;
                displayStat(plantTypes[plantTypeIndex]);
            }
        }

        // Located on instruction overlay and main page-> opens setting overlay
        let prevPage = '';
        settingBtns.forEach((btn) => {
            btn.addEventListener('click', function() {
                prevPage = btn.parentElement.id;
                console.log(btn.parentElement.id, prevPage);
                showOverlay(settings);
                if (toggleValues.soundOn) { buttonSound.play(); }
            });
        });

        // Located on settings overlay -> closes settings overlay
        closeSettingBtn.addEventListener('click', function() {
            console.log(prevPage);
            // Return to the origin of the settings button
            if (prevPage == 'introduction') {
                showOverlay(intro);
            } else if (prevPage == 'instructions') {
                showOverlay(instructions);
            } else if (prevPage == 'plant-selection') {
                showOverlay(plantSelection);
            } else {
                hideOverlay();
            }

            if (toggleValues.soundOn) { buttonSound.play(); }
        });

        // Located on settings overlay -> toggles each corresponding setting
        toggles.forEach( (toggle) => {
            let checkbox = document.querySelector(`#${toggle.id} input`);
            checkbox.addEventListener('change', () => {
                // Toggle value
                toggleValues[toggle.id] = !checkbox.checked;

                // turn animation on or off for action buttons
                if (toggleValues.animationOn) {
                    document.querySelector('#action-area').className = 'animationOn';
                } else {
                    document.querySelector('#action-area').removeAttribute('class');
                }

                if (toggleValues.soundOn) { buttonSound.play(); }
            });
            
        });

        // Located on main page -> opens instruction page
        infoBtn.addEventListener('click', function() {
            let startGame = document.getElementById('start');
            // Continue game if the game has already started
            if (gameStarted && startGame) {
                startGame.textContent = 'Continue Game';
                startGame.className = 'continue-game';

                prev.style.display = 'none';
                next.style.display = 'none';
            }

            showOverlay(instructions);
            
            if (toggleValues.soundOn) { buttonSound.play(); }
        });

        // Game event listeners
        startDayBtn.addEventListener('click', function() {
            if (gameData.day == 2) {
                startDayBtn.textContent = 'Return Plant';
            } else {
                startDayBtn.textContent = 'Start Next Day';
            }

            startDayBtn.className = 'hidden';
            passBtn.className = 'showing';
            rollBtn.className = 'showing';

            if (toggleValues.soundOn) { buttonSound.play(); }
            setUpDay();
        });

        rollBtn.addEventListener('click', function() {
            for (let r in gameData.health) {
                document.querySelector(`#${r}-stat span.value`).textContent = gameData.health[r];
            }
            throwDice(); 

            startDayBtn.className = 'showing';

            passBtn.className = 'hidden';
            rollBtn.className = 'hidden';
            if (toggleValues.soundOn) { buttonSound.play(); }
        });

        passBtn.addEventListener('click', function() {
            startDayBtn.className = 'showing';
            passBtn.className = 'hidden';
            rollBtn.className = 'hidden';
            if (toggleValues.soundOn) { buttonSound.play(); }
        });

        plant.addEventListener('click', (event) => {
            console.log(event.target.id);
            if (event.target.id == 'plant-visual' || event.target.id == 
            'plant') {
                if (healthOverlay.className == 'hidden') {
                    healthOverlay.className = 'showing';
                } else {
                    healthOverlay.className = 'hidden';
                }
            }

            if (event.target.id == 'bar-outline') {
                healthOverlay.className = 'showing';
            }

            setTimeout(() => {
                healthOverlay.className = 'showing';
            }, 3000);
        });
        
        stats.forEach( (stat) => {
            stat.addEventListener('click', () => {
                let hint = document.querySelector(`#${stat.parentElement.id} .hint`);
                hint.style.animation = 'revealHint 2s ease-in-out forwards 1';

                hint.addEventListener('animationend', () => {
                    hint.style.animation = '';
                });
            });
        });
    });

    function startGame() {
        // Set initial value of each resource to the perfect optimal health
        for (let resource in gameData.health) {
            gameData.health[resource] = median(optimalHealth[plantTypes[plantTypeIndex]][resource]);
        }
        // Reset the day to 1
        gameData.day = gameStartDay;

        updateCalendar();
        updateHealth();

        gameStarted = true;

        settingBtnsInOverlay.forEach((btn) => {
            btn.style.display = 'none';
            btn.nextElementSibling.style.display = 'block';
            btn.nextElementSibling.addEventListener('click', () =>{
                hideOverlay();
            });
        });

        restartGameBtns.forEach( (btn) => {
            btn.style.display = 'block';
        }); 
        document.getElementById('settings-page-btns').style.display = 'flex';


        
    }

    function flipDate(front, back) {
        if (toggleValues.animationOn) {
            front.style.animation = 'flipDown 0.3s linear forwards';
            front.addEventListener('animationend', (e) => {
                front.textContent = back.textContent;
                front.style.animation = '';
            })
        } else {
            front.textContent = back.textContent;
            front.style.animation = '';
        }

        if (toggleValues.soundOn) { flipPage.play(); }
    }

    function clearResource(front, back) {  
        if (toggleValues.animationOn) {
            front.style.animation = '0.3s flipUp 0.3s linear forwards'

            front.addEventListener('animationend', () => {
                if (back.firstChild) {
                    back.removeChild(back.firstChild);
                }
                front.style.animation = '';
            });
        } else {
            if (back.firstChild) {
                back.removeChild(back.firstChild);
            }
            front.style.animation = '';
        }
    }

    function setUpDay() {
        gameData.day--;

        updateCalendar();

        // Each resource has a probability of depleting by 1 or 2 (See depletionRate for exact probabilities)
        for (let r in gameData.health) {
            document.querySelector(`#${r}-stat span.value`).textContent = gameData.health[r];

            if (gameData.health[r] > 0 && (Math.random() < depletionRate[r])) {
                gameData.health[r] -= randomInt([1,3]);
                if (gameData.health[r] < 0) {
                    gameData.health[r] = 0;
                }
            }
        }
        updateHealth();


        for (let r in gameData.health) {
            let hint = document.querySelector(`#${r}-stat .hint`);
            hint.style.animation = 'revealHint 2s ease-in-out forwards 1';
            hint.addEventListener('animationend', () => {
                hint.style.animation = '';
            });
        }
        
        // Check if game has ended
        // Plant survived the 30 days
        if (gameData.day == 0) {
            showOverlay(document.getElementById('end-survive'));
            // document.getElementById('end-survive').className = 'showing';
            endGame();
        }
        // Plant died before the 30 days
        if (calculateHealthVal() == 0) {
            showOverlay(document.getElementById('end-dead'));
            endGame();
        }

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
        });

        for (let i = 0; i < 2; i++ ){
            console.log(resourceType[i], resourceAmount[i])
            // Update Plant health with corresponding resource type and amount
            gameData.health[resourceType[i]] += resourceAmount[i];

            let img = document.createElement('img');
            img.src = `images/${resourceType[i]}${resourceAmount[i]}.png`;

            resourceCardsBack[i].appendChild(img);
        }

        updateHealth();
    }

    function calculateHealthVal() {
        let health = 30;

        // If resource amount within optimal range => no health deduction
        // Otherwise, deduct the difference
        for (let r in gameData.health) {
            if (gameData.health[r] < optimalHealth[plantTypes[plantTypeIndex]][r][0]) {
                health -= optimalHealth[plantTypes[plantTypeIndex]][r][0] - gameData.health[r];
            } else if (gameData.health[r] > optimalHealth[plantTypes[plantTypeIndex]][r][1]) {
                health -= gameData.health[r] - optimalHealth[plantTypes[plantTypeIndex]][r][1];
            }
        }
        return health > 0 ? health : 0;
    }

    function updateCalendar() {
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
        });
    }

    function updateHealth() {
        let healthVal = calculateHealthVal() / 30;
        updatePlantVisuals(healthVal);
        updateHealthColor(healthVal);

        let width = window.innerWidth * 0.25

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

            let hint = document.querySelector(`#${r}-stat .hint`);
            if (gameData.health[r] < optimalHealth[plantTypes[plantTypeIndex]][r][0]) {
                hint.textContent = 'Too Little!';
                hint.style.color = 'red';
            } else if (gameData.health[r] > optimalHealth[plantTypes[plantTypeIndex]][r][1]) {
                hint.textContent = 'Too Much!';
                hint.style.color = 'red';
            } else {
                hint.textContent = 'Just Right!';
                hint.style.color = 'black';
            }

            let currentVal = document.querySelector(`#${r}-stat span.value`).textContent;

            if (!gameStarted || !toggleValues.animationOn || currentVal == gameData.health[r]) {
                document.querySelector(`#${r}-stat span.value`).textContent = gameData.health[r];
            } else {
                iterateStat(r); 
            }
        }
    }

    function iterateStat(resource) {
        let stat = document.querySelector(`#${resource}-stat .stat`);
        console.log(stat);
        let statValue = document.querySelector(`#${resource}-stat .value`);

        if (gameStarted && gameData.health[resource] != statValue.textContent) {
            setTimeout(() => {
                if (statValue.textContent < gameData.health[resource]) {
                    stat.style.animation = 'increment 0.75s ease forwards';
                } else {
                    stat.style.animation = 'decrement 0.75s ease forwards';
                }

                stat.addEventListener('animationend', () => {
                    stat.style.animation = '';
                });
                if (statValue.textContent < gameData.health[resource]) {
                    statValue.textContent = parseInt(statValue.textContent) + 1;
                } else {
                    statValue.textContent = parseInt(statValue.textContent) - 1;
                }
                iterateStat(resource);
            }, 1000);
        }
    }

    function updatePlantVisuals(healthVal) {
        // Update plant image
        let index = Math.ceil(healthVal * 5);
        console.log("Img: ", index);

        const plant = document.querySelector('#plant-visual');

        if (!plant.src.includes(`${plantTypes[plantTypeIndex]}${index}.png`)) {
            if (toggleValues.soundOn) { plantSound.play(); }
        }

        plant.src = `images/${plantTypes[plantTypeIndex]}${index}.png`;

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

    // Returns the median 
    function median(range) {
        let min = Math.ceil(range[0]);
        let max = Math.floor(range[1]);
        return Math.floor((max + min) / 2); 
    }

    function showOverlay(page) {
        document.querySelector('main').className = 'hidden';
        document.querySelectorAll('#overlay article').forEach((page) => {
            page.className = 'hidden';
        });

        if (page) {
            page.className = 'showing';
        }
        overlay.className = 'showing';
    }

    function displayStat(statType) {
        const allStats = document.querySelectorAll('.plant-select-info div');
        allStats.forEach((stat) => {
            stat.style.display = 'none';
        });

        const currentStat = document.getElementById(`${statType}-info`);
        currentStat.style.display = 'block';
    }

    function hideOverlay() {
        document.querySelector('main').className = 'showing';
        document.querySelectorAll('#overlay article').forEach((page) => {
            page.className = 'hidden';
        });
        overlay.className = 'hidden';
    }

    window.addEventListener('resize', function () {
        updateHealth();
    });

    function endGame() {
        gameStarted = false;
        showOverlay(document.getElementById('end-survive'));
        overlay.style.display = 'flex';

        overlay.className = 'showing;'
        document.getElementById('end-survive').className = 'showing';
    }
})(); 