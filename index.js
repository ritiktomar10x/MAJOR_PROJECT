if(process.env.NODE_ENV != "Production"){
    require("dotenv").config();
};


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);


const DB_URL = process.env.ATLAS_DB;
main().then(console.log("CONNECTED SUCCESSFULLY!")).catch(err=>console.log(err));

async function main() {
    await mongoose.connect(DB_URL);
};

const store= MongoStore.create({
    mongoUrl: DB_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error",()=>{
    console.log("Error in Mongo Session Store!",err);
});

const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : Date.now() + 7 * 24 * 60 * 60 *1000,
        httpOnly: true
    }
};


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demoUser",async(req,res)=>{
//     let demoUser = new User({
//         email:"demo@gmail.com",
//         username:"demo"
//     });
//     let userRegister = await User.register(demoUser,"123");
//     res.send(userRegister);
// });

app.use("/",async(req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = await req.user;
    next();
});

//Listing
app.use("/listings",listingRouter);

//Review 
app.use("/listings/:id/reviews",reviewRouter);

//User Router
app.use("/",userRouter);

//Error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8080,(req,res)=>{
    console.log("listening to port 8080");
});
