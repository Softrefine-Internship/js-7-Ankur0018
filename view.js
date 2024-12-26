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
  #resultsScreen = document.querySelector(".results_screen");
  #questionCount = document.querySelector(".question_count");
  #questionHeader = document.querySelector(".question_header");
  #optionsContainer = document.querySelector(".options");
  #scoreElement = document.querySelector(".score");
  #finalScore = document.querySelector(".final_score");
  #errorModal = document.querySelector(".error_modal");
  #closeModalBtn = document.querySelector(".close_modal_btn");

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

  renderQuestion(question, index, totalQuestions, options) {
    this.#clearOptions();
    this.#questionHeader.innerHTML = question;
    this.#questionCount.innerHTML = `Question ${
      index + 1
    } of ${totalQuestions}`;
    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.classList.add("option");
      btn.innerHTML = option;
      this.#optionsContainer.appendChild(btn);
    });
  }

  highlightAnswers(selectedOption, correctAnswer) {
    // Make all buttons unclickable after an answer is selected
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      option.disabled = true;
      option.style.cursor = "not-allowed"; // Set cursor to not-allowed
      if (option.textContent === selectedOption) {
        option.classList.add(
          selectedOption === correctAnswer ? "correct" : "incorrect"
        );
      }
      if (
        option.textContent === correctAnswer &&
        selectedOption !== correctAnswer
      ) {
        option.classList.add("correct");
      }
    });
  }

  // Disable options after selection
  disableOptions() {
    document.querySelectorAll(".option").forEach((option) => {
      option.disabled = true;
    });
  }

  // Update the score display
  updateScore(score) {
    this.#scoreElement.textContent = `Score: ${score}`;
  }

  // Add handler for "Next" button
  addHandlerNavigation(handler) {
    document
      .querySelector(".next_question_btn")
      .addEventListener("click", handler);
  }

  addHandlerOptionSelect(handler) {
    this.#optionsContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains("option")) return;

      // Clear error message when an option is selected
      this.clearErrorMessage();

      // Pass selected option to the handler
      handler(e.target.textContent);
    });
  }

  addHandlerNavigation(handler) {
    document
      .querySelector(".next_question_btn")
      .addEventListener("click", () => handler(1));
  }

  #clearOptions() {
    this.#optionsContainer.innerHTML = "";
  }

  hideQuizScreen() {
    this.#quizScreen.classList.add("hidden");
  }

  // Toggle to results screen
  toggleResultsScreen() {
    this.#quizScreen.classList.add("hidden");
    this.#resultsScreen.classList.remove("hidden");
  }

  // Show final results
  showResults(score, totalQuestions) {
    this.#finalScore.textContent = `You scored ${score} out of ${totalQuestions}!`;
  }

  resetQuiz() {
    this.#resultsScreen.classList.add("hidden");
    this.#formScreen.classList.remove("hidden");

    this.resetQuizDataSelection();

    this.#scoreElement.textContent = `Score: 0`;
  }

  resetQuizDataSelection() {
    this.#questionAmount.value = "";
    this.#questionCategory.value = "any";
    this.#questionType.value = "any";
    this.#questionDifficulty.value = "any";
  }

  // Quit quiz and show results
  quitQuiz(score, totalQuestions) {
    this.#quizScreen.classList.add("hidden");
    this.#resultsScreen.classList.remove("hidden");
    this.showResults(score, totalQuestions);
  }

  // Restart quiz handler
  addHandlerRestart(handler) {
    document
      .querySelector(".play_new_quiz_btn")
      .addEventListener("click", handler);
  }

  // Quit quiz handler
  addHandlerQuit(handler) {
    document.querySelector(".quit_btn").addEventListener("click", handler);
  }

  //// Error modal

  showErrorModal(message) {
    const modalMessage = this.#errorModal.querySelector(".modal_message");
    modalMessage.textContent = message;
    this.#errorModal.classList.remove("hidden");
  }

  addHandlerCloseModal() {
    this.#closeModalBtn.addEventListener("click", () => {
      this.#errorModal.classList.add("hidden");
      this.resetQuizDataSelection();
      this.#formScreen.classList.remove("hidden");
    });
  }

  hidequizScreen() {
    this.#quizScreen.classList.add("hidden");
  }

  hideScreenExceptForm() {
    this.#quizScreen.classList.add("hidden");
    this.#timerScreen.classList.add("hiddden");
    this.#formScreen.classList.remove("hidden");
  }

  changeToSubmitButton() {
    const nextButton = document.querySelector(".next_question_btn");
    nextButton.textContent = "Submit Quiz";
    nextButton.classList.add("submit-btn");
  }

  changeToNextButton() {
    const nextButton = document.querySelector(".next_question_btn");
    nextButton.innerHTML = "Next &rarr;";
    nextButton.classList.remove("submit-btn");
  }

  displayErrorMessage(message) {
    let errorSpan = document.querySelector(".error-message");
    if (!errorSpan) {
      document
        .querySelector(".quiz_screen_main_container")
        .appendChild(errorSpan);
    }
    errorSpan.textContent = message;
  }

  clearErrorMessage() {
    const errorSpan = document.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = "";
    }
  }

  showModal(
    message,
    onConfirm = null,
    onCancel = null,
    confirmText = "OK",
    cancelText = "Cancel"
  ) {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");
    const modalMessage = modal.querySelector(".modal-message");
    const confirmButton = modal.querySelector(".modal-confirm");
    const cancelButton = modal.querySelector(".modal-cancel");

    // Update the modal content
    modalMessage.textContent = message;
    confirmButton.textContent = confirmText;
    cancelButton.textContent = cancelText;

    // Show the modal and overlay
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Remove existing event listeners to avoid stacking
    confirmButton.onclick = null;
    cancelButton.onclick = null;

    // new event listeners
    confirmButton.onclick = () => {
      this.hideModal();
      if (onConfirm) onConfirm();
    };

    cancelButton.onclick = () => {
      this.hideModal();
      if (onCancel) onCancel();
    };
  }

  hideModal() {
    const modal = document.querySelector(".modal");
    const overlay = document.querySelector(".overlay");

    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  }

  #loader = document.querySelector(".loader");

  // Show the loader
  showLoader() {
    this.#loader.classList.remove("hidden");
  }

  // Hide the loader
  hideLoader() {
    this.#loader.classList.add("hidden");
  }

  // Updated method for screen toggles
  toggleScreens() {
    this.#formScreen.classList.add("hidden");
    this.#quizScreen.classList.remove("hidden");
  }
}

export default new View();
