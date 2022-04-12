import { getError } from './errors.js';
import { getClientList } from './clientList.js'

let dataBase = null;

const url = 'http://localhost:3000/api/clients';

async function loadClients() {
  await fetch(url)
   .then(response => response.json())
   .then(data => dataBase = data)
}

function responseStatus(status, errorMessage, errorContainer = 'errorsContainer_ID') {
  status === 422 || status >= 500 ? getError(null, `Ошибка ${status}! ${errorMessage.errors[0].message}`, errorContainer) : false;
  status === 404 ? getError(null, `Ошибка ${status}! Клиент с таким ID не найден`, errorContainer) : false;
  if (status < 400) {
    renderNewTable();
  }
}

async function renderNewTable() {
  await fetch(url).then(response => response.json()).then(data => dataBase = data)
  getClientList(dataBase)
}

async function createClient(getClientData) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(getClientData()),
    headers: { 'Content-Type': 'application/json' }
  });
  const status = response.status;
  const errorMessage = await response.json()
  responseStatus(status, errorMessage);
}

async function editClient(getClientData, id) {
  const response = await fetch(url + '/' + id, {
    method: 'PATCH',
    body: JSON.stringify(getClientData()),
    headers: { 'Content-Type': 'application/json' }
  });
  const status = response.status;
  const errorMessage = await response.json()
  responseStatus(status, errorMessage);
}

async function deleteClient(id) {
  const response = await fetch(url + '/' + id, {
    method: 'DELETE',
  });
  const status = response.status;
  const errorMessage = await response.json()
  responseStatus(status, errorMessage, 'errorsContainerDeleteModal_ID');
}

export { loadClients, createClient, editClient, deleteClient, dataBase };