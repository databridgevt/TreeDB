'use strict';
const mongoose = require("mongoose");

//Connect to the database server
mongoose.connect("mongodb+srv://admin-conork:Franklinglen16@cluster0-5je4y.mongodb.net/treeDB", {
  useNewUrlParser: true
});

// Create and add the Schema to mongoose
const articleSchema = {
    name: String,
    author: String,
    date: String,
    keywords: String,
    file: Buffer
  };
const Article = mongoose.model("ArticleEntry", articleSchema);

/* TODO: Remove before Production
      Bug fix #1:  
      Dubbed the ToLowerCase bug
      Fix: MongoDB needs to be cleaned out each time the server restarts
*/
//Clean DB
Article.deleteMany({}, () => {
    console.log('db cleaned')
  });


/*  The following entries are example articles to be used
    in the db and to be used for testing.
*/
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

//Combine articles into a single array and insert into db 
const defaultArticles = [article1, article2, article3, article4, article5, article6];
Article.insertMany(defaultArticles);
//End testing environment

//Export only the Article db object
//TODO: isn't this dated? figure out a better export
module.exports = Article;
