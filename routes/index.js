var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
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
	app.post('/reg',function(req,res){
		//检验两次输入的命令是否一致
		if(req.bopy['password-repeat'] != req.bopy['password']){
			req.flash('error','两次输入的密码不一致');
			return res.rediret('/reg');
		};
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		var newUser = new User({
			name:req.body.name,
			password:password
		});
		//检查用户名是否已经存在
		User.get(newUser.name, function(err, user) {
			if (user)
				err = 'Username already exists.';
				if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			//如果不存在则新增用户
			newUser.save(function(err) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success', '注册成功');
				res.redirect('/');
		});
	})
}