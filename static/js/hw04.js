/* Accessibility Questions
1. Accessibility is important for all users that might visit a site. Primarily we
make an effort to ensure individuals with disabilities, e.g. color-blindness or
dyslexia, can still use our site in a similar capacity to every other individual.
On the other hand, it's also helpful for specific situations, such as when viewing
with smaller viewports, viewing in bright sunlight, or using without a mouse. It's
important to ensure equal access and equal opportunity on the Web.

In my opinion, Instagram can be more accessible by improving color contrast. 
When using WAVE on the page, in addition to the color contrast, it appears Instgram
can leverage more labels as well. Other considerations might be a dyslexia or 
color-blind mode, among others.

2. Beyond what was suggested from the HW itself, I primarily used W3C sites such as
- https://www.w3.org/WAI/fundamentals/accessibility-intro/
- https://www.w3.org/WAI/tips/developing/

3. The most challenging part is remembering to do it. Otherwise, when writing up
a specific image, for example, it is not particularly difficult to add alt-text
or a label, particularly if it's dynamically pulled from the server. In addition,
color-contrast is one of the more challenging parts if most colors are easy to
read for you. Accesibility definitly improves usability for all users because, 
for example, allowing users to tab and spacebar can always be situationally
convenient. It also may provide further context if individuals do read labels.
*/


// Lab7 - Suggestions Sidebar
const user2Html = user => {
    return `
        <img
            class="pic"
            src="${user.thumb_url}"
            alt="${user.username} profile picture">
        <h1>
            ${user.username}
        </h1>
        `;
};

const displayUser = () => {
    fetch('/api/profile')
        .then(response => response.json())
        .then(user => {
            // console.log(user);
            const html = user2Html(user);
            document.querySelector('.user').innerHTML = html;
        });
};

const toggleFollow = ev => {
    
    const elem = ev.currentTarget;

    // if (elem.innerHTML === 'follow') {
    if (elem.getAttribute('aria-checked') === 'false'){
        followUser(elem.dataset.userId, elem);
    } else {
        unfollowUser(elem.dataset.followingId, elem);
    }
};

const followUser = (userID, elem) => {
    const postData = {
        "user_id": userID
    };

    fetch('/api/following/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow';
            elem.setAttribute('aria-label', 'unfollow');
            elem.setAttribute('aria-checked', 'true');
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            // in the event that we want to unfollow
            elem.setAttribute('data-following-id', data.id);
        });
};

