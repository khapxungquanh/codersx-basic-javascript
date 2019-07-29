/**
 * Viết hàm diff trả về số ngày chênh lệch giữa 2 ngày bất kì
 */
var moment = require('moment');

function diff(fromDate, toDate) {
	return moment(toDate).diff(moment(fromDate), 'days');
}

var start = new Date('2018/05/17');
var end = new Date();

console.log(diff(start, end) + ' days');