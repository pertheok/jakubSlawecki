//Leaflet configuration and related functions

//disables default zoom control placement as the search bar obscures it & centres the map around the UK if user has location disabled

let map = L.map('map', {zoomControl: false}).setView([51.505, -0.09], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'SPA made by <a href="http://www.jakubslawecki.com">Jakub Slawecki</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//re-adds the zoom control buttons to the bottom left of the screen

new L.Control.Zoom({position: "bottomleft"}).addTo(map);

//create an empty geoJSON layer to display country borders on it

let bordersLayer = L.geoJSON().addTo(map);

//display the selected country's borders on map

const displayBorders = countryJson => {
    bordersLayer.addData(countryJson);
};

//centre the map around the selected country

const centreMap = () => {
    map.fitBounds(bordersLayer.getBounds());
};

//search logic

//the below code prevents the JSON file from being downloaded by the user -  async: false is considered deprecated but I was unable to make the code work using promises

const getCountryNames = () => {
    let localJsonResponse;
    $.ajax({
        url: 'libs/php/getCountryNames.php',
        type: 'POST',
        dataType: 'text json',
        async: false,
        success: function(result) {
            localJsonResponse = result.data;            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });
    return localJsonResponse;
};

//create an object containing information retrieved from a local JSON file

const countryNames = getCountryNames();

//populate the dropdown list with country names

for (let i = 0; i < countryNames.length; i++) {

    //if given country does not have a valid iso_a2 code, don't include it on the list
    if (countryNames[i]['iso_a2'] == "-99") {
        continue;
    } else {
        $("select").append(`<option value="${countryNames[i]['iso_a2']}">${countryNames[i].countryName}</option>`);
    }
}

//sort the countries on the dropdown menu

$("#countrySearch").html($("option").sort((a, b) => {
    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
}));

//script for handling requests 

const getData = (chosenCountryCode) => {

    //create a variable that will store retrieved geoJSON data for drawing borders
    let chosenCountryGeoJson;

    //clear any drawn borders
    bordersLayer.clearLayers();

    //retrieve data about the chosen country from the internal JSON
    // const chosenCountryCode = $("select").val();

    //ajax request to get a geoJSON object containing the chosen country's data

    $.ajax({
        url: 'libs/php/getCountryBorders.php',
        type: 'POST',
        async: false,
        data: {
            isoCode: chosenCountryCode
        },
        dataType: 'text json',
        success: function(result) {
            chosenCountryGeoJson = result.data;            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });

    //ajax request to get data from the geonames API

    $.ajax({
        url: "libs/php/geonamesHandler.php",
        type: "POST",
        dataType: 'json',
        data: {
            countryCode: chosenCountryCode
        },
        success: function(result) {

            if (result.status.name == "ok") {
                    $('#countryName').html(result.data[0].countryName);
                    $('#capitalName').html(result.data[0].capital);
                    $('#countryPopulation').html(result.data[0].population);
                    $('#countryCurrency').html(result.data[0].currencyCode);

                    if (result.data[0].countryName.includes(" ")) {
                        let underscore = result.data[0].countryName.replace(" ", "_");
                        $('#countryWiki').attr('href', `https://en.wikipedia.org/wiki/${underscore}`);
                    } else {
                        $('#countryWiki').attr('href', `https://en.wikipedia.org/wiki/${result.data[0].countryName}`); //<-needs implementation based on API response
                    }   
            }
        },

        // nested ajax request, as data retrieved from the first request is needed for the remaining two

        complete: function () {

            //ajax request to get data from the openExchangeRates API

            $.ajax({
                url: "libs/php/openExchangeRatesHandler.php",
                type: "POST",
                dataType: 'json',
                data: {
                    countryCurrency: $("#countryCurrency").html()
                },
                success: function(result) {

                    if (result.status.name == "ok") {
                        //modify the result so it's rounded to two decimal places
                        let rate = (result.data.rates[$("#countryCurrency").html()]).toFixed(2);
                        $('#countryCurrencyExchange').html(`1 USD = ${rate} ${$("#countryCurrency").html()}`);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
                }
            });

             //ajax request to get data from the openWeatherMap API

            $.ajax({
                url: "libs/php/openWeatherMapHandler.php",
                type: "POST",
                dataType: 'json',
                data: {
                    capitalName: $("#capitalName").html()
                },
                success: function(result) {

                    if (result.status.name == "ok") {
                        //modify the result so it's rounded to the nearest integer
                        let convertToCelsius = (result.data.main.temp - 273.15).toFixed(0);                    
                        $('#countryWeather').html(`${convertToCelsius}&#8451;, ${result.data.weather[0].description}`); 
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
                }
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
        }
    });   
    
    //display the selected country's borders on map

    displayBorders(chosenCountryGeoJson);

    //centre the map around the selected country

    centreMap();

    //displaying country information modal after clicking on the country outline

    bordersLayer.on("click", () => {
        $('#countryInfoModal').modal("show");
    });

}

//retrieve the user's location or retrieve the data for the default country (UK)

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        getData("GB");
    }
}

const showPosition = position => {
   console.log("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude);
    // $.ajax({
    //   url: 'abc.php',
    //   type: 'POST',
    //   data: 'latitude='+position.coords.latitude+'&longitude='+position.coords.longitude,
    //   success: function(data) {
    //     console.log(data);
    //   },
    //   error: function(e) {
    //     //called when there is an error
    //     //console.log(e.message);
    //   }
    // });
}

getLocation();


//retrieve data about the country selected from the drop down menu

$('select').change(() => {
    getData($("select").val());
});

