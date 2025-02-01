const container = document.querySelector('.details');
const expandAllButton = container.querySelector('#expandAll');
const collapseAllButton = container.querySelector('#collapseAll');
const details = container.querySelectorAll('details');

expandAllButton.addEventListener('click', () => {
  for (const detail of details) {
    detail.open = true;
  }
});

collapseAllButton.addEventListener('click', () => {
  for (const detail of details) {
    detail.open = false;
  }
});

for (const detail of details) {
  detail.addEventListener('toggle', () => {
    const hash = detail.open ? `#${detail.id}` : '#';
    history.pushState(null, null, hash);
  });
}

const id = window.location.hash.slice(1);
if (id) {
  const detail = container.querySelector(`#${CSS.escape(id)}`);
  if (detail) detail.open = true;
}
