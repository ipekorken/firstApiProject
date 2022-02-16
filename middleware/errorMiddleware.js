const catchError = (err, req, res, next) => {
  // hata mesajını daha net görmek için yapılabilir:
  // 11000 duplicated hatası
  if (err.code === 11000) {
    return res.json({
      // message: JSON.stringify(err.keyValue) + " unique olmalıdır.",
      message:
        Object.keys(err.keyValue) /*email*/ +
        " için girdiğiniz değer unique olmalıdır. " +
        Object.values(err.keyValue) /*girilen email*/ +
        " başka bir kullanıcı tarafından kullanılmaktadır.",
      errorCode: 400,
    });
  }
  // output:
  // {
  //   "message": "{\"email\":\"test@mail.com\"} unique olmalıdır.",
  //   "errorCode": 400
  // }
  // if (err.code === 66) =>> 66 _id değiştirmeye çalışırken çıkar. Değiştirilemez bir alanı güncellemeye çalışırsak alırız.
  if (err.code === 66) {
    return res.json({
      message: "Değiştirilemez bir alanı güncellemeye çalıştın.",
      errorCode: 400,
    });
  }

  res.json({
    message: err.message, //err.message'daki message, js de bulunan Error sınıfındaki bir alan. Sadece err'yi yazdırırsak message gibi daha bir çok alanı görürüz.(name, stringValue, value gibi.)
    errorCode: err.statusCode || 400,
  });
};

module.exports = catchError;
