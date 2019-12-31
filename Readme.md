# attainU

Very Simple server for search related APIs 

## Run

```bash
npm install
npm start
```
##### Import Seed data by making a GET request at this API endpoint
```
GET /api/seed
```

## API Usage

```
get all states from database with their corresponding cities
GET /api/states
Response:
{
 "success": true,
 "data": [
       "cities": [
           "Mumbai",
           "Pune",
           "Nagpur",
           "Thane",
           ....
        ],
       "_id": "5e0b847aea5d160d50e5f487",
       "state": "Maharashtra",
       "__v": 0
  ],
}

Get all states along with cities matching a keyword
GET /api/states?search=guj
Response:
{
 "success": true,
 "data": [
           "cities": [
              "Ahmedabad",
              "Surat",
              "Vadodara"
                 .....            
         ],
         "_id": "5e0b847aea5d160d50e5f48a",
         "state": "Gujarat",
         "__v": 0
  ],
}


Get all cities from the database
GET /api/cities
Response:
{
 "success": true,
 "data": [
           {
             "cities": [
              "Ahmedabad",
              "Surat",
              "Vadodara"
                 .....            
              ],
           "state": "Gujarat"
           "cities": [
              "Delhi",
              "New Delhi"
                 .....            
           ],
           "state": "Delhi"
        ]
}

Get all cities matching the keyword
GET /api/cities?search=mum
Response:
{
    "success": true,
    "data": [
        {
            "cities": [
                "Mumbai"
            ],
            "state": "Maharashtra"
        }
    ]
}
```