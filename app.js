//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
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
  author: String
};
const Article = mongoose.model("Article", articleSchema);

const article1 = new Article({
  name: "Post-fertilization physiology and growth performance of loblolly pine clones",
  author: "N.T King, J. R. Seiler, T.R. Fox, K. H. Johnsen"
});

const article2 = new Article({
  name: "Genetic Variation in Nitrogen Use Efficiency of Loblolly Pine Seedlings",
  author: "Bailian Li, S.E. McKeand, H.L. Allen"
});

const article3 = new Article({
  name: "Nitrogen and Family Effects on Biomass Allocation of Loblolly Pine Seedlings",
  author: "Bailian Li, S.E. McKeand, H.L. Allen"
});

const article4 = new Article({
  name: "Responsiveness of Diverse Families of Loblolly Pine to Fertilization: Eight-Year REsults from SETRES-2",
  author: "S.E. McKeand, J.E. Grissom, R. Rubilar and H.L. Allen"
});

const article5 = new Article({
  name: "Characterization of Foliar Macro- and Micronutrient Concentrations and Ratios in Loblolly Pine Plantations in the Southeastern United States",
  author: "Janine M. Albaugh, Leandra Blevins, H. Lee Allen, Timothy J. Albaugh, Thomas R. Fox, Jose L. Stape, and Rafael A. Rubilar"
});

const article6 = new Article({
  name: "TestName",
  author: "TestAuthor"
});

let articles = [article1, article2, article3, article4, article5, article6];

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/publish", function(req, res) {
  res.render("publish");
});

app.post("/", function(req, res) {
  potentialArticles = [];
  Article.find({}, function(err, foundArticles) {
    if (foundArticles.length == 0) {
      Article.insertMany(articles, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default articles to database!!!");
        }
      });
      res.render("search-results", {
        potentialArticles: articles
      });
    } else {
      res.render("search-results", {
        potentialArticles: foundArticles
      });
      articles = foundArticles;
    }
  });
});

app.post("/publish", function(req, res) {
  const newArticle = new Article({
    name: req.body.newName,
    author: req.body.newAuthor
  });
  newArticle.save()
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const id = req.body.deleteButton;
  Article.findByIdAndDelete(id, function(err) {
    if (err) {
      console.log(err);
    }
  });
  Article.find({}, function(err, foundArticles) {
    res.render("search-results", {
      potentialArticles: foundArticles
    });
    articles = foundArticles;
  });
});
