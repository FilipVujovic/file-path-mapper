# File path mapper

## Description
This is a *relatively* simple file path mapping algorithm that delivers data trough a `/api/files` endpoint.

It converts an array of string values that prepresent paths in the file system up to 3 levels deep to an object. 
It gets data from `https://rest-test-eight.vercel.app/api/test` or you can pass your own custom dataset in the body of the request. 

The custom dataset should look like this:
```
{
  "domains" : [
    "http://34.8.32.234:48183/testPath/1/11",
    "http://34.8.32.234:48183/testPath/1/12",
    "http://34.8.32.234:48183/testPath/2/21",
    "http://34.8.32.234:48183/testPath/2/22",
    "http://34.8.32.234:48183/testPath2/3/31",
    "http://34.8.32.234:48183/testPath2/3/32",
    "http://34.8.32.234:48183/testPath2/3/33"
]
}
```

You will get this reponse : 

```
{
  "34.8.32.234": [
    {
      "testPath": [
        {
          "1": [
            "11",
            "12"
          ]
        },
        {
          "2": [
            "21",
            "22"
          ]
        }
      ]
    },
    {
      "testPath2": [
        {
          "3": [
            "31",
            "32",
            "33"
          ]
        }
      ]
    }
  ]
}
```

**If you dont want work with a custom dataset, dont add anything to the body of the request.**

## Testing

There are 2 ways to test this API.

### Running it locally 

You can test this API by running the server on your machine. 
To do this :
    1. Clone this repo
    2. Run `npm install`
    3. Run `npm run start`

You should see a message that the server has started successfully and is listening on port 3000.

Make a `POST` request to `localhost:3000/api/files` with or without the body as shown above.

### Running it from docker

You can run this API from a docker container. 
To do this you need to run `docker compose up`. This will spin up the docker container. 

You should see a message that the server has started successfully and is listening on port 3000.

Now you can simply send a `POST` request to `localhost:3000/api/files` with or without the body as shown above.