const User = require("../models/user.js");

module.exports.signUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username, email});
        const userRegister = await User.register(newUser,password);
        console.log("New User Registered!");
        req.login(userRegister,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To Wanderlust!");
            res.redirect("/listings"); 
        });
    }catch(e){
        let message = e.message;
        req.flash("error",message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome To Wanderlust!,You Logged In");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out, Successfully!");
        res.redirect("/listings");
    })
};