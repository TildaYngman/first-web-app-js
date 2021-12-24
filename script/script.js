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
        console.log(dateAndHourToString);
        return dateAndHourToString;
    } else {
        const dateAndHour = todaysDate() + hour;
        const dateAndHourToString = dateAndHour.toString();
        console.log(dateAndHourToString);
        return dateAndHourToString;
    }
};

function compareTimeForResentUpdates(data) {
    for (let i = 0; i < data.timeSeries.length; i++) {
        if (data.timeSeries[i].validTime.includes(convertDateAndHourToString())) {
            console.log(i);
            return i;
        }
    }    
};

function checkObjectForKeys(data) {
    arrayPosition = compareTimeForResentUpdates(data);
    console.log(arrayPosition);
    let currentConditions = {celcius: "Weather is not available right now", weatherNumber: "" }; 
    for (let i = 0; i < data.timeSeries[arrayPosition].parameters.length; i++) {
        if (data.timeSeries[arrayPosition].parameters[i].name === "t"){
            currentConditions.celcius = data.timeSeries[arrayPosition].parameters[i].values[0];
            console.log("position ", i);
            console.log("value ", currentConditions.celcius)
        }
        if (data.timeSeries[arrayPosition].parameters[i].name === "Wsymb2"){
            currentConditions.weatherNumber = data.timeSeries[arrayPosition].parameters[i].values[0];
            console.log("position ",i);
            console.log("value ",currentConditions.weatherNumber);
        }
    }
    return currentConditions;
};


// function getWeatherData(data) {
//     for (let i = 0; i < data.timeSeries.length; i++) {
//         if (data.timeSeries[i].validTime.includes(dateAndTimeToString)) {
//             console.log("the time is", data.timeSeries[i].validTime)
//             for (let n = 0; n < data.timeSeries[i].parameters.length; n++) {
//                 if (data.timeSeries[i].parameters[n].name === "t"){
//                     todaysWeather = data.timeSeries[i].parameters[n].values[0];
//                 } if (data.timeSeries[i].parameters[n].name === "Wsymb2"){
//                     todaysWeatherNumber = data.timeSeries[i].parameters[n].values[0];
//                 }
//             }
//         } 
//     }
// };

function getIconFromLocalJson(iconData) {
    for (let i = 0; i < iconData.length; i++) {
        if (iconData[i].id === todaysWeatherNumber) {
            todaysWeatherSymbol = iconData[i].image;
            console.log("picture ", todaysWeatherSymbol);
            return todaysWeatherSymbol;
        }
    }
}

async function fetchLocalJson() {
    let response = await fetch('../data/icon.json');
    let iconData = await response.json();
    getIconFromLocalJson(iconData);
};

async function fetchApi() {
    let response = await fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.2523/lat/62.5590/data.json');
    let data = await response.json();
    convertDateAndHourToString();
    checkObjectForKeys(data);
    await fetchLocalJson();
    displayWeather(data);
    console.log(data)
};

function displayWeather(data) {
    let displayWeatherData = document.getElementById("todaysWeather");
    displayWeatherData.innerHTML += `
    <h1 class="todaysWeather__text">Svansjöliftarna</h1>
    <h2> ${getCurrentHour()}:00</h2>
    <img class="todaysWeather__img" src="${checkObjectForKeys(data).weatherNumber}" alt ="symbol displaying the weather"> 
    <h2 class="todaysWeather__number">${checkObjectForKeys(data).celcius}&#8451</h2>`;
};

fetchApi();