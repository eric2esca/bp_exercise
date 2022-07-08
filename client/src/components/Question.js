import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import api from '../utils/api';

import Alert from '@mui/material/Alert';
import { v4 as uuidv4 } from 'uuid';

const Question = () => {
  // Don't really expect to change, but w/ future screeners in mind used state
  const [displayName, setDisplayName] = useState('');
  const [prompt, setprompt] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionsLength, setQuestionsLength] = useState(0);

  // Will update with questions
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('loading...');
  const [currentQuestionID, setCurrentQuestionID] = useState(null);
  const [answersArray, setAnswersArray] = useState([]);
  const [results, setResults] = useState(null);

  //Load the basic data from the api
  useEffect(() => {
    const fetchDiagnosticScreener = async () => {
      const BDS = await api.get('/api/diagnosticScreener')
        .then(res => res.data);

      const sections = BDS[0]['content']['sections'][0];
      setDisplayName(BDS[0].content.display_name);
      setprompt(sections.title);
      setQuestions(sections.questions);
      setAnswers(sections.answers);
    }

    fetchDiagnosticScreener();
  }, []);

  //Update the current questions and set the length of progress bar
  useEffect(() => {
    const activeQuestion = () => {
      setQuestionsLength(questions.length);
      
      if(questionIndex < questions.length){
        setCurrentQuestion(questions[questionIndex].title);
        setCurrentQuestionID(questions[questionIndex].question_id);
      }
    }

    activeQuestion();
  }, [questions, questionIndex, results]);

  //Check if user has completed screener questions, submit, update results
  useEffect(() => {
    const isFinished = async () => {
      if((questionIndex) === questionsLength && questionsLength !== 0){
        const submitResponse = await api.post('/api/diagnosticScreener/submit', { "answers": answersArray })
          .then(res => res.data);
        setResults(submitResponse);
      }
    }
    
    isFinished();
  }, [questionIndex, questionsLength, answersArray]);

  // Handle clicking the buttons, preserve responses in state, update index
  const handleButtonClick = async (value, id) => {
    setAnswersArray([...answersArray, { value, question_id: id }]);

    const newIndex = questionIndex + 1;
    setQuestionIndex(newIndex);
  }

  return(
    <div className="question">
      <div className="question__progressbar">
        <ProgressBar // Progress Bar
          currentQuestion={questionIndex} 
          qLength={questionsLength} // Dynamic question length in case the screener is swapped with another
        />
      </div>
      <div className="question__display_name">
        <h3>{displayName}</h3>
      </div>
      <div className="question__prompt">
        <p>{prompt}</p>
      </div>
      <div className="question__active_question">
        <p>{currentQuestion}</p>
      </div>
      <div className="question__response_container">
        {answers.map(a => {
          return(
            <button 
              className="question__answer_buttons question__bw"
              key={a.value}
              onClick={() => handleButtonClick(a.value, currentQuestionID)}
            >
              {a.title}
            </button>
          );
        })}
      </div>
      <div className="question__results"> 
        { results // Returned results in a more readable manner. We initially recieve json
          ? 
          <Alert severity="success">  
            {results['results'].map(assesment => {
              return(
                <p key={uuidv4()}>Recommended Assesment: {assesment}</p>
              );
            })}
          </Alert> 
          : null
        }
      </div>
    </div>
  );
}

export default Question;
