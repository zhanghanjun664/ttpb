<?php
	$mysql=new mysqli(SAE_MYSQL_HOST_M,SAE_MYSQL_USER,SAE_MYSQL_PASS,SAE_MYSQL_DB);
	$mysql->query("set name utf8");
	$result=$mysql->query("SELECT * FROM `userinfo` ORDER BY  `score` DESC ");
	$arr=[];
	$num=0;
	while($row=$result->fetch_assoc()){
		$num++;
		if($num>20){
			return;
		}
		$arr[]=$row;
	}
	$newarr=json_encode($arr);
	echo $newarr;
?>