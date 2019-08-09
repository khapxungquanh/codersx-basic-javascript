/**
 * Thiết kế database cho 1 hệ thống quản lý thư viện sách, cho biết thư viện này có hàng trăm giá sách khác nhau, sách được để ở bất kì giá nào không theo danh mục nào.
 * Mỗi cuốn sách có 1 mã khác nhau.
 * Hệ thống cho phép đăng ký người dùng mới, một người có thể mượn nhiều sách khác nhau trong một khoảng thời gian hữu hạn.
 * Hệ thống có thể lưu lịch sử ai đã mượn sách nào, bắt đầu mượn từ bao lâu, trả lúc nào.
 * Hệ thống có lưu lại số ngày quá hạn tổng cộng của 1 người dùng, ví dụ sách A quá 2 ngày, sách B quá 3 ngày -> tổng 5 ngày
 */

// non-header plugin
const
	fs = require('fs'),
	readlineSync = require('readline-sync'),
	moment = require('moment'),
	{ table } = require('table'),
	MAX_CASES = 100;


// defines
const
	errorInput = 'Tùy chọn bạn đã nhập không hợp lệ',
	userPath = './users.json',
	bookPath = './books.json',
	casePath = './cases.json',
	loanBookPath = './loanbooks.json';

var
	userData, caseData, bookData, loanBooksData,
	caseIDToIndex = new Array(MAX_CASES),
	bookIdToIndex = new Array(MAX_CASES * 50),
	isPlayerLogin = false,
	loginAttempt = 3,
	userID; // Array index, not JSON ID

// main
main();
function main() {
	showEasyGUITitle('Trang chủ');
	if (!isPlayerLogin) {
		loadDatabase()
			.then(function () {
				var answer = readlineSync.question('Bạn chưa đăng nhập, bạn có thể đăng ký tài khoản mới hoặc đăng nhập với tài khoản đã tạo.\
				\n1. Đăng nhập\n2. Đăng ký\n> ');

				if (answer == 1) login();
				else if (answer == 2) register();
				else console.log('Exiting...');
			});
	} else {
		// console.log(userID);
		var a = (userData[Number(userID)].name).split(' ');
		console.log('Loli: Em chào ', a[a.length - 1] + '-nii chan, hãy trao cho em!');
		var answer = readlineSync.question('1. Vào thư viện\n2. Truyện anh mượn\n3. Đăng xuất\n> ' + a[a.length - 1] + ': ');
		switch (answer) {
			case '1':
				console.log('Loli: Onii-chan~ đã vào thư viện, mời anh chọn tủ sách ạ.');
				showBookCases();
				break;
			case '2':
				myLoanBooks();
				break;
			case '3':
				console.log('Anh đã đăng xuất thành công!');
				isPlayerLogin = false;
				login();
				break;
			default:
				console.log('Exiting..')
		}
	}
}

// generator functions
function User(id, name, username, password) {
	this.id = id;
	this.name = name;
	this.username = username;
	this.password = password;
}
function Case(id, name) {
	this.id = id;
	this.name = name;
}
function Book(id, name, ncase, available) {
	this.id = id;
	this.name = name;
	this.case = ncase;
	this.available = available;
}
function LoanBook(id, days, playerid, date = moment()) {
	this.id = id;
	this.playerid = playerid;
	this.days = days; // day to return book back
	this.date = date;
}

