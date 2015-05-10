<?php
	require_once("dbcon.php");
	
	$query = $_GET['query'];
	if($query == "getcats"){ //Get all categories
		$res = $mysqli->query("SELECT * FROM `categories`");
		$results = Array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	if($query == "getlancers"){ //Get all freelancers
		$res = $mysqli->query("SELECT * FROM `freelancers`");
		$results = Array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	if($query == "getlancersbyid" && isset($_GET["id"])){ //Get all freelancers by freelancer id
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` WHERE id = ?");
		$stmt->bind_param("i", $_GET['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		$results = $res->fetch_assoc();
	}
	
	if($query == "getlancersbycat" && isset($_GET["id"])){ //Get all freelancers in a category
	
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` WHERE cat_id = ?");
		$stmt->bind_param("i", $_GET['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	if($query == "getreviewsbylancer" && isset($_GET["id"])){ //Get all reviews for a freelancer
		$stmt = $mysqli->prepare("SELECT * FROM `reviews` WHERE free_id = ?");
		$stmt->bind_param("i", $_GET['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	if($query == "searchcats" && isset($_GET["searchquery"])){ //Search all categories
		$stmt = $mysqli->prepare("SELECT * FROM `categories` WHERE name LIKE ?");
		$param = '%'.$_GET['searchquery'].'%';
		$stmt->bind_param("s", $param);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	if($query == "searchlancers" && isset($_GET["searchquery"])){ //Search all categories
		$stmt = $mysqli->prepare("SELECT * FROM `lancers` WHERE name LIKE ? OR description LIKE ?");
		$param = '%'.$_GET['searchquery'].'%';
		$stmt->bind_param("ss", $param, $param);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else{
		echo "please check your syntax!";
		exit();
	}
	echo json_encode($results);
?>