'use strict';

(function getRandomizedPhotoGalleryWithXMLHttpRequest() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://picsum.photos/400');

  xhr.addEventListener('load', () => {
    const img = document.createElement('img');
    img.setAttribute('src', xhr.responseURL);
    document.body.appendChild(img);
  });

  xhr.send();
})();

(function getRandomizedPhotoGalleryWithAxios() {
  axios
    .get('https://picsum.photos/400')
    .then(response => {
      const img = document.createElement('img');
      img.setAttribute('src', response.request.responseURL);
      document.body.appendChild(img);
    })
    .catch(error => console.error(error));
})();

