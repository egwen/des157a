(function(){
    'use strict';
    console.log("Reading js");
    const scrollHint = document.getElementById('scroll-hint');

    let scrollHintTimer, focusTimer;

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    window.addEventListener('load', function () {
        const posts = document.querySelectorAll('main section');
        const closeBtn = document.getElementById('close-overlay');

        let postTops = [];
        let pageTop;
        let counter = 1;
        let prevCounter = 1;
        let doneResizing;

        scrollHintTimer = setTimeout( showScrollHint(), 2000);
        scrollHint.style.bottom = `-${window.pageYOffset - 50}px`;

        const loadingStripes = document.querySelectorAll('#loading-stripes div');
        console.log(loadingStripes)
        loadingStripes.forEach( (stripe) => {
            stripe.style.animationDuration = '3s';
            stripe.addEventListener('animationend', () => {
                const preloader = document.getElementById('preloader');
                preloader.className = 'fadeout';

                console.log(preloader);
                setTimeout( () => {
                    preloader.style.display = 'none';
                }, 3000);
            });
        })

        resetPagePosition();

        window.addEventListener('scroll', function () {
            hideScrollHint();
            scrollHint.style.bottom = `-${window.pageYOffset - 50}px`;

            clearTimeout(focusTimer);

            pageTop = window.pageYOffset + (window.innerHeight - 100);
            if (pageTop > postTops[counter] && counter < postTops.length) {
                counter++;
                console.log(`scrolling down ${counter}`);
            } else if (counter > 1 && pageTop < postTops[counter - 1]) {
                counter--;
                console.log(`scrolling up ${counter}`);
            }

            if (counter > 0 ) {
                document.querySelector('#container img').style.transitionDuration = '3s';
            }

            if (counter != prevCounter) {
                // Show overlay button if not on first article
                if (counter > 1) {
                    console.log("SHOW")
                    closeBtn.className = 'showing';
                } else {
                    closeBtn.className = 'hidden';
                }
                closeOverlay();

                setTimeout( function() {
                    document.querySelector('#container img').className = 'sect' + counter;
                    focusArticle();

                }, 1000);

                prevCounter = counter;
            }
            if (counter > 1) {
                focusTimer = setTimeout( function() {
                    document.querySelector('#container img').className = 'sect' + counter;
                    focusArticle();
                }, 5000);
            }
            

        }); // end window scroll function

        window.addEventListener('resize', function () {
            clearTimeout(doneResizing);
            doneResizing = setTimeout(function () {
                resetPagePosition();
            }, 500);
        });

        function resetPagePosition() {
            postTops = [];
            posts.forEach(function (post) {
                postTops.push(Math.floor(post.getBoundingClientRect().top) + window.pageYOffset);

            });

            const pagePosition = window.pageYOffset + 300;
            counter = 0;

            postTops.forEach(function (post) { if (pagePosition > post) { counter++; } });
            console.log(postTops);
        }

        function focusArticle() {
            console.log("focus article")
            window.scrollTo({
                top: (postTops[counter-1] - 150),
                left: 0,
                behavior: 'smooth'
            });   
            setTimeout( () => {
                clearTimeout(focusTimer);
                showScrollHint();
            }, 4000);
           
        }

        // Set transition for buttons
        // const buttons = document.querySelectorAll('button');
        // buttons.forEach( (btn) => {
        //     btn.addEventListener('click', (event) => {
        //         console.log("click", event.target);
        //         openOverlay();
        //     });
        // });

        closeOverlay();

        function openOverlay() {
            hideScrollHint();

            console.log("open")
            console.log(pageTop)
            // Set current article to correct spot
            focusArticle();

            const stripes = document.querySelector('#stripes');
            stripes.className = 'expanded';
            const container = document.getElementById('container');
            container.className = 'expanded';

            closeBtn.className = 'expanded';
            closeBtn.removeEventListener('click', openOverlay);
            closeBtn.addEventListener('click', closeOverlay);
            
            const overlay = document.getElementById("overlay");
            console.log(overlay);
            let video = document.querySelector('video');
            video.className = 'hidden';
            video.src = `videos/v${counter}.webm`;  

            let loader = document.getElementById('loader');
            loader.className = 'showing';
            loader.style.backgroundImage = `url('images/V${counter}.gif')`

            setTimeout( () => {

                overlay.className = 'showing';

                video.addEventListener('canplaythrough', ()=> {
                    setTimeout(() => {
                        video.className = 'showing';
                        loader.className = "hidden";
                    }, 3000);
                    
                });            

            }, 1000);
        }

        function closeOverlay() {
            console.log("close")
            stripes.removeAttribute('class');
            container.removeAttribute('class');
            closeBtn.className = counter == 1 ? 'hidden' : 'showing';

            closeBtn.removeEventListener('click', closeOverlay);
            closeBtn.addEventListener('click', openOverlay);
            setTimeout( () => {
                overlay.className = 'hidden';
            }, 1000)

            scrollHintTimer = setTimeout(showScrollHint, 5000);
        }


        // Toggle button when mouse hovers over it
        function toggleButton() {
            if (closeBtn.src.includes('open')) {
                closeBtn.src = 'images/overlay-close.png';
            } else {
                closeBtn.src = 'images/overlay-open.png';
            }
        }
        closeBtn.addEventListener('mouseover', toggleButton);
        closeBtn.addEventListener('mouseout', toggleButton);

        function showScrollHint() {
            console.log("SHOW SCROLL: ", postTops[counter-1])
            clearTimeout(scrollHintTimer);
            // scrollHint.style.bottom = `-${window.pageYOffset - 50}px`;

            // scrollHint.style.bottom = `-${(postTops[counter-1] - 150)}px`;
            console.log(window.pageYOffset);
            if ( counter < postTops.length ) {
                scrollHint.className = 'showing';
            }


            // window.scrollTo({
            //     top: (postTops[counter-1] - 200),
            //     left: 0,
            //     behavior: 'smooth'
            // }); 
        }

        function hideScrollHint() {
            console.log("HIDE SCROLL")
            clearTimeout(scrollHintTimer);
            
            scrollHint.className = 'hidden';
        }


    }); // end window load function

})();// END IIFE