class View {
  // Selectors
  #questionAmount = document.getElementById("trivia_amount");
  #questionCategory = document.getElementById("trivia_category");
  #questionType = document.getElementById("trivia_type");
  #questionDifficulty = document.getElementById("trivia_difficulty");
  #startTestBtn = document.getElementById("start_btn");
  #formScreen = document.querySelector(".form_api");
  #timerScreen = document.querySelector(".timer_screen");
  #timerElement = document.querySelector(".timer");
  #quizScreen = document.querySelector(".quiz_screen");
  #question_header = document.querySelector(".question_header");
  #options = document.querySelector(".options");

  // Render categories in the dropdown
  renderCategories(categories) {
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      this.#questionCategory.appendChild(option);
    });
  }

  // Get user inputs for API generation
  getInputs() {
    return {
      amount: this.#questionAmount.value,
      category: this.#questionCategory.value,
      difficulty: this.#questionDifficulty.value,
      type: this.#questionType.value,
    };
  }

  // Display timer countdown
  startTimer(duration, callback) {
    let timeLeft = duration;
    this.#timerElement.textContent = timeLeft;

    const countdown = setInterval(() => {
      timeLeft--;
      this.#timerElement.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        callback();
      }
    }, 1000);
  }

  // hide timer screen

  hidetimerScreen() {
    this.#timerScreen.classList.add("hidden");
    this.#quizScreen.classList.remove("hidden");
  }

  // Hide or show screens
  toggleScreens() {
    this.#formScreen.classList.add("hidden");
    this.#timerScreen.classList.remove("hidden");
  }

  // Add event listener for the start button
  addHandlerStartTest(handler) {
    this.#startTestBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  }

  /// Quiz Screen View

  clearQuestionsContainer() {
    this.#question_header.textContent = "";
    this.#options.textContent = "";
  }
}

export default new View();
