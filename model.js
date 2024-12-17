export const state = {
  API: ``,
  questionsData: [],
  currentQuestionIndex: 0,
  questionStatus: {
    question_No: ``,
    question: ``,
    options: [],
  },
  currentScore: 0,
  quizComplete: false,
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
  let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

  if (category !== "any") apiUrl += `&category=${category}`;

  if (difficulty !== "any") apiUrl += `&difficulty=${difficulty}`;

  if (type !== "any") {
    const difficultyType = type === "MCQ" ? "multiple" : "boolean";
    apiUrl += `&type=${difficultyType}`;
  }

  return apiUrl;
};

// Fetch questions based on the API URL
export const fetchQuestions = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // state.questionsData = data; // Update the state with fetched questions

    state.questionsData = data.results.map((q) => ({
      question: q.question,
      options: [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      ),
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
    }));
    state.currentQuestionIndex = 0;
    state.currentScore = 0;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
