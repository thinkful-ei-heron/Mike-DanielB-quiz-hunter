/* global STORE */
'use strict';
//STORE
//MODEL = [
  //{
    //question: 'What color is the youtube icon?', 
    //possibleAnswers: ['red', 'green', 'blue', 'purple'],
    //correctAnswer: 'red',
    //imageAsset: 'url'
  //}
//]
//
//Display question one at a time

//Home starting screen
//Question Screen
//  -display question and possible answers
//  -display question number and current score
//  -render with <form>
//Answer screen
//  -Tell user after each question if they were right or wrong
//  -tell user correct answer
//  -question # and current score
//  -next question element
//End Screen
//  -tally of questions right and wrong
//  -element for retake
//  -
// STORE = [
//   {
//     question: 'What color is the youtube icon?', 
//     possibleAnswers: ['red', 'green', 'blue', 'purple'],
//     correctAnswer: 'red',
//     imageAsset: 'url'
//   }
// ]
function questionBuilder(num){ //build HTML from question
  let q = STORE.questions[num]
  let html = `<form>
    <fieldset>
      <li>question: ${q.question}</li>`
  for (let i = 0; i < q.answers.length; i++){
    html = html.concat(`  <label class="answer" for="">
    <input class="radio" type="radio" id="ans${i}" value="${q.answers[i]}" name="ans" required>
    <span>${q.answers[i]}</span>
  </label>`);
  }
  html = html.concat(`
    <button id='submit-question'>Submit Button Placeholder</button>
  </fieldset>
</form>`);
  return html;
}

function renderMainPage(){
  console.log('renderMainPage')
  
  renderQuestion(0); //temp
  renderScore();
}

function renderQuestion(num){
  //console.log('renderQuestion')
  let html = questionBuilder(num);
  //console.log(html);
  $('.card').html(html);
  $('.js-questionNum').text(`Question ${num + 1} of ${STORE.questions.length}`);
  renderScore();
}

function renderScore(){
  // console.log('renderScore')
  $('.js-score').text(STORE.score);
}

function checkAnswer(ans){ //ans is full answer string
  let q = STORE.questions[STORE.currentQuestion];
  return ans === q.correctAnswer;
}

function renderAnswer(bool){
  let html = answerBuilder(bool);
  $('.card').html(html);
}

function answerBuilder(bool){
  let html = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>'
  if(bool){
    html = html.concat('<p>YOU\'RE WINNER</p>');
  } else {
    html = html.concat('<p>FAILURE</p>');
  }
  //html = html.concat(`<button id='${STORE.currentQuestion < STORE.questions.length - 1 ? 'next-question' : 'finish-quiz'}'>Submit Button Placeholder</button>`);
  html = html.concat('<button id=\'answer-page-button\'>Submit Button Placeholder</button>');
  return html;
}

function renderEnd(){
  console.log('renderEnd')
  $('.js-questionNum').remove();
  $('.js-score').remove();
  let score = STORE.score;
  let numQuestions = STORE.questions.length;
  let html = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

  <p>You correctly answered ${score} of ${numQuestions} questions</p>`;
  if (score === numQuestions){
    html = html.concat('A perfect score!');
  } else if (score > numQuestions) {
    html = '<p>Nice try, cheater</p>';
  } else if (score >= numQuestions * .8){
    html = html.concat('Good job');
  } else if (score >= numQuestions * .5){
    html = html.concat('Not bad');
  } else if (score < numQuestions * .25){
    html = html.concat('Worse than chance would suggest. Ouch.');
  }

  html.concat('button id=\'start-over\'>Start Over</button>')
}

function handleSubmitQuestionClick(){
  $('.js-card').on('click', '#submit-question', event => {
    // console.log(event);
    event.preventDefault();
    let answer = $('.radio:checked').val();
    if (answer){ //if nothing is checked answer is undefined, which is falsy
      let success = checkAnswer(answer);
      if(success){
        STORE.score++;
        renderScore();
      }
      renderAnswer(success);}
  });

}
function handleAnswerPageClick() {
  $('.js-card').on('click', '#answer-page-button', event => {
    event.preventDefault();
    if(STORE.currentQuestion + 1 < STORE.questions.length){
      STORE.currentQuestion++;
      renderQuestion(STORE.currentQuestion);
    } else {
      renderEnd();
    }
  });
}
function handleStartOverClick() {
  $('.js-card').on('click', '#answer-page-button', event => {
    event.preventDefault();
    renderMainPage();
  });
}

function start(){
  renderMainPage();
  //event handlers
  handleSubmitQuestionClick();
  handleAnswerPageClick();
  handleRestartClick();
}

$(start)