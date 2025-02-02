document.getElementById('searchBtn').addEventListener('click', () => {
    let city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

document.getElementById('locationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            error => {
                alert("Geolocation permission denied. Please enter a city manually.");
            }
        );
    }
});

async function fetchWeather(city) {
    const apiKey = 'cba55def7b8e87d3e2797056566368b6';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        document.getElementById('errorMessage').classList.add('hidden');
        updateWeatherUI(data);
    } catch (error) {
        document.getElementById('errorMessage').classList.remove('hidden');
    }
}

async function fetchWeatherByCoords(lat, lon) {
    const apiKey = 'cba55def7b8e87d3e2797056566368b6';
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    updateWeatherUI(data);
}

function updateWeatherUI(data) {
    document.getElementById('cityName').innerText = `${data.city.name} (${new Date().toISOString().split('T')[0]})`;
    document.getElementById('temperature').innerText = `${data.list[0].main.temp}°C`;
    document.getElementById('wind').innerText = `Wind: ${data.list[0].wind.speed} M/S`;
    document.getElementById('humidity').innerText = `Humidity: ${data.list[0].main.humidity}%`;
    document.getElementById('weatherDesc').innerText = data.list[0].weather[0].description;

    let forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    let dailyForecasts = {};
    
    data.list.forEach(entry => {
        let date = entry.dt_txt.split(' ')[0];
        let time = entry.dt_txt.split(' ')[1];
        
        if (!dailyForecasts[date] && time === "12:00:00") {
            dailyForecasts[date] = entry;
        }
    });

    Object.keys(dailyForecasts).slice(0, 5).forEach(date => {
        let forecast = dailyForecasts[date];
        let forecastCard = `
            <div class='bg-dark text-white p-4 rounded-lg shadow text-center'>
                <h3 class="font-bold text-accent">${date}</h3>
                <p class="text-lg font-semibold">${forecast.main.temp}°C</p>
                <p class="text-sm">🌬️ ${forecast.wind.speed} M/S</p>
                <p class="text-sm">💧 ${forecast.main.humidity}%</p>
            </div>`;
        forecastContainer.innerHTML += forecastCard;
    });
}