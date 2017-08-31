<?php
	$appid = "wx225b4215ece069fc";
	$appsecret = "3a20f4d30581dfc1d80c1f3d9ae6c7e7";
	
echo "<script>window.location.herf='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx225b4215ece069fc&redirect_uri=https%3A%2F%2Fttpb.applinzi.com%2Fcode.php&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'</script>";	

	$code = $_GET['code'];
//	echo $code;
//通过appid appsecret 和 code 获取另一个access_token码-----注意：code码只有5s有效时间
	$api = "https://api.weixin.qq.com/sns/oauth2/access_token?appid={$appid}&secret={$appsecret}&code={$code}&grant_type=authorization_code";
	$json = json_decode(httpGet($api),true);
//echo httpGet($api);
//var_dump($json["access_token"]);
	$refresh_token = $json["refresh_token"];
	$json_token = $json["access_token"];
	if(!$json_token){
    	echo "<script>window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx225b4215ece069fc&redirect_uri=https%3A%2F%2Fttpb.applinzi.com%2Fcode.php&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'</script>";
        return;
	}
	$json_openid = $json["openid"];
	
////使用refresh_token进行刷新--------拥有较长的有效期（7天、30天、60天、90天）
//	$api = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid={$appid}&grant_type=refresh_token&refresh_token={$refresh_token}";
//	$jsonRe = json_decode(httpGet($api),true);
//	var_dump($jsonRe);
	//获取授权用户信息
	$api = "https://api.weixin.qq.com/sns/userinfo?access_token={$json_token}&openid={$json_openid}&lang=zh_CN";
	$user = httpGet($api);
	$user_json = json_decode($user,true);
	//var_dump($user_json);
	$headUrl = $user_json['headimgurl'];
	$name = $user_json['nickname'];
	$openID=$user_json["openid"];
//	echo "<hr/>";
//	echo $user_json;
//	echo "<hr/>";
//	echo "<img src='$headUrl' style='width:50px'/>";
//	echo "'$nick',你好。";
	
//	https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc3bde56951194fbe&redirect_uri=http://yohe.applinzi.com/code.php&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
//echo $headUrl,$name,$openID;
	//httpGet方法
	function httpGet($url) {
	    $curl = curl_init();
	    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
	    // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
	    // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
	    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
	    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, true);//本地服务器用不了，用于网上的匹配
	    curl_setopt($curl, CURLOPT_URL, $url);
	    $res = curl_exec($curl);
	    curl_close($curl);
	    return $res;
	 }
	
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
		<title></title>
		<link rel="stylesheet" type="text/css" href="css/PK1.0.css"/>
	</head>
	<body>
		
		<!--开始页面-->
		<div id="ready">
			<div class="rcontent">
				<div class="rleft">
					<img src="img/pk_record.png"/>
					<div class="paiming_cont">
						<ul class="paiming">
							<li>
								<img src="" alt="" />
								<span class="username"></span>
								<span class="userscore"></span>
							</li>
						</ul>
					</div>
				</div>
				<div class="rright">
					<div class="rright1">
						<img src="img/pk_renwu.gif"/>
					</div>
					<div class="go">开始游戏</div>
				</div>
			</div>
		</div>
		
		
		<!--游戏界面-->
		<div id="game">
			<canvas id="canvas"></canvas>
            <div class="btn1"></div>
			<div class="btn2"></div>
			<div class="title">
				<div class="biaoxian">
					<div class="bx_tu"></div>
					<div class="bx_fen"></div>
					<div class="bx_num"></div>
				</div>
				<div class="juli">
					<div class="jl_tu"></div>
					<div class="jl_mi"></div>
					<div class="jl_num"></div>
				</div>
				<div class="stop"></div>
			</div>
			<div class="stop_cont">
				<div class="stop_box">
					<div class="stop_t">
						<p class="zanting">暂停</p>
					</div>
					<div class="stop_b">
						<div class="stop_b_box">
							<div class="jixu">继续游戏</div>
							<div class="chongxin">重新开始</div>
							<div class="paiheng">排 行 榜</div>
						</div>
					</div>
				</div>
				
				<div class="daojishi"></div>
			</div>
			<div class="power">
				<p class="power_num">20%</p>
				<div class="power_box"></div>
				<div class="power_head"></div>
			</div>
			<div class="click"></div>
			<div class="chong"></div>
			<div class="die">
				<div class="die_box">
					<p class="jieshu">游戏结束！</p>
					<p class="again">再来一局</p>
					<p class="mark">查看成绩</p>
				</div>
			</div>
		</div>
		
		<!--计分页面-->
		<div id="ending">
			<canvas id="canvas2"></canvas>
			<div class="best"></div>
			<div class="ending_t">
				<img src="img/pk_renwu.gif"/>
				<div class="ending_t_box">
					<img src="img/pk_total.png"/>
					<p class="history">历史最高分<span class="zuigaofen"></span></p>
					<div class="total_now">
						<div class="total_one">
							<p class="total_one1">距离</p>
							<p class="total_one2">米</p>
							<p class="total_juli">226</p>
						</div>
						<div class="total_two">
							<p class="total_two1">表现</p>
							<p class="total_two2">分</p>
							<p class="total_fenshu">1555</p>
						</div>
						<div class="total_three">
							<p class="total_three1">总 分</p>
							<div class="total_all">
								<p class="total_all_box"></p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ending_b">
				<p class="ending_b_back">返回</p>
				<p class="ending_b_share">分享好友</p>
			</div>
		</div>
		<script type="text/javascript">
			var  ajax_name='<?php echo $name;?>';
			var ajax_img='<?php echo $headUrl;?>';
			var ajax_openid='<?php echo $openID;?>';
		</script>
		<script src="js/PK1.0.js" type="text/javascript" charset="utf-8"></script>
	</body>
</html>
