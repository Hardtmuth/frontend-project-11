import * as yup from 'yup';
import 'bootstrap';
import './style.scss';

import watchedState from './view.js';

const schema = yup.object().shape({
  url: yup.string().url().nullable(),
});

/* const validate = (fields) => {
  schema.validate(fields) // DONE - rewrite to async 
}; */

const render = () => {}; // TODO - write render

export default () => {
  /* const elements = {
    form: document.querySelector('.form-floating'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  }; */

  // Model
  const initialState = {
    inputUrl: {
      state: 'invalid',
      data: {
        url: '',
      },
      feeds: [],
      errors: [],
    },
  };

  // View
  //const state = watchedState(initialState);
 
  // Controller

  const form = document.querySelector('.form-floating');
  const url = document.querySelector('.form-control');
  console.log(url);

  url.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(e.target.value)
    /* schema.validate(e.target.value)
      .then((val) => {
        console.log(val);
        /* state.inputUrl.errors = [];
        state.inputUrl.state = 'valid';
        state.inputUrl.feeds.push(val);
        fields.url.value = '';
      })
      .catch((e) => {
        /* state.inputUrl.errors.push(e);
        state.inputUrl.state = 'invalid';
        console.log(e);
      }); */

    /* if (state.inputUrl.state === 'valid') {
      elements.fields.url.classList.remove('is-invalid');
    } else {
      elements.fields.url.classList.add('is-invalid'); // DONE - remove class if valid url
    } */
  });
};
