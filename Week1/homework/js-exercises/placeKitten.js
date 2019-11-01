'use strict';

// One with XMLHttpRequest
const kittenUrl = 'https://wwwww.placekitten.com/api';
function getApiWithXMLHttpRequest(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'json';

  // Log the received data to the console
  // err: null, data: { response: xhr.response, status: xhr.status }
  xhr.onload = () => callback(null, { response: xhr.response, status: xhr.status });

  // Incorporate error handling
  // err: 'There is an error', data : undefined
  xhr.onerror = () => callback('There is an error');
  xhr.send();
}

getApiWithXMLHttpRequest(kittenUrl, (err, data) => {
  if (err) {
    console.error(err); // For client error
  } else {
    if (data.status >= 200 && data.status <= 299) { // Log the received data to the console
      console.log(data.response);
    } else { // For server error      
      console.error('Error (load):', data.response, 'status:', data.status);
    }
  }
});


// One with axios
(function getApiWithAxios() {
  axios
    .get('https://wwwww.placekitten.com/api')
    .then(response => console.log(response.data)) // Log the received data to the console 
    .catch(error => console.log(error)); // Incorporate error handling
})();