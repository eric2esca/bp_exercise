var express = require('express');
const db = require('../db');
var router = express.Router();

// RETURN GIVEN SCREENER TO FRONTEND
router.get('/', function(req, res, next) {
  res
    .status(200)
    .json([{
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
    }]);
});

// FETCH DOMAIN MAPPING FROM DB - USED POSTGRES BECAUSE I ALREADY HAVE A TEST ONE FOR DEV PURPOSES
router.post('/submit', async (req, res, next) => {
  try {
    let depressionScores = 0;
    let maniaScores = 0;
    let anxietyScores = 0;
    let substanceScores = 0;
    let resultsArray = new Set();

    //Postgres query to fetch domain mapping
    const query = `SELECT * FROM domainMapping`;
    const { rows } = await db.query(query); // For Brady & Jason who asked me why not async await

      //From postgres - domain mapping results
      const domainMapping = rows; // Notice this mapping matches the instructions in the exercise 
      
      //answers from frontend
      const clientAnswers = req.body;  // Recieved in the format requested by coding exercise

      //Small data set, so for simplicity just combined domainMapping & clientAnswers
      const mappedArray = clientAnswers['answers'].map(ans => {
        const clientQuestionID = ans['question_id'];

        for(let i=0; i < domainMapping.length; i++){
          if(domainMapping[i]['question_id'] === clientQuestionID){
            return { 
              question_id: clientQuestionID, 
              domain: domainMapping[i]['domain'], 
              value: ans['value'] 
            }
          }
        }
      });

      //Update the scores to reflect client answers
      mappedArray.forEach(mappedObj => {
        switch(mappedObj['domain']) {
          case "depression":
            return depressionScores += mappedObj['value'];
          case "mania":
            return maniaScores += mappedObj['value'];
          case "anxiety":
            return anxietyScores += mappedObj['value'];
          case "substance_use":
            return substanceScores += mappedObj['value'];
          default:
            break;
        }
      });

      //Return results based on recommendation chart given in exercise
      if(depressionScores >= 2) resultsArray.add("PHQ-9");
      if(maniaScores >= 2) resultsArray.add("ASRM");
      if(anxietyScores >= 2) resultsArray.add("PHQ-9");
      if(substanceScores >= 1) resultsArray.add("ASSIST");
      
      // For Brady and Jason Question. To avoid duplicates. Returned new set to conform to requested format
      res.status(200).json({ "results": [...new Set(resultsArray)] }); // Returned json in requested format from exercise
    // { "results": [array] }
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
