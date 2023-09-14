"use strict";

// Змінні для перекладу
const translations = {
  en: {
    pageTitle: "Dates",
    languageLabel: "Select language",
    tab1: "Calculate time interval",
    tab2: "Holidays list",
    presetsLabel: "Presets",
    daysPreset: "Days",
    monthPreset: "Month (30 days)",
    weekPreset: "Week (7 days)",
    dateRange: "Date range",
    optionsLabel: "Options",
    allOption: "All days",
    weekdaysOption: "Weekdays",
    weekendsOption: "Weekends",
    resultTypeLabel: "Result type",
    daysResultType: "Days",
    hoursResultType: "Hours",
    minutesResultType: "Minutes",
    secondsResultType: "Seconds",
    calculateBtn: "Calculate",
    timeIntervalTitle: "Time interval",
    historyTitle: "History",
    historyResult: "Result",
    day: ["day", "days"],
    hour: ["hour", "hours"],
    minute: ["minute", "minutes"],
    second: ["second", "seconds"],
    errorEndDateEarlier: "End date cannot be earlier than start date.",
    countryLabel: "Select country",
    getHolidaysBtn: "Get holidays",
    errorFetchCountries:
      "Error while fetching countries data. Please try again later.",
    errorFetchHolidays:
      "Error while fetching holidays data. Please try again later.",
    noData: "No data available for the selected country and year.",
    fetchError: "Error fetching holidays.",
    dateTitle: "Date",
    holidayTitle: "Holiday",
  },
  uk: {
    pageTitle: "Дати",
    languageLabel: "Оберіть мову",
    tab1: "Розрахувати інтервал часу",
    tab2: "Список свят",
    presetsLabel: "Пресети",
    daysPreset: "Дні",
    monthPreset: "Місяць (30 днів)",
    weekPreset: "Тиждень (7 днів)",
    dateRange: "Діапазон дат",
    optionsLabel: "Опції",
    allOption: "Всі дні",
    weekdaysOption: "Будні дні",
    weekendsOption: "Вихідні дні",
    resultTypeLabel: "Тип результату",
    daysResultType: "Дні",
    hoursResultType: "Години",
    minutesResultType: "Хвилини",
    secondsResultType: "Секунди",
    calculateBtn: "Розрахувати",
    timeIntervalTitle: "Інтервал часу",
    historyTitle: "Історія",
    historyResult: "Результат",
    day: ["день", "дні", "днів"],
    hour: ["година", "години", "годин"],
    minute: ["хвилина", "хвилини", "хвилин"], // Додано хвилини для української
    second: ["секунда", "секунди", "секунд"],
    errorEndDateEarlier: "Кінцева дата не може бути раніше початкової.",
    countryLabel: "Оберіть країну",
    getHolidaysBtn: "Отримати свята",
    errorFetchCountries:
      "Помилка під час отримання даних про країни. Будь ласка, спробуйте пізніше.",
    errorFetchHolidays:
      "Помилка під час отримання даних про свята. Будь ласка, спробуйте пізніше.",
    noData: "Немає даних про свята для обраної країни та року.",
    fetchError: "Помилка під час отримання свят.",
    dateTitle: "Дата",
    holidayTitle: "Свято",
  },
};

// Встановлення мови за замовчуванням (англійська)
let currentLang = "en";

window.onload = function () {
  changeLanguage("en");
  document.getElementById("languageSelect").value = "en";
};

// Функція для зміни мови
function changeLanguage(lang) {
  currentLang = lang;
  // Оновлюємо всі тексти згідно обраної мови
  updateTexts();
  updateHistoryLocalization();
}

// Функція для оновлення текстів на сторінці згідно обраної мови
function updateTexts() {
  const texts = document.querySelectorAll("[data-translate]");
  texts.forEach((element) => {
    const key = element.getAttribute("data-translate");
    const langText = translations[currentLang][key];
    if (langText) {
      element.textContent = langText;
    }
  });
}

function updateHistoryLocalization() {
  for (let i = 1; i < historyTable.rows.length; i++) {
    const row = historyTable.rows[i];
    const resultText = row.cells[1].textContent;
    const resultValue = parseInt(resultText, 10);
    const resultType = resultText.match(/\D+$/)[0].trim();

    const localizedResultType =
      translations[currentLang][resultType.toLowerCase()] || resultType;
    row.cells[1].textContent = `${resultValue} ${localizedResultType}`;
  }
}

let countrySelect, yearSelect, resultBlock2, holidaysForm;

