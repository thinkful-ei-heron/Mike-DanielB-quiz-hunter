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

const testMode = true;

function startPageBuilder(){
  //doesn't really need to be a function but likely to be big enough that we'll want it out of the way
  return `<p>As a hunter, you'r skilled at hunting monsters in a variety of habitats. But every high ranking hunter knows that knowledge is key.</p>
  <p>Its time to find YOUR hunter rank!</p>
  <button id='start-button'>HUNT</button>`;
}

function checkAnswer(ans){ //ans is full answer string
  let q = STORE.questions[STORE.currentQuestion];
  return ans === q.correctAnswer;
}

function answerBuilder(ans){
  let html;
  if(checkAnswer(ans)){
    html = '<p>YOU\'RE WINNER</p>';
  } else {
    html = `<p>FAILURE</p>
    <p>You answered ${ans} but the correct answer was ${STORE.questions[STORE.currentQuestion].correctAnswer}</p>`;
  }
  html = html.concat(`<button id='answer-page-button'>${STORE.currentQuestion + 1 < STORE.questions.length ? 'HUNT' : 'Results'}</button>`);
  return html;
}

function questionBuilder(){
  let q = STORE.questions[STORE.currentQuestion];
  let html = `<form id='question'>
    <fieldset>
      <li>${q.question}</li>`;
  for (let i = 0; i < q.answers.length; i++){
    html = html.concat(`  <label class="answer" for="">
    <input class="radio" type="radio" id="ans${i}" value="${q.answers[i]}" name="ans" required>
    <span class="option">${q.answers[i]}</span>
  </label>`);
  }
  html = html.concat(`
    <button id='submit-question'>SUBMIT</button>
    ${testMode ? '<button id=\'test-skip\'>TEST: skip question</button>' : ''}
  </fieldset>
</form>`); //TODO: don't forget to remove TEST button
  return html;
}

function endPageBuilder(){
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

  html = html.concat('<button id=\'start-over\'>Hunt Again</button>');
  return html;
}

function render(ans = ''){
  let html = '<p>something went wrong</p>';
  const state = STORE.state;
  if ('end' === state || 'start' === state){
    $('.js-questionNum').hide();
    $('.js-score').hide();
  } else {
    $('.js-score').show().text(`Hunter Rank: ${STORE.score}`);
    $('.js-questionNum').show().text(`Question: ${STORE.currentQuestion + 1} of ${STORE.questions.length}`);
  }
  switch(state){
  case 'start':
    html = startPageBuilder();
    break;
  case 'question':
    html = questionBuilder();
    break;
  case 'answer':
    html = answerBuilder(ans);
    break;
  case 'end':
    html = endPageBuilder();    
  }

  $('.card').html(html);
}

function quizControl(answer = ''){
  switch(STORE.state){
  case 'start':
    STORE.state = 'question';
    render();
    break;
  case 'question':
    if(checkAnswer(answer)) STORE.score++;
    STORE.state = 'answer';
    render(answer);
    break;
  case 'answer':
    ++STORE.currentQuestion < STORE.questions.length //prefix increment because we want the new value for comparison
      ? STORE.state = 'question' : STORE.state = 'end';
    render();
    break;
  case 'end':
    STORE.state = 'start';
    STORE.score = 0;
    STORE.currentQuestion = 0;
    render();
    break;
  default:
    // eslint-disable-next-line no-console
    console.error('invalid state, restarting');
    STORE.state = 'start';
    render();
  }
}

function handleButtonClick(){
  $('.js-card').on('click', 'button', event => {
    event.preventDefault();
    if (STORE.state === 'question'){
      if (testMode && event.target.id === 'test-skip'){ //TODO: don't forget to remove
        quizControl(STORE.questions[STORE.currentQuestion].correctAnswer);
      }
      let answer = $('.radio:checked').val();
      //TODO: required doesn't seem to be working, workaround below
      if (answer){ //if nothing selected, answer is undefined which is falsy
        quizControl(answer);
      } else {
        document.getElementById('question').reportValidity(); //N.B. jQuery objects do not currently support reportValidity()
      }
    } else {
      quizControl();
    } 
  });
}

function start(){
  render(); //render start page
  handleButtonClick(); //event handler
}

$(start);
