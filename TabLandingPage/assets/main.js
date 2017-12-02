// JS for DevTab Landing Page

function dlOptions() {
  const dlButton = document.getElementsByClassName('downloadLink')[0];
  const dlPopUp = document.getElementsByClassName('download-pop-up')[0];

  dlButton.onclick = () => {
    dlPopUp.style.display = 'block';
  };

  document.addEventListener('click', (event) => {
    const linkClicked = dlButton.contains(event.target);
    if (!linkClicked && event.target !== document.getElementsByClassName('dl-links')[0]) {
      dlPopUp.style.display = 'none';
    }
  });
}

window.onload = () => {
  dlOptions();
};
