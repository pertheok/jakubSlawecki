<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

//URL to send the request to - API keys not hidden as they are free and do not incur any costs when going over limitations. Perhaps add a functionality to hide it somehow?

$url = 'https://api.opencagedata.com/geocode/v1/json?key=db840d0c33834a239c5ea6741c24d039&q=' . $_POST['userLatitude'] . '%2C+' . $_POST['userLongitude'] . '&pretty=1&no_annotations=1'; //URL to retrieve data from the api providing the name of the country that user is currently in

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
	$output['data'] = $decode['results'][0]['components']['ISO_3166-1_alpha-2'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>