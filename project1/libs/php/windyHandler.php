<?php
	
	//retrieve data from the Windy API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//header containing the API key, required to make a request - not hidden as the API is free to use and does not incur any costs when going over limitations. Perhaps add a functionality to hide it in an .env file?
    $headers = ["x-windy-key: 7PBqgt8aVLmbPJhQuAZVLaFw0WhkMyxa"];

	$executionStartTime = microtime(true);

	//URL to send the request to
	$url = 'https://api.windy.com/api/webcams/v2/list/country=' . $_REQUEST['countryCode'] . "/orderby=popularity/limit=50?show=webcams:location,player";



	//cURL configuration
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	$result = curl_exec($ch);

	curl_close($ch);

    //create a new array that will contain only the desired data
	$finalDataArray = [];
	$decode = json_decode($result,true)['result']['webcams'];

    //populate the array with desired data
	for ($i = 0; $i < count($decode); $i++) {
		array_push($finalDataArray, (object)['latitude' => $decode[$i]['location']['latitude'], 'longitude' => $decode[$i]['location']['longitude'], 'id' => $decode[$i]['id'], 'title' => $decode[$i]['title']]);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//takes only what's required from the JSON response
	$output['data'] = $finalDataArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>