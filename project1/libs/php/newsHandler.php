<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//API key, required to make a request - not hidden as the API is free to use and does not incur any costs when going over limitations. Perhaps add a functionality to hide it in an .env file?

	$newsApiKey = 'a6f3ba0005e44352adcd34b99222b894';

	$username = 'pertheok';

	$executionStartTime = microtime(true);

	//URL to send the request to - API keys not hidden as they are free and do not incur any costs when going over limitations. Perhaps add a functionality to hide it somehow?

	$url = 'https://newsapi.org/v2/everything?q=' . $_REQUEST['countryName'] . '&sortBy=publishedAt&language=en&pageSize=10&apiKey=' . $newsApiKey;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	//include user agent in the header, not doing so prevents from obtaining data when testing locally

	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1");

	$result=curl_exec($ch);

	curl_close($ch);


	//create a new array that will contain only the desired data

	$finalDataArray = [];
	$decode = json_decode($result,true);
	
	//populate the array with desired data

	for ($i = 0; $i < count($decode['articles']); $i++) {
		array_push($finalDataArray, (object)['source' => $decode['articles'][$i]['source']['name'], 'title' => $decode['articles'][$i]['title'], 'description' => $decode['articles'][$i]['description'], 'url' => $decode['articles'][$i]['url'], 'urlToImage' => $decode['articles'][$i]['urlToImage']]);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

	//this will be used for the logic checks in the script.js 

	$output['status']['totalResults'] = $decode['totalResults'];

	$output['data'] = $finalDataArray;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>