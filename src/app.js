import i18next from 'i18next';

import 'bootstrap';
import ru from './texts.js';
import './style.scss';

import watchedState from './view.js';
import validate from './validate.js';

// const render = () => {}; // TODO - write render

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

  const renderError = (errMessage) => {
    const p = document.createElement('p');
    p.classList.add('mt-2', 'mb-0', 'text-red');
    p.textContent = errMessage;
    elements.form.append(p);
  };

  // Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    state.inputUrl.data.url = value;

    validate(state.inputUrl.data.url, initialState)
      .then((val) => {
        console.log(val);
        state.inputUrl.errors = [];
        elements.fields.url.value = '';
        initialState.inputUrl.feeds.push(val.url);
        console.log(state.inputUrl.feeds);
        state.inputUrl.stat = 'valid';
        elements.fields.url.classList.remove('is-invalid');
      })
      .catch((err) => {
        console.log(err);
        state.inputUrl.errors.push(err);
        state.inputUrl.stat = 'invalid';
        elements.fields.url.value = '';
        elements.fields.url.classList.add('is-invalid');
        console.log(state.inputUrl.errors);
        renderError(err);
      });
  });
};
