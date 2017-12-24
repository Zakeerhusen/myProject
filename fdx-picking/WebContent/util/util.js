var server = "http://10.40.3.187:8020/"

var currentView= "";
var parentApp = "";

var oLoginJsonModel =new sap.ui.model.json.JSONModel();
var oOrderJsonModel = new sap.ui.model.json.JSONModel();
var oDetailJsonModel = new sap.ui.model.json.JSONModel();
var oReportJsonModel =  new sap.ui.model.json.JSONModel();
var oExceptionJsonModel =  new sap.ui.model.json.JSONModel();
var pickQuantity= "";
var weightIndicator ="";
var pickLocation ="";
var batchPick = "";
var orderNum = "";
var sound = new Audio("background_sound/beep.mp3");
var exceptionIndicator =0;
var pphThreshold = 0;

Date.prototype.toSqlFormat = function() {
			   var yyyy = this.getUTCFullYear().toString();
			   var mm = (this.getUTCMonth()+1).toString(); // getMonth() is zero-based
			   var dd  = this.getUTCDate().toString();
//			   var hh = this.getUTCHours().toString();
//			   var min = this.getUTCMinutes().toString();
//			   var sec = this.getUTCSeconds().toString();
			   var hh="00";
			   var min="00";
			   var sec="00";
			   return yyyy+"-" + (mm[1]?mm:"0"+mm[0])+"-" + (dd[1]?dd:"0"+dd[0])+"T"+(hh[1]?hh:"0"+hh[0])+":"+(min[1]?min:"0"+min[0])+":"+(sec[1]?sec:"0"+sec[0]); // padding
			  };
			  

 Date.prototype.toMmDdYyyy = function() {
				   var yyyy = this.getUTCFullYear().toString();
				   var mm = (this.getUTCMonth()+1).toString(); // getMonth() is zero-based
				   var dd  = this.getUTCDate().toString();
				   
				   return mm+"-"+dd+"-"+yyyy;
				  };

