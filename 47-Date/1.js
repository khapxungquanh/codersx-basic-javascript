/**
 * Viết hàm isWeekend nhận vào 1 ngày dưới dạng string YYYY/MM/DD trả về true nếu ngày đó là 1 ngày cuối tuần (Thứ 7 hoặc Chủ Nhật), ngược lại trả về false
 */
var moment = require('moment');

function isWeekend(dateString) {
	var weekDay = moment(dateString, "YYYY/MM/DD").isoWeekday();
	// console.log(dateString, weekDay);
	if(weekDay === 6 || weekDay === 7) return true;
	return false;
}

console.log(isWeekend('2018/09/08'));
console.log(isWeekend('2018/09/07'));
// console.log(isWeekend('2019/07/28'));