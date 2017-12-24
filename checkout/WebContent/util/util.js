var oLoginJsonModel = new sap.ui.model.json.JSONModel();
var oCheckoutJsonModel = new sap.ui.model.json.JSONModel();
var oCheckOrderSetJsonModel = new sap.ui.model.json.JSONModel();
var oDialogueJsonModel = new sap.ui.model.json.JSONModel();
var oCheckPickTasksJsonModel = new sap.ui.model.json.JSONModel();
var oPendingLinkJsonModel = new sap.ui.model.json.JSONModel();
var oMaterialJsonModel = new sap.ui.model.json.JSONModel();
var oStageLocationJsonModel =new sap.ui.model.json.JSONModel();
var oDialogueJsonModel1 = new sap.ui.model.json.JSONModel();
var oCurrentToteSearchJsonModel = new sap.ui.model.json.JSONModel();
var oCurrentToteSearchJsonModel1 = new sap.ui.model.json.JSONModel();
var oCurrentToteSearchJsonModelTemp = new sap.ui.model.json.JSONModel();
var snd = new Audio("fdx_checkout/beep.mp3");
var descCheck =[];
var upcCheck = [];
var idleTime ="";
var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];
var dayName = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
		"Friday", "Saturday" ];

var currentDate = new Date();
var dateTimeFormate1 = currentDate.getFullYear() + "-"
		+ (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + "T"
		+ currentDate.getHours() + ":" + currentDate.getMinutes() + ":"
		+ currentDate.getSeconds();
var dateTimeFormat2 = dayName[currentDate.getDay()] + ", "
		+ monthNames[currentDate.getMonth()] + " "
		+ currentDate.getDate() + " " + currentDate.getFullYear();
var dateTimeFormat3;
function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	var currentTime = h + ":" + m + ":" + s;
	return currentTime;
}
function checkTime(i) {
	if (i < 10) {
		i = "0" + i
	}
	; // add zero in front of numbers < 10
	return i;
}
function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'PM' : 'AM';
	  hours = hours % 12;
	  hours = hours ? hours : 12;
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
	}