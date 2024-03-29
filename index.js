/*global STORE*/
'use strict';

let monsterPin = ['.mon4', '.diablos', '.rath', '.rathian', '.mon5'];
function startPageBuilder(){
  //doesn't really need to be a function but likely to be big enough that we'll want it out of the way
  return `<p>As a hunter, you may think you are purrfectly skilled at hunting monsters and crafting equipment. But every high ranking hunter knows that a hunter is only as good as their Palico! Well, Im here to see if you have what it takes to employ a feline of my purrowless!</p>
  <p>Its time we find YOUR hunter rank!</p>
  <img class="cat" src="images/cat1.png" alt="palico in leather armor">
  <form id='foo'></form>
  <button id='start-button' form='foo'>HUNT</button>`; //have to attach the button to a form for submit to work if we can't use on('click')
}

function checkAnswer(ans){ //ans is full answer string
  let q = STORE.questions[STORE.questionOrder[STORE.currentQuestion]];
  return ans === q.correctAnswer;
}

function answerBuilder(ans){
  let html;
  let moreQuestions = STORE.currentQuestion + 1 < STORE.questions.length;
  if(checkAnswer(ans)){
    html = `<p>That was purrfect!!! You just might have what it takes to employ me yet! ${moreQuestions ? 'Let\'s see if you can handle the next one!' : '</p><p>Let\'s take a look at how you did.'}</p>
            <img class="cat leather" src="images/nerg-cat.png" alt="palico in leather armor">`;
  } else {
    html = `<p>Are you even paying attention Hunter!? ${ans}?! Every G-Rank Hunter knows it was supposed to be ${STORE.questions[STORE.questionOrder[STORE.currentQuestion]].correctAnswer}.  ${moreQuestions ? 'Maybe you can redeem yourself on the next question.' : '</p><p>Let\'s take a look at how you did.'}</p>
      <img class="cat" src="images/disco-cat.png" alt="cat in a disco outfit!"> `;
  }
  //empty form to let submit work
  html = html.concat(`<form id='foo'></form><button id='answer-page-button' form='foo'>${moreQuestions ? 'HUNT' : 'Results'}</button>`);
  return html;
}

function questionBuilder(){
  let q = STORE.questions[STORE.questionOrder[STORE.currentQuestion]];
  let html = `<form id='question'>
    <fieldset>
      <legend>${q.question}</legend>`;
  //to randomize order of answers, make an array [0, 1, ..., index of last question], then shuffle it
  let rand = [];
  for (let i = 0; i < q.answers.length; i++){
    rand.push(i);
  }
  rand = shuffle(rand);
  for (let i = 0; i < q.answers.length; i++){
    let idx = rand[i];
    html = html.concat(`  <label class="answer" for="ans${idx}">
    <input class="radio" type="radio" id="ans${idx}" value="${q.answers[idx]}" name="ans" required>
    <span class="option">${q.answers[idx]}</span>
  </label>`);
  }
  html = html.concat(`</fieldset>
    <button id='submit-question'>SUBMIT</button>
</form>`);
  return html;
}

function shuffle(arr){ //Fisher-Yates algorithm
  let idx = arr.length;
  let temp;
  let randIdx;
  while (0 < idx){ //if idx is 0 we end up working on arr[-1]
    randIdx = Math.floor(Math.random() * idx); //pick a remaining element
    idx--;
    //swap it with arr[idx]
    temp = arr[idx];
    arr[idx] = arr[randIdx];
    arr[randIdx] = temp;
  }
  return arr;
}

function endPageBuilder(){
  let score = STORE.score;
  let numQuestions = STORE.questions.length;
  let html = `
  <p>The dust has settled in your epic quest for knowledge! Your weapons sharp, armor strong, your brain...
  Meow, lets see here, you correctly answered ${score} of ${numQuestions} questions.</p>`;
  if (score === numQuestions){
    html = html.concat('<span class="score">"Puurfect! You are a G-Rank Hunter!</span>');
  } else if (score > numQuestions) {
    html = '<p>Nice try, cheater</p>';
  } else if (score >= numQuestions * .8){
    html = html.concat(`<p> You're not bad, with some work I might be able to make you a certified G-Rank Hunter.</p>
      <img class="cat" src="images/shrug-cat.png" alt="">`);
  } else if (score >= numQuestions * .5){
    html = html.concat(`<p> ...Meow thats not bad, maybe you can hire my brother.</p>
      <img class="cat" src="images/shirt-cat.png" alt="Dopey looking cat in floral shirt">`);
  } else if (score < numQuestions * .25){
    html = html.concat(`<p> Ouch! You better focus on your research and less on the tasty meat!.</p>
      <img class="cat" src="images/pal-fly.png" alt="funny looking cat in butterfly costume">`);
  }

  html = html.concat('<form id=\'foo\'><button id=\'start-over\' form=\'foo\'>Hunt Again</button>');
  return html;
}

/* replace the entire content card html, and display progress if appropriate */

function render(ans = ''){
  let html = '<p>something went wrong</p>';
  const state = STORE.state;
  if ('end' === state || 'start' === state){
    $('.js-questionNum').text('');
    $('.js-score').text('');
  } else {
    $('.js-score').text(`Hunter Rank: ${STORE.score}`);
    $('.js-questionNum').text(`Question: ${STORE.currentQuestion + 1} of ${STORE.questions.length}`);
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

/* main control flow logic, called when button pressed
 * state flow: start -> question -> answer -> [back to question if there are more, else end]
 * end -> start
 */

function quizControl(answer = ''){
  switch(STORE.state){
  case 'start': //quiz start button
    STORE.state = 'question';
    STORE.questionOrder = shuffle(STORE.questionOrder); //randomize question order when quiz begins
    render();
    break;
  case 'question': //submit answer button
    if(checkAnswer(answer)) {
      STORE.score++;
      spawnMon(); //Spawn monster on right answers only
    }
    STORE.state = 'answer';
    render(answer);
    break;
  case 'answer': //next question/end page button
    ++STORE.currentQuestion < STORE.questions.length //prefix increment because we want the new value for comparison
      ? STORE.state = 'question' : STORE.state = 'end'; //checking if there are more questions to ask
    render();
    break;
  case 'end': //start over button
    fillMonsterPin();
    STORE.state = 'start';
    STORE.score = 0;
    STORE.currentQuestion = 0;
    render();
    break;
  default:
    // eslint-disable-next-line no-console
    console.error('invalid state, restarting');
    fillMonsterPin();
    STORE.state = 'start';
    STORE.score = 0;
    STORE.currentQuestion = 0;
    render();
  }
}

function fillMonsterPin() {
  monsterPin = ['.mon4', '.diablos', '.rath', '.rathian', '.mon5'];
  monsterPin = shuffle(monsterPin);
  monsterPin.forEach(x => $(x).animate({opacity: 0}));
  // console.log(monsterPin)
}

function spawnMon(){
  let activeMon = monsterPin.shift();
  // console.log({activeMon})
  // monsterPin.forEach(x => $(x).animate({opacity: 0}));
  $(activeMon).animate({opacity: 1});
}

function handleButtonSubmit(){
  $('.js-card').on('submit', '*', event => {
    event.preventDefault();
    if (STORE.state === 'question'){
      let answer = $('.radio:checked').val();
      quizControl(answer);

    } else {
      quizControl();
    }
    return false;
  });
}

function start(){
  render(); //render start page
  handleButtonSubmit(); //event handler
  //initialize question order array (will be randomized on start)
  for(let i = 0; i < STORE.questions.length; i++){
    STORE.questionOrder.push(i);
  }
}

$(start);
