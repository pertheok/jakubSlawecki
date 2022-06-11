//Leaflet configuration

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//search logic

const search = document.getElementById("country-search");
const matchList = document.getElementById("match-list");

//search countryBorders.geo.json and filter it by user's input, going through the available country names

const searchCountries = async userInput => {
    const response = await fetch('./libs/json/countryBorders.geo.json');
    const countries = await response.json();
    const countriesData = countries.features;

    //display data matching user input

    let matches = countriesData.filter(country => {
        const regex = new RegExp(`^${userInput}`, 'gi');
        return country.properties.name.match(regex) || country.properties['iso_a2'].match(regex) || country.properties['iso_a3'].match(regex);
    });

    //prevent displaying all countries if the search box is empty

    if (userInput.length === 0) {
        matches = [];
        matchList.innerHTML = '';
    }

    outputHtml(matches);
}

// display results in HTML

const outputHtml = matches => {
    if (matches.length > 0) {
        const html = matches.map(match => `
            <li class="list-group-item">
                <h4>${match.properties.name} (${match.properties['iso_a2']} / ${match.properties['iso_a3']})</h4>
            </li>
        `).join('');

        matchList.innerHTML = html;
    }
}

search.addEventListener('input', () => searchCountries(search.value));

//script for handling requests

$('.list-group-item').click(() => { //needs changing

    $.ajax({
        url: "libs/php/formHandler.php",
        type: "POST",
        dataType: 'json',
        data: {
            countryCode: $('#selNorth').val() //needs changing
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                    $('#countryName').html(result.countryName);
                    $('#capitalName').html(result.capital);
                    $('#countryPopulation').html(result.population);
                    $('#countryCurrency').html(result.currencyCode);
                    $('#countryCurrencyExchange').html(result.currencyCode); //<-needs implementation
                    $('#countryWeather').html(result.currencyCode); //<-needs implementation

                    if (result.countryName.includes(" ")) {
                        let underscore = result.countryName.replace(" ", "_");
                        $('#countryWiki').attr('href', `https://en.wikipedia.org/wiki/${underscore}`);
                    } else {
                        $('#countryWiki').attr('href', `https://en.wikipedia.org/wiki/${result.countryName}`); //<-needs implementation
                    }   
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${textStatus}, ${errorThrown}`);
        }
    });

});