var fs = require('fs');
var axios = require('axios');

// fs.readFile(
//   './data.json', 
//   { encoding: 'utf8'}, 
//   function(err, data) {
//     console.log('Data loaded from disk', data);

//     axios.get('https://jsonplaceholder.typicode.com/todos/1')
//       .then(function(res) {
//         console.log('Data downloaded from url', res.data);
//       });
//   }
// );

/**
 * Sử dụng async await kết hợp với Promise để viết lại đoạn code trên. Gợi ý: Viết lại 1 async function làm 2 việc trên và chạy thử
 */
function readFileFromDisk(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, {encoding: 'utf8'}, function(err, data) {
      if(err === null) {
        var result = JSON.stringify(data);
        resolve(result);
      } else {
        reject(err);
      }
    });
  });
}
function readFileFromUrl(url) {
  return new Promise(function(resolve, reject) {
    axios.get(url)
      .then(function(response) {
        resolve(response.data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
async function readFile() {
  var values = [];
  values.push(await readFileFromDisk('./data.json'));
  values.push(await readFileFromUrl('https://jsonplaceholder.typicode.com/todos/1'));
  return values;
}

readFile()
  .then(function(values) {
    console.log(values);
  })
  .catch(function(error) {
    console.log('Error:', error);
  });