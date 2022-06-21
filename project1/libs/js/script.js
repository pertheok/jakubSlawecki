//-----Leaflet configuration and related functions

//create the main map object
let map = L.map('map');

//add tile layers from the selected tile provider to the map
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'SPA made by <a href="http://www.jakubslawecki.com target="_blank">Jakub Slawecki</a>, Tiles &copy; <a href="https://www.esri.com/en-us/home" target="_blank">Esri</a>'
}).addTo(map);

//create an empty geoJSON layer to display country borders on it
let bordersLayer = L.geoJSON().addTo(map);

//create an empty layer for displaying markers
let markerLayer = L.markerClusterGroup().addTo(map);

//display the selected country's borders on map
const displayBorders = countryJson => {
    bordersLayer.addData(countryJson);
};

//centre the map around the selected country
const centreMap = () => {
    map.fitBounds(bordersLayer.getBounds());
};

//-----buttons to invoke info modals

//centre map on the selected country
L.easyButton('<i class="fa-solid fa-xl fa-location-crosshairs"></i>', () => {
    map.fitBounds(bordersLayer.getBounds());
}).addTo(map);

//display basic country info modal
L.easyButton('<i class="fa-solid fa-xl fa-circle-info"></i>', () => {
    $('#countryInfoModal').modal("show");
}).addTo(map);

//display weather info modal
L.easyButton('<i class="fa-solid fa-xl fa-cloud-sun"></i>', () => {
    $('#weatherInfoModal').modal("show");
}).addTo(map);

//display currency info modal
L.easyButton('<i class="fa-solid fa-xl fa-dollar-sign"></i>', () => {
    $('#currencyInfoModal').modal("show");
}).addTo(map);

//display local news modal
L.easyButton('<i class="fa-solid fa-xl fa-newspaper"></i>', () => {
    $('#countryNewsModal').modal("show");
}).addTo(map);

//display country wiki modal
L.easyButton('<i class="fa-brands fa-xl fa-wikipedia-w"></i>', () => {
    $('#wikipediaModal').modal("show");
}).addTo(map);

//-----search logic

//extract the data regarding country names and their ISO codes - async: false is considered deprecated but I was unable to make the code work using promises
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

//create an object containing information retrieved from the local JSON file
const countryNames = getCountryNames();

//populate the dropdown list with country names
for (let i = 0; i < countryNames.length; i++) {

    //if given country does not have a valid iso_a2 code, don't include it on the list - change the requirement to a regex, perhaps?
    if (countryNames[i]['iso_a2'] == "-99") {
        continue;
    } else {
        $("select").append(`<option value="${countryNames[i]['iso_a2']}">${countryNames[i].countryName}</option>`);
    }
}

//sort the countries on the dropdown menu alphabetically
$("#countrySearch").html($("option").sort((a, b) => {
    return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
}));

//-----script for handling requests 

