(function() {
    'use strict';
    console.log('reading js');
    let formData = {};
    let songTitle = 'i <3 u forever';

    function showOutput() {
        document.getElementById('input-page').className = 'hidden';
        document.getElementById('output-page').className = 'showing';
        document.querySelector('main').className = 'output';

        // Set artist name (only necessary once)
        let name = document.getElementById('name').value;
        document.getElementById('artist').textContent = name;
    }

    function showInput() {
        document.getElementById('output-page').className = 'hidden';
        document.getElementById('input-page').className = 'showing';
        document.querySelector('main').className = 'input';
    }

    function processFormData() {
        let formIds = ["name", "favorite-animal", "number", "time", "color", "adj", "favorite-thing"];
        let numInvalid = 0;

        for (let id of formIds) {
            let input = document.getElementById(id);
            let inputVal = input.value;

            if (!inputVal) {
                document.getElementById('error-msg').style.opacity = '1';
                input.style.borderColor = 'rgb(200 38 38)';
                input.addEventListener('change', () => {
                    input.style.borderColor = 'black';
                });
                if (numInvalid == 0) {
                    input.focus();
                }
                numInvalid++;
            } else {
                if (id != "name") {
                    formData[id] = inputVal;
                }
            }
        }
        if (numInvalid == 0) {
            document.getElementById('error-msg').style.opacity = '0';
            buildMadLib(formData);
            return true;
        }
    }

    const lyrics = {
        'favorite-animal': [
            'With grace and beauty that shines like the sun,<br> my love for you, <br> my sweet <span id="favorite-animal_output"></span>,<br> soars higher than anyone!',
            'Like a <span id="favorite-animal_output"></span>,<br> fierce and free,<br> my love for you will forever be.',
            'My <span id="favorite-animal_output"></span>,<br> you bring joy to my day,<br> my love for you will never go away.'
        ],
        'number-time': [
            'Every <span id="number_output" class="number-sensitive"></span> <span id="time_output"></span> spent with you is a blessing<br> Together, our love will keep us confessing',
            'With you, my heart beats <span id="number_output"></span> times every <span id="time_output"></span> that passes.',
            'Every moment with you feels like <span id="number_output"></span> <span id="time_output" class="number-sensitive"></span> of the perfect dream'
        ],
        'color': [
            'They say the grass is always greener on the other side,<br> but the grass is <span id="color_output"></span>-er when you\'re by my side',
            'Like a brilliant <span id="color_output"></span> gem,<br> you shine so bright,<br>your love guides me through the darkest night.',
            'Like a <span id="color_output"></span> sunset,<br> your love sets my soul ablaze,<br> my heart is yours,<br> forever and always.'
        ],
        'adj': [
            'Your love is like a warm hug,<br> always <span id="adj_output"></span> and snug.',
            'Your love is <span id="adj_output"></span>,<br> like a never-ending bliss,<br> I\'m so grateful to have you,<br> as my one true kiss.',
            'You light up my life with your <span id="adj_output"></span> smile,<br> I am forever yours,<br> mile after mile.'
        ],
        'favorite-thing': [
            'Your love is like my favorite <span id="favorite-thing_output"></span>,<br> filling me with comfort and grace.',
            'You are my perfect <span id="favorite-thing_output"></span>,<br> my constant companion,<br> your love gives me strength.',
            'I swear on my favorite <span id="favorite-thing_output"></span>,<br> I will never stop fighting for your love.',
            'I will never stop trying to be the best <span id="favorite-thing_output"></span> for you.'
        ]
    }

    function buildMadLib(formData) {
        getRandomSong();

        // Remove any old lyrics
        let lyricElement = document.getElementById('lyrics');
        while (lyricElement.hasChildNodes() ) {
            lyricElement.removeChild(lyricElement.firstChild);
        }

        // Generate new song lyrics
        for (let line in lyrics) {
            generateLine(line);
        }

        for (let word in formData) {
            let span = document.getElementById(word + '_output');

            if (word == 'time' && span.className == 'number-sensitive' && parseInt(formData['number']) != 1) {
                    span.textContent = formData[word] + 's';
            } else {
                span.textContent = formData[word];
            }
        }

    }
    
    function randomInt(min, max) {
        return Math.floor( (max - min + 1) * Math.random() ) + min;
    }


    function getRandomSong() {
        const lyricColors = ['#3D6675','#877667','#7A5B6D', '#4A5820', ];
        let songNum = randomInt(0, lyricColors.length-1);
        
        let albumCover = document.getElementById('album-cover');
        albumCover.src = `images/album-cover${songNum+1}.png`;

        let lyricElem = document.getElementById('lyrics');

        // Set song title
        document.getElementById('song-title').textContent = songTitle;

        if (window.screen.width >= 675) {
            lyricElem.style.backgroundColor = lyricColors[songNum];

            // Set song title
            if (songTitle.length < 50 && window.screen.width >= 850) {
                songTitle += ' and ever';
            }
        } else {
            document.getElementById('song-title').textContent = 'i <3 u';

            lyricElem.style.backgroundColor = '';

            document.querySelector('#content').className = 'album' + (songNum + 1);
            document.querySelector('nav img').className = 'album' + (songNum + 1);
        }
    
    }

    function getRandomLine(id) {
        return lyrics[id][randomInt(0, lyrics[id].length-1)];
    }

    function generateLine(id) {
        let lyrics = document.getElementById('lyrics');
        let line = document.createElement('p');
        line.innerHTML = getRandomLine(id);
        lyrics.appendChild(line);
        let musicNote = document.createElement('img');
        musicNote.width = '15';
        musicNote.height = '20';
        musicNote.src = 'images/music-note.png';
        lyrics.appendChild(musicNote);
    }

    let form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if ( processFormData() ) {
            // Transition animations if not mobile screen size
            document.querySelector('#animation').className = 'load';
            if (window.screen.width >= 675) {
                setTimeout(showOutput, 8000);
            } else {
                showOutput();
            }
        }
    });

    let home = document.querySelector('#home');
    home.addEventListener('click', (e) => {
        document.querySelector('#animation').className = '';
        showInput();
    });

    let skipForward = document.querySelector('#skip-forward');
    skipForward.addEventListener('click', (e) => {
        buildMadLib(formData);
    });
	

}());

