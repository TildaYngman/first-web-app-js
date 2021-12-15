let todaysWeather = "Väder är inte tillgängligt just nu";
let todaysDate;
let date;
let time
let todaysTimeAndDate;
let dateToText;

//By getting todays date and the hour every time I do the check the code will be better maintainable. 
//If the API desides to change the way they display the date and time stamp it will break and the weather will default to the error message inside let todaysWeather

function getTodaysDate() {
    date = new Date();
    todaysDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'T';
    time = date.getHours();
    todaysTimeAndDate = todaysDate + time;
    dateToText = todaysTimeAndDate.toString();
    console.log(dateToText);
}
getTodaysDate()

//IF (dateToText === KEY(validTime)) {do the checks for key and values}
//ENDIF
//The Pseudo code did contain the right tings I needed to check but I needed to figure out how to compare the string to part of a string.
//the includes() method is doing exactly this for me and is therby doing the comparison inside the parentases of the mathod.

function getWeatherData(data) {
    for (let i = 0; i < data.timeSeries.length; i++) {
        if (data.timeSeries[i].validTime.includes(dateToText)) {
            console.log("the valid time is", data.timeSeries[i].validTime)
            for (let n = 0; n < data.timeSeries[i].parameters.length; n++) {
                if (data.timeSeries[i].parameters[n].name === "t"){
                    todaysWeather = data.timeSeries[i].parameters[n].values[0];
                }
            }
        } 
    }
};

async function fetchWeatherApi() {
    let response = await fetch('https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.2523/lat/62.5590/data.json');
    let data = await response.json();
    console.log("Getting the API", data);
    getWeatherData(data);
    displayWeather();
};

fetchWeatherApi()

function displayWeather() {
    let displayWeatherData = document.getElementById("todaysWeather");
    displayWeatherData.innerHTML += `<h1> Todays Weather ${todaysWeather} </h1>`;
};
