(function() {
    'use strict';
    console.log('reading js');

    
    function showOutput() {
        document.getElementById('input-page').style.display = 'none';
        document.getElementById('output-page').style.display = 'flex';

        document.querySelector('main').className = 'output';
    }

    function showInput() {
        console.log("show input");
        document.getElementById('input-page').style.display = 'flex';
        document.getElementById('output-page').style.display = 'none';

        document.querySelector('main').className = 'input';
    }

    function processFormData() {
        let formIds = ["favorite-animal", "number", "time", "favorite-food", "color", "favorite-thing", "verb"];
        let formData = {};
        let numInvalid = 0;

        for (let id of formIds) {
            let input = document.getElementById(id);
            let inputVal = input.value;

            if (!inputVal) {
                input.style.borderColor = 'red';
                if (numInvalid == 0) {
                    input.focus();
                }
                numInvalid++;
            } else {
                input.style.borderColor = 'black';
                formData[id] = inputVal;
            }
        }

        if (numInvalid == 0) {
            buildMadLib(formData);
            return true;
        }
    }

    function buildMadLib(formData) {
        for (let word in formData) {
            document.getElementById(word + '_output').textContent = formData[word];
        }
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

        console.log("home", e);
        showInput();
    });
	

}());

