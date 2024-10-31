module.exports = (query) => {
  let objectSearch = {
    keyword : "",
  }

  if (query.keyword){
    objectSearch.keyword = query.keyword;

    // tạo regex để search vd như tìm iphone thì nó ra iphone 9 10 11 
    const regex = new RegExp(objectSearch.keyword,"i") // "i" không phân biệt chữ hoa chữ thường
    objectSearch.regex = regex;
  }

  return objectSearch;
}