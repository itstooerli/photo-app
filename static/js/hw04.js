// Lab7
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
            console.log(user);
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
                    class="follow"
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
            console.log(users);
            const html = users.map(suggestion2Html).join('\n');
            document.querySelector('.suggestion').innerHTML = html;
        });
};

const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// // from class
// const post2Html = post => {
//     return `
//         <section>
//             <img src="${ post.thumb_url }" />
//             <p>${ post.caption }</p>
//             <button onclick="handleLike(event);">Like</button>
//             <button onclick="handleBookmark(event);">Bookmark</button>
//         </section>
//     `;
// }

// // from class
// const displayPosts = () => {
//     fetch('/api/posts')
//         .then(response => response.json())
//         .then(posts => {
//             const html = posts.map(post2Html).join('\n');
//             document.querySelector('.posts').innerHTML = html;
//         })
// };

// // from class
// const handleLike = ev => {
//     console.log("Handle like functionality");
// };

// // from class
// const handleBookmark = ev => {
//     console.log("Handle bookmark functionality");
// };

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const initPage = () => {
    displayStories();
    displayUser();
    displaySuggestions();
    // displayPosts(); // from class
};

// invoke init page to display stories:
initPage();