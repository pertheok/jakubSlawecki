<?php

	//retrieves data from an internal JSON file

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $countryInfoJson = file_get_contents("../json/countryBorders.geo.json");
    $countryInfoJsonArray = json_decode($countryInfoJson, true)['features'];	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//get only selected country's geoJSON data

    $filter = function($country) 
    {
        return $country['properties']['iso_a2'] == $_POST['isoCode'];
    };

	$finalData = array_filter($countryInfoJsonArray, $filter);

    //accesses the value of the first (and in this case, the only) value from the key-> value pair of the object and assigns it as a response

	$output['data'] = reset($finalData);
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>