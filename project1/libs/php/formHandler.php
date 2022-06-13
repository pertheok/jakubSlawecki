<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    //URLs to send the requests to - API keys not hidden as they are free and do not incur any costs when going over limitations. Perhaps add a functionality to hide it somehow?

    $countryUrl = 'http://api.geonames.org/countryInfoJSON?&lang=en&country=' . $_REQUEST['countryCode'] . '&username=pertheok'; //URL to retrieve data from the api providing basic country information
    $currencyUrl = 'https://openexchangerates.org/api/latest.json?app_id=c692867c4e8647368b163220f42193fe&symbols=' . $_REQUEST['currencyName']; //URL to retrieve data from currency exchange, free account only allows to use USD as a base
    $weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['capitalName'] . '&APPID=e32492c31dc6e5cd00009f4f881846d6'; //URL to retrieve data from weather api

    //initialising a handle for each URL

    $ch1 = curl_init();
    $ch2 = curl_init();
    $ch3 = curl_init();

    // curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch1, CURLOPT_URL, $countryUrl);
    curl_setopt($ch1, CURLOPT_HEADER, 0);

    // curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch2, CURLOPT_URL, $currencyUrl);
    curl_setopt($ch1, CURLOPT_HEADER, 0);

    // curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, false);
    // curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch3, CURLOPT_URL, $weatherUrl);
    curl_setopt($ch1, CURLOPT_HEADER, 0);

    //creating the multiple cURL handle

    $mh = curl_multi_init();

    //adding the three handles to the multiple cURL handles

    curl_multi_add_handle($mh, $ch1);
    curl_multi_add_handle($mh, $ch2);
    curl_multi_add_handle($mh, $ch3);

    // executing the handles

    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh);
        }
    } while ($active && $status == CURLM_OK);

    //closing the handles

    curl_multi_remove_handle($mh, $ch1);
    curl_multi_remove_handle($mh, $ch2);
    curl_multi_remove_handle($mh, $ch3);
    curl_multi_close($mh);

    //BELOW NEEDS REFACTORING

    $decode = json_decode($status, true);

    $output['status']['code'] = '200';
    $output['status']['name'] = 'ok';
    $output['status']['description'] = 'success';
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 100) . ' ms';
    $output['data'] = $decode['geonames'];

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
    
?>