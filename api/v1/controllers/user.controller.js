const md5 = require('md5');
const User = require("../models/user.model");
const ForgotPassword = require('../models/forgot-password.model')
const generateHelper = require('../../../helpers/generate.helper');
const sendMailHelper = require('../../../helpers/sendMail.helper');


//[POST] /api/v1/users/register
module.exports.register = async(req,res) =>{

  req.body.password = md5(req.body.password);

  const exitEmail = await User.findOne({
    email : req.body.email,
    delete  : false,
  })

  if (!exitEmail){
    const newUser = new User({
      email : req.body.email,
      password : req.body.password,
      fullname : req.body.fullname,
      token : generateHelper.generateRandomString(20),
    });
    await newUser.save();
    const token = newUser.token;
    res.cookie("token", token);
    res.json( {
      code : 200,
      message:"Đăng kí thành công",
      token : token
    });
  }else{
    res.json( {
      code : 400,
      message:"Email đã tồn tại",
    });
    return;
  }
}

//[POST] /api/v1/users/login
module.exports.login = async(req,res) =>{

  req.body.password = md5(req.body.password);

  const user = await User.findOne({
    email : req.body.email,
    // password : req.body.password,
    delete  : false,
  })

  if (!user){
    res.json( {
      code : 400,
      message:"Email không tồn tại",
    });
    return;
  }

  if (req.body.password !== user.password){
    res.json( {
      code : 400,
      message:"Sai mật khẩu",
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);
  res.json( {
    code : 200,
    message:"Đăng nhập thành công",
    token : token
  });
}

//[POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async(req,res) =>{

  const user = await User.findOne({
    email : req.body.email,
    delete  : false,
  })

  if (!user){
    res.json( {
      code : 400,
      message:"Email không tồn tại",
    });
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  const timeExprice = 5 ;

  //lưu data vào database (tạo 1 data sau khi nhâp đúng email quên mật khẩu vào database)
  const objectForgotPassword = {
    email : req.body.email,
    otp : otp,
    expireAt : Date.now() + timeExprice*60*1000,  
  }

  const newForgotPassword = new ForgotPassword(objectForgotPassword);
  await newForgotPassword.save();

  //Gửi email xác nhận mã OTP
  const subject ="Mã OTP"
  const html = `
  <h1>Mã OTP của bạn là : ${otp}</h1>
  <p>Mã OTP sẽ hết hạn sau 3 phút</p>
  `;
  sendMailHelper.sendMail(req.body.email,subject,html);

  res.json( {
    code : 200,
    message:"Email tồn tại",
  });
}

//[POST] /api/v1/users/password/otp
module.exports.otpPassword = async(req,res) =>{

  const otp = req.body.otp;

  const email = req.body.email;

  const result = await ForgotPassword.findOne({
    email :email,
    otp : otp,
  })

  if (!result){
    res.json( {
      code : 400,
      message:"Nhập sai OTP",
    });
    return;
  }

  const user = await User.findOne({
    email : email,
    delete  : false,
  })

  const token = user.token;
  res.cookie("token", token);

  res.json( {
    code : 200,
    message:"xác nhận thành công",
    token : token,
  });
}

//[POST] /api/v1/users/password/reset
module.exports.resetPassword = async(req,res) =>{

  const password = md5(req.body.password);

  const token = req.body.token;


  const user = await User.findOne({
    token :token,
  })

  if (password == user.password) {
    res.json( {
      code : 400,
      message:"Vui lòng nhập mật khẩu khác mật khẩu cũ",
    });
    return;
  }

  await User.updateOne({
    token : token,
    delete  : false,
  },{
    password :  password,
  })

  res.json( {
    code : 200,
    message:"sửa mật khẩu thành công",
  });
}

//[POST] /api/v1/users/detail
module.exports.detail = async(req,res) =>{

  res.json( {
    code : 200,
    message:"Thông tin người dùng",
    info : req.user,
  });
}

//[POST] /api/v1/users/list
module.exports.list = async(req,res) =>{
  const users = await User.find({}).select("id fullName email")
  res.json( {
    code : 200,
    message:"Thông tin người dùng",
    users : users,
  });
}