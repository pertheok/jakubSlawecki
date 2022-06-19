<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

//URL to send the request to - API keys not hidden as they are free and do not incur any costs when going over limitations. Perhaps add a functionality to hide it somehow?

$url = 'http://api.geonames.org/countryInfoJSON?&lang=en&country=' . $_REQUEST['countryCode'] . '&username=pertheok'; //URL to retrieve data from the api providing basic country information

$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//takes only what's required from the JSON response
	$output['data']['areaInSqKm'] = $decode['geonames'][0]['areaInSqKm'];
	$output['data']['capital'] = $decode['geonames'][0]['capital'];
	$output['data']['continentName'] = $decode['geonames'][0]['continentName'];
	$output['data']['currencyCode'] = $decode['geonames'][0]['currencyCode'];
	$output['data']['population'] = $decode['geonames'][0]['population'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>