import { dataBase } from './api.js';

function getSearchDropDownList() {
  const dropDownContainer = document.createElement('div');
  const dropDownList = document.createElement('ul');

  dropDownContainer.classList.add('search__drop-down-container', 'hidden');
  dropDownList.classList.add('search__drop-down-list');

  dropDownList.id = 'dropDownList_ID';

  dropDownContainer.append(dropDownList);
  searchContainer_ID.append(dropDownContainer);

  return {
    dropDownContainer
  };
}

function getSearchClient() {
  const dropDownContainer = getSearchDropDownList().dropDownContainer;
  const TIMEOUT_300MS = 300;
  let timeout = null;
  const inputAction = () => {
    inputSearch_ID.value = inputSearch_ID.value.replace(/(^\s)|(\s{2}$)/g, (match, p1, p2) =>
    match === p1 ? p1 = '' : match === p2 ? p2 = ' ' : false);

    if (!inputSearch_ID.value) {
      dropDownContainer.classList.add('hidden');
      dropDownList_ID.innerHTML = '';
      dropDownContainer.style.height = '0';
    } else {
      dropDownContainer.classList.remove('hidden');
    }

    const renderSearchDropDownListAction = () => {
      if (inputSearch_ID.value) {
        let filterData = dataBase.filter(f =>
          (f.surname + ' ' + f.name + ' ' + f.lastName).toLowerCase()
          .includes(inputSearch_ID.value.toLowerCase())
        );
        renderSearchDropDownList(filterData, dropDownContainer);
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(renderSearchDropDownListAction, TIMEOUT_300MS)
   };

   inputSearch_ID.addEventListener('input', inputAction);
   inputSearch_ID.addEventListener('blur', () => dropDownContainer.classList.add('hidden'));
   inputSearch_ID.addEventListener('focus', () => {
     dropDownContainer.classList.remove('hidden');
     tableBody_ID.childNodes.forEach(i => i.classList.remove('select-client-background'))
    });

   accessibilitySearchDropDownList(dropDownContainer)
}

function renderSearchDropDownList(filterData, dropDownContainer) {
  const WIDTH_DROPDOWN_CONTAINER = 44;
  dropDownList_ID.innerHTML = '';
  dropDownContainer.style.height = '0';

  filterData.forEach(i => {
    const dropDownItem = document.createElement('li');
    const found = `${i.surname} ${i.name} ${i.lastName}`;
    const preRegExp = inputSearch_ID.value.split('').map(i => i = `${i}\\s*`).join('');
    const regExp = new RegExp(`(?:${preRegExp}\\s*)`, 'gui');
    const entry = found.match(regExp) || '';
    const value = found.replace(`${entry[0]}`, `<b>${entry[0]}</b>`);

    dropDownItem.classList.add('search__drop-down-item');

    dropDownItem.innerHTML = value.replace(/(\s<b>)|(\s<\/b>)/g, (match, p1, p2) =>
      match === p1 ? p1 = `&nbsp;<b>` : match === p2 ? p2 = '&nbsp;</b>' : false);
    dropDownItem.dataset.searchId = i.id;

    dropDownContainer.style.height = +dropDownContainer.style.height.replace('px', '') + WIDTH_DROPDOWN_CONTAINER + 'px';

    dropDownList_ID.append(dropDownItem);

    setTimeout(() => dropDownItem.classList.add('opacity'), 1)
  });
}

function accessibilitySearchDropDownList(dropDownContainer) {
  let indexItem = -1;
  let flagItem = true;
  const dropDownItems = dropDownList_ID.childNodes;
  const deleteSelection = () => dropDownItems.forEach(i => i.classList.remove('select-background'));
  const selectAction = (id) => {
    inputSearch_ID.dispatchEvent(new Event('input'));
    inputSearch_ID.blur();
    dropDownContainer.classList.add('hidden')
    indexItem = -1;
    tableBody_ID.childNodes.forEach(i => {
      if (i.innerHTML.includes(id)) {
        i.classList.add('select-client-background');
        i.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    });
  };

  dropDownList_ID.addEventListener('mouseout', () => {
    indexItem = -1;
    deleteSelection();
  });

  dropDownList_ID.addEventListener('mousemove', (e) => {
    const indexOf = Array.prototype.indexOf.call(e.target.parentElement.children, e.target);

    if (!flagItem) {
      deleteSelection();
      flagItem = true
    }

    if (!e.target.classList.contains('select-background')) {
      e.target.classList.add('select-background');
      indexItem = indexOf;
    }
  });

  inputSearch_ID.addEventListener('keydown', (e) => {
    if (inputSearch_ID.value) {
      if (e.key === 'ArrowDown') {
        deleteSelection();
        indexItem = indexItem + 1;
        indexItem > (dropDownItems.length - 1) ? indexItem = 0 : false;
        dropDownItems[indexItem].classList.add('select-background');
        flagItem = false;
      }

      if (e.key === 'ArrowUp') {
        deleteSelection();
        indexItem = indexItem - 1;
        indexItem < 0 ? indexItem = (dropDownItems.length - 1) : false;
        dropDownItems[indexItem].classList.add('select-background');
        flagItem = false;
      }

      if (e.key === 'Enter') {
        dropDownItems.forEach(i => {
          if (i.classList.contains('select-background')) {
            inputSearch_ID.value = i.textContent.trim();
            selectAction(i.dataset.searchId);
          }
        });
      }
    }
  });

  searchContainer_ID.addEventListener('click', (e) => {
    if (!e.target.closest('.search__drop-down-item')) return;
    inputSearch_ID.value = e.target.textContent.trim();
    selectAction(e.target.dataset.searchId);
  });
}

export { getSearchClient };
