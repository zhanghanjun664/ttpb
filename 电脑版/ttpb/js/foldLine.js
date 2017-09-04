var dataBox = [],maxLength=60,activeType=1;
updateLength()
var current = {
	buyStopTime:"",
	periodTime:""
}
var hadBuy = 1;

function updateLength(){
	switch (String(activeType)){
		case "1":
			maxLength = 60;
			break;
		case "2":
			maxLength = 60;
			break;
		case "3":
			maxLength = 120;
			break;
		case "4":
			maxLength = 240;
			break;
		case "5":
			maxLength = 240;
			break;
		case "6":
			maxLength = 3600; 
			break;
		default:
			break;
	}
}

function getData(type){
	var dataX=[],dataY=[]
	ajax({
		type:"post",
		url: REST_PREFIX + "/api/kliner/getList.json",
		data:{proType:type},
		dataType:"json",
		success:function(data){
			var datas = data.data.list.slice(-maxLength/2)
			console.log(data)
			if(datas.length){
				
				dataBox = datas
				console.log(dataBox)
				//第一次
				if(!current.buyStopTime || getTime(current.buyStopTime)<=getTime(data.data.buyStopTime)){
					current.buyStopTime = data.data.buyStopTime
					current.periodTime = data.data.periodTime
				}
				
				dataBox.forEach(function(item){
					var time = getTime(item[0])
					dataX.push(time)
					dataY.push(Number(item[1]))
				})
				
				var minY = Math.min.apply(null,dataY)
				var diuY = (Math.max.apply(null,dataY) - Math.min.apply(null,dataY)+20)/4
				console.log(diuY)
				
				console.log(dataX,dataY)
				canvasInit({
				  width:w,
				  dataX:dataX,
				  dataY:dataY,
				  deadLine: getTime(current.buyStopTime),
				  openLine: getTime(current.periodTime),
				  countdown:data.data.buyCountDownSec,
				  originY:minY-10,
				  diuY:diuY,
				  proType:activeType,
				  mySelected:[
				  	{
					    trackMoney:"1012",//下注金额
					    directionType:"1",//1=买涨 2=买跌
					    time:1504439484645,
					    price:108
					  }
				  ]
				})
			}
		}
	})
}
//getData(activeType)
setInterval(function(){
	getData(activeType)
},1000)

function getTime(str){
	return new Date(str).getTime()
}

var dataX=[],dataY=[];
console.log($(document).innerWidth())
var w = $(document).innerWidth()/2-20
//canvasInit({
//width:w,
//dataX:[1504439474645,1504439475645,1504439476645,1504439477645,1504439478645,1504439479645,1504439480645,1504439481645,1504439482645,1504439483645,1504439484645,1504439485645],
//dataY:[100,131,122,130,111,133,118,104,120,122,108,111],
//deadLine:1504439498645,
//mySelected:{
//  trackMoney:"1012",//下注金额
//  directionType:"1",//1=买涨 2=买跌
//  time:1504439484645,
//  price:108
//}
//})
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = w;
canvas.height = 320;
var deadImg = new Image(),openImg = new Image();
deadImg.src = "img/icon_deadLine.png";
openImg.src = "img/icon_openLine.png";

