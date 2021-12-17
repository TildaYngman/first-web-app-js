let todaysWeather = "Weather is not available right now";
let todaysWeatherNumber;
let todaysWeatherSymbol;
let todaysDate;
let date;
let time;
let todaysTimeAndDate;
let dateAndTimeToString;

//By getting todays date and the hour every time I do the check the code will be better maintainable. 
//If the API desides to change the way they display the date and time stamp it will break and the weather will default to the error message inside let todaysWeather
//Since hours only display single digit if < 10 i needed to append a 0 if it is a single digit to be able to compare.

function getTodaysDateAndTime() {
    date = new Date();
    todaysDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T';
    time = date.getHours();
}

function redefineDateAndTime() {
    if (time < 10) {
        time = "0" + date.getHours()
        todaysTimeAndDate = todaysDate + time;
        dateAndTimeToString = todaysTimeAndDate.toString();
        console.log(dateAndTimeToString);
    } else {
        todaysTimeAndDate = todaysDate + time;
        dateAndTimeToString = todaysTimeAndDate.toString();
        console.log(dateAndTimeToString);
    }
}

//IF (dateAndTimeToString === KEY(validTime)) {do the checks for key and values}
//ENDIF
//The Pseudo code did contain the right tings I needed to check but I needed to figure out how to compare the string to part of a string.
//the includes() method is doing exactly this for me and is therby doing the comparison inside the parentases of the mathod.

function getWeatherData(data) {
    for (let i = 0; i < data.timeSeries.length; i++) {
        if (data.timeSeries[i].validTime.includes(dateAndTimeToString)) {
            console.log("the time is", data.timeSeries[i].validTime)
            for (let n = 0; n < data.timeSeries[i].parameters.length; n++) {
                if (data.timeSeries[i].parameters[n].name === "t"){
                    todaysWeather = data.timeSeries[i].parameters[n].values[0];
                } if (data.timeSeries[i].parameters[n].name === "Wsymb2"){
                    todaysWeatherNumber = data.timeSeries[i].parameters[n].values[0];
                }
            }
        } 
    }
};

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
    getTodaysDateAndTime();
    redefineDateAndTime();
    getWeatherData(data);
    await fetchLocalJson();
    displayWeather();
};

function displayWeather() {
    let displayWeatherData = document.getElementById("todaysWeather");
    displayWeatherData.innerHTML += `
    <h1 class="todaysWeather__text">Svansjöliftarna</h1> 
    <img class="todaysWeather__img" src="${todaysWeatherSymbol}" alt ="symbol displaying the weather"> 
    <h2 class="todaysWeather__number">${todaysWeather}&#8451</h2>`;
};

fetchApi();