//script for running api 3

$('#api-run-3').click(() => {

    $.ajax({
        url: "libs/php/getOceanOrSeaName.php",
        type: "POST",
        dataType: 'json',
        data: {
            lat: $('#oceanLat').val(),
            lng: $('#oceanLng').val()
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {

                // if (result['data']['status']['message'] == 'missing parameter ') {
                //     $('#api3Name').html("Missing parameter");
                // } else if (result['data']['status']['message'] == 'invalid lat/lng') {
                //     $('#api3Name').html("Invalid lat/lng");
                // } else if (result['data']['status']['value'] == '15') {
                //     $('#api3Name').html("No ocean or sea found");
                // } else {
                    $('#api3Name').html(result['data']['name']);
                // }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${textStatus}, ${errorThrown}`);
        }
    });

});