<?php

	//retrieve data from the openExchangeRates API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//API key, required to make a request - not hidden as the API is free to use and does not incur any costs when going over limitations. Perhaps add a functionality to hide it in an .env file?
	$openExchangeRatesApiKey = 'c692867c4e8647368b163220f42193fe';

	$executionStartTime = microtime(true);

	//URL to send the request to
	$url = 'https://openexchangerates.org/api/latest.json?app_id=' . $openExchangeRatesApiKey . '&symbols=' . $_POST['countryCurrency'];

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

	//retrieve data, it's small enough so no need to bother with sieving it through  
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>