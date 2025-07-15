const Listing = require("../models/listing.js");

module.exports.newListing = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const newListing = await Listing.findById(id);
    if(!newListing){
        req.flash("error","Listing You Try To Access Does Not Exist!");
        res.redirect("/listings");
    };
    // let originalImg = newListing.image.url;
    // let cropImg = originalImg.replace("/upload","/upload/w_200,h_200,c_scale");
    res.render("listings/edit.ejs",{newListing});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let updateListing = await Listing.findByIdAndUpdate(id,{...req.body.Listing},{runValidators:true});
    if (typeof (req.file) != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updateListing.image = {filename,url};
        await updateListing.save();
    };
    req.flash("success","Listing Is Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing You Try To Access Does Not Exist!");
        res.redirect("/listings");
    };
    res.render("listings/show.ejs",{listing});
};

module.exports.indexListing = async(req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.Listing);
    newListing.owner = await req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
};