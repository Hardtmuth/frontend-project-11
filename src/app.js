import * as yup from 'yup';
import 'bootstrap';
import './style.scss';

import watchedState from './view.js';



/* const validate = (fields) => {
  schema.validate(fields) // DONE - rewrite to async 
}; */

const render = () => {}; // TODO - write render

export default () => {
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
  const schema = yup.string().required().url().nullable().notOneOf(); // FIX - do not working notOneOf from Proxy Array

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    state.inputUrl.data.url = value;

    schema.validate(state.inputUrl.data.url)
      .then((val) => {
        console.log(val);
        state.inputUrl.errors = [];
        filter.push(val);
        elements.fields.url.value = '';
        state.inputUrl.stat = 'valid';
        console.log('feeds is: ', filter);
        console.log('state is: ', state.inputUrl.stat);
        elements.fields.url.classList.remove('is-invalid');
      })
      .catch((e) => {
        state.inputUrl.errors.push(e);
        state.inputUrl.stat = 'invalid';
        elements.fields.url.classList.add('is-invalid');
        console.log(e);
      });
  });
};
