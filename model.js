export const state = {
  API: ``,
  questionsData: [],
  questionStatus: {
    question_No: ``,
    question: ``,
    options: [],
  },
};

// Fetch trivia categories
export const fetchCategories = async function () {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Generate API URL based on user inputs
export const generateAPI = function (amount, category, difficulty, type) {
  const difficultyType = type === "MCQ" ? "multiple" : "boolean";
  return `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${difficultyType}`;
};

// Fetch questions based on the API URL
export const fetchQuestions = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    state.questionsData = data; // Update the state with fetched questions
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const questionStatusUpdate = function () {
  try {
    // if (state.questionsData.length >= 0) {
    state.questionStatus.question = state.questionsData.results[0].question;
    state.questionStatus.options = [
      ...state.questionsData.results[0].incorrect_answers,
      state.questionsData.results[0].correct_answer,
    ];
    // } else {
    //   console.log("No questions to update");
  } catch (error) {
    console.error("Error Displaying Questions", error);
  }
};
