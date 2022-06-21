<?php

	//retrieve data from the geonames API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//Username, required to make a request - not hidden as the API is free to use and does not incur any costs when going over limitations. Perhaps add a functionality to hide it in an .env file?

	$geonamesUsername = 'pertheok';

	$executionStartTime = microtime(true);

	//URL to send the request to - API keys not hidden as they are free and do not incur any costs when going over limitations.

	$url = 'http://api.geonames.org/countryInfoJSON?&lang=en&country=' . $_REQUEST['countryCode'] . '&username=' . $geonamesUsername;

	//cURL configuration

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	//access the required data from the json response

	$decode = json_decode($result,true)['geonames'][0];	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//takes only what's required from the JSON response

	$output['data']['areaInSqKm'] = $decode['areaInSqKm'];
	$output['data']['capital'] = $decode['capital'];
	$output['data']['continentName'] = $decode['continentName'];
	$output['data']['currencyCode'] = $decode['currencyCode'];
	$output['data']['population'] = $decode['population'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>