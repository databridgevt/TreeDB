//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const Article = require('./db/build_db.js');
const formidable = require("formidable");
const mongoose = require("mongoose");
const app = express();
let displayedArticles = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-conork:Franklinglen16@cluster0-5je4y.mongodb.net/treeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//NOTE unused function
function print(articles, attr) {
  articles.forEach(function(article) {
    if (attr == "name") {
      console.log(article.name);
    }
    if (attr == "author") {
      console.log(article.author);
    }
  });
};

// Tanner - was port 80, changed to port 3000, TODO: needs to be 80 on lightsail
app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000"); //changed to 3000
});

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/publish", function(req, res) {
  res.render("publish");
});

/*
  This function takes an array of all articles in the db (foundArticles) and 
  checks if searchedName is contained within some of the document's porperties.
  An array of articels containg searchedName is returned.
*/
function search(foundArticles, searchedName) {
  matchedArticles = [];
  str = searchedName.replace(/\s/g, '');
  console.log(foundArticles)
  if (str == "") {
    return matchedArticles;
  }
  foundArticles.forEach(function(article) {
    if (article.name.toLowerCase().includes(searchedName.toLowerCase())) {
      matchedArticles.push(article);
    }
    else if (article.author.toLowerCase().includes(searchedName.toLowerCase())) {
      matchedArticles.push(article);
    }
    else if (article.keywords.toLowerCase().includes(searchedName.toLowerCase())) {
      matchedArticles.push(article);
    }
  });
  return matchedArticles;
};

/*
  This post request is meant to search the database for articels that match a 
  requested phrase. This requested phrase is checked against articles in the database,
  and articles containing that phrase in the following document's properties
  {
    name: String,
    author: String,
    keywords: String
  }
  should be passed to the webpage to render the results.
*/
app.post("/", function(req, res) {
  searchedName = req.body.searchName;
  potentialArticles = []; 
  Article.find({}, function(err, foundArticles) {
    console.log(foundArticles.length)
    if (foundArticles.length == 0) {
      Article.insertMany(defaultArticles, function(err) {
        console.log("No articles in database... Adding default papers...");
        if (err) {
          console.log(err);
        }
        else {
          console.log("Successfully saved default articles to database!!!");
        }
      });
      res.render("search-results", {
        potentialArticles: defaultArticles
      });
      displayedArticles = defaultArticles;
    } else {
      displayedArticles = search(foundArticles, searchedName);
      if (searchedName == "") {
        displayedArticles = foundArticles;
      }
      res.render("search-results", {
        potentialArticles: displayedArticles
      });
    }
  });
});

/*
 * This post is meant to upload a new pdf to be stored in the database.
 * The db should then save the articels and redirect the user back to home ("/").
 */
app.post("/publish", function(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req);
  form.on('fileBegin', (name, file) => {
    file.path =  __dirname + '/uploads/' + file.name;
    req.body.fileName = file.name;
    req.body.filePath = file.path;
    console.log('File Received');
  });
  form.on('end',  () => {
    console.log('Uploaded File: ' + req.body.fileName);
  })
  next();
}, (req, res) => {
  const newArticle = new Article({
    name: req.body.newName,
    author: req.body.newAuthor,
    date: req.body.newDate,
    keywords: req.body.newKeyWords
  });
  newArticle.save()
  res.status(200);
  res.redirect("/");
});

/**
 * This function is meant to splice out the article to be deleted. 
 * Then it should return an array of all articles to be displayed after deletion.
 * 
 * param id: The _id (in mongodb) of the article to be deleted
 * param articles: An array of currently displayed articels on the web page.
 * returns An array of the srticles to be displayed on the web page.
 */
function remove(id, articles) {
  for (var i = 0; i < articles.length; i++) {
    if (articles[i]._id == id) {
      articles.splice(i, 1);
    }
  }
  return articles;
};

/*
  FIXME:
    Was routed to "/delete" using post request
    Want to route to root using delete request
    HTML only lets forms submit GET and POST requests
*/
/*
  This post request is meant to delete one of the 
  currently displayed articles from the database.
  Then the webpage should be sent a new array of articles to render.
*/
app.post("/delete", function(req, res) {
  const id = req.body.deleteButton;
  console.log(id)
  Article.findByIdAndDelete(id, function(err) {
    if (err) {
      console.log(err);
    }
  });
  displayedArticles = remove(id, displayedArticles);
  res.render("search-results", {
    potentialArticles: displayedArticles
  });
});
