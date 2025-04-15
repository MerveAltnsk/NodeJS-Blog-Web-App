const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", (req, res) => {
  res.render("home", { posts: posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = {
    id: Date.now().toString(),
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  res.render("edit", { post });
});

app.post("/edit/:id", (req, res) => {
  const index = posts.findIndex(p => p.id === req.params.id);
  posts[index].title = req.body.postTitle;
  posts[index].content = req.body.postBody;
  res.redirect("/");
});

// DELETE methodu ile gelen istek
app.delete('/delete/:id', (req, res) => {
    const postId = req.params.id;
  
    // posts dizisinden postu silme
    posts = posts.filter(post => post.id !== postId);
  
    // Silindikten sonra ana sayfaya yönlendir
    res.redirect('/');
  });
  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
