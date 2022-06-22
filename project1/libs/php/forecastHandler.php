<?php

	//retrieve data from the openWeatherMap forecast API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//API key, required to make a request - not hidden as the API is free to use and does not incur any costs when going over limitations. Perhaps add a functionality to hide it in an .env file?
	$openWeatherMapApiKey = 'e32492c31dc6e5cd00009f4f881846d6';

	$executionStartTime = microtime(true);

	//URL to send the request to
	$url = 'https://api.openweathermap.org/data/2.5/forecast?q=' . $_POST['capitalName'] . '&APPID=' . $openWeatherMapApiKey;

	//cURL configuration
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

	//take only what's required from the response
	$output['data']['clouds'] = $decode['clouds']['all'];
	$output['data']['temperature'] = $decode['main']['temp'];
	$output['data']['pressure'] = $decode['main']['pressure'];
	$output['data']['humidity'] = $decode['main']['humidity'];
	$output['data']['sunrise'] = $decode['sys']['sunrise'];
	$output['data']['sunset'] = $decode['sys']['sunset'];
	$output['data']['windSpeed'] = $decode['wind']['speed'];
	$output['data']['description'] = $decode['weather'][0]['description'];
	$output['data']['icon'] = $decode['weather'][0]['icon'];

	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>