function canvasInit(config) {
	ctx.clearRect(0,0,w,h)
	var w = config.width || 300;
	var h = config.height || 320;
	var paddingBottom = config.paddingBottom || 40;
	var lineH = h - paddingBottom;
	var el = config.el || "canvas";
	//1、30秒 * 2、60秒 * 3、2分钟 * 4、3分钟 * 5、5分钟 * 6、30分钟
	var proType = config.proType || 1;

	//数据
	var dataX = config.dataX;
	var dataY = config.dataY;

	//原点
	var originX = dataX[0]; //时间戳
	var originY = config.originY||60; //价钱
	//终点
	var sumTime = "",diuX = 0,diuY = config.diuY||20;
	var sumMoney = originY + diuY * 4;
	//两条线
	var deadLine = config.deadLine; //购买截止
	var openLine = config.openLine; //收益发放
	//最后一点时间：开始时间+每截的时间*4（显示4段）
	//1、30秒 * 2、60秒 * 3、2分钟 * 4、3分钟 * 5、5分钟 * 6、30分钟
	switch(String(proType)) {
		case "2":
			diuX = 30 * 1000
//			openLine = 60 * 1000 + deadLine
			break;
		case "3":
			diuX = 60 * 1000
//			openLine = 2 * 60 * 1000 + deadLine
			break;
		case "4":
			diuX = 2 * 60 * 1000
//			openLine = 3 * 60 * 1000 + deadLine
			break;
		case "5":
			diuX = 2 * 60 * 1000
//			openLine = 5 * 60 * 1000 + deadLine
			break;
		default:
			diuX = 30 * 1000
//			openLine = 30 * 1000 + deadLine
			break;
	}
	sumTime = originX + diuX * 4

	//每毫秒的长度
	var xDis = w / (sumTime - originX);

	var countdown = ""; //倒计时
	if(config.countdown){
		var a = config.countdown.length==2?config.countdown:"0"+config.countdown
		countdown = "00:"+ a
	}
	var mySelect = config.mySelected; //下注信息

//	var canvas = document.getElementById("canvas");
//	var ctx = canvas.getContext("2d");
//	canvas.width = w;
//	canvas.height = h;
//	ctx.clearRect(0,0,w,h)
	//背景色
	ctx.beginPath()
	ctx.fillStyle = "#19242e"
	ctx.fillRect(0, 0, w, h)
	ctx.closePath()

	//画背景虚线
	ctx.beginPath()
	//x轴
	ctx.fillStyle = "#45505b"
	ctx.font = "12px Arial"
	ctx.textBaseline = "bottom"
	ctx.textAlign = "right"

	for(var i = 0; i < 5; i++) {
		ctx.moveTo(x(originX), y(originY + i * diuY))
		ctx.lineTo(x(sumTime), y(originY + i * diuY))
		ctx.fillText(Number(originY + i * diuY).toFixed(2), x(sumTime), y(originY + i * diuY) - 2)
	}
	//y轴
	for(var j = 0; j < 5; j++) {
		ctx.moveTo(x(originX + diuX * j), y(originY))
		ctx.lineTo(x(originX + diuX * j), y(sumMoney))

	}
	ctx.setLineDash([4, 2]);
	ctx.strokeStyle = "#2a3d4d"
	ctx.stroke()

	//x轴时间

	console.log(config)
	console.log(originX, originY)

	//描点
	ctx.beginPath()
	ctx.moveTo(x(dataX[0]), y(dataY[0]));
	for(var i = 1; i < dataX.length; i++) {
		ctx.lineTo(x(dataX[i]), y(dataY[i]))
	}
	ctx.strokeStyle = "#32b9a1"
	ctx.setLineDash([1, 0])

	ctx.stroke()
	//闭合
	ctx.lineTo(x(dataX[dataX.length - 1]), y(originY))
	ctx.lineTo(x(originX), y(originY))
	ctx.closePath()

	//渐变加透明
	var lineGradient = ctx.createLinearGradient(0, 0, 0, y(originY));
	lineGradient.addColorStop(0, 'rgba(44,149,134,.8)');
	lineGradient.addColorStop(1, 'rgba(44,149,134,.1)');
	ctx.fillStyle = lineGradient;
	ctx.fill()

	

	//最后一点径向渐变
	ctx.beginPath()
	ctx.strokeStyle = "#32b9a1"
	ctx.strokeStyle = "transparent"

	ctx.setLineDash([10, 0])
	var radialGradient = ctx.createRadialGradient(x(dataX[dataX.length - 1]), y(dataY[dataY.length - 1]), 0, x(dataX[dataX.length - 1]), y(dataY[dataY.length - 1]), 8)
	radialGradient.addColorStop(0, 'rgba(44,149,134,1)')
	radialGradient.addColorStop(1, 'rgba(44,149,134,.6)')
	//最后一点画圆
	ctx.arc(x(dataX[dataX.length - 1]), y(dataY[dataY.length - 1]), 5, 0, Math.PI * 2)
	ctx.fillStyle = radialGradient
	ctx.stroke()
	ctx.fill()

	//购买截止时间
	ctx.beginPath()
	ctx.save()
	ctx.font = "14px Arial"
	ctx.textAlign = "right"
	ctx.textBaseline = "top"
	//把画布移到那个点（相当于那个点是旋转中心）
	ctx.translate(x(deadLine) - 20, 10)
	ctx.rotate(-Math.PI / 2)
	ctx.strokeStyle = "#f2bf51"
	ctx.strokeText("购买截止时间", 0, 0)
	ctx.restore()
	//线
	ctx.strokeStyle = "#f2bf51"
	ctx.moveTo(x(deadLine), 0)
	ctx.lineTo(x(deadLine), y(originY))
	ctx.setLineDash([4, 2])
	ctx.stroke()
	//图标
	ctx.drawImage(deadImg,x(deadLine)-10,y(originY)-20,20,20)


	//收益发放时间
	ctx.beginPath()
	ctx.setLineDash([1, 0])
	ctx.save()
	ctx.font = "14px Arial"
	ctx.textAlign = "right"
	ctx.textBaseline = "top"
	//把画布移到那个点（相当于那个点是旋转中心）
	ctx.translate(x(openLine) - 20, 10)
	ctx.rotate(-Math.PI / 2)
	ctx.strokeStyle = "#f25158"
	ctx.strokeText("收益发放时间", 0, 0)
	ctx.restore()
	//线
	ctx.strokeStyle = "#f25158";
	ctx.moveTo(x(openLine), 0)
	ctx.lineTo(x(openLine), y(originY))
	ctx.setLineDash([4, 2])
	ctx.stroke()
	//图标
	ctx.drawImage(openImg,x(openLine)-10,y(originY)-20,20,20)
	
	openImg.onload = function(){
	}
	

	//倒计时
	ctx.beginPath()
	ctx.setLineDash([1, 0])
	ctx.strokeStyle = "#f2bf51";
	ctx.textAlign = "right"
	ctx.textBaseline = "top"
	ctx.strokeText(countdown, x(deadLine) - 25, 10)
	ctx.closePath()

	//我的投注
	if(mySelect) {
		//投注虚线
		ctx.beginPath()
		ctx.moveTo(x(mySelect.time), y(mySelect.price))
		ctx.lineTo(x(openLine), y(mySelect.price))
		ctx.setLineDash([4, 2])
		ctx.strokeStyle = "32b9a1"
		ctx.stroke()
		//投注箭头 高：20
		ctx.beginPath()
		ctx.moveTo(x(mySelect.time), y(mySelect.price))
		ctx.lineTo(x(mySelect.time) + 10, y(mySelect.price) - 10)
		ctx.lineTo(x(mySelect.time) + 30, y(mySelect.price) - 10)
		ctx.lineTo(x(mySelect.time) + 30, y(mySelect.price) - 30)
		ctx.lineTo(x(mySelect.time) - 20, y(mySelect.price) - 30)
		ctx.lineTo(x(mySelect.time) - 20, y(mySelect.price) - 10)
		ctx.lineTo(x(mySelect.time) - 10, y(mySelect.price) - 10)
		ctx.closePath()
		//        ctx.fillStyle = "#3d5971"
		ctx.fillStyle = "rgba(61, 89, 113,1)"
		ctx.fill()
		//投注方向 1：买涨  三角形高：8
		ctx.beginPath()
		if(mySelect.directionType == 1) {
			ctx.moveTo(x(mySelect.time) - 6, y(mySelect.price) - 16)
			ctx.lineTo(x(mySelect.time) - 12, y(mySelect.price) - 24)
			ctx.lineTo(x(mySelect.time) - 18, y(mySelect.price) - 16)
			ctx.closePath()
			ctx.fillStyle = "#50e065"
		} else {
			ctx.moveTo(x(mySelect.time) - 6, y(mySelect.price) - 24)
			ctx.lineTo(x(mySelect.time) - 12, y(mySelect.price) - 16)
			ctx.lineTo(x(mySelect.time) - 18, y(mySelect.price) - 24)
			ctx.closePath()
			ctx.fillStyle = "#f25158"
		}
		ctx.fill()
		//投注金额
		ctx.beginPath()
		ctx.font = "normal 12px Arial"
		ctx.textAlign = "left"
		ctx.textBaseline = "middle"
		ctx.strokeStyle = "#ffffff"
		ctx.setLineDash([1, 0])
		ctx.strokeText(mySelect.trackMoney, x(mySelect.time) - 5, y(mySelect.price) - 20)
		ctx.stroke()
	}
	
	//最后一点画水平线;80留着画箭头
	ctx.beginPath()
	ctx.moveTo(x(originX), y(dataY[dataY.length - 1]))
	ctx.lineTo(w - 70, y(dataY[dataY.length - 1]))
	//箭头
	ctx.lineTo(w - 60, y(dataY[dataY.length - 1]) - 12)
	ctx.lineTo(w, y(dataY[dataY.length - 1]) - 12)
	ctx.lineTo(w, y(dataY[dataY.length - 1]) + 12)
	ctx.lineTo(w - 60, y(dataY[dataY.length - 1]) + 12)
	ctx.lineTo(w - 70, y(dataY[dataY.length - 1]))
	ctx.fillStyle = "#31c2a5"
	ctx.strokeStyle = "#31c2a5"
	ctx.stroke()
	ctx.fill()
	//箭头写字,箭头宽度60
	ctx.fillStyle = "#ffffff"
	ctx.font = "14px Arial"
	ctx.textBaseline = "middle"
	ctx.textAlign = "center"
	ctx.fillText(dataY[dataY.length - 1], w - 30, y(dataY[dataY.length - 1]))
	
	

	ctx.closePath()
	

	//坐标开始时间x:
	function x(str) {

		//每毫秒的长度w/(sumTime - originX) * 有多少毫秒(str - originX)
		var nX = (str - originX) * xDis;
		return nX
	}

	function y(str) {

		//同上    y-X 就反着来了
		var nY = lineH - (str - originY) * lineH / (sumMoney + 10 - originY);
		return nY
	}

}