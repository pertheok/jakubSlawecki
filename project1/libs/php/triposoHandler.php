<?php
	
	//retrieve data from the Triposo API

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	//Import API key
	include("config.php");

	$executionStartTime = microtime(true);

	//URL to send the request to
	$url = 'https://www.triposo.com/api/20220411/location.json?part_of=' . $_REQUEST['countryName'] . '&tag_labels=national_park&count=100&fields=coordinates,name,snippet&account=' . $triposoAccountId .  '&token=' . $triposoApiKey;

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

	//takes only what's required from the JSON response
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>