// register
function register() {
	console.log('Chào bạn, hãy điền các thông tin theo yêu cầu để đăng ký tài khoản');
	var name, username, password;

	name = readlineSync.question('> Họ và tên: ');
	username = readlineSync.question('> Tài khoản: ');

	while (isAccountExist(username)) {
		username = readlineSync.question('> Tài khoản bạn chọn đã có người đặt, chọn cái khác:');
	}

	password = readlineSync.question('> Mật khẩu: ');

	while (password.length < 3) {
		password = readlineSync.question('> Mật khẩu cần tối thiếu 3 ký tự: ');
	}

	console.log('Đăng ký thành công.');
	var id = getEmptyID();
	userData.push(new User(id, name, username, password));

	saveData();
	// console.log(userData);
	return 1;
}
function isAccountExist(username) {
	for (var i of userData) {
		if (i.username === username) return true;
	}
	return false;
}
function getEmptyID() {
	var i = 1;
	while (true) {
		var x = userData.find(function (obj) {
			return obj.id === i;
		});
		console.log('Debug 1: ' + x);
		if (x !== undefined)++i;
		else {
			break;
		}
	}
	return i;
}
function login() {
	var
		account, password;

	account = readlineSync.question('> Tên người dùng: ');

	var user = userData.find(function (x, index) {
		userID = index;
		return x.username === account;
	});
	if (user === undefined) {
		console.log('Tài khoản của bạn chưa được đăng ký, hãy đăng ký.');
		console.log('[Bạn được chuyển đến trang Đăng ký]');
		register();
		return;
	}

	do {
		password = readlineSync.question('> Mật khẩu: ');
		if (--loginAttempt === 0) {
			console.log('Bạn đã hết số lần thử đăng nhập lại.');
			break;
		}
		else {
			if (password === user.password) {
				console.log('Đăng nhập thành công.\n[Bạn được chuyển đến trang chủ]');
				isPlayerLogin = true;
				main();
			} else {
				console.log('Mật khẩu không chính xác. Bạn còn ' + loginAttempt + ' lần thử đăng nhập lại.');
			}
		}
	}
	while (!isPlayerLogin);
}
// Menu
function showBookCases() {
	showEasyGUITitle('Danh sách các tủ sách hiện có');
	var a = (userData[userID].name).split(' ');
	// for (i in caseData) {
	// 	console.log(caseData[i].id + '. ' + caseData[i].name);
	// }
	console.log(table(
		caseData.map(function(value, index) {
			return [value.id, value.name];
		})
	));
	var answer = readlineSync.question('> ');
	while (caseData[answer] == undefined) {
		if(answer === 'exit') {
			setTimeout(main, 3000);
			console.log('[Về menu chính sau 3 giây]');
			return;
		}
		answer = readlineSync.question('> (nhập lại) :');
	}

	showCase(Number(answer));
}
function showCase(caseID) {
	var filterBooks = bookData.filter(function (value, index) {
		if (value.case == caseID && value.available == true) return true;
	});
	
	showEasyGUITitle(caseData[idCaseToIndex(caseID)].name);
	filterBooks = filterBooks.map(function (value, index) {
		return [value.id, value.name, caseData[idCaseToIndex(value.case)].name, value.available == true ? 'Có thể mượn' : 'Đã có người mượn'];
	});
	filterBooks.unshift(['ID', 'Tên sách', 'Tủ sách', 'Có sẵn']);
	console.log(table(filterBooks));

	var answer = readlineSync.question('> Hãy nhập ID của sách (hoặc nhập exit để trở về menu): \n> ');

	while (!isBookExist(answer) || bookData[idBookToIndex(Number(answer))].case != caseID) {
		if(answer === 'exit') {
			main();
		}
		answer = readlineSync.question('> ID của sách không hợp lệ, xin hãy nhập lại (hoặc nhập exit để  về menu): \n> ');
	}
	showBook(Number(answer));
}
function showBook(bookID) {
	var arrayIndex = idBookToIndex(bookID);
	showEasyGUITitle('Thông tin sách:');
	console.log('ID: ' + bookData[arrayIndex].id);
	console.log('Tên sách: ' + bookData[arrayIndex].name);
	console.log('Tủ sách: ' + caseData[idCaseToIndex(bookData[arrayIndex].case)].name);
	// console.log(bookData[arrayIndex].available);
	console.log(bookData[arrayIndex].available == true ? 'Tình trạng: Có thể mượn' : 'Tình trạng: Đã có người khác mượn');
	var answer = readlineSync.question('1. Mượn sách\n2. Trở về \n> ');
	if (answer == 1) {
		if (arrayIndex == undefined) {
			console.log('Sách mà bạn chọn không tồn tại hoặc đã được mượn bởi người khác.');
		}
		else {
			var days;
			while(days < 3 || days > 30) {
				days = Number(readlineSync.question('Nhập số  ngày mượn sách (tối thiếu 3 ngày, tối đa 30 ngày):'));
			}
			console.log('Bạn đã mượn thành công cuốn ' + bookData[arrayIndex].name);
			loanBooksData.push(new LoanBook(bookID, days, userData[userID].id));
			bookData[arrayIndex].available = false;
			saveData();
			console.log('[Đang chuyển hướng đến trang chủ trong 1 giây]');
			setTimeout(main, 1000);
		}
	}
	else if (answer == 2) {
		console.log('[Bạn vừa được dịch chuyển về kệ sách ' + caseData[bookData[arrayIndex].case].name + ']');
		showCase(bookData[arrayIndex].case);
	}
	else {
		main();
	}
}
function isBookExist(bookID) {
	// console.log(bookData[idBookToIndex(bookID)]);
	var test = bookData.find(function(value, index) {
		return value.id == bookID;
	});
	return (bookData[idBookToIndex(bookID)] == undefined || test == undefined) ? false : true;
}
function idBookToIndex(id) {
	return bookIdToIndex[id];
}
function idCaseToIndex(id) {
	return caseIDToIndex[id];
}

