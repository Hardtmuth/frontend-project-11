import axios from 'axios';
//import { prefetch } from 'webpack';

export default (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    // handle success
    const parser = new DOMParser();

    const xmlString = response.data.contents;
    const doc1 = parser.parseFromString(xmlString, "application/xml");
    const title = doc1.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const description = doc1.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    const postsData = doc1.querySelectorAll('item');

    const posts = {};
    postsData.forEach((post, id) => {
      const data = {};
      data.title = post.getElementsByTagName('title')[0].childNodes[0].nodeValue;
      data.text = post.getElementsByTagName('description')[0].childNodes[0].nodeValue;
      posts[id] = data;
    });

    const res = { title, description, posts };

    return res;
  })
  .catch((error) => {
    // handle error
    console.log(error);
  })
};
