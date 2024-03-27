// 'Input' Container Elements
const inputContainer = document.querySelector("#input-container");
const inputForm = document.querySelector("#input-form");
const datePickerEl = document.querySelector("#date-picker");

// 'Countdown' Container Elements
const countdownContainer = document.querySelector("#countdown-container");
const countdownTitleEl = document.querySelector("#countdown-title");
const countdownButton = document.querySelector("#countdown-button");
const timeElements = document.querySelectorAll("span");

// 'Complete' Container Elements
const completeContainer = document.querySelector("#complete-container");
const completeInfoEl = document.querySelector("#complete-info");
const completeButton = document.querySelector("#complete-button");

// Global Variables
let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;

let savedCountdown; // An object to store title and date to save to localStorage

// Helper Constants
const second = 1000; // 1 second === 1000 milliseconds
const minute = second * 60; // 1 minute === 60 seconds
const hour = minute * 60; // 1 hour === 60 minutes
const day = hour * 24; // 1 day === 24 hours

// get today's date to set the date element's 'min' attribute
const today = new Date().toISOString().split("T")[0];
datePickerEl.setAttribute("min", today);

// updateDOM() function
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime(); // get the millisecond value from january 1 1970 until now
    const timeDifference = countdownValue - now;

    // Math for timeElements
    const days = Math.floor(timeDifference / day);
    const hours = Math.floor((timeDifference % day) / hour);
    const minutes = Math.floor((timeDifference % hour) / minute);
    const seconds = Math.floor((timeDifference % minute) / second);

    const timeValue = [days, hours, minutes, seconds];

    inputContainer.hidden = true;

    if (timeDifference < 0) {
      // Show 'Complete' Container
      completeContainer.hidden = false;
      countdownContainer.hidden = true;
      completeInfoEl.textContent = `Countdown for '${countdownTitle}' Completed!`;
      clearInterval(countdownActive);
    } else {
      // Populate timeElements
      timeElements.forEach((timeEl, i) => {
        timeEl.textContent = timeValue[i];
      });
      countdownTitleEl.textContent = `${countdownTitle}`;
      // Show 'Countdown' Container
      completeContainer.hidden = true;
      countdownContainer.hidden = false;
    }
  }, second);
}

// updateCountdown function, triggered when the user submits a form
function updateCountdown(e) {
  e.preventDefault();

  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;

  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  // getTime() on the input date, updateDOM
  countdownValue = new Date(countdownDate).getTime(); // get the millisecond value from January 1 1970 until 'countdownDate' value
  updateDOM();
}

// reset function
function reset() {
  clearInterval(countdownActive); // stop countdown functionality (setInterval)

  // Show 'Input' Container
  countdownContainer.hidden = true;
  completeContainer.hidden = true;
  inputContainer.hidden = false;

  // reset values
  countdownTitle = "";
  countdownDate = "";

  // reset localStorage Item
  localStorage.removeItem("countdown");
}

// Check if countdown data available on localStorage
function restoreData() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime(); // get the millisecond value from January 1 1970 until 'countdownDate' value
    updateDOM();
  }
}

// event listeners
inputForm.addEventListener("submit", updateCountdown);
countdownButton.addEventListener("click", reset);
completeButton.addEventListener("click", reset);

// On Load
restoreData();
