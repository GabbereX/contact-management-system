import { getClientList } from './clientList.js';
import { spin } from './markup.js';
import { dataBase } from './api.js';

function getSortClients() {
  const sort = (key, column) => {
    if (column) {
      column.dataset.sort = key;
      column.classList.toggle('rotate');
    }

    tableHead_ID.childNodes.forEach(item => {
      if (item !== column) {
        item.classList.remove('rotate');
        item.removeAttribute('data-sort');
      }
    });

    tableColumnName_ID.classList.contains('rotate') ?
    (aToZ_ID.style.opacity = '1') & (aToZ_ID.innerText = 'А-Я') :
    (aToZ_ID.style.opacity = '1') & (aToZ_ID.innerText = 'Я-А');

    !tableColumnName_ID.dataset.sort ? aToZ_ID.style.opacity = '0' : false;

    dataBase.sort((prev, next) => {
      if (prev[key] < next[key]) return -1;
      if (prev[key] === next[key]) return 0;
      if (prev[key] > next[key]) return 1;
    });
  };

  sort('id', tableColumnId_ID);
  spin(tableBody_ID);
  setTimeout(() => getClientList(dataBase), 1000);

  tableHead_ID.addEventListener('click', (e) => {
    e.preventDefault();

    if (![tableColumnId_ID, tableColumnName_ID, tableColumnDateCreate_ID, tableColumnDateEdit_ID].includes(e.target)) return;

    tableBody_ID.innerHTML = '';

    if (e.target === tableColumnName_ID) {
      !dataBase[0].fullname ?
        dataBase.forEach(data => data.fullname = (data.surname + data.name + data.lastName).toLowerCase()) : false;
      sort('fullname', e.target);
    }
    e.target === tableColumnId_ID ? sort('id', e.target) : false;
    e.target === tableColumnDateCreate_ID ? sort('createdAt', e.target) : false;
    e.target === tableColumnDateEdit_ID ? sort('updatedAt', e.target) : false;
    !e.target.classList.contains('rotate') ? dataBase.reverse() : false;

    getClientList(dataBase)

  });
}

export {getSortClients}