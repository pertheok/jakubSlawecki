//script for running api 1

$('#api-run-1').click(() => {

    $.ajax({
        url: "libs/php/getEarthquakeInfo.php",
        type: "POST",
        dataType: 'json',
        data: {
            north: $('#selNorth').val(),
            south: $('#selSouth').val(),
            east: $('#selEast').val(),
            west: $('#selWest').val()
        },
        success: function(result) {
            console.log(result);

            if (result.status.name == "ok") {
                // if(Object.keys(result.status.data) === 0) {
                //     $('#api1Datetime').html("No data found.");
                // } else {
                
                    $('#api1Datetime').html(result['data'][0]['datetime']);
                    $('#api1Depth').html(result['data'][0]['depth']);
                    $('#api1Magnitude').html(result['data'][0]['magnitude']);
                    $('#api1Latitude').html(result['data'][0]['lat']);
                    $('#api1Longitude').html(result['data'][0]['lng']);
                // }

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(`${textStatus}, ${errorThrown}`);
        }
    });

});