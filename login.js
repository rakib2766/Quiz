// Fetch student data from JSON file
async function loadStudentData() {
  try {
    const response = await fetch("./students.json");
    if (!response.ok) {
      throw new Error("Failed to load student data");
    }
    const data = await response.json();
    return data.students;
  } catch (error) {
    console.error("Error loading student data:", error);
    document.getElementById("login-error").textContent =
      "System error. Please try again later.";
    document.getElementById("login-error").style.display = "block";
    return [];
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const studentId = document.getElementById("student-id").value;
    const password = document.getElementById("student-password").value;
    const errorElement = document.getElementById("login-error");

    try {
      const students = await loadStudentData();
      const student = students.find(
        (s) => s.id === studentId && s.password === password
      );

      if (student) {
        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("studentId", student.id);
        sessionStorage.setItem("studentName", student.name);
        sessionStorage.setItem("studentBatch", student.batch);
        window.location.href = "index.html";
      } else {
        errorElement.textContent = "Invalid student ID or password!";
        errorElement.style.display = "block";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorElement.textContent = "Login failed. Please try again.";
      errorElement.style.display = "block";
    }
  });
