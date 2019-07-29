var moment = require('moment');

/**
 * Tính số ms chênh lệch giữa 2 date object bất kì
 */
function diffMs(a, b) {
	console.log(b.diff(a) + 'ms');
}
// viết ví dụ để kiểm tra
var start = moment([2019, 6, 28]);
var end   = moment([2019, 6, 29]);

diffMs(start, end);