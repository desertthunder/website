const buttons = document.querySelectorAll('button[data-index]');
const modals = document.querySelectorAll('dialog');
const closeButtons = document.querySelectorAll('dialog button');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const index = button.dataset.index;
    modals[index].showModal();
  });
}


for (const button of closeButtons) {
  button.addEventListener('click', () => {
    for (const modal of modals) {
      if (button.closest('dialog') === modal) {
        modal.close();
      }
    }
  });
}

window.addEventListener('click', event => {
  for (const modal of modals) {
    if (event.target === modal) {
      modal.close();
    }
  }
});
