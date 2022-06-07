//script for running api 2

$('#api-run-2').click(() => {

    $.ajax({
        url: "libs/php/getCountryCode.php",
        type: "POST",
        dataType: 'json',
        data: {
            lat: $('#selLat').val(),
            lng: $('#selLng').val()
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {

                // if (result.data.status.message == 'missing parameter ') {
                //     $('#api2Code').html("Missing parameter");
                // } else if (result.data.status.message == 'invalid lat/lng') {
                //     $('#api2Code').html("Invalid lat/lng");
                // } else if (result.data.status.message == 'no country code found') {
                //     $('#api2Code').html("No data found");
                // } else {
                    $('#api2Code').html(result['data']['countryCode']);
                    $('#api2Name').html(result['data']['countryName']);
                // }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${textStatus}, ${errorThrown}`);
        }
    });

});