const unfollowUser = (followingID, elem) => {
    fetch(`/api/following/${followingID}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'follow';
            elem.setAttribute('aria-label', 'follow');
            elem.setAttribute('aria-checked', 'false');
            elem.classList.add('follow');
            elem.classList.remove('unfollow');
            elem.removeAttribute('data-following-id', data.id);
        });
};

const suggestion2Html = user => {
    return `
        <section class="asuggestion">
            <img class="pic" src="${user.thumb_url}" />
            <div>
                <p class="username">${user.username}</p>
                <p class="suggestion-text">suggested for you</p>
            </div>
            <div>
                <button
                    class="link following"
                    aria-label="follow"
                    aria-checked="false"
                    data-user-id="${user.id}"
                    onclick="toggleFollow(event)">
                    follow
                </button>
            </div>
        </section>
        `;
};

const displaySuggestions = () => {
    fetch('/api/suggestions')
        .then(response => response.json())
        .then(users => {
            // console.log(users);
            const html = users.map(suggestion2Html).join('\n');
            document.querySelector('.suggestion').innerHTML = html;
        });
};

// Given - Stories Top Bar
const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

// Posts Main Section
const likes2Html = post => {
    if (post.likes.length === 1){
        return `1 like`;
    }
    
    return `${post.likes.length} likes`;
};

const comments2Html = post => {
    if (post.comments.length === 0) {
        return `<p></p>`;
    }
    else if (post.comments.length === 1){
        return `<p>
                    <strong> ${post.comments[0].user.username} </strong>
                    ${post.comments[0].text}
                </p>
                <p class="timestamp">
                    ${ post.comments[0].display_time }
                </p>
                `;
    } else {
        return `<button class="link" onclick="openModal(event);" data-post-id="${post.id}">
                    View all ${post.comments.length} comments
                </button>
                <p>
                    <strong> ${post.comments[0].user.username} </strong>
                    ${post.comments[0].text}
                </p>
                <p class="timestamp">
                    ${ post.comments[0].display_time }
                </p>
                `;
    }
};

const heartButton2Html = post => {
    if (post.current_user_like_id){
        return `
                <button 
                role="switch"    
                aria-label="Unlike"
                class="like"
                aria-checked="true"
                data-post-id="${post.id}"
                data-like-id="${post.current_user_like_id}"
                onclick="toggleLike(event);">
                <i class="fas fa-heart"></i>
                </button>`;
    };

    return `
            <button 
            role="switch"    
            aria-label="Like"
            class="like"
            aria-checked="false"
            data-post-id="${post.id}"
            onclick="toggleLike(event);">
            <i class="far fa-heart"></i>
            </button>`;
};

const bookmarkButton2Html = post => {
    if (post.current_user_bookmark_id){
        return `
                <button
                role="switch"
                aria-label="Unsave"
                class="bookmark"
                aria-checked="true"
                data-post-id="${post.id}"
                data-bookmark-id="${post.current_user_bookmark_id}"
                onclick="toggleBookmark(event);">
                <i class="fas fa-bookmark"></i>
                </button>
                `;
    };
    return `
            <button
            role="switch"
            aria-label="Save"
            class="bookmark"
            aria-checked="false"
            data-post-id="${post.id}"
            onclick="toggleBookmark(event);">
            <i class="far fa-bookmark"></i>
            </button>
            `;
};

// from class
const post2Html = post => {
    
    return `
        <section class="card" id="post${post.id}">
            <div class="header">
                <h3>
                    ${post.user.username}
                </h3>

                <button
                    aria-label="More options"
                    class="buttons">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            
            <img src="${ post.image_url }" alt="${ post.alt_text }"/>

            <div class="info">
                <div class="buttons">
                    <div>
                        ${heartButton2Html(post)}
                        <button 
                            aria-label="Comment"
                            class="comment"
                            onclick="jumpToComment(event)"
                            data-post-id=${post.id}>
                            <i class="far fa-comment"></i>
                        </button>
                        <button 
                            aria-label="Share Post" 
                            class="share">
                            <i class="far fa-paper-plane"></i>
                        </button>
                    </div>
                    <div>
                        ${bookmarkButton2Html(post)}
                    </div>
                </div>

                <p class="likes">
                    <strong>
                        ${likes2Html(post)}
                    </strong>
                <p/>
                
                <div class="caption">
                    <p>
                        <strong> ${ post.user.username} </strong>
                        ${ post.caption }
                    </p>
                    <p class="timestamp">
                        ${ post.display_time }
                    </p>
                </div>

                <div class="comments">
                    ${comments2Html(post)}
                </div>
            </div>
            <form class="add-comment">
                <div class="input-holder">
                    <input
                        id="commentbox${post.id}"
                        class="comment-textbox"
                        aria-label="Add a comment"
                        placeholder="Add a comment..."
                        value
                    >
                </div>
                <button 
                        type="button"
                        class="link"
                        data-post-id="${post.id}"
                        onclick="postComment(event);">
                        Post
                </button>
            </form>
        </section>
    `;
}

// from class
const displayPosts = () => {
    fetch('/api/posts/?limit=10')
        .then(response => response.json())
        .then(posts => {
            // console.log(posts);
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};

// To redraw one post
const redrawPost = postID => {
    fetch(`/api/posts/${postID}`)
        .then(response => response.json())
        .then(post => {
            const html = post2Html(post);
            document.querySelector(`#post${postID}`).outerHTML = html;
        })
};

// Likes Card Section
const toggleLike = ev => {
    
    const elem = ev.currentTarget;

    if (elem.getAttribute('aria-checked') === 'false'){
        likePost(elem.dataset.postId);
    } else {
        unlikePost(elem.dataset.likeId, elem.dataset.postId);
    }
};

