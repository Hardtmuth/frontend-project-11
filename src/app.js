import i18next from 'i18next';

import 'bootstrap';
import ru from './texts.js';
import './style.scss';

import watchedState from './view.js';
import validate from './validate.js';
import parseFeed from './parse.js';

const render = (feedsList) => {
  console.log('feed list is: ', feedsList);
  feedsList.forEach(parseFeed);
}; // TODO - write render

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: { ru }
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  // Model
  const initialState = {
    inputUrl: {
      stat: 'invalid',
      data: {
        url: '',
      },
      feeds: [],
      errors: [],
    },
  };

  // View
  const state = watchedState(initialState);

  // Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    state.inputUrl.data.url = value;

    validate(state.inputUrl.data.url, initialState)
      .then((val) => {
        // console.log(val);
        state.inputUrl.errors = [];
        elements.fields.url.value = '';
        initialState.inputUrl.feeds.push(val.url);
        // console.log(state.inputUrl.feeds);
        state.inputUrl.stat = 'valid';
        elements.fields.url.classList.remove('is-invalid');
        elements.feedback.textContent = '';
      })
      .catch((err) => {
        state.inputUrl.errors.push(err.message);
        state.inputUrl.stat = 'invalid';
        elements.fields.url.value = '';
        elements.fields.url.classList.add('is-invalid');
        // console.log(state.inputUrl.errors);
        elements.feedback.textContent = err.message
      });

    render(state.inputUrl.feeds);
  });
};
