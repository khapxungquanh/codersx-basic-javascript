/**
 * Thiết kế database cho 1 hệ thống quản lý thư viện sách, cho biết thư viện này có hàng trăm giá sách khác nhau, sách được để ở bất kì giá nào không theo danh mục nào.
 * Mỗi cuốn sách có 1 mã khác nhau.
 * Hệ thống cho phép đăng ký người dùng mới, một người có thể mượn nhiều sách khác nhau trong một khoảng thời gian hữu hạn.
 * Hệ thống có thể lưu lịch sử ai đã mượn sách nào, bắt đầu mượn từ bao lâu, trả lúc nào.
 * Hệ thống có lưu lại số ngày quá hạn tổng cộng của 1 người dùng, ví dụ sách A quá 2 ngày, sách B quá 3 ngày -> tổng 5 ngày
 */

var fs = require('fs');
var readlineSync = require('readline-sync');

// defines
var caseData;
var bookData;

main();

function main() {
	console.log('-------------------------------------');
	console.log('[Thư viện] > [Menu chính]\n\
* Librarian: Chào bạn, bạn cần gì hok ạ?\n\
	1. Xem sách trong thư viện\n\
	2. Sách bạn mượn\n\
	3. Quản lý sách (Staff Only)\n\
	4. Exit');
	var answer = readlineSync.question('* Nhập lựa chon của bạn (1-3): ');
	while (answer < 1 || answer > 4) {
		answer = readlineSync.question('* Bạn vừa chọn một tùy chọn không hợp lệ, hãy nhập lại (1..3): ');
	}

	loadDatabase()
		.then(function() {
			if (answer == 1) showBookCases();
			else if (answer == 2) console.error('Tùy chọn hiện tại không có sẵn'), main();
			else if (answer == 3) manageBooks();
		});

	return 1;
}
// Menu
function showBookCases() {
	console.log('Librarian: Chào mừng bạn đến kho sách, hãy chọn cho mình một ngăn sách:');
	for(i in caseData) {
		console.log(caseData[i].id + '. ' + caseData[i].name);
	}
}
// Async fnc
async function loadDatabase() {
	console.log('Loading database...');
	caseData = await loadFile('./cases.json');
	bookData = await loadFile('./books.json');
}
function loadFile(path) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path, {encoding: 'utf8'}, function(error, data) {
			if(error) reject(error);
			else {
				// console.log('[loadFile] ' + path + ' successfully loaded.');
				var out = JSON.parse(data);
				// console.log('[DATA OUT]\n', out);
				resolve(out);
			}
		});
	});
}