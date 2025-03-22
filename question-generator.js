document.addEventListener("DOMContentLoaded", function () {
  // Prevent accidental page closure/refresh
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  // Prevent Ctrl+R and F5
  window.addEventListener("keydown", (e) => {
    if ((e.key === "r" && (e.ctrlKey || e.metaKey)) || e.key === "F5") {
      e.preventDefault();
      if (
        confirm(
          "Are you sure you want to refresh? Any unsaved changes will be lost."
        )
      ) {
        window.location.reload();
      }
    }
  });

  const form = document.getElementById("questionForm");
  const output = document.getElementById("output");
  const hasImage = document.getElementById("hasImage");
  const imageInput = document.getElementById("imageInput");
  const copyButton = document.getElementById("copyButton");
  const resetButton = document.getElementById("resetButton");

  let generatedQuestions = { questions: [] }; // Initialize empty questions array

  hasImage.addEventListener("change", function () {
    imageInput.className = this.checked ? "show" : "";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const question = document.getElementById("question").value;
    const answers = Array.from(document.getElementsByClassName("answer")).map(
      (input) => input.value
    );
    const correct = parseInt(document.getElementById("correct").value);

    const newQuestion = {
      question: question,
      image: hasImage.checked ? imageInput.value : undefined,
      answers: answers,
      correct: correct,
    };

    // Remove undefined image property if not using image
    if (!hasImage.checked) {
      delete newQuestion.image;
    }

    // Add new question to array
    generatedQuestions.questions.push(newQuestion);

    // Format for JSON file
    const jsonFormat = JSON.stringify(generatedQuestions, null, 2);
    output.textContent = jsonFormat;
  });

  copyButton.addEventListener("click", function () {
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Copied to clipboard!");
  });

  resetButton.addEventListener("click", function () {
    // Reset the form completely
    form.reset();

    // Reset the image input default value and class
    imageInput.value = "images/questions/";
    imageInput.className = "";
  });
});
