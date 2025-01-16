import axios from 'axios';

export default (feedList) => {
  const xmls = [];
  feedList.forEach((url) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
    .then((response) => {
      console.log(response);
      if (response.status === 200) return response.data;
      throw new Error('Network response was not ok.')
    })
    .then((data) => {
      if (data.status.hasOwnProperty('error')) {
        throw new Error(data.status.error.name);
      }
      xmls.push(data.contents); // накопить и вернуть данные?
    })
    .catch((e) => {
      console.log(e); // прокинуть ошибку дальше?
    });
  });
  return xmls;
};

// https://feeds.simplecast.com/54nAGcIl
// https://lorem-rss.hexlet.app/feed