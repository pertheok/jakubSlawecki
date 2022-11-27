<?php

	//retrieve data from the openWeatherMap forecast API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//Import API key
	include("config.php");

	$executionStartTime = microtime(true);

	//URL to send the request to
	$url = 'https://api.openweathermap.org/data/2.5/forecast?q=' . $_POST['capitalName'] . '&APPID=' . $openWeatherMapApiKey . '&units=metric';

	//cURL configuration
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	//create a new array that will contain only the desired data
	$finalDataArray = [];

	$decode = json_decode($result,true)['list'];

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//take only what's required from the response
	for ($i = 0; $i < count($decode); $i++) {

		//check if forecast data is for the noon of the given day
		if (str_contains($decode[$i]['dt_txt'], '12:00:00')) {
			array_push($finalDataArray, (object)['temp' => $decode[$i]['main']['temp'], 'date' => $decode[$i]['dt_txt'], 'icon' => $decode[$i]['weather'][0]['icon']]);
		}
	}

	$output['data'] = $finalDataArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
