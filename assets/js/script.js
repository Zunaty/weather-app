var locations = [];
var long = 0;
var lat = 0;

function searchW() {
    var locSearch = document.getElementById('locationSearch').value;
    locations.push(locSearch)
    console.log(locations)

    fetch('http://api.positionstack.com/v1/forward?access_key=8b6705bd3db1ed3c15005b1f93926e8e&query=' + locSearch)
    .then(function(response) {
            return response.json();
    })
    .then(function(response) {
        fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + response.data[0].latitude + '&lon=' + response.data[0].longitude + '&appid=9dec8df59837f3104deb7123b36583ae')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response)
        })
    });   
}

document.getElementById("locationSearch").addEventListener("submit", searchW)