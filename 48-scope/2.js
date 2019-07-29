var a = 1;

var b = {
  a: 2,
  foo: function() {
    console.log(this.a);
  }
};

b.foo();

var fooCopy = b.foo;
fooCopy();
// Chạy code và giải thích vì sao kết quả dòng 10 khác dòng 13

// Dòng 10 gọi hàm foo trong object b.
// Dòng 13 hàm fooCopy không tồn tại