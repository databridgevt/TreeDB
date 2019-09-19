# TreeDB

## Basic Usage:

1. Clone this repository to the directory of your choice:

```
git clone https://github.com/databridgevt/TreeDB.git
```

2. Install packages with this command:
``` 
npm install 
```

3. Launch the app on server 80 of your local host:

```
node app.js
```

## Network configuration:

- **Change Port Number -** open app.js and change line 81 from:
  ```
  app.listen(80, function() {
  ```
  to:
  ```
  app.listen(NewPortNumber, function() {
  ```
- **Change MongoDB Instance -** open app.js and change line 14 from:
  ```
  mongoose.connect("mongodb+srv://admin-conork:Franklinglen16@cluster0-5je4y.mongodb.net/treeDB", {
  ```
  to:
  ```
  mongoose.connect(NewMongDBString, {
  ```

## Contents:

- **app.js:** Server-side portion of the application which launches the server and application, handles get/post requests, and interacts with the database.
- **views:** Directory that contains the various ejs templates for the application. This directory is automatically searched for files to be rendered to the user. Therefore, when they are referenced in app.js the path appears as simply "filename" rather than "views/filename". Ejs templates are just html files that support ejs templating.
  - **home.ejs:** Code to render the home page.
  - **publish.ejs:** Code to render the page to upload new articles. This is where any additional attributes that articles should contain should be added.
  - **search-results:** Code to render the search results when users search for a new article. This is where any additional attributes of the articles that you want the normal users to see should be added.
  - **partials:** Directory that contains the header and footer ejs files.
- **public:** Directory the application uses as the root directory for all files except those to be rendered to the clients as views. Therefore, when they are referenced in app.js the path appears as simply "filename" rather than "public/filename". All CSS, JavaScript, images, etc. are located in this file.
  - **css:** Directory that contains all the css scripts named for the view that uses them.
  - **images:** Directory that contains all the images for the application.
- \*package.json:\*\* Json object containing the names of all the packages needed for application.
- \*node_modules:\*\* Directory containing all the downloaded modules referenced in package.json.
