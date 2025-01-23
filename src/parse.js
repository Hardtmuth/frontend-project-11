import axios from 'axios';
import i18next from 'i18next';

export default (url) => {
  return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    console.log(response);
    const httpCode = response.data.status.http_code;
    console.log(httpCode);
    if (httpCode === 200) {
      return response
    }
    throw new Error(i18next.t('errors.notValidUrl'));
  })
  .then((responseData) => {
    // handle success
    const parser = new DOMParser();

    const xmlString = responseData.data.contents;
    const doc1 = parser.parseFromString(xmlString, "application/xml");
    const title = doc1.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const description = doc1.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    const postsData = doc1.querySelectorAll('item');

    const posts = [];
    postsData.forEach((post, id) => {
      const data = {};
      data.postId = id;
      data.title = post.getElementsByTagName('title')[0].childNodes[0].nodeValue;
      data.text = post.getElementsByTagName('description')[0].childNodes[0].nodeValue;
      posts.push(data);
    });

    const res = { title, description, posts };
    // console.log(res);

    return res;
  })
};
