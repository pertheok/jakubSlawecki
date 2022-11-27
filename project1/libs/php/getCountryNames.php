<?php

	//retrieve country names and their ISO codes from an internal JSON file

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//load the local json file
    $countryInfoJson = file_get_contents("../json/countryBorders.geo.json");

	//access the required data from the json response
    $countryInfoJsonArray = json_decode($countryInfoJson, true)['features'];	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//create a new array that contains objects of countryName => iso_a2 (key => value) pairs
	$finalDataArray = [];

	for ($i = 0; $i < count($countryInfoJsonArray); $i++) {
		array_push($finalDataArray, (object)['countryName' => $countryInfoJsonArray[$i]['properties']['name'], 'iso_a2' => $countryInfoJsonArray[$i]['properties']['iso_a2']]);
	}

	$output['data'] = $finalDataArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
