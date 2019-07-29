/**
 * Viết hàm countDown đếm ngược từ x về 0, mỗi lần đếm cách nhau 1s, trả về promise, promise này resolve sau khi đã đếm xong
 */
function countDown(x) {
	console.log(x);
	return new Promise(function (resolve, reject) {
		var clock = setInterval(function () {
			console.log(--x);
			if (x === 0) resolve(), clearInterval(clock);
		}, 1000);
	});
}

function sayHappyNewYear() {
	console.log('Happy new year');
}

countDown(5).then(sayHappyNewYear);