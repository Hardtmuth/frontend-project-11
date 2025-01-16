import axios from 'axios';
//import { prefetch } from 'webpack';

export default (url) => {
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    // handle success
    console.log(response.data);
    const parser = new DOMParser();

    const xmlString = response.data.contents;
    const doc1 = parser.parseFromString(xmlString, "application/xml");
    const title = doc1.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const description = doc1.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    const posts = doc1.querySelectorAll('item');

    console.log(doc1);
    console.log(title);
    console.log(description);

    const res = { title, description, posts };
    console.log('parsed res is: ', res);

    return res;

   /*  // add to feed list
    const feedsList = document.querySelector('.feeds');

    const feed = document.createElement('li');
    feed.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    feedHeader.textContent = title;
    
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = description;

    feed.append(feedHeader);
    feed.append(feedDescription);
    
    feedsList.lastElementChild.append(feed);

    // add to content list
    const renderPost = (postNode) => {
      //const postsList = document.querySelector('.posts');
      const post = document.createElement('li');
      post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const link = document.createElement('a');
      link.classList.add('fw-bold');
      link.textContent = postNode.getElementsByTagName('title');

      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.textContent = 'Просмотр'; // change to i18

      post.append(link);
      post.append(button);
    
      postsList.lastElementChild.append(post);
    };

    console.log(posts);
    posts.forEach(renderPost); */
  })
  .catch((error) => {
    // handle error
    console.log(error);
  })
};
