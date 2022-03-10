import { createClient, editClient } from './api.js';
import { getTooltip } from './tooltip.js';
import { getModal } from './modal.js';
import { getError, clearErrors } from './errors.js';

function getModalContainer() {
  const modalContainer = document.createElement('div');
  const modalWindow = document.createElement('div');

  modalContainer.classList.add('modal-container');
  modalWindow.classList.add('modal-window');

  return {
    modalContainer,
    modalWindow
  };
};

function getModalContent(modalTitle, { onOpen, onClose }, value) {
  const modalContainer = getModalContainer().modalContainer;
  const modalWindow = getModalContainer().modalWindow;
  const title = document.createElement('h2');
  const form = document.createElement('form');
  const addContactContainer = document.createElement('div');
  const allContactsContainer = document.createElement('div');
  const errorsContainer = document.createElement('ol');
  const id = document.createElement('span');
  const replaceAddContactButton = document.createElement('span');
  const checkDeletion = document.createElement('p');

  const [
    surnameContainer,
    nameContainer,
    lastNameContainer
  ] = Array(3).fill().map((container) => {
    container = document.createElement('div');
    container.classList.add('modal-input-container');
    form.append(container);
    return container;
  });

  const [
    surnameInput,
    nameInput,
    lastNameInput
  ] = Array(3).fill().map((input) => {
    input = document.createElement('input');
    input.classList.add('modal-input');
    input.type = 'text';
    getInputMask(input)
    return input;
  });

  const [
    surnameLabel,
    nameLabel,
    lastNameLabel
  ] = Array(3).fill().map((label) => {
    label = document.createElement('label');
    label.classList.add('modal-input-label');
    return label;
  });

  const [
    addContactButton,
    saveButton,
    cancelButton,
    deleteButton,
    closeButton
  ] = Array(5).fill().map(() => document.createElement('button'));

  id.classList.add('modal-id');
  form.classList.add('modal-form');
  title.classList.add('modal-title');
  addContactContainer.classList.add('modal-add-contact-container');
  allContactsContainer.classList.add('all-contacts-container')
  addContactButton.classList.add('modal-add-contact-button');
  saveButton.classList.add('modal-button');
  deleteButton.classList.add('modal-delete-button');
  cancelButton.classList.add('modal-cancel-button');
  closeButton.classList.add('modal-close-button');
  replaceAddContactButton.classList.add('replace-modal-add-contact-button', 'add-contact-button__hidden');
  checkDeletion.classList.add('check-deletion');

  title.innerText = `${modalTitle}`;
  addContactButton.innerText = `Добавить контакт`;
  saveButton.innerText = 'Сохранить';
  cancelButton.innerText = 'Отмена';
  deleteButton.innerText = 'Удалить клиента';
  surnameLabel.innerText = 'Фамилия';
  nameLabel.innerText = 'Имя';
  lastNameLabel.innerText = 'Отчество';
  replaceAddContactButton.innerText = 'Достигнуто максимальное количество контактных данных';
  checkDeletion.innerText = 'Вы действительно хотите удалить данного клиента?';
  closeButton.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.2333 1.73333L15.2666 0.766664L8.49991 7.53336L1.73324 0.766696L0.766576 1.73336L7.53324 8.50003L0.766603 15.2667L1.73327 16.2333L8.49991 9.46669L15.2666 16.2334L16.2332 15.2667L9.46657 8.50003L16.2333 1.73333Z" fill=""/></svg>`;

  addContactButton.type = 'button';
  errorsContainer.id = 'errorsContainer_ID';
  allContactsContainer.id = 'allContactsContainer_ID';
  surnameInput.id = 'surnameInput_ID';
  nameInput.id = 'nameInput_ID';
  lastNameInput.id = 'lastNameInput_ID';
  surnameLabel.setAttribute('for', 'surname');
  nameLabel.setAttribute('for', 'name');
  lastNameLabel.setAttribute('for', 'lastName');
  saveButton.setAttribute('formnovalidate', '');

  surnameContainer.append(surnameInput, surnameLabel)
  nameContainer.append(nameInput, nameLabel)
  lastNameContainer.append(lastNameInput, lastNameLabel)
  addContactContainer.append(allContactsContainer, addContactButton)
  form.append(addContactContainer, errorsContainer, saveButton);
  addContactContainer.append(replaceAddContactButton)

  // ! action for edit client

  if (value) {
    id.innerText = 'ID: ' + value.id;
    surnameInput.value = value.surname;
    nameInput.value = value.name;
    lastNameInput.value = value.lastName;
    getModal(deleteButton, 'Удалить клиента', value)

    value.contacts.forEach(contact => {
      getNewContact(
        addContactButton,
        allContactsContainer,
        modalWindow,
        addContactContainer,
        replaceAddContactButton,
        contact.type,
        contact.value
      );
    });

    getFormValidation(form, title, value, modalContainer, modalWindow, { onClose })
  } else getFormValidation(form, title, null, modalContainer, modalWindow, { onClose });

  // ! actions for modal

  onOpen(modalContainer, modalWindow);

  modalContainer.addEventListener('click', (e) => {
    // e.target === modalContainer ||
    e.target === closeButton ||
    e.target === closeButton.querySelector('svg') ||
    e.target === closeButton.querySelector('path') ||
    e.target === cancelButton ?
    onClose(modalContainer, modalWindow) : false;
  });

  const inputs = form.querySelectorAll('.modal-input');

  inputs.forEach(input => {
    input.value.length ?
    input.nextElementSibling.classList.add('input-label-transform') : false;

    input.onblur = () => !input.value.length ?
    input.nextElementSibling.classList.remove('input-label-transform') : false;

    input.onfocus = () => input.nextElementSibling.classList.add('input-label-transform');
  });

  addContactButton.addEventListener('click', () => {
    getNewContact(
      addContactButton,
      allContactsContainer,
      modalWindow,
      addContactContainer,
      replaceAddContactButton,
    );
  });

  return {
    modalWindow,
    modalContainer,
    title,
    form,
    cancelButton,
    deleteButton,
    closeButton,
    id,
    saveButton,
    checkDeletion,
    errorsContainer
  };
};

