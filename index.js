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
STORE = [
  {
    question: 'What color is the youtube icon?', 
    possibleAnswers: ['red', 'green', 'blue', 'purple'],
    correctAnswer: 'red',
    imageAsset: 'url'
  }
]
function questionBuilder(){
  console.log('questionBuilder')
}

function renderMainPage(){
  console.log('renderMainPage')
}

function renderQuestion(){
  console.log('renderQuestion')
}

function renderScore(){
  console.log('renderScore')
}

function storeAnswer(){
  console.log('storeAnser')
}

function renderAnswer(){
  console.log('renderAnswer')
}

function renderEnd(){
  console.log('renderEnd')
}

function start(){
  questionBuilder()
  renderQuestion()
  renderAnswer()
  renderEnd()
}

$(start)