// Loan book
function myLoanBooks() {
	var loanList = loanBooksData.filter(function (value) {
		// console.log(value);
		return value.playerid == userData[userID].id;
	})
		.map(function (value, index) {
			return [
				value.id,
				bookData[idBookToIndex(value.id)].name,
				moment(value.date).format('MMMM Do YYYY, h:mm:ss a'),
				moment.duration(moment(value.date).diff(moment(), 'days')) + ' ngày'
			];
		});
	// console.log(typeof(loanList));
	loanList.unshift(['ID', 'Tên sách', 'Ngày mượn', 'Số ngày đã qua']);
	// console.log(loanList);
	console.log(table(loanList));
	var answer, index;
	do {
		if(index == undefined) answer = readlineSync.question('> Nhập lại ID sách (hoặc exit để thoát): ');
		if(answer == 'exit') return main();
		loanList.find(function(value, ind) {
			if(value.id == answer) {
				index = value.id;
				return true;
			}
		});
	}
	while (isNaN(answer) || !isBookExist(answer) || bookData[idBookToIndex(answer)].available == true);
	// console.log(index);
	// vaild
	showEasyGUITitle(bookData[idBookToIndex(answer)].name);
	console.log('1. Trả sách\n2. Trở về');
	var answer2 = readlineSync.question('> ');
	if(answer2 == '1') {
		console.log('Bạn đã trả sách thành công.');
		
		var loanBookIndex;
		loanBooksData.find(function(value, index) {
			if(value.id == loanList[index].id) {
				loanBookIndex = index;
				return true;
			};
		});
		loanBooksData.splice(loanBookIndex, 1);

		bookData[idBookToIndex(answer)].available = true;

		saveData();
		
		myLoanBooks();
	}
	else {
		main();
	}
}
// Async fnc
async function loadDatabase() {
	console.log('Loading database...');

	userData = await loadDataFromFile(userPath);
	caseData = await loadDataFromFile(casePath);
	bookData = await loadDataFromFile(bookPath);
	loanBooksData = await loadDataFromFile(loanBookPath);

	// Enable prototype for user, case, book, pendingbook 
	userData = userData.map(function (value, index) {
		return new User(value.id, value.name, value.username, value.password);
	});
	caseData = caseData.map(function (value, index) {
		caseIDToIndex[value.id] = index;
		return new Case(value.id, value.name);
	});
	bookData = bookData.map(function (value, index) {
		// save in mask array
		bookIdToIndex[value.id] = index;
		return new Book(value.id, value.name, value.case, value.available);
	});
	loanBooksData = loanBooksData.map(function (value, index, array) {
		return new LoanBook(value.id, value.days, value.playerid, value.date);
	});

	// console.log(userData, caseData, bookData, loanBooksData);
}
function loadDataFromFile(path) {
	return new Promise(function (resolve, reject) {
		fs.readFile(path, { encoding: 'utf8' }, function (error, data) {
			if (error) reject(error);
			else {
				var out = JSON.parse(data);
				resolve(out);
			}
		});
	});
}
function saveData() {
	fs.writeFileSync(userPath, JSON.stringify(userData, null, 4), { encoding: 'utf8' });
	fs.writeFileSync(casePath, JSON.stringify(caseData, null, 4), { encoding: 'utf8' });
	fs.writeFileSync(bookPath, JSON.stringify(bookData, null, 4), { encoding: 'utf8' });
	fs.writeFileSync(loanBookPath, JSON.stringify(loanBooksData, null, 4), { encoding: 'utf8' });
}
// Some other functions
function ClearScreen(number = 20) {
	for (var i = 0; i < number; i++) {
		console.log('');
	}
}
function showEasyGUITitle(msg) {
	ClearScreen(5);
	// console.log('\t------------------------------');
	// console.log('\t' + msg);
	console.log(table([[msg]],
		{
			singleLine: true,
			columns: {
				0: {
					alignment: 'center',
					width: 60
				}
			}
		}
	));
}