import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import 'bootstrap';
import './style.scss';

const schema = yup.object().shape({
  url: yup.string().url().nullable(),
});


const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const render = () => {};

export default () => {
  const elements = {
    container: document.querySelector('.container-fluid'),
    form: document.querySelector('.form-floating'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submitButton: document.querySelector('button[type="submit"]'),
  };

  // Model
  const state = {
    inputUrl: {
      state: 'invalid',
      data: {
        url: '',
      },
      errors: [],
    },
  };

  // View
  const watchedState = onChange(state, (path, value, prev) => {
    // console.log(state);
    /* const buttn = elements.submitButton;//document.querySelector('input.btn');
    if (path === 'inputUrl.state') {
      if (value === 'valid') {
        buttn.disabled = false;
      } else {
        buttn.disabled = true;
      }
    } */
  });

  // Controller
  console.log(elements.fields.url);
  elements.fields.url.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.inputUrl.data.url = e.target.value;
    const val = validate(state.inputUrl.data);
    console.log(e.target.value);
    console.log(val);

    if (state.inputUrl.state === 'invalid') {
      elements.fields.url.classList.add('is-invalid');
    }

  });
};
