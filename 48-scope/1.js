var a = 1;

function foo() {
  var a = 2;
  return a;
}

function bar() {
  a = 2;
  return a;
}

foo();
console.log(a); // Kết quả = 1
bar();
console.log(a); // Kết quả = 2
// Giải thích vì sao kết quả dòng 14 lại khác 16 bằng tiếng Việt hoặc tiếng Anh
// Cả 2 kết quả đều trả về biến a của global scope, 
// riêng ở fnc bar có sửa biến a (global scope) nên kết quả khác với fnc foo