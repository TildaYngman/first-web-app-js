function todaysDate() {
    let date = new Date();
    date = date.getFullYear() + '-' + checkDateLength(date.getMonth()+1) + '-' + checkDateLength(date.getDate()) + 'T';
    return date;
};

function checkDateLength(dateType) {
    let value = dateType;
    if (value < 10) {
        value = "0"+ value;
    }
    return value;
}

function getCurrentHour() {
    const date = new Date();
    const hour = date.getHours();
    return hour;
};

//All single digits in month, day and hour need a 0 added to match how the api is displaying its date.

function convertDateAndHourToString() {
    let date = new Date();
    let hour = getCurrentHour();
    if (hour < 10) {
        hour = "0" + date.getHours();
        const dateAndHour = todaysDate() + hour;
        const dateAndHourToString = dateAndHour.toString();
        return dateAndHourToString;
    } else {
        const dateAndHour = todaysDate() + hour;
        const dateAndHourToString = dateAndHour.toString();
        return dateAndHourToString;
    }
};

function compareTimeForRecentUpdates(data) {
    for (let i = 0; i < data.timeSeries.length; i++) {
        if (data.timeSeries[i].validTime.includes(convertDateAndHourToString())) {
            return i;
        }
    }    
};

function checkObjectForCelcius(data) {
    arrayPosition = compareTimeForRecentUpdates(data);
    let currentConditions = {celcius: "Weather is not available right now"}; 
    for (let i = 0; i < data.timeSeries[arrayPosition].parameters.length; i++) {
        if (data.timeSeries[arrayPosition].parameters[i].name === "t"){
            currentConditions.celcius = data.timeSeries[arrayPosition].parameters[i].values[0];
        }
    }
    return currentConditions;
};

function checkObjectForWeatherNumber(data) {
    arrayPosition = compareTimeForRecentUpdates(data);
    let todaysWeatherNumber;
    for (let i = 0; i < data.timeSeries[arrayPosition].parameters.length; i++) {
        if (data.timeSeries[arrayPosition].parameters[i].name === "Wsymb2"){
            todaysWeatherNumber = data.timeSeries[arrayPosition].parameters[i].values[0];
        }
    }
    return todaysWeatherNumber;
};

async function fetchWeatherData() {
    const response = await fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.2523/lat/62.5590/data.json');
    const data = await response.json();
    renderPage(data);
};

function renderPage(data){
    checkObjectForCelcius(data);
    fetchWeatherIconData(data);
};

async function fetchWeatherIconData(data) {
    let response = await fetch('../data/icon.json');
    iconData = await response.json();
    displayWeather(data, iconData);
};

function displayWeather(data, iconData) {
    const weatherRef = compareIconIdWithWeatherId(iconData, data);
    const temperature = checkObjectForCelcius(data).celcius;
    const displayWeatherData = document.getElementById("todaysWeather");

    displayWeatherData.innerHTML += `
    <h1 class="todaysWeather__text">Svansjöliftarna</h1>
    <h2> ${getCurrentHour()}:00</h2>
    <img class="todaysWeather__img" src="${weatherRef}" alt ="symbol displaying the weather"> 
    <h2 class="todaysWeather__number">${temperature}&#8451</h2>`;
};

function compareIconIdWithWeatherId(iconData, data) {
    let weatherId = checkObjectForWeatherNumber(data);
    console.log(weatherId)
    for (let icon of iconData) {
        if (icon.id == weatherId) {
            todaysWeatherSymbol = icon.image;
            return todaysWeatherSymbol;
        }
    }
}

window.addEventListener('load', (event) => {
    fetchWeatherData();
});