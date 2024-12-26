import * as model from "./model.js";
import view from "./view.js";

const state = {
  currentQuestionIndex: 0, // Tracking current question
  currentScore: 0, // Tracking score
};

const controlFetchCategories = async function () {
  try {
    // Fetch and render trivia categories
    const categories = await model.fetchCategories();
    view.renderCategories(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// const controlStartTest = async function () {
//   try {
//     // Reset score before starting a new test
//     state.currentScore = 0;
//     model.state.currentScore = 0;

//     // Get user inputs
//     const inputs = view.getInputs();

//     if (!inputs.amount || inputs.amount <= 0) {
//       view.showModal(
//         "Please enter a valid number of questions.",
//         () => {
//           view.resetQuizDataSelection();
//         },
//         () => {
//           console.log("Validation error");
//         }
//       );
//       return;
//     }

//     // Generate API URL
//     model.state.API = model.generateAPI(
//       inputs.amount,
//       inputs.category,
//       inputs.difficulty,
//       inputs.type
//     );

//     // Start timer and fetch questions
//     view.startTimer(5, () => view.hidetimerScreen());

//     await model.fetchQuestions(model.state.API);

//     state.currentQuestionIndex = 0;

//     // Show main quiz screen
//     view.toggleScreens();

//     console.log(model.state);

//     if (model.state.questionsData.length < inputs.amount) {
//       view.hideScreenExceptForm();
//       view.showModal(
//         "Not enough questions available. Please select a smaller number or a different category.",
//         () => {
//           view.resetQuizDataSelection();
//         },
//         () => {
//           console.log(`API Error`);
//         }
//       );
//       return;
//     } else {
//       renderCurrentQuestion();
//     }
//   } catch (error) {
//     console.error("Error starting the test:", error);
//   }
// };

const controlStartTest = async function () {
  try {
    state.currentScore = 0;
    model.state.currentScore = 0;

    const inputs = view.getInputs();

    if (!inputs.amount || inputs.amount <= 0) {
      view.showModal(
        "Please enter a valid number of questions.",
        () => {
          view.resetQuizDataSelection();
        },
        () => {
          console.log("Validation error");
        }
      );
      return;
    }

    model.state.API = model.generateAPI(
      inputs.amount,
      inputs.category,
      inputs.difficulty,
      inputs.type
    );

    // Show loader while fetching questions
    view.showLoader();

    await model.fetchQuestions(model.state.API);

    // Hide loader and transition to quiz screen
    view.hideLoader();

    state.currentQuestionIndex = 0;

    if (model.state.questionsData.length < inputs.amount) {
      view.hideScreenExceptForm();
      view.showModal(
        "Not enough questions available. Please select a smaller number or a different category.",
        () => {
          view.resetQuizDataSelection();
        },
        () => {
          console.log(`API Error`);
        }
      );
      return;
    } else {
      view.toggleScreens();
      renderCurrentQuestion();
    }
  } catch (error) {
    console.error("Error starting the test:", error);
    view.hideLoader();
  }
};

const renderCurrentQuestion = function () {
  const questionData = model.state.questionsData[state.currentQuestionIndex];
  const question = questionData.question;
  const options = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];

  // Shuffling Options to randomize
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  // Displaying Questions and options
  view.renderQuestion(
    question,
    state.currentQuestionIndex,
    model.state.questionsData.length,
    shuffledOptions
  );

  // Change button text to "Submit Quiz" on the last question
  if (state.currentQuestionIndex === model.state.questionsData.length - 1) {
    view.changeToSubmitButton();
  } else {
    view.changeToNextButton();
  }
};

const handleOptionSelect = function (selectedOption) {
  const questionData = model.state.questionsData[state.currentQuestionIndex];
  const correctAnswer = questionData.correct_answer;

  // Identifying correct and incorrect options

  const isCorrect = selectedOption === correctAnswer;

  // Highlight correct and incorrect answers
  view.highlightAnswers(selectedOption, correctAnswer);

  // Update Score if the answer is correct
  if (isCorrect) {
    state.currentScore++;
  }

  view.updateScore(state.currentScore);
  // DIsable options after selections
  view.disableOptions();

  // setTimeout(() => {
  //   handleNavigation();
  // }, 1000);
};

// Navigation Logic for next button

const handleNavigation = function () {
  const nextButton = document.querySelector(".next_question_btn");
  const isSubmitButton = nextButton.classList.contains("submit-btn");

  if (isSubmitButton) {
    // End the quiz and display results
    view.toggleResultsScreen();
    view.showResults(state.currentScore, model.state.questionsData.length);
    return;
  }

  const options = document.querySelectorAll(".option");
  const isOptionSelected = Array.from(options).some(
    (option) =>
      option.classList.contains("correct") ||
      option.classList.contains("incorrect")
  );

  if (!isOptionSelected) {
    view.displayErrorMessage("Please select an option before proceeding.");
    return;
  }

  // Clear error message if present
  view.clearErrorMessage();

  // Move to the next question
  state.currentQuestionIndex++;

  if (state.currentQuestionIndex < model.state.questionsData.length) {
    // Render the next question
    renderCurrentQuestion();
  }
};

// Adding event handlers for restart and quit functionality
const handleRestartQuiz = function () {
  // Reset quiz state
  state.currentQuestionIndex = 0;
  state.currentScore = 0;
  model.state.currentScore = 0;

  view.resetQuiz();
  controlFetchCategories();
};

const handleQuitQuiz = function () {
  view.showModal(
    "Are you sure you want to quit the Quiz?",
    () => {
      // Confirm action
      view.quitQuiz(state.currentScore, model.state.questionsData.length);
      state.currentQuestionIndex = 0;
      state.currentScore = 0;
    },
    () => {
      // Cancel action
      console.log("Quit cancelled");
    },
    "Yes, Quit",
    "No, Stay"
  );
};

const init = function () {
  controlFetchCategories();
  view.addHandlerStartTest(controlStartTest);
  view.addHandlerOptionSelect(handleOptionSelect);
  view.addHandlerNavigation(handleNavigation);
  view.addHandlerRestart(handleRestartQuiz);
  view.addHandlerQuit(handleQuitQuiz);
  view.addHandlerCloseModal();
};

init();
