/**
 * Sử dụng node co + axios để tải về các đường link sau theo 2 cách:
*/
var co = require('co');
var axios = require('axios');

var urls = [
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/2',
    'https://jsonplaceholder.typicode.com/todos/3',
    'https://jsonplaceholder.typicode.com/todos/4',
    'https://jsonplaceholder.typicode.com/todos/5'
  ];

function loadUrl(url) {
  return new Promise(function(resolve, reject) {
    axios.get(url)
      .then(function(response) {
        resolve(response.data);
      })
      .catch(function(error) {
        reject(error);
      });
  })
}
// Cách 1: Sử dụng vòng lặp for

co(function*() {
  var values = [];
  for(var i of urls) {
    values.push(yield loadUrl(i));
  }
  console.log(values);
  return values;
});

// Cách 2: Sử dụng array.map
// Gợi ý: Có thể yield 1 array các Promise

// var loadUrls = co.wrap(function*(urls) {
//   var values = yield urls.map(function(url) {
//     return loadUrl(url);
//   });
//   console.log(values);
//   return values;
// })

// loadUrls(urls);