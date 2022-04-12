function getDate(fullDate) {
  const dateTime = document.createElement('div');
  const dateSpan = document.createElement('span');
  const timeSpan = document.createElement('span');

  dateSpan.classList.add('date');
  timeSpan.classList.add('time');

  const date = new Date(fullDate)

  const optionsDate = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  };

  const day = date.toLocaleString('ru', optionsDate);

  const optionsTime = {
    hour: 'numeric',
    minute: 'numeric'
  };

  const time = date.toLocaleString('ru', optionsTime);

  dateSpan.innerText = day;
  timeSpan.innerHTML = time;

  dateTime.append(dateSpan, timeSpan);

  return dateTime;
}

export { getDate };