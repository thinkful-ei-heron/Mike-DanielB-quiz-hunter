// defines a store to be used elsewhere, so: 
/* eslint-disable no-unused-vars */ 
'use strict';
const STORE = {
  questions: [  
    { 
      question: 'What monster was the featured monster for the release of Monster Hunter World?',
      answers: ['Vespoid', 'Kelbi', 'Nergigante', 'Raphinos'],
      correctAnswer: 'Nergigante'
    },
    { 
      question: 'Which monster was part of the Witcher crossover?',
      answers: ['Ancient Leshen', 'Pukei-Pukei', 'Tobi-Kadachi', 'Lavasoith'],
      correctAnswer: 'Ancient Leshen' 
    },
    { 
      question: 'Which brute wyvern is noted for having a huge crown atop its skull?',
      answers: ['Rathalos', 'Barroth', 'Lunastra', 'Great Girros'],
      correctAnswer: 'Barroth'
    },
    { 
      question: 'Which agile monster resembles a unicorn that can shoot lightning from its horn?',
      answers: ['Kirin', 'Diablos', 'Vaal Hazak', 'Xeno\'jiva'],
      correctAnswer: 'Kirin'
    },
    { 
      question: 'Which monster is covered in a golden mantel?',
      answers: ['Radobaan', 'Kulve Taroth', 'Odogaron', 'Legiana'],
      correctAnswer: 'Kulve Taroth'
    }
  ],
  currentQuestion: 0,
  score: 0,
  state: 'start' //valid values: 'start' for the start view, 'question' for a question view, 'answer' for an answer view, 'end' for final view
  //maybe should use enum?
};
