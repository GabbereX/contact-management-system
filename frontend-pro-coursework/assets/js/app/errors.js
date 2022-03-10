const getError = (input = null, errorReason, id = 'errorsContainer_ID') => {
  const errorsContainer = document.getElementById(id);
  const error = document.createElement('li');
  const TIMEOUT_1MS = 1;
  let inputLabel = '';

  // ! style actions

  setTimeout(() => {
    errorsContainer.style.height = +errorsContainer.style.height.replace('px', '') + error.clientHeight + 'px';
    errorsContainer.style.opacity = '1';
  }, TIMEOUT_1MS);

  // ! append error content

  if (input) {
    input.type === 'text' ? inputLabel = input.nextSibling.innerText :
    input.type === 'tel' || input.type === 'email' ? inputLabel = input.previousSibling.querySelector('.contact__select-head').innerText :
    input.type === 'url' ? inputLabel = 'Профиль ' + input.dataset.url + ' ' : false;
    input.classList.add('error-validate');
    error.innerText = `${inputLabel}: ${errorReason}`;
  } else error.innerText = errorReason;;

  error.classList.add('error-reason')
  errorsContainer.append(error);
};

const clearErrors = (id = 'errorsContainer_ID') => {
  const errorsContainer = document.getElementById(id);
  errorsContainer.style.height = '0px';
  errorsContainer.innerHTML = '';
};

export { getError, clearErrors };