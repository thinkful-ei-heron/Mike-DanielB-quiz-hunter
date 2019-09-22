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
  return `<p>As a hunter, you may think you are purrfectly skilled at hunting monsters and crafting equipment. But every high ranking hunter knows that a hunter is only as good as their Palico! Well, Im here to see if you have what it takes to employ a feline of my purrowless!</p>
  <p>Its time we find YOUR hunter rank!</p>
  <button id='start-button'>HUNT</button>`;
}

function checkAnswer(ans){ //ans is full answer string
  let q = STORE.questions[STORE.currentQuestion];
  return ans === q.correctAnswer;
}

function answerBuilder(ans){
  let html;
  if(checkAnswer(ans)){
    html = '<p>That was purrfect!!! You just might have what it takes to employ me yet! Lets see if you can handle the next one!</p>';
  } else {
    html = `<p>Are you even paying attention Hunter!?</p>
    <p>${ans}?! Every G-Rank Hunter knows it was supposed to be ${STORE.questions[STORE.currentQuestion].correctAnswer}</p>`;
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
  let html = `
  <p>The dust has settled in your epic quest for knowledge! Your weapons sharp, armor strong, your brain...
  Meow, lets see here, you corectly answered ${score} of ${numQuestions} questions.</p>`;
  if (score === numQuestions){
    html = html.concat('<span class="score">"Puurfect! You are a G-Rank Hunter!</span>');
  } else if (score > numQuestions) {
    html = '<p>Nice try, cheater</p>';
  } else if (score >= numQuestions * .8){
    html = html.concat('<p> Your not bad, with some work I might be able to make you a certified G-Rank Hunter.</p>');
  } else if (score >= numQuestions * .5){
    html = html.concat('<p> ...Meow thats not bad, maybe you can hire my brother.</p>');
  } else if (score < numQuestions * .25){
    html = html.concat('<p> Ouch your a couple teeth short of a Taroth\'s Blaze. You have lots of hunting yet to do kid.</p>');
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