// Перемикач табів
function changeTab(tabIndex) {
  const tabs = document.querySelectorAll(".tabs__item");
  const tabContents = document.querySelectorAll(".tabs-content__tab");

  tabs.forEach((tab, index) => {
    if (index + 1 === tabIndex) {
      tab.classList.add("active");
      tabContents[index].classList.add("active");
    } else {
      tab.classList.remove("active");
      tabContents[index].classList.remove("active");
    }
  });

  if (tabIndex === 2) {
    // Запит на отримання списку країн тільки при переході на таб 2
    populateCountries();
  }
}
// Функція для заповнення списку країн
function populateCountries() {
  const countrySelect = document.getElementById("country");
  axios
    .get(
      "https://calendarific.com/api/v2/countries?api_key=y0gvssxCHpIsHkei0jnIwt74Zsf5cfAE"
    )
    .then((response) => {
      const countries = response.data.response.countries;
      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country["iso-3166"];
        option.textContent = country.country_name;
        option.classList.add("tabs-content__option");
        countrySelect.appendChild(option);
      });
    })
    .catch((error) =>
      console.error(translations[currentLang].errorFetchCountries, error)
    );
}
// Глобальні змінні
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const dateForm = document.querySelector(".tabs-content__date-form");
const resultBlock1 = document.getElementById("result1");
const historyTable = document.getElementById("historyTable");
const presets = document.getElementsByName("preset");

function getLocalizedUnit(value, unitsArray) {
  if (currentLang === "uk") {
    const lastDigit = value % 10;

    if (value === 1) {
      return unitsArray[0];
    } else if (value % 100 === 11) {
      return unitsArray[2]; // особливий випадок для числа 11
    } else if (lastDigit === 1) {
      return unitsArray[0];
    } else if (lastDigit > 1 && lastDigit < 5) {
      return unitsArray[1];
    } else {
      return unitsArray[2];
    }
  } else {
    return value === 1 ? unitsArray[0] : unitsArray[1];
  }
}
function handleDateChange() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);

  if (daysDiff !== 7 && daysDiff !== 30) {
    document.getElementById("preset-0").checked = true;
  }
}

// Функція для розрахунку інтервалу часу
function calculateTimeInterval(event) {
  event.preventDefault();

  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (startDate > endDate) {
    alert(translations[currentLang].errorEndDateEarlier);
    return;
  }

  const presetValue = document.querySelector(
    'input[name="preset"]:checked'
  ).value;
  const optionsValue = document.querySelector(
    'input[name="options"]:checked'
  ).value;
  const resultTypeValue = document.querySelector(
    'input[name="result-type"]:checked'
  ).value;

  const timeDiff = endDate - startDate;
  let timeInterval = timeDiff / (1000 * 60 * 60 * 24);

  if (optionsValue === "Weekdays") {
    let days = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    timeInterval = days;
  } else if (optionsValue === "Weekends") {
    let days = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    timeInterval = days;
  }

  if (resultTypeValue === "hours") {
    timeInterval *= 24;
  } else if (resultTypeValue === "minutes") {
    timeInterval *= 24 * 60;
  } else if (resultTypeValue === "seconds") {
    timeInterval *= 24 * 60 * 60;
  }

  let localizedResult;
  if (resultTypeValue === "days") {
    localizedResult = getLocalizedUnit(
      Math.floor(timeInterval),
      translations[currentLang].day
    );
  } else if (resultTypeValue === "hours") {
    localizedResult = getLocalizedUnit(
      Math.floor(timeInterval),
      translations[currentLang].hour
    );
  } else if (resultTypeValue === "minutes") {
    localizedResult = getLocalizedUnit(
      Math.floor(timeInterval),
      translations[currentLang].minute
    );
  } else if (resultTypeValue === "seconds") {
    localizedResult = getLocalizedUnit(
      Math.floor(timeInterval),
      translations[currentLang].second
    );
  }
  // Виведення результату
  resultBlock1.innerHTML = `<p>${
    translations[currentLang]["timeIntervalTitle"]
  }: ${Math.floor(timeInterval)} ${localizedResult}</p>`;

  startDateInput.addEventListener("change", handleDateChange);
  endDateInput.addEventListener("change", handleDateChange);

  // Оновлення історії
  const historyRow = document.createElement("tr");
  historyRow.innerHTML = `<td>${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</td><td>${Math.floor(
    timeInterval
  )} ${localizedResult}</td>`;

  if (historyTable.rows.length >= 10) {
    historyTable.deleteRow(1);
  }

  historyTable.appendChild(historyRow);

  // Збереження історії в localStorage
  const historyData = [];
  for (let i = 1; i < historyTable.rows.length; i++) {
    const row = historyTable.rows[i];
    const dateRange = row.cells[0].textContent;
    const result = row.cells[1].textContent;
    historyData.push({ dateRange, result });
  }
  localStorage.setItem("history", JSON.stringify(historyData));
}

