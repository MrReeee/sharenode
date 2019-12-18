#!/usr/bin/env node
const AWS = require('aws-sdk');
const argv = require('yargs').argv
const mime = require('mime');
const path = require('path');
const dateFormat = require('dateformat');
const fs = require('fs');
const randomWords = require('random-words');
var homedir = require('os').homedir();
var config = undefined;

try {
    config = require(homedir + '/.node-uploader.json');
} catch(e) {
    console.error("Could not read config file at " + homedir + "/.node-uploader.json");
}

var dest = (argv.dest||null);


if(dest == null)
{
  console.error("Please specify a destination!");
  process.exit();
}

var filepath = (argv.file||null);
var fmimetype = (argv.mimetype||mime.getType(argv.file));
var destPath = (argv.path||config.destinations[dest].path);
var useDate = (argv.usedate||config.destinations[dest].useDate);
var useRandom = (argv.random||config.destinations[dest].useRandom);


if(!argv.path && useDate)
{
    var destPath = config.destinations[dest].path + "/" + dateFormat(new Date(), 'yyyy/mm/dd');
}

if (destPath.charAt(0) == "/") destPath = destPath.substr(1);
if (destPath.charAt(destPath.length - 1) == "/") destPath = destPath.substr(0, destPath.length - 1);

if(filepath == null)
{
    console.error("Please select a file to upload using --file argument!");
    process.exit(1);
}

if(dest == null)
{
    console.error("Provide a destination with the --dest argument!")
    process.exit(1);
}

const s3 = new AWS.S3({
    endpoint: config.destinations[dest].endpoint,
    accessKeyId: config.destinations[dest].accessKeyId,
    secretAccessKey: config.destinations[dest].secretAccessKey
  });
  
  
  function uploadFile(file, fileName, mimetype) {
    fs.readFile(file, (err, data) => {
      if (err) throw err;
      const params = {
        Bucket: config.destinations[dest].bucket, // pass your bucket name
        ACL: 'public-read',
        Key: destPath + "/" + fileName,
        ContentType: mimetype,
        Body: data
      };
      s3.upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err
        console.log(config.destinations[dest].url + "/" + destPath + "/" + fileName);
      });
    });
  }

  var destFileName;
  if((argv.random||config.destinations[dest].useRandom))
  {
      destFileName = randomWords({exactly:2}).join('-') + path.extname(filepath);
  } else {
      destFileName = path.basename(filepath);
  }

uploadFile(filepath, destFileName, fmimetype);