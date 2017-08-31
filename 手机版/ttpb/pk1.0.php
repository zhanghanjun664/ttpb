<?php
	$mysql=new mysqli(SAE_MYSQL_HOST_M,SAE_MYSQL_USER,SAE_MYSQL_PASS,SAE_MYSQL_DB);
	$mysql->query("set name utf8");
//	$mysql->query("INSERT INTO `userinfo`(`id`, `img`, `name`, `score`) VALUES (null,'111','112','113')");
	$name=$_GET["name"];
	$score=$_GET["score"];
	$img=$_GET["img"];
	$openID=$_GET["openid"];
	$result=$mysql->query("SELECT  `score`,`name` FROM `userinfo` WHERE `openid`='$openID'");
	if($result->num_rows){
		$row=$result->fetch_assoc();
		if($row["score"]<$score){
			$mysql->query("UPDATE `userinfo` SET `score`=$score WHERE `openid`='$openID'");
			echo $score;
			return;
		}
//		$json=json_encode($row);
		echo $row["score"];
	}else{
		$mysql->query("INSERT INTO `userinfo`(`id`, `img`, `name`, `score`, `openid`) VALUES (null,'$img','$name','$score','$openID')");
//		$mysql->query("INSERT INTO `userinfo`(`id`, `img`, `name`, `score`) VALUES (null,'111','222','333')");
	}
?>
