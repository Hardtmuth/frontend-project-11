export default (responseData) => {
    const parser = new DOMParser();

    const xmlString = responseData.data.contents;
    const doc1 = parser.parseFromString(xmlString, 'application/xml');
    const title = doc1.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const description = doc1.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    const postsData = doc1.querySelectorAll('item');

    const posts = [];
    postsData.forEach((post, id) => {
      const data = {};
      data.postId = id;
      data.title = post.getElementsByTagName('title')[0].childNodes[0].nodeValue;
      data.text = post.getElementsByTagName('description')[0].childNodes[0].nodeValue;
      data.url = post.getElementsByTagName('link')[0].childNodes[0].nodeValue;
      posts.push(data);
    });

    return { title, description, posts };
  };
