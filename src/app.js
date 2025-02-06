import i18next from 'i18next';

import 'bootstrap';
import ru from './texts.js';
import './style.scss';

import watchedState from './view.js';
import validate from './validate.js';
import parse from './parse.js';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: { ru },
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    fieldUrl: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    viewBtns: document.querySelectorAll('button[data-bs-toggle="modal"]'), // FIX add only after add render rss url
  };

  // Model
  const initialState = {
    inputUrl: {
      stat: 'invalid',
      url: '',
      feedList: [],
      errors: [],
    },
    content: {
      feeds: [],
      posts: [],
      visited: [],
    },
  };

  // View
  const state = watchedState(initialState);

  // Controller
  const feedlist = [...state.inputUrl.feedList];

  const prepareForParsing = (val) => {
    feedlist.push(val.url);
    state.inputUrl = {
      stat: 'valid',
      errors: [],
      feedlist,
    };
    elements.fieldUrl.value = '';
    elements.fieldUrl.classList.remove('is-invalid');
    elements.feedback.textContent = '';
    return val.url;
  };

  const prepareForRender = ({
    feedId,
    title,
    description,
    posts,
  }) => {
    let id = feedId;
    if (id === undefined) {
      id = Object.keys(state.content.feeds).length;
    }

    const updatedContent = { ...state.content };

    if (title) {
      const thisFeed = { feedId: id, title, description };
      updatedContent.feeds.push(thisFeed);
    }

    const postsWithFeedId = posts.map((post) => {
      const postWithID = post;
      postWithID.feedId = feedId;
      return postWithID;
    });
    updatedContent.posts.push(...postsWithFeedId);
    state.content = updatedContent;

    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = i18next.t('errors.downloadSuccess');
  };

  const errorHandler = (err) => {
    state.inputUrl.errors.push(err.message);
    state.inputUrl.stat = 'invalid';

    elements.fieldUrl.value = '';
    elements.fieldUrl.classList.add('is-invalid');
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.feedback.textContent = err.message;
  };

  const compareHeaders = (newPosts, oldPosts) => {
    const oldPostsHeaders = oldPosts.map((post) => post.title);
    const compareResult = newPosts.posts.filter((post) => !oldPostsHeaders.includes(post.title));
    return { posts: compareResult };
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validate(value, feedlist)
      .then(prepareForParsing)
      .then(parse)
      .then(prepareForRender)
      .catch(errorHandler);

      const ff = document.querySelectorAll('button[data-bs-toggle="modal"]');
      console.log('ff: ', ff);
  });

  elements.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const data = e.target.parentNode;
    if (e.target.nodeName === 'LI') {
      return;
    }
    state.content.visited.push(data.firstChild.textContent);

    

  if (elements.viewBtns.length) {
    elements.viewBtns.addEventListener('click', (e) => {  // DO THIS - Moved from view.js for right MVC rules
      e.preventDefault();
      const focusPost = e.target;
      console.log(focusPost);
      const href = '';
      //modalHandler(e, focusPost, href);
    });
  }
  });

  /* const modalHandler = (e, post, href) => {
    e.preventDefault();
    href.classList.add('fw-normal')// : href.classList.add('fw-bold');
    modal.setAttribute('id', 'modal');
  
    modal.innerHTML = '';
  
    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
  
    // Header
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
  
    const headerText = document.createElement('h5');
    headerText.classList.add('modal-title');
    headerText.textContent = post.title;
  
    const headerCloseBtn = document.createElement('button');
    headerCloseBtn.classList.add('btn-close');
    headerCloseBtn.setAttribute('data-bs-dismiss', 'modal');
    headerCloseBtn.setAttribute('aria-label', 'Close');
  
    modalHeader.append(headerText);
    modalHeader.append(headerCloseBtn);
  
    // Modal body
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
  
    const modalBodyText = document.createElement('p');
    modalBodyText.textContent = post.text;
  
    modalBody.append(modalBodyText);
  
    // Modal footer
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
  
    const footerRead = document.createElement('button');
    footerRead.classList.add('btn', 'btn-secondary');
    footerRead.setAttribute('href', post.href);
    footerRead.textContent = i18next.t('buttons.read');
    footerRead.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(post.url, '_blank');
    });
  
    const footerClose = document.createElement('button');
    footerClose.classList.add('btn', 'btn-primary');
    footerClose.setAttribute('data-bs-dismiss', 'modal');
    footerClose.textContent = i18next.t('buttons.close');
  
    modalFooter.append(footerRead);
    modalFooter.append(footerClose);
  
    // Matryoshka
    modalContent.append(modalHeader);
    modalContent.append(modalBody);
    modalContent.append(modalFooter);
  
    modalDialog.append(modalContent);
  
    modal.append(modalDialog);
  }; */
  // Modal
  

  /* const run = (list) => {
    if (list.length) {
      list.forEach((item) => {
        parse(item)
          .then((newPsts) => compareHeaders(newPsts, state.content.posts))
          .then(prepareForRender)
          .catch(errorHandler);
      });
    }
    setTimeout(() => run(feedlist), 5000);
  };
  setTimeout(() => run(feedlist), 5000); */
};