// Функція для отримання сьогоднішньої дати у форматі 'YYYY-MM-DD'
function getCurrentDateAsString() {
  const today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
}

// Прикріплюємо обробник події для відправки форми
dateForm.addEventListener("submit", calculateTimeInterval);

// Прикріплюємо обробник події для вибору пресету
for (const preset of presets) {
  preset.addEventListener("change", function () {
    if (!startDateInput.value) {
      startDateInput.value = getCurrentDateAsString();
    }
    if (preset.checked) {
      // Оновлена функція updateEndDate()
      const startDate = new Date(startDateInput.value);
      const presetValue = document.querySelector(
        'input[name="preset"]:checked'
      ).value;
      let daysToAdd = 0;

      if (presetValue === "7") {
        daysToAdd = 7;
      } else if (presetValue === "30") {
        daysToAdd = 30;
      }

      const endDate = new Date(
        startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );
      endDateInput.value = endDate.toISOString().slice(0, 10);
    }
  });
}

// Завантажуємо історію з localStorage
const savedHistory = JSON.parse(localStorage.getItem("history"));
if (savedHistory) {
  for (const item of savedHistory) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.dateRange}</td><td>${item.result}</td>`;
    historyTable.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const countrySelect = document.getElementById("country");
  const yearSelect = document.getElementById("year");
  const resultBlock2 = document.getElementById("result2");
  const holidaysForm = document.getElementById("holidays-form");

  let dateAscending = false;

  function sortHolidaysByDate(holidays) {
    holidays.sort((a, b) => {
      const dateA = new Date(a.date.iso);
      const dateB = new Date(b.date.iso);
      return dateAscending ? dateA - dateB : dateB - dateA;
    });
    dateAscending = !dateAscending;
  }

  yearSelect.disabled = true;

  countrySelect.addEventListener("change", function () {
    const selectedCountry = countrySelect.value;
    const currentYear = new Date().getFullYear();
    if (selectedCountry === "select-country") {
      yearSelect.disabled = true;
      yearSelect.value = currentYear;
    } else {
      yearSelect.disabled = false;
      yearSelect.value = currentYear;
    }
  });

  function populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = 2001; year <= 2049; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year === currentYear) {
        option.selected = true;
      }
      option.classList.add("tabs-content__option");
      yearSelect.appendChild(option);
    }
  }

  async function getHolidays(country, year) {
    try {
      const apiKey = "y0gvssxCHpIsHkei0jnIwt74Zsf5cfAE";
      const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;

      const response = await axios.get(url);
      const data = response.data;

      if (
        data.response &&
        data.response.holidays &&
        data.response.holidays.length > 0
      ) {
        displayHolidays(data.response.holidays);
      } else {
        resultBlock2.innerHTML = translations[currentLang].noData;
      }
    } catch (error) {
      console.error(translations[currentLang].errorFetchHolidays, error);
      resultBlock2.innerHTML = translations[currentLang].errorFetchHolidays;
    }
  }

  function displayHolidays(holidays) {
    resultBlock2.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add("custom-table");
    const thead = table.createTHead();
    const row = thead.insertRow();
    const dateHeader = row.insertCell(0);
    const nameHeader = row.insertCell(1);
    dateHeader.style.cursor = "pointer";

    // Створюємо іконку для заголовка "дата"
    const dateIcon = document.createElement("i");
    if (dateAscending) {
      dateIcon.className = "fa-solid fa-arrow-up";
    } else {
      dateIcon.className = "fa-solid fa-arrow-down";
    }

    // Додаємо текст і іконку до заголовка "дата"
    dateHeader.textContent = translations[currentLang].dateTitle + " ";
    dateHeader.appendChild(dateIcon);

    nameHeader.textContent = translations[currentLang].holidayTitle;

    dateHeader.addEventListener("click", function () {
      sortHolidaysByDate(holidays);

      // Оновлення іконки в заголовку "дата"
      if (dateAscending) {
        dateIcon.className = "fa-solid fa-arrow-up";
      } else {
        dateIcon.className = "fa-solid fa-arrow-down";
      }

      displayHolidays(holidays);
    });

    const tbody = table.createTBody();
    holidays.forEach((holiday) => {
      const row = tbody.insertRow();
      const dateCell = row.insertCell(0);
      const nameCell = row.insertCell(1);
      dateCell.textContent = formatDate(holiday.date.iso);
      nameCell.textContent = holiday.name;
    });

    resultBlock2.appendChild(table);
  }

  holidaysForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const selectedCountry = countrySelect.value;
    const selectedYear = yearSelect.value;
    await getHolidays(selectedCountry, selectedYear);
  });

  populateYears();
});
