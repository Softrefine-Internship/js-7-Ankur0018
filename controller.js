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

const controlStartTest = async function () {
  try {
    // Reset score before starting a new test
    state.currentScore = 0;
    model.state.currentScore = 0;

    // Get user inputs
    const inputs = view.getInputs();

    if (!inputs.amount || inputs.amount <= 0) {
      view.showErrorModal(
        "Please enter a valid number of questions greater than 0."
      );

      view.hideAllScreens();
      return;
    }

    // Generate API URL
    model.state.API = model.generateAPI(
      inputs.amount,
      inputs.category,
      inputs.difficulty,
      inputs.type
    );

    // Start timer and fetch questions
    view.startTimer(5, () => view.hidetimerScreen());

    await model.fetchQuestions(model.state.API);

    if (model.state.questionsData.length < inputs.amount) {
      view.showErrorModal(
        "Not enough questions available. Please select a smaller number of questions or a different category."
      );
      view.hideAllScreens();
      return;
    }

    state.currentQuestionIndex = 0;

    // Show main quiz screen
    view.toggleScreens();

    console.log(model.state);

    renderCurrentQuestion();
  } catch (error) {
    console.error("Error starting the test:", error);
  }
};

const renderCurrentQuestion = function () {
  const questionData = model.state.questionsData[state.currentQuestionIndex];
  console.log(questionData);

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
  state.currentQuestionIndex++;

  console.log(state);

  if (state.currentQuestionIndex < model.state.questionsData.length) {
    // Render the next question
    renderCurrentQuestion();
  } else {
    // End the quiz and display results
    view.toggleResultsScreen();
    view.showResults(state.currentScore, model.state.questionsData.length);
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
  view.quitQuiz(state.currentScore, model.state.questionsData.length);
  state.currentQuestionIndex = 0;
  state.currentScore = 0;
};

const init = function () {
  view.addHandlerStartTest(controlStartTest);
  view.addHandlerOptionSelect(handleOptionSelect);
  view.addHandlerNavigation(handleNavigation);
  view.addHandlerRestart(handleRestartQuiz);
  view.addHandlerQuit(handleQuitQuiz);
  view.addHandlerCloseModal();
  controlFetchCategories();
};

init();
