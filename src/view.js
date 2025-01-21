import onChange from 'on-change';
import i18next from 'i18next';

const watchedState = (initialState) => onChange(initialState, (path, value, prev) => {
  const render = (feedsList) => {
    console.log('feed list is: ', feedsList);
  
    const feeds = document.querySelector('.feeds');
    const posts = document.querySelector('.posts');
  
    // Headers
    if (feeds) {
      feeds.innerHTML = '';

      const feedsContainer = document.createElement('div');
      feedsContainer.classList.add('card', 'border-0');
      const feedsContainerHeader = document.createElement('div');
      feedsContainerHeader.classList.add('card-body');
      const titleFeeds = document.createElement('h2');
      titleFeeds.classList.add('card-title', 'h4');
      titleFeeds.textContent = i18next.t('listHeaders.feeds'); // FIX change to i18
  
      feedsContainerHeader.append(titleFeeds);
      feedsContainer.append(feedsContainerHeader);
  
      feeds.append(feedsContainer);
    }
  
    if (posts) {
      posts.innerHTML = '';
  
      const postsContainer = document.createElement('div');
      postsContainer.classList.add('card', 'border-0');
      const postsContainerHeader = document.createElement('div');
      postsContainerHeader.classList.add('card-body');
      const titlePosts = document.createElement('h2');
      titlePosts.classList.add('card-title', 'h4');
      titlePosts.textContent = i18next.t('listHeaders.posts'); // FIX change to i18
  
      postsContainerHeader.append(titlePosts);
      postsContainer.append(postsContainerHeader);
  
      posts.append(postsContainer);
    }
    // Content
    const loadedFeedsList = document.createElement('ul');
    loadedFeedsList.classList.add('list-group', 'border-0', 'rounded-0');
    feeds.append(loadedFeedsList);

    const loadedPostsList = document.createElement('ul');
    loadedPostsList.classList.add('list-group', 'border-0', 'rounded-0');
    posts.append(loadedPostsList);

    const ids = Object.keys(feedsList);

    ids.forEach((id) => {
      const feedTitle = feedsList[id].title;
      const feedDescr = feedsList[id].description;
      const feedPosts = feedsList[id].posts;

      const feedCard = document.createElement('li');
      feedCard.classList.add('list-group-item', 'border-0', 'border-end-0');

      const feedCardHeader = document.createElement('h3');
      feedCardHeader.classList.add('h6', 'm-0');
      feedCardHeader.textContent = feedTitle;

      const feedCardDescr = document.createElement('p');
      feedCardDescr.classList.add('m-0', 'small', 'text-black-50');
      feedCardDescr.textContent = feedDescr;

      feedCard.append(feedCardHeader);
      feedCard.append(feedCardDescr);

      loadedFeedsList.append(feedCard);


      const postsIds = Object.values(feedPosts);
      postsIds.forEach((post) => {
        const postItem = document.createElement('li');
        postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

        const href = document.createElement('a');
        href.classList.add('fw-bold');
        href.setAttribute('href', "http://google.com"); // FIX URL
        href.textContent = post.title;

        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        btn.textContent = i18next.t('buttons.view');

        postItem.append(href);
        postItem.append(btn);

        loadedPostsList.append(postItem);
      });
    })

  };

  render(initialState.data);
});

export default watchedState;

// https://feeds.simplecast.com/54nAGcIl
