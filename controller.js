import * as model from "./model.js";
import view from "./view.js";

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
    // Get user inputs
    const inputs = view.getInputs();

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

    console.log(model.state);

    model.questionStatusUpdate();

    // console.log(model.state.questionsData.results[0].question);

    // // Show main quiz screen
    view.toggleScreens();
  } catch (error) {
    console.error("Error starting the test:", error);
  }
};

const displayQuestionScreen = async function () {
  try {
  } catch (error) {
    console.error("Error displaying Questions :", error);
  }
};

const init = function () {
  view.addHandlerStartTest(controlStartTest);
  controlFetchCategories(); // Fetch categories on page load
};

init();
