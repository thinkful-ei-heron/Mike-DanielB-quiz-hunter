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
    html = html.concat(`  <label class="" for="">
    <input class="radio" type="radio" id="ans${i}" value="" name="" required>
    <span>${q.answers[i]}</span>
  </label>`);
  }
  html = html.concat(`
  </fieldset>
</form>`);
  return html;
}

function renderMainPage(){
  console.log('renderMainPage')
}

function renderQuestion(num){
  //console.log('renderQuestion')
  let html = questionBuilder(num);
  //console.log(html);
  $('.card').html(html);
  $('.question').text(`Question ${num + 1} of ${STORE.questions.length}`);
  renderScore();
}

function renderScore(){
  console.log('renderScore')
  $('.score').text(STORE.score);
}

function storeAnswer(questionId, ans){ //ans is full answer string
  console.log('storeAnswer');
  let q = STORE.questions[questionId];
  if (ans === q.answers[q.correctAnswer]){
    STORE.score++;
  }
}

function renderAnswer(){
  console.log('renderAnswer')
}

function renderEnd(){
  console.log('renderEnd')
}



function start(){
  //renderMainPage();
  renderScore();
  renderQuestion(0);
  // renderAnswer()
  // renderEnd()
}

$(start)
