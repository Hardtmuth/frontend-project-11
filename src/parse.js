import axios from 'axios';

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

    console.log(doc1);
    console.log(title);
    console.log(description);

  })
  .catch((error) => {
    // handle error
    console.log(error);
  })
};
