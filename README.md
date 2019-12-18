# Introduction
sharenode allows you to upload files from your local machine to an S3 compatible storage bucket using command line.

# Configuration
Edit and drop the following configuration into ~/.node-uploader.json

    {
        "destinations":{
            "example":{
                "endpoint":"ep.example.com",
                "secretAccessKey":"",
                "accessKeyId":"",
                "bucket":"example",
                "path":"uploads",
                "useDate": true,
                "useRandom":false,
                "url": "https://cdn.example.com"
            }
        }
    }

# Usage
To run sharenode simply run `sharenode` with the desired + required arguments:

`*` = required;

`--dest*` - Name of the destination that you would like to upload to. eg- `--dest=example`

`--file*` - Path to the file you would like to upload. eg- `--file=myfile.txt`

`--random` - Use random word generator for file name.

`--usedate` - Append date to destination file path

`--path` - Specify path to upload to. eg- `--path=uploads/myfiles`