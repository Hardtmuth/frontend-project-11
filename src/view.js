import onChange from 'on-change';

const watchedState = (initialState) => onChange(initialState, (path, value, prev) => {
  // console.log(state);
  /* const buttn = elements.submitButton;//document.querySelector('input.btn');
  if (path === 'inputUrl.state') {
    if (value === 'valid') {
      buttn.disabled = false;
    } else {
      buttn.disabled = true;
    }
  } */
}); // DONE - move to a separate file

export default watchedState;
