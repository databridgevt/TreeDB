//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
let displayedArticles = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-conork:Franklinglen16@cluster0-5je4y.mongodb.net/treeDB", {
  useNewUrlParser: true
});
const articleSchema = {
  name: String,
  author: String,
  date: String,
  keywords: String
};
const Article = mongoose.model("ArticleEntry", articleSchema);
  /* TODO: Remove before Production
      Bug fix #1:  
      Dubbed the ToLowerCase bug
      Fix: MongoDB needs to be cleaned out each time ther server restarts
  */
//Clean DB
Article.deleteMany({}, () => {
  console.log('db cleaned')
});


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

const article1 = new Article({
  name: "Intra-annual nutrient flux in Pinus taeda",
  author: "Timothy J. Albaugh, H. Lee Allen, Jose L. Stape, Thomas R. Fox, Rafael A. Rubilar and James W. Price",
  date: "01/20/2012",
  keywords: "Pinus taeda, flux"
});

const article2 = new Article({
  name: "Ecosystem Nutrient Retention after Fertilization of Pinus taeda",
  author: "Timothy J. Albaugh, L. Chris Kiser, Thomas R. Fox, H. Lee Allen, Rafael A. Rubilar, and Jose L. Stape",
  date: "2014",
  keywords: "fertilization, irrigation, nutrient balance, Pinus taeda"
});

const article3 = new Article({
  name: "Soil Nitrogen Turnover is Altered by Herbicide Treatment in a North Carolina Piedmont Forest Soil",
  author: "Steven W. Andariese, Peter M. Vitousek",
  date: "04/14/1987",
  keywords: "herbicide, soil nitrogen, insecticides"
});

const article4 = new Article({
  name: "Irrigation and fertilization effects on foliar and soil carbon and nitrogen isotope ratios in a loblolly pine stand",
  author: "Woo-Jung Choi, Scott X. Chang, H. Lee Allen, Daniel L. Kelting, Hee-Myong Ro",
  date: "03/23/2005",
  keywords: "irrigation, fertilization, loblolly, isotope"
});

const article5 = new Article({
  name: "Characterization of Foliar Macro- and Micronutrient Concentrations and Ratios in Loblolly Pine Plantations in the Southeastern United States",
  author: "Janine M. Albaugh, Leandra Blevins, H. Lee Allen, Timothy J. Albaugh, Thomas R. Fox, Jose L. Stape, and Rafael A. Rubilar",
  date: "2010",
  keywords: "Pinus taeda, foliar nutrient concentrations, nutrient ratios, loblolly"
});

const article6 = new Article({
  name: "TestName",
  author: "TestAuthor",
  date: "01/31/2019",
  keywords: "test, keyword"
});

const defaultArticles = [article1, article2, article3, article4, article5, article6];
Article.insertMany(defaultArticles);

// app.listen(process.env.PORT || 3000, function() {
// Tanner - was port 80, changed to port 3000
app.listen(3000, function() {
  console.log("Server is running on port 3000"); //changed to 3000
});

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/publish", function(req, res) {
  res.render("publish");
});

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
  // for (var i = 1; i <= searchedName.length-1; i++) {
  //   console.log(searchedName.slice(-5, -i));
  // }
  return matchedArticles;
};

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

app.post("/publish", function(req, res) {
  const newArticle = new Article({
    name: req.body.newName,
    author: req.body.newAuthor,
    date: req.body.newDate,
    keywords: req.body.newKeyWords
  });
  newArticle.save()
  res.redirect("/");
});

function remove(id, articles) {
  for (var i = 0; i < articles.length; i++) {
    if (articles[i]._id == id) {
      articles.splice(i, 1);
    }
  }
  return articles;
};

app.post("/delete", function(req, res) {
  const id = req.body.deleteButton;
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