const likePost = (postID) => {
    const postData = {
        "post_id": postID
    };

    fetch('/api/posts/likes/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // elem.innerHTML = '<i class="fas fa-heart"></i>';
            // elem.setAttribute('aria-checked', 'true');
            // elem.setAttribute('data-like-id', data.id);
            redrawPost(postID);
        });
};

const unlikePost = (likeID, postID) => {
    fetch(`/api/posts/likes/${likeID}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // elem.innerHTML = '<i class="far fa-heart"></i>';
            // elem.setAttribute('aria-checked', 'false');
            // elem.removeAttribute('data-like-id');
            redrawPost(postID);
        });
};

// Bookmark Card Section
const toggleBookmark = ev => {
    const elem = ev.currentTarget;

    if (elem.getAttribute('aria-checked') === 'false'){
        bookmarkPost(elem.dataset.postId, elem);
    } else {
        unbookmarkPost(elem.dataset.bookmarkId, elem);
    }
};

const bookmarkPost = (postID, elem) => {
    const postData = {
        "post_id": postID
    };

    fetch('/api/bookmarks/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = '<i class="fas fa-bookmark"></i>';
            elem.setAttribute('aria-label', 'Unsave');
            elem.setAttribute('aria-checked', 'true');
            elem.setAttribute('data-bookmark-id', data.id);
            // redrawPost(postID);
        });
};

const unbookmarkPost = (bookmarkID, elem) => {
    fetch(`/api/bookmarks/${bookmarkID}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = '<i class="far fa-bookmark"></i>';
            elem.setAttribute('aria-label', 'Save');
            elem.setAttribute('aria-checked', 'false');
            elem.removeAttribute('data-bookmark-id');
            // redrawPost(postID);
        });
};

// Post Comment Card Section
const postComment = ev => {
    const elem = ev.currentTarget;
    const postID = elem.dataset.postId;
    const textbox = document.querySelector(`#commentbox${postID}`);

    const postData = {
        "post_id": postID,
        "text": textbox.value
    };
    
    fetch('/api/comments/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // textbox.value = '';
            redrawPost(postID);
            document.querySelector(`#commentbox${postID}`).focus(); // This won't work when redrawing.
        });
};

const jumpToComment = ev => {
    const postID = ev.currentTarget.dataset.postId;
    document.querySelector(`#commentbox${postID}`).focus();
}

// Modal Code
const modal2Html = post => {
    return `
            <div class="modal-bg">
                <button class="close" aria-label="Close Button" onclick="closeModal();">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal" role="dialog" aria-live="assertive">
                    <div class="featured-image" style="background-image: url(${post.image_url};)"></div>
                    <div class="container">
                        <h3>
                            <img
                            class="pic"
                            src="${post.user.thumb_url}"
                            alt="${post.user.username} profile picture">    
                            ${post.user.username}
                        </h3>
                        <div class="body">
                            ${post.comments.map(aComment2Html).join('\n')}
                        </div>
                    </div>
                </div>
            </div>
            `;
};

const aComment2Html = comment => {
    return `
            <div class="modal-comment">
                <img class="pic" src="${comment.user.thumb_url}" alt="${comment.user.username} profile picture">
                <p>
                    <strong> ${ comment.user.username } </strong>
                    ${ comment.text }
                </p>
                <p class="timestamp">
                    <strong> ${ comment.display_time } </strong>
                </p>
            </div>
    `;
}

const openModal = ev => {
    const postID = ev.currentTarget.dataset.postId;
    fetch(`/api/posts/${postID}`)
    .then(response => response.json())
    .then(post => {
        const html = modal2Html(post);
        modalElement = document.querySelector('#modal');
        modalElement.classList.remove('visuallyhidden');
        document.querySelector(`#modal`).innerHTML = html;
        document.querySelector('.close').focus();
    })
}

const closeModal = () => {
    modalElement = document.querySelector('#modal');
    modalElement.classList.add('visuallyhidden');
    modalElement.innerHTML = '';
}

const initPage = () => {
    displayStories();
    displayUser();
    displaySuggestions();
    displayPosts(); // from class
};

// invoke init page to display stories:
initPage();