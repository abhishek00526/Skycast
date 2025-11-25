const apiKey = '0fcd22cf70a240e5899142926252011';
let data;

// Fetch weather for a city
async function getWeather(city) {
    const star = document.getElementById('star');

    // Update star if city is favorite
    if (getFavoriteCity() === city) {
        star.classList.replace('fa-star-o', 'fa-star');
    } else {
        star.classList.replace('fa-star', 'fa-star-o');
    }

    // Fetch data from WeatherAPI
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=6`;
    const response = await fetch(url);
    data = await response.json();

    updateCurrentWeather(data);
    updateForecast(data);
}

// Get favorite city from cookie
function getFavoriteCity() {
    const cookies = decodeURIComponent(document.cookie).split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith('loc=')) return cookie.slice(4);
    }
    return null;
}

// Initialize weather on page load
function init() {
    const city = getFavoriteCity();
    if (city) {
        getWeather(city); // load favorite city automatically
    } else {
        getWeather('Ranchi'); // fallback city if no favorite
    }
}
init();


// Update current weather info
function updateCurrentWeather(data) {
    document.getElementById('current-city').innerText = data.location.name;
    document.getElementById('temperature').innerText = `${data.current.temp_c} °C`;
    document.getElementById('date').innerText = formatDate(data.forecast.forecastday[0].date_epoch);
    document.getElementById('wind-speed').innerText = `${data.current.wind_kph} kph`;
    document.getElementById('humidity').innerText = `${data.current.humidity} %`;
    document.getElementById('feels').innerText = `Feels Like ${data.current.feelslike_c} °C`;
    document.getElementById('desc').innerText = data.current.condition.text;
    document.getElementById('visibility').innerText = `${data.current.vis_km} km`;
    document.getElementById('pressure').innerText = `${data.current.pressure_mb} mb`;
    document.getElementById('icon').innerHTML = `<img src="https:${data.current.condition.icon}">`;
}

// Format date from epoch
function formatDate(epoch) {
    const d = new Date(epoch * 1000).toString().split(" ");
    return `${d[0]}, ${d[1]} ${d[2]}, ${d[3]}`;
}

// Search city
function searchWeather() {
    const city = document.getElementById('search-city').value.trim();
    if (city) getWeather(city);
    document.getElementById('search-city').value = '';
}

document.getElementById('search-city').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchWeather();
});
// Make the star clickable
document.getElementById('star').addEventListener('click', toggleFavorite);


// Set or remove favorite city
function toggleFavorite() {
    const star = document.getElementById('star');
    if (star.classList.contains('fa-star-o')) {
        star.classList.replace('fa-star-o', 'fa-star');
        document.cookie = `loc=${data.location.name};expires=Tue, 15 Mar 2030 00:00:00 UTC;path=/`;
    } else {
        star.classList.replace('fa-star', 'fa-star-o');
        document.cookie = `loc=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }
}

// Update 5-day forecast (today + next 5 days)
function updateForecast(data) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Today
    const today = data.forecast.forecastday[0];
    document.getElementById('today_min').innerText = `${today.day.mintemp_c}°C`;
    document.getElementById('today_max').innerText = `${today.day.maxtemp_c}°C`;
    document.getElementById('today_sunrise').innerText = today.astro.sunrise;
    document.getElementById('today_sunset').innerText = today.astro.sunset;
    document.getElementById('todayIcon').innerHTML = `<img src="https:${today.day.condition.icon}">`;

    // Next 5 days (1 to 5)
    for (let i = 1; i <= 5; i++) {
        const forecast = data.forecast.forecastday[i];
        document.getElementById(`tempMin${i}`).innerText = `${forecast.day.mintemp_c}°C`;
        document.getElementById(`tempMax${i}`).innerText = `${forecast.day.maxtemp_c}°C`;
        document.getElementById(`wicon${i}`).innerHTML = `<img src="https:${forecast.day.condition.icon}">`;
        const day = new Date(forecast.date);
        document.getElementById(`day${i}`).innerText = i === 1 ? "Tomorrow" : weekday[day.getDay()];
    }

    // UV and precipitation for today
    document.getElementById('uv-index').innerText = `${data.current.uv}`;
    document.getElementById('ppt').innerText = `${data.current.precip_mm} mm`;
}

/*// Dark Mode Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Apply saved theme on load
window.addEventListener("load", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
});*/

