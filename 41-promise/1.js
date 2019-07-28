var request = require('request');

/**
 * Module `request` dùng để tải về 1 đường dẫn nào đó. 
 * Hãy thử chạy code để xem cách hoạt động
 */
console.log('Start fetching...');

// request('https://jsonplaceholder.typicode.com/todos/1', function (error, response, body) {
//   if (error !== null) {
//     console.log('error:', error); // Print the error
//   }
//   console.log('Done:', body);
// });

/**
 * Viết function `load` nhận vào 1 tham số là 1 đường link dạng string, trả về 1 promise sao cho khi gọi:
 * load('some url').then(function(body) {
 *   console.log('Done', body);
 * });
 * thì sẽ hiển thị ra màn hình 'Done' kèm theo nội dung đường link đã truyền vào.
 * Sau 30' không làm được thì có thể lên Slack hỏi
 */
function load(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      if (error === null) {
        resolve(body);
      }
      else {
        reject(error);
      }
    });
  });
}
load('https://jsonplaceholder.typicode.com/todos/1')
  .then(function(result) {
    console.log('Done', result);
  })
  .catch(function(error) {
    console.log('Error', error);
  });

console.log('Nothing');