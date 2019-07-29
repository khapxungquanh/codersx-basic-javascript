var moment = require("moment");

/**
 * Viết hàm subtractDays trả về 1 ngày trong quá khứ cách ngày được truyền vào n ngày
 */
function subtractDays(date, n) {
	console.log(moment(date).subtract(n, 'days').format("dddd, MMMM Do YYYY, h:mm:ss a"));
}

subtractDays(new Date(), 5);