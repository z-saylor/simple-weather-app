import "./styles.css";
import {format} from "date-fns";

class Units {
    constructor() {
        this.unitGroup = {f: {value: "us", display: "F"}, c: {value: "metric", display: "C"}};
        this.current = this.unitGroup.f;
    }

    toggle() {
        this.current = this.current == this.unitGroup.f ? this.unitGroup.c : this.unitGroup.f;
    }
}

const unit = new Units();
let currentZip = "49085";

async function getWeather(zip, units) {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${zip}/next7days?unitGroup=${units}&key=RPRKKAPSJX9PNPZBUJV3D2ARC&contentType=json`, {mode: "cors"});
    const weather = await response.json();
    return weather;
}

const tempDiv = document.querySelector(".current-temp");
const forecastDiv = document.querySelector(".forecast");
const todayOtherDiv = document.querySelector(".today-other");
function updateWeather(zip, units) {
    getWeather(zip, units).then((weather) => {
        console.log(weather);
        tempDiv.textContent = weather.currentConditions.temp;

        todayOtherDiv.innerHTML = '';
        const conditions = document.createElement("p");
        conditions.innerText = `conditions: ${weather.currentConditions.conditions}`;

        const feelslike = document.createElement("p");
        feelslike.innerText = `feels like: ${weather.currentConditions.feelslike}`;

        const humidity = document.createElement("p");
        humidity.innerText = `humidity: ${weather.currentConditions.humidity}`;

        todayOtherDiv
            .appendChild(conditions)
            .appendChild(feelslike)
            .appendChild(humidity);

        forecastDiv.innerHTML = "<h3>forecast</h3>";
        console.log(weather.days);
        for (let day of weather.days) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day-container");

            let d = new Date(day.datetime);
            console.log(d);

            const dateP = document.createElement("p");
            dateP.textContent = format(d.setDate(d.getDate() + 1), "MMM dd");

            const maxMinP = document.createElement("p");
            maxMinP.textContent = `${day.tempmax} / ${day.tempmin}`;

            dayDiv.appendChild(maxMinP);
            dayDiv.appendChild(dateP);
            forecastDiv.appendChild(dayDiv);
        }
    });
}

const zipInput = document.querySelector(".zip-entry");
zipInput.addEventListener("input", (e)=> {
    if (zipInput.value.length == 5) {
        currentZip = zipInput.value;
        updateWeather(currentZip, unit.current.value);
    }
});

zipInput.addEventListener("focusout", (e)=> {
    if (zipInput.value.length < 5) {
        zipInput.value = currentZip;
    }
});

const unitsSpan = document.querySelector(".units");
unitsSpan.addEventListener("click", (e)=> {
    unit.toggle();
    unitsSpan.innerHTML = '&nbsp; &deg' +unit.current.display;
    updateWeather(currentZip, unit.current.value);
});

const title = document.querySelector(".title");
title.addEventListener("click", ()=> {
    updateWeather(currentZip, unit.current.value);
});

updateWeather(currentZip, unit.current.value);