<?php
	header('Access-Control-Allow-Credentials:true');
	require_once("dbcon.php");
	
	$query = trim($_POST['query']);
	if($query == "getcats"){ //Get all categories
		$res = $mysqli->query("SELECT * FROM `categories`");
		$results = Array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "getlancers"){ //Get all freelancers
		$res = $mysqli->query("SELECT * FROM `freelancers`");
		$results = Array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "getlancersbyid" && isset($_POST["id"])){ //Get all freelancers by freelancer id
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` WHERE id = ?");
		$stmt->bind_param("i", $_POST['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		$results = $res->fetch_assoc();
	}
	
	else if($query == "getlancersbycat" && isset($_POST["id"])){ //Get all freelancers in a category
	
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` WHERE cat_id = ?");
		$stmt->bind_param("i", $_POST['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "getreviewsbylancer" && isset($_POST["id"])){ //Get all reviews for a freelancer
		$stmt = $mysqli->prepare("SELECT * FROM `reviews` WHERE free_id = ?");
		$stmt->bind_param("i", $_POST['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "searchcats" && isset($_POST["searchquery"])){ //Search all categories
		$stmt = $mysqli->prepare("SELECT * FROM `categories` WHERE name LIKE ?");
		$param = '%'.$_POST['searchquery'].'%';
		$stmt->bind_param("s", $param);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "searchlancers" && isset($_POST["searchquery"])){ //Search all freelancers
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` WHERE name LIKE ? OR description LIKE ?");
		$param = '%'.$_POST['searchquery'].'%';
		$stmt->bind_param("ss", $param, $param);
		$stmt->execute();
		$res = $stmt->get_result();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else{
		echo "Please check your syntax!";
		exit();
	}
	echo json_encode($results);
?>