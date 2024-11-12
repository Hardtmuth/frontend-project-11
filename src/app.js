import i18next from 'i18next';

import * as yup from 'yup';
import 'bootstrap';
import ru from './texts.js';
import './style.scss';

import watchedState from './view.js';

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

  // Controller
  const schema = yup.string().required().url().nullable(); // TODO - rewrite to yup notOneOf

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    state.inputUrl.data.url = value;

    schema.validate(state.inputUrl.data.url)
      .then((val) => {
        state.inputUrl.errors = [];
        elements.fields.url.value = '';
        if (!state.inputUrl.feeds.includes(val)) {
          state.inputUrl.feeds.push(val);
          state.inputUrl.stat = 'valid';
          elements.fields.url.classList.remove('is-invalid');
        } else {
          state.inputUrl.stat = 'invalid';
          throw new Error('url already in feeds');
        }
      })
      .catch((err) => {
        state.inputUrl.errors.push(err);
        state.inputUrl.stat = 'invalid';
        elements.fields.url.classList.add('is-invalid');
      });
  });
};
