import { getModalContent } from './modalContent.js';
import { deleteClient, dataBase } from './api.js';
import { clearErrors } from './errors.js';

function getModal(button, title, value = null) {
  button.addEventListener('click', () => {
    const modalContent = getModalContent(title, { onOpen, onClose }, value);
    const modalWindow = modalContent.modalWindow;
    const modalContainer = modalContent.modalContainer;

    if (title === 'Новый клиент') {
      modalWindow.append(
        modalContent.title,
        modalContent.form,
        modalContent.cancelButton,
        modalContent.closeButton,
      );
    }

    if (title === 'Удалить клиента') {
      modalWindow.append(
        modalContent.title,
        modalContent.checkDeletion,
        modalContent.errorsContainer,
        modalContent.saveButton,
        modalContent.cancelButton,
        modalContent.closeButton,
      );
      modalContent.errorsContainer.id = 'errorsContainerDeleteModal_ID'
      modalContent.saveButton.innerText = 'Удалить';
      modalContent.saveButton.classList.add('button-deletion');
      modalContent.title.classList.add('d-flex', 'j-content-center');
      modalContent.saveButton.addEventListener('click', () => {
        clearErrors('errorsContainerDeleteModal_ID');
        deleteClient(value.id);
        if(errorsContainerDeleteModal_ID.innerHTML === '') {
          history.replaceState(null, null, ' ');
          onClose(modalContainer, modalWindow);
          document.querySelector('.modal-container').remove();
        }
      });
    }

  });
}

function getEditClientModal() {
  const callModalEditClient = () => {
    const hash = window.location.hash.replace(/\D/gu, '');
    const value = dataBase.find(item => item.id === hash);
    const modalContent = getModalContent('Изменить данные', { onOpen, onClose }, value);
    const modalWindow = modalContent.modalWindow;
    return modalWindow.append(
      modalContent.id,
      modalContent.title,
      modalContent.form,
      modalContent.deleteButton,
      modalContent.closeButton,
    );
  };

  window.location.hash ? callModalEditClient() : false;
  window.addEventListener('hashchange', callModalEditClient);
}

function onOpen(modalContainer, modalWindow) {
  document.body.classList.add('body-fixed');

  const action = () => {

    modalContainer.classList.add('fixed', 'opacity');
    modalWindow.classList.add('scale', 'opacity', 'padding-x-25')
  };

  setTimeout((action), 100);

  modalContainer.append(modalWindow);
  document.body.append(modalContainer);
}

function onClose(modalContainer, modalWindow) {
  document.body.classList.remove('body-fixed');

  modalContainer.classList.remove('opacity');
  modalWindow.classList.remove('scale', 'opacity', 'padding-x-25');

  const action = () => {
    modalContainer.classList.remove('fixed');
    modalContainer.remove()
  };

  setTimeout((action), 400);

  history.replaceState(null, null, ' ');
}

export { getModal, getEditClientModal };