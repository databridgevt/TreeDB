import { Dirent } from 'fs';
import { GridFSBucket } from "mongodb";

const fs = require('fs')
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const GridBucket = require('mongodb').GridBucket

const directory = process.argv[2]

/* Set up connections.
  This chunk of code is all about connect to a mongodb.
  Then I grab a db instance using my client.
  Finally, I instantiate a bucket that I'll use to upload files.
  */
const uri = 'mongodb+srv://admin-conork:Franklinglen16@cluster0-5je4y.mongodb.net/treeDB';
const localUri = 'mongodb://localhost:27017/'; //this is for making local connections to mongodb
const dbName = 'treeDB';
const client = MongoClient.connect(localUri, { useNewUrlParser: true})
  .then((client: any) => client)
  .catch((err: Error) => console.log(err));
const db = client.db(dbName);
const bucket = new GridFSBucket(db, { bucketName: 'AutoWrite' })

/*
  This function builds an array of all of the directories names
  and then appends a '/' before returning.
*/
const getDirectories = (directory: string): string[] => {
  return fs.readdirSync(directory, { withFileTypes: true})
    .filter((dirent: Dirent) => dirent.isDirectory())
    .map((dirent: Dirent) => {
      return directory + dirent.name + '/'
    })
}

const subDirArray = getDirectories(directory)

let pmcidArray: string[] = []

/* Push json into db and above array

  This function operates on each entry in the subDirectory array
  and reads a the file into a string. That string is passed to
  JSON.parse, where the json is then inserted into mongo and the
  pmcid is pushed into an array.  
*/
subDirArray.forEach( async (subDir: string) => {
  fs.readFile(subDir + 'eupmc_result.json', 'utf8', 
  (err: Error, jsonStr: string) => {
    const jsonData = JSON.parse(jsonStr);
    pmcidArray.push(jsonData.pmcid[0])
  })
})



/* Apparently, GridStore is deprecated, and node node doesn't
    decide to tell me until I'm basically done. So here's 
    an almost working, deprecated solution 
    to putting pdf's in mongodb.

MongoClient.connect(localUri, { useNewUrlParser: true }, (err: Error, client: any) => {
  if (err) { console.log('Could not connect to db'); return }
  const db = client.db(dbName)
  const gridStore = new GridStore(db, null, "w")
  const subDirArray = getDirectories(directory)
  subDirArray.forEach(async (subDir: string) => {
    fs.readFile(subDir + 'eupmc_result.json', 'utf8', (err: Error, jsonString: string) => {
    if (err) {console.log("File read failed:", err); return}
    const jsonData = JSON.parse(jsonString);
    try {
        //Some of these json are missing objects that other json's have
        //For example, I was extracting meshHeadingList which
        //has a ton of info about topic of the aritcle
        //but some of these articles just don't have meshHeadingList
        //Some of them don't even have a doi.
        //Alright, well so much for making this stuff easier to access.
        const title: string = jsonData.title[0];
        const pmcid: string = jsonData.pmcid[0];
        //const authorStr: string = jsonData.authorString[0];
        //const authorList: string[][] = jsonData.authorList[0];
        //Journal info contains some dates and stuff
        const journalInfo = jsonData.journalInfo[0];
      } catch (err) {
        console.log(err)
        console.log(`PMCID: ${jsonData.pmcid[0]}`)
      }
      gridStore.open((err: Error, gridStore: any) => {
        gridStore.write(fs.readFile(subDir + 'fulltext.pdf', (err: Error) => {
          /* Callback for fs.readFile 
          if (err) {
            console.log(err)
              console.log(`Could not read file ${subDir + 'fulltext.pdf'}`)
          }
        }), 
          (err: Error, gridStore: any) => {
            client.close();
        }).catch((err: Error) => {
          client.close();
        })
      })
    })
  })
}) */
