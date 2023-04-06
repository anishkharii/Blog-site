const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const Str = require("@supercharge/strings");
const date  = require("./date");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const url = "mongodb+srv://user001:test123@cluster0.dpqjq5z.mongodb.net/postDB";

app.set('view engine', 'ejs');

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    publishDate:String
});
/*const IdSchema = new mongoose.Schema({
    _id:{
        type:Number,
        required:true
    },
    seq:{
        type:Number,
        default:0
    }
    
})*/
const Post = mongoose.model("Post", postSchema);
//const ID = mongoose.model("Id",IdSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res)=> {
    Post.find({}).then((data)=> {
        posts = data;
        res.render("home", {
            totalPosts: data
        })
    }).catch((err)=> {
        console.log(err.message);
    });

});

app.get("/about", (req, res)=> {
    res.render("about", {
        AboutContent: aboutContent
    });
});
app.get("/contact", (req, res)=> {
    res.render("contact", {
        ContactContent: contactContent
    });
});

app.get("/compose", (req, res)=> {
    

    
    res.render("compose");
    
})

app.post("/compose", (req, res)=> {
        var postData = new Post ({
        title: req.body.postTitle,
        content: req.body.postContent,
        publishDate : date.getDate()
    });
    postData.save().then((err)=>{
        if(!err){
            res.redirect("/");
        }
    });
    res.redirect("/");
    
})

app.get("/posts/:postId", (req, res)=> {
    var requestId = req.params.postId;
    Post.findOne({_id:requestId}).then((foundPost)=>{
        res.render("post",{
            PostTitle:foundPost.title,
            PostContent:foundPost.content,
            PostDate : foundPost.publishDate
        });
    });

});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});