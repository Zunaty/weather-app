var locations = [];
var today = moment().format('L');

// This runs a search of the value in the search bar, and saves that value to an array as search history
function searchW() {
    // Getting search input
    var locSearch = document.getElementById('locationSearch').value.toLowerCase();

    // Checking for nothing in search input
    if(!locSearch){
        alert("Please search a city");
    }

    // Adding search to history and not including repeats
    locations.push(locSearch);
    locations = locations.filter((x, index) => {
        return locations.indexOf(x) === index;
    });

    // Using only the last 5 searches to create five buttons
    locations = locations.slice(-5);
    removeAllChildNodes(document.querySelector('#searchH'));
    locations.forEach(createBtn);
    
    localSave();
    fetching(locSearch);
}

// This fetches the data from the apis
function fetching(data) {
    // This searches a city and returns long and lat
    fetch('http://api.positionstack.com/v1/forward?access_key=8b6705bd3db1ed3c15005b1f93926e8e&query=' + data)
    .then(function(response) {
            return response.json();
    })
    .then(function(response) {
        // This takes long and lat and turns it into weather info
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + response.data[0].latitude + '&lon=' + response.data[0].longitude + '&units=imperial' + '&appid=9dec8df59837f3104deb7123b36583ae')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // This puts the current weather onto the website
            document.getElementById('info').removeAttribute("style");
            document.getElementById('city').innerHTML = data + " " + today + " " + '<img src="http://openweathermap.org/img/wn/' + response.current.weather[0].icon +'@2x.png"/>';
            document.getElementById('condition').innerHTML = response.current.weather[0].description;
            document.getElementById('temp').innerHTML = "Temp: " + response.current.temp + " f";
            document.getElementById('wind').innerHTML = "Wind: " + response.current.wind_speed + " mph";
            document.getElementById('humi').innerHTML = "Humidity: " + response.current.humidity + "%";
            document.getElementById('uv').innerHTML = "UV Index: " + response.current.uvi;

            var uvi = response.current.uvi;
            if(uvi > 3 && uvi < 5) {
                document.getElementById('uv').setAttribute("style", "background-color: yellow;")
            } else if(uvi > 6 && uvi < 7) {
                document.getElementById('uv').setAttribute("style", "background-color: orange;")
            } else if(uvi > 8 && uvi < 10) {
                document.getElementById('uv').setAttribute("style", "background-color: red;")
            } else if(uvi > 11) {
                document.getElementById('uv').setAttribute("style", "background-color: purple;")
            }
            // This is filling out the forecast
            for(var i = 1; i < 6; i++) {
                document.getElementById('info5').removeAttribute('style');
                document.getElementById(`f${i}`).innerHTML = moment.unix(response.daily[i].dt).format('L');
                document.getElementById(`i${i}`).innerHTML = '<img src="http://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon +'@2x.png"/>';
                document.getElementById(`ftemp${i}`).innerHTML = "Temp: " + response.daily[i].temp.day + " f";
                document.getElementById(`fwind${i}`).innerHTML = "Wind: " + response.daily[i].wind_speed + " mph";
                document.getElementById(`fhumi${i}`).innerHTML = "Humidity: " + response.daily[i].humidity + "%";
            }
        });
    });
};

// This loads all data in Local Storage
function load() {
    locations = JSON.parse(localStorage.getItem("locations"));

    if(!locations) {
        locations = [];
    }

    locations.forEach(createBtn);
};

// This saves to Local Storage
function localSave() {
    localStorage.setItem("locations", JSON.stringify(locations));
};

// This creates the buttons for the search history
function createBtn(x) {
    var btn = document.createElement("div");
    // btn.type = "button";
    btn.className = "btn btn-outline-primary searchA";
    btn.innerHTML = x;
    document.getElementById('searchH').appendChild(btn);
};

// This removes all child elements of a parent
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

// This will search your selected search history
$(".searchA").click(function() {
    var x = $(this).text();
    fetching(x);
});

load();
document.getElementById("locationSearch").addEventListener("keyup", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("locationSearch").click();
        searchW();
    }
});