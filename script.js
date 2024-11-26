// // // write javascript here

// DOM Selectors
const questionAmount = document.getElementById("trivia_amount");
const questionCategory = document.getElementById("trivia_category");
const questionType = document.getElementById("trivia_type");
const questionDifficulty = document.getElementById("trivia_difficulty");
const startTestBtn = document.getElementById("start_btn");
const formScreen = document.querySelector(".form_api");
const timerScreen = document.querySelector(".timer_screen");
const timerElement = document.querySelector(".timer");

// Fetch categories on page load
const fetchCategories = async function () {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();

    // Populating the category dropdown
    data.trivia_categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      questionCategory.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

// Function to fetch questions based on selected parameters
const generateQuestions = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

// Generate API URL based on user inputs
const generate_API = function () {
  const amount = questionAmount.value;
  const category_id = questionCategory.value;
  const difficulty_level = questionDifficulty.value;
  const difficulty_type = questionType.value === "MCQ" ? "multiple" : "boolean";

  return `https://opentdb.com/api.php?amount=${amount}&category=${category_id}&difficulty=${difficulty_level}&type=${difficulty_type}`;
};

const startTimer = function (duration, callback) {
  let timeLeft = duration;
  timerElement.textContent = timeLeft;

  const countdown = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      callback();
    }
  }, 1000);
};

// Event listener for the start button
startTestBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  const API_URL = generate_API();
  state.API = API_URL;
  console.log(API_URL);

  // Start the timer and fetch questions after 5 seconds
  startTimer(5, () => {
    timerScreen.classList.add("hidden");
  });

  const data = await generateQuestions(API_URL);
  state.questionsData.push(data);
  // Hide the form screen
  formScreen.classList.add("hidden");
  timerScreen.classList.remove("hidden");
});

// Fetch categories on page load
fetchCategories();

/////////////////////////////////////////////////////////////////////////////////////////
// Main QUIZ SCREEN

const state = {
  API: ``,
  questionsData: [],
};

console.log(state);
console.log(state.questionsData[0].results[0]);
