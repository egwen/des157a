(function() {
    'use strict';
    console.log('reading js');

    let posts = document.querySelectorAll('.post');

    for (let post of posts) {
        post.addEventListener('click', (event) => {
            // Hide current article
            let curArticle = document.querySelector('.current-article');
            let curPost = document.querySelector('.current-post');
            curArticle.removeAttribute('class');
            curPost.removeAttribute('class');

            console.log(event.currentTarget.parentNode);
            event.currentTarget.parentNode.setAttribute('class','current-post');

            let name = event.currentTarget.id;
            let num = name[name.length-1];
            let article = document.getElementById(`article${num}`);
            console.log(article);
            article.setAttribute('class', 'current-article');
        })

    }
	

}());

