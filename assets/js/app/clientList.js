import { getDate } from './date.js';
import { getTooltip } from './tooltip.js';
import { getModal } from './modal.js';

function getClientList(data) {
  tableBody_ID.innerHTML = '';

  data.forEach(value => {
    const id = value.id;
    const name = value.name;
    const surname = value.surname;
    const lastName = value.lastName;
    const contacts = value.contacts;
    const createdAt = value.createdAt;
    const updatedAt = value.updatedAt;
    const clientData = getClient(id, name, surname, lastName, contacts, createdAt, updatedAt, value)

    tableBody_ID.append(clientData.clientLine)
  });
}

function getClient(id, name, surname, lastName, contacts, createdAt, updatedAt, value) {
  const clientLine = document.createElement('tr');
  const editClientButton = document.createElement('a');
  const deleteClientButton = document.createElement('button');
  const [
    idColumn,
    fullNameColumn,
    createdAtColumn,
    updatedAtColumn,
    contactsColumn,
    actionColumn
  ] = Array(7).fill('').map(element => {
    element = document.createElement('td');
    element.classList.add('client__cell');
    return element;
  });

  editClientButton.classList.add('client-button', 'edit__client-button');
  deleteClientButton.classList.add('client-button', 'delete__client-button');
  clientLine.classList.add('client__line');

  idColumn.innerText = id;
  fullNameColumn.innerText = `${surname} ${name} ${lastName}`;
  editClientButton.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 10.5002V13.0002H2.5L9.87333 5.62687L7.37333 3.12687L0 10.5002ZM11.8067 3.69354C12.0667 3.43354 12.0667 3.01354 11.8067 2.75354L10.2467 1.19354C9.98667 0.933535 9.56667 0.933535 9.30667 1.19354L8.08667 2.41354L10.5867 4.91354L11.8067 3.69354Z" fill=""/>
  </svg>Изменить`;
  deleteClientButton.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill=""/>
  </svg>Удалить`;

  editClientButton.href = `\#id=${value.id}`

  createdAtColumn.append(getDate(createdAt));
  updatedAtColumn.append(getDate(updatedAt));
  actionColumn.append(editClientButton, deleteClientButton)

  clientLine.append(
    idColumn,
    fullNameColumn,
    createdAtColumn,
    updatedAtColumn,
    contactsColumn,
    actionColumn
  );

  contactsItems(contacts, contactsColumn);
  contactsItemsHiddenButton(contactsColumn);

  getModal(deleteClientButton, 'Удалить клиента', value)

  setTimeout(() => clientLine.classList.add('opacity-client'), 1)

   return {
    clientLine
  };
}

function contactsItems(contacts, contactsColumn) {
  const MAX_VISIBLE_CONTACT_ICONS = 4;

  contacts.length > 0 ? contacts.forEach((contact, index) => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    const icon = document.createElement('img');

    container.classList.add('container__contact');
    button.classList.add('contact-button', 'opacity-07');
    icon.classList.add('icon-img');

    contact.type === 'Vk' ?
      icon.src = './assets/img/vk.svg' :
    ['Телефон', 'Доп. телефон'].includes(contact.type) ?
      icon.src = './assets/img/phone.svg' :
    contact.type === 'Facebook' ?
      icon.src = './assets/img/fb.svg' :
    contact.type === 'Email' ?
      icon.src = './assets/img/mail.svg' : (icon.src = './assets/img/other.svg');

    ['Телефон', 'Доп. телефон', 'Email'].includes(contact.type) ?
      container.append(button, getTooltip(contact.value).tooltip) :
      container.append(button, getTooltip(contact.type + ': ', contact.value).tooltip);

    button.append(icon);
    contactsColumn.append(container)

    if (index >= MAX_VISIBLE_CONTACT_ICONS) {
      button.classList.add('d-none');
      button.classList.remove('opacity-07');
    }

  }) : false;
}

function contactsItemsHiddenButton(contactsColumn) {
  const hiddenIconsButton = document.createElement('button');
  const contactButtons = contactsColumn.querySelectorAll('button');
  const TIMEOUT_100MS = 100;
  const TIMEOUT_1MS = 1;
  const MAX_VISIBLE_CONTACT_ICONS = 4;

  hiddenIconsButton.classList.add('d-none', 'opacity-07')

  if (contactButtons.length > MAX_VISIBLE_CONTACT_ICONS) {
    hiddenIconsButton.classList.add('hidden-icons', 'contact-button');
    hiddenIconsButton.innerText = `+${contactButtons.length - MAX_VISIBLE_CONTACT_ICONS}`;
    hiddenIconsButton.classList.remove('d-none');
    contactsColumn.append(hiddenIconsButton);
  }

  hiddenIconsButton.addEventListener('click', () => {
    hiddenIconsButton.classList.add('d-none');
    contactButtons.forEach((contact) => {
      contact.classList.add('d-none');
      contact.classList.remove('opacity-07')
      setTimeout(() => contact.classList.remove('d-none'), TIMEOUT_1MS);
      setTimeout(() => contact.classList.add('opacity-07'), TIMEOUT_100MS);
    });
  });
}

export { getClientList }