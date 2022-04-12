import { getHeader, getClientsTable, getMain, getAddClientButton } from './app/markup.js';
import { loadClients } from './app/api.js';
import { getModal, getEditClientModal } from './app/modal.js';
import { getSortClients } from './app/sort.js'
import { getSearchClient } from './app/search.js';

(async function createApp() {
  const header = getHeader();
  const main = getMain();
  const clientsList = getClientsTable();
  const addClient = getAddClientButton();

  document.body.append(header);
  document.body.append(main);
  main.append(clientsList.tableContainer);
  main.append(addClient.button);

  await loadClients();

  getSortClients()
  getEditClientModal();
  getSearchClient()

  getModal(addClient.button, 'Новый клиент');
})();
