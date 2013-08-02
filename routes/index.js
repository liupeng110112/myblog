var crypto = require('crypto');
var User = require('../models/user.js');
module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index',{
			title:'首页'
		})
	})
	app.get('/reg',function(req,res){
		res.render('reg',{
			title:'用户注册'
		})
	})
	app.post('/reg', function(req,res){
	  var name = req.body.name,
	      password = req.body.password,
	      password_re = req.body['password-repeat'];
	  	//检验用户两次输入的密码是否一致
	  if(password_re != password){
	    req.flash('error','两次输入的密码不一致!'); 
	    return res.redirect('/reg');
	  }
	  //生成密码的散列值
	  var md5 = crypto.createHash('md5'),
	      password = md5.update(req.body.password).digest('hex');
	  var newUser = new User({
	      name: req.body.name,
	      password: password
	  });
	  //检查用户名是否已经存在 
	  User.get(newUser.name, function(err, user){
	    if(user){
	      err = '用户已存在!';
	    }
	    if(err){
	      req.flash('error', err);
	      return res.redirect('/reg');
	    }
	    //如果不存在则新增用户
	    newUser.save(function(err){
	      if(err){
	        req.flash('error',err);
	        return res.redirect('/reg');
	      }
	      req.session.user = newUser;//用户信息存入session
	      req.flash('success','注册成功!');
	      res.redirect('/');
	    });
	  });
	});
}	