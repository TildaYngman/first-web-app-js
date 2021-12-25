let todaysWeatherNumber;
let todaysWeatherSymbol;

function todaysDate() {
    let date = new Date();
    date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T';
    return date;
};

function getCurrentHour() {
    const date = new Date();
    const hour = date.getHours();
    return hour;
};

//Since hours only display single digit if < 10 i needed to append a 0 if it is a single digit to be able to compare.

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

function compareTimeForResentUpdates(data) {
    for (let i = 0; i < data.timeSeries.length; i++) {
        if (data.timeSeries[i].validTime.includes(convertDateAndHourToString())) {
            return i;
        }
    }    
};

function checkObjectForKeys(data) {
    arrayPosition = compareTimeForResentUpdates(data);
    let currentConditions = {celcius: "Weather is not available right now", weatherNumber: "" }; 
    for (let i = 0; i < data.timeSeries[arrayPosition].parameters.length; i++) {
        if (data.timeSeries[arrayPosition].parameters[i].name === "t"){
            currentConditions.celcius = data.timeSeries[arrayPosition].parameters[i].values[0];
        }
        if (data.timeSeries[arrayPosition].parameters[i].name === "Wsymb2"){
            todaysWeatherNumber = data.timeSeries[arrayPosition].parameters[i].values[0];
        }
    }
    return currentConditions;
};

//This runs first, importing the data from the Api then launching the function to import from the JSON
async function fetchApi() {
    let response = await fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.2523/lat/62.5590/data.json');
    let data = await response.json();
    convertDateAndHourToString();
    checkObjectForKeys(data);
    await fetchLocalJson(data);
};

//Imports the data from the JSON then displays the weather, passing it the data form the API and the Icon data from the JSON
async function fetchLocalJson(data) {
    let response = await fetch('../data/icon.json');
    iconData = await response.json();

    displayWeather(data, iconData);
};

function displayWeather(data, iconData) {
    //Runs the function to get the correct icon from the icon array
    const weatherRef = getIconFromLocalJson(iconData);
    //I moved this here to just clean up the code a bit
    const temperature = checkObjectForKeys(data).celcius;

    let displayWeatherData = document.getElementById("todaysWeather");
    displayWeatherData.innerHTML += `
    <h1 class="todaysWeather__text">Svansjöliftarna</h1>
    <h2> ${getCurrentHour()}:00</h2>
    <img class="todaysWeather__img" src="${weatherRef}" alt ="symbol displaying the weather"> 
    <h2 class="todaysWeather__number">${temperature}&#8451</h2>`;
};

function getIconFromLocalJson(iconData) {
    for (let icon of iconData) {
        console.log("number", todaysWeatherNumber);
        if (icon.id == todaysWeatherNumber) {
            todaysWeatherSymbol = icon.image;
            return todaysWeatherSymbol;
        }
    }
}

fetchApi();