const getData = (chosenCountryCode) => {

    //show the loading modal when function is initiated - when locally tested, the function is executed so fast the modal doesn't even show - this will be more useful when retrieveing API data takes longer than usual?
    $('#loadingModal').modal("show");

    //create a variable that will store the retrieved geoJSON data for drawing borders
    let chosenCountryGeoJson;

    //create a variable that will be used to query news API and places API
    let chosenCountryName;

    //clear any drawn borders and markers
    bordersLayer.clearLayers();
    markerLayer.clearLayers();

    //change contents of the news modal back to empty
    $('#news').html('');    

    //ajax request to get a geoJSON object containing the chosen country's data from the internal geo.json file
    $.ajax({
        url: 'libs/php/getCountryBorders.php',
        type: 'POST',
        async: false,
        data: {
            isoCode: chosenCountryCode
        },
        dataType: 'text json',
        success: function(result) {

            //set the retrieved geoJSON data to a variable that will be used to draw country borders on the map
            chosenCountryGeoJson = result.data;

            //set the indicated html classes and ids equal to the relevant retrieved data
            $('.countryName').html(result.data.properties.name);
            $('#countryIsoCode').html(result.data.properties['iso_a2']);

            //extracts the country name and appends it to the wikipedia URL directly or after replacing any present spaces in the country's name with underscores, assigns whatever's apended to a variable that will be used to query news API and places API
            if (result.data.properties.name.includes(" ")) {
                chosenCountryName = result.data.properties.name.replace(" ", "_");
                $('#countryWiki').attr('href', `https://en.wikipedia.org/wiki/${chosenCountryName}`);
            } else {
                chosenCountryName = result.data.properties.name;
                $('#countryWiki').attr('href', `https://en.wikipedia.org/wiki/${chosenCountryName}`);
            } 
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

                    //set the indicated html classes and ids equal to the relevant retrieved data
                    $('.capitalName').html(result.data.capital);

                    //conversion to string and regex used to help with adding a comma for separating thousands from the number
                    $('#countryPopulation').html(result.data.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    $('#countryContinent').html(result.data.continentName);

                    //change the areaInSqKm from float to int to get rid of the decimal (which seems to always be .0 anyway). convert the int to string and add comma for separating thousands from the number 
                    $('#countryArea').html(parseInt(result.data.areaInSqKm).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                    $('#countryCurrency').html(result.data.currencyCode);   
            }
        },

        //nested ajax request, as data retrieved from the previous request is needed for the remaining ones
        complete: function () {

            //ajax request to get data from the news API
            $.ajax({
                url: "libs/php/newsHandler.php",
                type: "POST",
                dataType: 'json',
                data: {
                    countryName: chosenCountryName
                },
                success: function(result) {

                    if (result.status.name == "ok") {

                        //display a message if there's no results for the selected country
                        if (result.status.totalResults === 0) {
                            $('#news').html('<p>No news data found for the selected country.</p>');
                        } else {

                            //render html based on the retrieved news data - if there's no image provided with the article, use the placeholder instead
                            for (let i = 0; i < result.data.length; i++) {
                                if (result.data[i].urlToImage) {
                                    $('#news').append(
                                        `<a class="newslink" href="${result.data[i].url}" target="_blank">
                                            <img src="${result.data[i].urlToImage}" alt="Article image">
                                            <p>${result.data[i].source} | </p>
                                            <h5>${result.data[i].title}</h5>
                                            <p>${result.data[i].description}</p>
                                        </a>
                                        <hr>`
                                    );
                                } else {
                                    $('#news').append(
                                        `<a class="newslink" href="${result.data[i].url}" target="_blank">
                                            <img src="./libs/images/noimg.jpg" alt="Article image placeholder">
                                            <p>${result.data[i].source} | </p>
                                            <h5>${result.data[i].title}</h5>
                                            <p>${result.data[i].description}</p>
                                        </a>
                                        <hr>`
                                    );
                                }

                            }
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
                }
            });

            //ajax request to get data from the Triposo API
            $.ajax({
                url: "libs/php/triposoHandler.php",
                type: "POST",
                dataType: 'json',
                data: {
                    countryName: chosenCountryName
                },
                success: function(result) {

                    if (result.status.name == "ok") {

                        //adds markers to the map and gives each marker a popup with a short description

                        for (let i = 0; i < result.data.length; i++) {
                            markerLayer.addLayer(L.marker([result.data[i].coordinates.latitude, result.data[i].coordinates.longitude], {
                                title: result.data[i].name
                            }).bindPopup(`<b>${result.data[i].name}</b><br>${result.data[i].snippet}`));
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
                }
            });

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

                        //set the indicated html classes and ids equal to the relevant retrieved data
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
                    capitalName: $(".capitalName").html()
                },
                success: function(result) {

                    if (result.status.name == "ok") {

                        //set the indicated html classes and ids equal to the relevant retrieved data

                        //modify the result so it's rounded to the nearest integer 
                        $('#capitalTemperature').html(result.data.temperature.toFixed(0));
                        $('#capitalWeather').html(result.data.description);
                        $('#weatherImage').attr('src', `https://openweathermap.org/img/wn/${result.data.icon}@2x.png`);
                        $('#capitalCloudiness').html(result.data.clouds);
                        $('#capitalPressure').html(result.data.pressure);
                        $('#capitalHumidity').html(result.data.humidity);
                        $('#capitalWindSpeed').html(result.data.windSpeed);

                        //converting received Unix timestamps to UTC time hh:mm
                        let sunrise = result.data.sunrise;
                        let sunset = result.data.sunset;

                        //creating a new date from each retrieved Unix, multiplying each by 1000 so the arguments are in ms instead of s
                        let sunriseDate = new Date(sunrise * 1000);
                        let sunsetDate = new Date(sunset * 1000);

                        //extract hours from each timestamp
                        let sunriseHour = sunriseDate.getHours();
                        let sunsetHour = sunsetDate.getHours();

                        //extract minutes from each timestamp
                        let sunriseMinutes = sunriseDate.getMinutes();
                        let sunsetMinutes = sunsetDate.getMinutes();
                        $('#capitalSunrise').html(`${sunriseHour}:${sunriseMinutes}`);
                        $('#capitalSunset').html(`${sunsetHour}:${sunsetMinutes}`);
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
    
    //set the value of the drop down menu to the country whose data is being currently displayed - this is used when country data was not retrieved following user's actions, such as when invoking the getLocation() function 
    $('select').val(chosenCountryCode);
    
    //display the selected country's borders on map
    displayBorders(chosenCountryGeoJson);

    //centre the map around the selected country
    centreMap();

    //hide the loading modal after all data had been retrieved successfully
    $('#loadingModal').modal("hide");

}

//-----initial state

//retrieve the user's location or retrieve the data for the default country (UK) if navigator.geolocation is not supported by the browser
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, () => { getData("GB")});
    } else {
        getData("GB");
    }
}

const showPosition = position => {
    let userLat = position.coords.latitude;
    let userLong = position.coords.longitude;

    //if user lat-long data is available, call openCage API to get the ISO code of the country the user is currently in, otherwise retrieve the data for the default country (UK)
    if (userLat && userLong) {
        $.ajax({
            url: "libs/php/openCageHandler.php",
            type: 'POST',
            data: {
                userLatitude: userLat,
                userLongitude: userLong
            },
            success: function(result) {
                getData(result.data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(`${jqXHR}, ${textStatus}, ${errorThrown}`);
            }
        });
    } else {
        getData("GB");
    }
};

//invoke the two functions defined above
getLocation();

//-----main functionality

//retrieve data about the country selected from the drop down menu
$('select').change(() => {
    getData($("select").val());
});