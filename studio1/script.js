(function() {
    'use strict';
    console.log('reading js');

    function showOutput() {
        document.getElementById('input-page').style.display = 'none';
        document.getElementById('output-page').style.display = 'flex';

        document.querySelector('main').className = 'output';
    }

    let form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showOutput();
    });

    let home = document.querySelector('nav a');
    form.addEventListener('click', () => {
        console.log("home");
    });
	

}());

