const fs = require('fs')
const mongodb = require('mongodb')

const directory = process.argv[2]

const uri = 'mongodb+srv://admin-conork:Franklinglen16@cluster0-5je4y.mongodb.net/treeDB';
const dbName = 'treeDB';

const getDirectories = (directory) => {
  return fs.readdirSync(directory, { withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}
console.log(getDirectories(directory))

/*
mongodb.MongoClient.connect(uri, (err, client) => {
  const db = client.db(dbName);
  const bucket = new mongodb.GridFSBucket(db);
});*/