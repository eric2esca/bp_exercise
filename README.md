# Blueprint Coding Exercise

## First things first
The site is hosted on an [AWS EC2 Server](http://ec2-54-159-132-145.compute-1.amazonaws.com/)

## Architecture Setup
* used `npx create-react-app` & modified some files & folders
* used material-ui to supplement ui components
* utilize sass & css grid to customize/ create components
* Already had a test Postgres AWS RDS for testing personal projects. May be a bit powerful for a small project, but quick to connect.
* Tech Stack - Postgres ExpressJS NodeJS ReactJS - (PERN)

## Instructions to run locally

**Run the following Instructions:**
* You must have NodeJs [Installed](https://nodejs.org/en/download/) and npm 
* `git clone git@github.com:eric2esca/bp_exercise.git`
* `cd bp_exercise`
* `npm install`
* `touch .env` <sup>\* Will provide PG CREDS privately. Set to DEV if running locally</sup>
```
PORT=5000
NODE_ENV=production
```
* `cd client`
* `npm install`
* `touch .env`
```
REACT_APP_BASE_URL=http://localhost:5000
```
* If you want to run production build locally `npm run build`
* cd back to *bp_exercise* root folder `cd ..`

### To run locally port 3000 client & port 5000 backend server & sass compiler
* `npm run dev`

### Run production build locally
* `npm run server`

## Description of Problem and Solution
1. Create front-end app that sends a diagnostic screener from the API to the front end. The JSON object has to be in the provided form

```
{
  "id": "abcd-123",
  "name": "BPDS",
  "disorder": "Cross-Cutting",
  "content": {
    "sections": [
      {
        "type": "standard",
        "title": "During the past TWO (2) WEEKS, how much (or how often) have you been bothered by the following problems?",
        "answers": [
          {
            "title": "Not at all",
            "value": 0
          },
          {
            "title": "Rare, less than a day or two",
            "value": 1
          },
          {
            "title": "Several days",
            "value": 2
          },
          {
            "title": "More than half the days",
            "value": 3
          },
          {
            "title": "Nearly every day",
            "value": 4
          }
        ],
        "questions": [
          {
            "question_id": "question_a",
            "title": "Little interest or pleasure in doing things?"
          },
          {
            "question_id": "question_b",
            "title": "Feeling down, depressed, or hopeless?"
          },
          {
            "question_id": "question_c",
            "title": "Sleeping less than usual, but still have a lot of energy?"
          },
          {
            "question_id": "question_d",
            "title": "Starting lots more projects than usual or doing more risky things than usual?"
          },
          {
            "question_id": "question_e",
            "title": "Feeling nervous, anxious, frightened, worried, or on edge?"
          },
          {
            "question_id": "question_f",
            "title": "Feeling panic or being frightened?"
          },
          {
            "question_id": "question_g",
            "title": "Avoiding situations that make you feel anxious?"
          },
          {
            "question_id": "question_h",
            "title": "Drinking at least 4 drinks of any kind of alcohol in a single day?"
          }
        ]
      }
    ],
    "display_name": "BDS"
  },
  "full_name": "Blueprint Diagnostic Screener"
}
```
**Solution 1**
* Create a React component page that makes an API call to the backend. 
* Recieves the JSON and renders the components as specified

2. The page screen should Display:
* Prompt
* Assesment display name
* Question title
* The answer options in the form of buttons
* Progress Bar that displays current question out of total length
* Tapping on a button renders the next question and the progress bar updates
* Upon answering the final question display the results

**Solution 2**
Created the component to match the bullet point description. After the final question is completed, an API Post request is made with the answers in the format that was requested. 

This is the format:
```
{
  "answers": [
    {
      "value": 1,
      "question_id": "question_a"
    },
    {
      "value": 0,
      "question_id": "question_b"
    },
    {
      "value": 2,
      "question_id": "question_c"
    },
    {
      "value": 3,
      "question_id": "question_d"
    },
    {
      "value": 1,
      "question_id": "question_e"
    },
    {
      "value": 0,
      "question_id": "question_f"
    },
    {
      "value": 1,
      "question_id": "question_g"
    },
    {
      "value": 0,
      "question_id": "question_h"
    }
  ]
}
```

3. Retrieve the Domain Mapping from storage system of your choosing
Here is the domain mapping provided:
```
[
  {
    "question_id": "question_a",
    "domain": "depression"
  },
  {
    "question_id": "question_b",
    "domain": "depression"
  },
  {
    "question_id": "question_c",
    "domain": "mania"
  },
  {
    "question_id": "question_d",
    "domain": "mania"
  },
  {
    "question_id": "question_e",
    "domain": "anxiety"
  },
  {
    "question_id": "question_f",
    "domain": "anxiety"
  },
  {
    "question_id": "question_g",
    "domain": "anxiety"
  },
   {
    "question_id": "question_h",
    "domain": "substance_use"
  },
]
```

**Use the chart to score the results**
**Domain** **Total Score**	**Level-2 Assessment**
Depression    ||	>= 2	 ||   PHQ-9
Mania	        ||  >= 2	 ||   ASRM
Anxiety	      ||  >= 2	 ||   PHQ-9
Substance_use || 	>= 1	 ||   ASSIST

**Solution 3**
* I chose AWS RDS Postgres as the DB as I have a handy one available for development purposed
* Additionally, Postgres was mentioned as part of the tech stack
* The domain mapping was stored in a **Domain Mapping PG Table**
* When the API received the clients Answers, it also made a call to the DB to fetch the Domain Mapping
* The domain mapping was recieved in the JSON format listed above.
* I combined the data and scored the results in the backend
* I returned JSON object with results in this format
```
{
  "results": ["ASRM", "PHQ-9"]
}
```
* Additionally, I styled the response in an alert on the front end to print the results

There was no styling guide so mostly followed the guide and slightly referenced the homepage for inspiration

## How to deploy as prod
One way to do this is using AWS EC2. Here is a summary of some steps
1. Launch an EC2 ubuntu server
2. Configure PEM keys
3. SSH in
4. `ssh-keygen` and set up github
5. `sudo apt update`
6. `sudo apt upgrade`
7. Install node & npm 
```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Check to see if node was installed
node --version
npm --version
```
8. `git clone git@github.com:eric2esca/bp_exercise.git`
9. `cd bp_exercise`
10. `npm install`
11. `touch .env` - get these privately
12. `cd client && npm install`
13. `npm run build`
14. set baseURL in a .env in the root directory of client
15. cd back to root of project bp_exercise
16. Install pm2 - `npm i -g pm2`
17. `pm2 start server.js` 
18. `ufw enable`
```
sudo ufw allow ssh (Port 22)
sudo ufw allow http (Port 80)
sudo ufw allow https (Port 443)
```
19. `apt install nginx`
20. `nano /etc/nginx/sites-available/default`
Update this section
```
location / {
  proxy_pass http://localhost:5000;    # or which other port your app runs on
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```
Also set this part `server_name domainname.com` <- use your amazonURL
21. `nginx -t`
22. `service nginx restart`
23. Set up SSL with maybe Let's Encrypt

**How to check performance & troubleshoot**
* ssh in and run `pm2 logs`
* AWS EC2 dashboard has metrics and cpu usage etc
* You can always add a loadbalancer and autoscaling to scale up as needed (May need a devops engineer to configure)
* Logs are useful and so is pm2 for troubleshooting. You can monitor with `pm2 monit`

**Interested in seeing some of my other code?**
Please reach out eric2esca@gmail.com
For security reasons and protected content I cannot publicly display on my public repositories, or portfolio. 
I have to get authorization to display content.

**LinkedIn**
[Eric Escamilla](https://www.linkedin.com/in/eric-escamilla-ba1a6a146/)
