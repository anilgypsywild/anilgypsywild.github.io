const printButton = document.querySelector('#print-flyer');
printButton.hidden = false;
printButton.addEventListener('click', () => window.print());
