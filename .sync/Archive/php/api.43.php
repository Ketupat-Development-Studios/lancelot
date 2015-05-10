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
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` INNER JOIN categories ON freelancers.cat_id = categories.cat_id 
		WHERE freelancers.free_id = ?") or die($mysqli->error);
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
		$results = array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "getreviewsbylancer" && isset($_POST["id"])){ //Get all reviews for a freelancer
		$stmt = $mysqli->prepare("SELECT *, NULL as pass FROM `reviews` INNER JOIN `users` ON users.user_id = reviews.user_id WHERE reviews.free_id = ?");
		$stmt->bind_param("i", $_POST['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		$results = array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "searchcats" && isset($_POST["searchquery"])){ //Search all categories
		$stmt = $mysqli->prepare("SELECT * FROM `categories` WHERE cat_name LIKE ?");
		$param = '%'.$_POST['searchquery'].'%';
		$stmt->bind_param("s", $param);
		$stmt->execute();
		$res = $stmt->get_result();
		$results = array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "searchlancers" && isset($_POST["searchquery"])){ //Search all freelancers
		$stmt = $mysqli->prepare("SELECT * FROM `freelancers` INNER JOIN categories ON freelancers.cat_id = categories.cat_id 
		WHERE freelancers.free_name LIKE ? OR freelancers.free_description LIKE ?") or die($mysqli->error);
		$param = '%'.$_POST['searchquery'].'%';
		$stmt->bind_param("ss", $param, $param);
		$stmt->execute();
		$res = $stmt->get_result();
		$results = array();
		while ($row = $res->fetch_assoc()) {
			$results[] = $row;
		}
	}
	
	else if($query == "getcatsbyid" && isset($_POST["id"])){ //Get all categories by id
		$stmt = $mysqli->prepare("SELECT * FROM `categories` WHERE id = ?");
		$stmt->bind_param("i", $_POST['id']);
		$stmt->execute();
		$res = $stmt->get_result();
		$results = $res->fetch_assoc();
	}
	
	else if($query == "login" && isset($_POST["username"]) && isset($_POST["pass"])){ //log users in
		$stmt = $mysqli->prepare("SELECT * FROM `users` WHERE username = ? AND pass = ?");
		$pass = md5($_POST['pass']);
		$stmt->bind_param("ss", $_POST['username'], $pass);
		$stmt->execute();
		$res = $stmt->get_result();
		if($res->num_rows>0){
			$results = $res->fetch_assoc();
			session_start();
			$_SESSION['user_id'] = $results['user_id'];
			echo "login success";
		}
		else echo "check creds";
		exit();
	}
	
	else if($query == "addreview" && isset($_POST["price_rating"]) 
	&& isset($_POST["friendliness_rating"]) && isset($_POST["quality_rating"]) && isset($_POST["free_id"]) 
	&& isset($_POST["title"]) && isset($_POST["description"])){ //add a review for a freelancer
		
		session_start();
		$stmt = $mysqli->prepare("INSERT INTO `reviews` (price_rating, friendliness_rating, quality_rating, title, description, free_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?");
		$stmt->bind_param("dddssii", $_POST["price_rating"], $_POST["friendliness_rating"], $_POST["quality_rating"], $_POST["title"], $_POST["description"], $_POST["free_id"], $_SESSION["user_id"]);
		if($stmt->execute()) echo "add review success";
		else echo "failed";
		exit();
	}
	
	else{
		echo "Please check your syntax!";
		exit();
	}
	echo json_encode($results);
?>