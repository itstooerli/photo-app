const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// from class
const post2Html = post => {
    return `
        <section>
            <img src="${ post.thumb_url }" />
            <p>${ post.caption }</p>
            <button onclick="handleLike(event);">Like</button>
            <button onclick="handleBookmark(event);">Bookmark</button>
        </section>
    `;
}

// from class
const displayPosts = () => {
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            const html = posts.map(post2Html).join('\n');
            document.querySelector('.posts').innerHTML = html;
        })
};

// from class
const handleLike = ev => {
    console.log("Handle like functionality");
};

// from class
const handleBookmark = ev => {
    console.log("Handle bookmark functionality");
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

const initPage = () => {
    displayStories();
    displayPosts(); // from class
};

// invoke init page to display stories:
initPage();