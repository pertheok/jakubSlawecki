<?php

	//retrieve data from the calendarific API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//API key, required to make a request - not hidden as the API is free to use and does not incur any costs when going over limitations. Perhaps add a functionality to hide it in an .env file?
	$calendarificApiKey = '2b04ec4a8e9c4b70955714d4d5289b4f300cd060';
	$executionStartTime = microtime(true);

	//URL to send the request to
	$url = 'https://calendarific.com/api/v2/holidays?&api_key=' . $calendarificApiKey . '&country=' . $_REQUEST['countryCode'] . '&year=' . $_REQUEST['year'] . '&type=national';

	//cURL configuration
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    //create a new array that will contain only the desired data
	$finalDataArray = [];

	//access the required data from the json response
	$decode = json_decode($result,true)['response']['holidays'];	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    //populate the array with desired data
	for ($i = 0; $i < count($decode); $i++) {
		array_push($finalDataArray, (object)['name' => $decode[$i]['name'], 'date' => $decode[$i]['date']['iso']]);
	}

	//takes only what's required from the JSON response
	$output['data'] = $finalDataArray;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>