function getNewContact(
  addContactButton,
  allContactsContainer,
  modalWindow,
  addContactContainer,
  replaceAddContactButton,
  contactType,
  contactValue
) {

  const [
    container,
    select,
    selectHead,
    selectBody
  ] = Array(4).fill().map(() => document.createElement('div'));

  const [
    telephoneOption,
    additionalTelephoneOption,
    emailOption,
    vkOption,
    facebookOption,
    instagramOption,
    twitterOption,
    okOption,
    myWorldOption,
    linkedinOption
  ] = Array(10).fill().map(option => {
    option = document.createElement('div');
    option.classList.add('contact__option');
    selectBody.append(option);
    return option;
  })

  const input = document.createElement('input');
  const deleteButton = document.createElement('button');
  const deleteButtonContainer = document.createElement('div');
  const tooltip = getTooltip('Удалить контакт').tooltip

  const MAX_CONTACT_CONTAINERS = 10;
  const WIDTH_CONTACT_CONTAINER = 52;
  const TIMEOUT_1MS = 1;
  const TIMEOUT_200MS = 200;

  container.classList.add('contact__container');
  select.classList.add('contact__select');
  selectHead.classList.add('contact__select-head');
  selectBody.classList.add('contact__select-body');
  input.classList.add('add-contact__input');
  deleteButtonContainer.classList.add('contact__delete-button_container');
  deleteButton.classList.add('contact__delete-button');

  telephoneOption.innerText = 'Телефон';
  additionalTelephoneOption.innerText = 'Доп. телефон';
  emailOption.innerText = 'Email';
  vkOption.innerText = 'Vk';
  facebookOption.innerText = 'Facebook';
  instagramOption.innerText = 'Instagram';
  twitterOption.innerText = 'Twitter';
  okOption.innerText = 'Ok';
  myWorldOption.innerText = 'Мой Мир';
  linkedinOption.innerText = 'LinkedIn';
  deleteButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill=""/></svg>`;
  selectHead.innerText = contactType || selectBody.childNodes[0].innerText;

  input.placeholder = 'Введите данные контакта';
  deleteButton.type = 'button';

  deleteButtonContainer.append(deleteButton, tooltip)
  select.append(selectHead, selectBody);
  container.append(select, input, deleteButtonContainer);
  allContactsContainer.append(container);

  // ! actions for new contact

  const checkedSelectBody = () => selectBody.childNodes.forEach(option => {
    selectHead.innerText === option.innerText ?
      option.classList.add('d-none') : option.classList.remove('d-none');
  });

  const checkedSelectHead = () => {
    input.value = '';
    input.removeAttribute('maxlength');
    input.removeAttribute('data-url');

    selectHead.innerText === 'Телефон' || selectHead.innerText === 'Доп. телефон' ?
      input.setAttribute('maxlength', '18') & (input.type = 'tel') : input.type = 'url';

    selectHead.innerText === 'Email' ?
      input.type = 'email' : false;

    selectHead.innerText === 'Vk' ? input.dataset.url = 'vk.com' :
    selectHead.innerText === 'Facebook' ? input.dataset.url = 'facebook.com' :
    selectHead.innerText === 'Instagram' ? input.dataset.url = 'instagram.com' :
    selectHead.innerText === 'Twitter' ? input.dataset.url = 'twitter.com' :
    selectHead.innerText === 'Ok' ? input.dataset.url = 'ok.ru' :
    selectHead.innerText === 'Мой Мир' ? input.dataset.url = 'my.mail.ru' :
    selectHead.innerText === 'LinkedIn' ? input.dataset.url = 'linkedin.com' : false
  };

  checkedSelectBody();
  checkedSelectHead();

  allContactsContainer.childNodes.length === MAX_CONTACT_CONTAINERS ?
    addContactButton.classList.add('add-contact-button__hidden') &
    replaceAddContactButton.classList.remove('add-contact-button__hidden') : false;

  allContactsContainer.style.height = +allContactsContainer.style.height.replace('px', '') + WIDTH_CONTACT_CONTAINER + 'px';
  setTimeout(() => container.classList.add('opacity'), TIMEOUT_1MS);

  allContactsContainer.childNodes ?
    (addContactButton.style.marginTop = '10px') & (addContactContainer.style.padding = '25px 0') : false;

  modalWindow.addEventListener('click', (e) => {
    e.target === selectHead ?
      selectBody.classList.toggle('select-body_active') & selectHead.classList.toggle('select-head_arrow-open') :
      selectBody.classList.remove('select-body_active') & selectHead.classList.remove('select-head_arrow-open');
  });

  selectBody.addEventListener('click', (e) => {
    if (e.target === selectBody) return;
    selectHead.innerText = e.target.innerText;
    checkedSelectBody();
    checkedSelectHead();
  });

  deleteButton.addEventListener('click', () => {
    container.classList.remove('opacity');
    const action = () => {
      allContactsContainer.style.height = +allContactsContainer.style.height.replace('px', '') - WIDTH_CONTACT_CONTAINER + 'px';

      container.remove();

      allContactsContainer.childNodes.length === 0 ?
        (addContactContainer.style.padding = '8px 0') & (addContactButton.style.marginTop = '0px') : false;

      allContactsContainer.childNodes.length < MAX_CONTACT_CONTAINERS ?
        addContactButton.classList.remove('add-contact-button__hidden') &
        replaceAddContactButton.classList.add('add-contact-button__hidden') : false;
    };

    setTimeout(action, TIMEOUT_200MS)
  });

  getInputMask(input);

  contactValue ? input.value = contactValue : false;

};

function getInputMask(input) {
  input.addEventListener('input', (e) => {
    input.classList.remove('error-validate');

    if (input.type === 'tel') {
      const value = input.value.replace(/\D/g, '');
      const firstNumber = value[0] === '9' ? '+7 (9' : '+7';
      let formattedValue = '';

      if (['7', '8', '9'].includes(value[0])) {
        formattedValue = firstNumber + ' ';

        value.length > 1 ? formattedValue += '(' + value.substring(1, 4) : false;
        value.length >= 5 ? formattedValue += ') ' + value.substring(4, 7) : false;
        value.length >= 8 ? formattedValue += '-' + value.substring(7, 9) : false;
        value.length >= 10 ? formattedValue += '-' + value.substring(9, 11) : false;

      } else formattedValue = '+' + value.substring(0, 16);

      if (input.value.length !== input.selectionStart) {
        e.data && /\D/g.test(e.data) ? input.value = formattedValue : false;
        value.length > 10 ? input.value = formattedValue : false;
        return;
      };

      input.value = formattedValue;

      !value ? input.value = '' : false;
    };

    if (input.type === 'url') {
      const value = input.value.trim().toLowerCase().replace(/[^a-zа-я\-_:?%.\d/]/g, '');
      let formattedValue = value;

      input.value[0] === '/' ? formattedValue = input.dataset.url + '/' : false;

      /\w\//.test(formattedValue) ? formattedValue = formattedValue.replace(/(https?:\/\/)|(www\.)/g, '') : false;

      input.value = formattedValue;
    };

    if (input.type === 'text') {
      const value = input.value ?
        input.value[0].toUpperCase().replace(/[\-\s]/i, '') + input.value.slice(1).toLowerCase() : '';

      let formattedValue = value.replace(/[^а-яa-z\-\s]/gi, '');
          formattedValue = formattedValue.replace(/[\s\-]{2}/, (match) => `${match[1]}`);

      input.value = formattedValue.replace(/[\s\-].?/g, str => str.toUpperCase());
    };
  });

  // ! events 'keydown' & 'paste' for mask input type = 'tel'

  const getInputTelephoneMaskHelper = (input) => {
    input.addEventListener('keydown', (e) => {
      if (input.type === 'tel') {
        e.key === 'Backspace' && input.value.replace(/\D/g, '').length < 2 ?
          input.value = '' : false;
        e.key === '+' && input.value.replace(/\D/g, '').length === 0 ?
          input.value = '7' : false;
      };
    });

    input.addEventListener('paste', (e) => {
      if (input.type === 'tel') {
        const pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
          const pastedText = pasted.getData('Text');
          /\D/g.test(pastedText) ? input.value = input.value.replace(/\D/g, '') : false;
        };
      };
    });
  };

  getInputTelephoneMaskHelper(input);

};

function getFormValidation(form, title, value = null, modalContainer, modalWindow, { onClose }) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = form.getElementsByTagName('input');
    const input = [...inputs];

    clearErrors();

    input.forEach(input => {
      input.classList.remove('error-validate');
      input.value = input.value.trim().replace(/\/$/, '');

      if (input.type === 'text') {
        input.value.length === 1 ? getError(input, 'не может содержать менее 2 символов') :
        input.value.length > 32 ? getError(input, 'не может содержать более 32 символов') :
        /^.?(\-|\s).?|.?(\-|\s).?$/.test(input.value) ? getError(input, 'перед и после дефиса или пробела не может быть менее 2 символов') :
        /(?=(.))\1{3,}/gi.test(input.value) ? getError(input, 'не может содержать 3 или более повторяющихся символов подряд') :
        !input.value & (input.id === 'surnameInput_ID' || input.id === 'nameInput_ID') ? getError(input, 'это поле обязательно для заполнения') : false;
      };

      if (input.type === 'tel') {
        input.value && input.value.match(/\d/g).length < 11 ? getError(input, 'должен содержать минимум 11 цифр') :
        /\+[0-689]/.test(input.value) ? getError(input, 'с любым кодом страны кроме +7 не принимается') :
        !input.value ? getError(input, 'поле не может быть пустым') : false;
      };

      if (input.type === 'url') {
        const regExp = new RegExp(`\^${input.dataset.url + '/'}\.{2}`);
        !input.value ? getError(input, 'поле не может быть пустым') :
        !regExp.test(input.value) ? getError(input, `некорректная ссылка на профиль (пример: ${input.dataset.url}/ваш_id)`) : false;
      };

      if (input.type === 'email') {
        !input.value ? getError(input, 'поле не может быть пустым') :
        !/[-\w]{2,}@[-\w\.]{2,10}\.[\w]{2,10}/.test(input.value) ? getError(input, 'некорректный почтовый адрес (пример: mail@mail.ru)') :
        input.value.length > 256 ? getError(input, 'поле не может содержать более 256 символов') : false;
      };
    });

    if (errorsContainer_ID.innerHTML === '') {
      title.innerText === 'Новый клиент' ? createClient(getClientData) : false;
      title.innerText === 'Изменить данные' ? editClient(getClientData, value.id) : false;
    };

    errorsContainer_ID.innerHTML === '' ?
      history.replaceState(null, null, ' ') & onClose(modalContainer, modalWindow) : false

  });
};

function getClientData() {
  const contactsData = () => {
    const contactsArr = [...allContactsContainer_ID.getElementsByTagName('input')];

    return contactsArr.reduce((acc, input) => {
      const label = input.previousSibling.querySelector('.contact__select-head');

      acc.push({
        type: label.innerText,
        value: input.value
      });
      return acc;
    }, []);
  };

  let data = {
    name: nameInput_ID.value,
    surname: surnameInput_ID.value,
    lastName: lastNameInput_ID.value,
    contacts: contactsData(),
   };

  return data;
};

export { getModalContent };