function getTooltip(value, link = null) {
  const tooltip = document.createElement('div');
  const contactType = document.createElement('span');

  tooltip.classList.add('tooltip');
  contactType.classList.add('tooltip__contact-type');

  tooltip.tabIndex = 0;

  contactType.innerText = value;

  if (link) {
    const linkProfile = document.createElement('a');
    linkProfile.classList.add('tooltip__contact-value');
    linkProfile.href = 'https://' + link;
    linkProfile.target = 'blank';
    linkProfile.innerText = link.replace(/.*\//g, '@');
    linkProfile.innerText.length > 24 ? linkProfile.innerText = link.replace(/.*\//g, '@').substr(0, 24) + '...' : false;
    tooltip.append(contactType, linkProfile)
  } else tooltip.append(contactType);

  return {
    tooltip
  };
}

export { getTooltip };