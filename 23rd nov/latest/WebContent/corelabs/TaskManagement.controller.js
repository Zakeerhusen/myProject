jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.TaskManagement", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf servicescopeandchargesform.TaskManagement
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		var that=this;
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "TaskManagement") {
			that.getView().byId("rfsno").setValue("");
			if(that.getView().getModel("taskMgmtModel")!=undefined){
			that.getView().getModel("taskMgmtModel").setData();
			that.getView().getModel("taskMgmtModel").refresh();
			}
	    if(!that.busyDialog){
	    	that.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", that);
	    	that.getView().addDependent(that.busyDialog);
	    	that.busyDialog.addStyleClass("sapUiSizeCompact");
	    		}
			}
		});
	},
	
	/*searchTask:function(){
		var that=this;
		var rfsno=that.getView().byId("rfsno").getValue();
		var taskMgmtModel=new sap.ui.model.json.JSONModel();
		if(rfsno!=""){
			if(that.busyDialog){
				that.busyDialog.open();
			}
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			var taskPayload={"bpmProcessDto" : {"requestId" : "1001600822"}};
			var url="/utilweb/rest/bpm/getAllOpenTasks";
			taskMgmtModel.loadData("/utilweb/rest/bpm/getAllOpenTasks",JSON.stringify(taskPayload),false,"POST",false,false,oHeader);
			if((taskMgmtModel.getData()!=undefined) && (taskMgmtModel.getData().bpmTaskDtoList)){
				if((taskMgmtModel.getData().bpmTaskDtoList)&&!(taskMgmtModel.getData().bpmTaskDtoList instanceof Array)){
					taskMgmtModel.getData().bpmTaskDtoList=[taskMgmtModel.getData().bpmTaskDtoList];
				}
			}else{
				taskMgmtModel.setData();
			}
			that.getView().setModel(taskMgmtModel,"taskMgmtModel");
			that.getView().getModel("taskMgmtModel").refresh();
			that.busyDialog.close();
		}else{
			taskMgmtModel.setData();
			that.getView().setModel(taskMgmtModel,"taskMgmtModel");
			that.getView().getModel("taskMgmtModel").refresh();
			sap.ui.commons.MessageBox.show("Plese enter rfs number",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},*/
	
	searchTask:function(){
		var that=this;
		that.rfsno=that.getView().byId("rfsno").getValue();
		var taskMgmtModel=new sap.ui.model.json.JSONModel();
		if(that.rfsno!=""){
			if(that.busyDialog){
				that.busyDialog.open();
			}
			var soapMessage = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sch=\"http://www.badgerlms.com/webservices/resource/schemas\">"
				+ "<soapenv:Header/>"
				+ "<soapenv:Body>"
				+ "<yq1:getAllOpenTasks xmlns:yq1=\"http://kaust.com/service/bpm/\">"
			    + "<bpmProcessDto>"
			    + "<requestId>"
			    +that.rfsno
			    +"</requestId>"
			    +"<loggedInUserId>"+loggedinUserModel.getData().userId+"</loggedInUserId>"
			    + "<processNm>RFS</processNm>"
			    +"</bpmProcessDto>"
			    +"</yq1:getAllOpenTasks>"
				+ "</soapenv:Body>" + "</soapenv:Envelope>";

		$.ajax( {
			url :  "/UtilBpmServiceWsdlService/UtilBpmServiceWsdl?wsdl",            //"https://kaust1.badgerlms.com:8443/WebServices/Resource?wsdl",
			type : "POST",
			async : false,
			data : soapMessage,
			dataType : "xml",
			contentType : "text/xml; charset=\"utf-8\"",
			success : function(data, textStatus, jqXHR) {
			xmldoc = jqXHR.responseXML;

			/*if(xmldoc.getElementsByTagName('active').length!=0 && xmldoc.getElementsByTagName('active')[0].childNodes[0].length!=0){
				if(xmldoc.getElementsByTagName('active')[0].childNodes[0].nodeValue=="true"){
					isBadgerStatusActive=true;
				}
			}*/
			var bpmTaskDtoList = [];
			if(xmldoc.getElementsByTagName('success').length!=0 && xmldoc.getElementsByTagName('success')[0].childNodes[0].length!=0){
				if(xmldoc.getElementsByTagName('success')[0].childNodes[0].nodeValue=="true"){
					if(xmldoc.getElementsByTagName('bpmTaskDtoList').length!=0 && xmldoc.getElementsByTagName('bpmTaskDtoList')[0].childNodes[0].length!=0){
						for( var int = 0; int < xmldoc.getElementsByTagName("bpmTaskDtoList").length; int++) {
							var bpmTaskDto = {
									taskFullName : "",
									taskOwnerNames : "",
									taskStatus : "",
									taskUri:""
							};
							if (xmldoc.getElementsByTagName("taskFullName")[int] && xmldoc.getElementsByTagName("taskFullName")[int].childNodes[0]) {
								bpmTaskDto.taskFullName = xmldoc.getElementsByTagName("taskFullName")[int].childNodes[0].nodeValue;
							}
							if (xmldoc.getElementsByTagName("taskOwnerNames")[int] && xmldoc.getElementsByTagName("taskOwnerNames")[int].childNodes[0]) {
								bpmTaskDto.taskOwnerNames = xmldoc.getElementsByTagName("taskOwnerNames")[int].childNodes[0].nodeValue;
							}
							if (xmldoc.getElementsByTagName("taskStatus")[int] && xmldoc.getElementsByTagName("taskStatus")[int].childNodes[0]) {
								bpmTaskDto.taskStatus = xmldoc.getElementsByTagName("taskStatus")[int].childNodes[0].nodeValue;
							}
							if (xmldoc.getElementsByTagName("taskUri")[int] && xmldoc.getElementsByTagName("taskUri")[int].childNodes[0]) {
								bpmTaskDto.taskUri = xmldoc.getElementsByTagName("taskUri")[int].childNodes[0].nodeValue;
							}
						    bpmTaskDtoList.push(bpmTaskDto);
						}
						taskMgmtModel.setData({bpmTaskDtoList:bpmTaskDtoList});
						that.getView().setModel(taskMgmtModel,"taskMgmtModel");
						that.getView().getModel("taskMgmtModel").refresh();
						that.busyDialog.close();
					 } else {
						 taskMgmtModel.setData();
							that.getView().setModel(taskMgmtModel,"taskMgmtModel");
							that.getView().getModel("taskMgmtModel").refresh();
							sap.ui.commons.MessageBox.show("No data was fetched",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
					 }
				} else {
					taskMgmtModel.setData();
					that.getView().setModel(taskMgmtModel,"taskMgmtModel");
					that.getView().getModel("taskMgmtModel").refresh();
					sap.ui.commons.MessageBox.show("Invalid RFS number or no open task found with respect to RFS number",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				}
			} else {
				taskMgmtModel.setData();
				that.getView().setModel(taskMgmtModel,"taskMgmtModel");
				that.getView().getModel("taskMgmtModel").refresh();
				sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		},
		error : function(data) {
			}
		});
		that.busyDialog.close();
			/*var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			var taskPayload={"bpmProcessDto" : {"requestId" : "1001600822"}};
			var url="/utilweb/rest/bpm/getAllOpenTasks";
			taskMgmtModel.loadData("/utilweb/rest/bpm/getAllOpenTasks",JSON.stringify(taskPayload),false,"POST",false,false,oHeader);
			if((taskMgmtModel.getData()!=undefined) && (taskMgmtModel.getData().bpmTaskDtoList))
			{
				if((taskMgmtModel.getData().bpmTaskDtoList)&&!(taskMgmtModel.getData().bpmTaskDtoList instanceof Array))
				{
					taskMgmtModel.getData().bpmTaskDtoList=[taskMgmtModel.getData().bpmTaskDtoList];
				}
			}
			else
			{
				taskMgmtModel.setData();
			}
			that.getView().setModel(taskMgmtModel,"taskMgmtModel");
			that.getView().getModel("taskMgmtModel").refresh();
			that.busyDialog.close();*/
		}else{
			taskMgmtModel.setData();
			that.getView().setModel(taskMgmtModel,"taskMgmtModel");
			that.getView().getModel("taskMgmtModel").refresh();
			sap.ui.commons.MessageBox.show("Please enter RFS number",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	handleSuggest : function(oEvent){
		var that= this;
		var autoUser = oEvent.getParameter("suggestValue");
		var oSearchUserModel = new sap.ui.model.json.JSONModel();

		if (autoUser.length > 3) {
			var searchPayload ={"userNm" : autoUser};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),false,"POST",false,false,oHeader);
			if(!(oSearchUserModel.getData().userDtos instanceof Array)){
				oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];
			}
		that.getView().setModel(oSearchUserModel,"userSearchModel");
		}else{
			if(that.getView().getModel("userSearchModel")!=undefined){
				that.getView().getModel("userSearchModel").setData();
				that.getView().getModel("userSearchModel").refresh();
			}	
		}	
	},
		
	itemSelected : function(oEvt){
		var that=this;
		that.userId=oEvt.getParameter("selectedItem").getAdditionalText();
	},
	
	clear:function(){
		var that=this;
		that.getView().byId("rfsno").setValue("");
		//clear the model
		/*var taskMgmtModel=that.getView().getModel("taskMgmtModel");
		taskMgmtModel.setData();
		taskMgmtModel.refresh();*/
	},
	
	/*Btn_nominate:function(oEvent){
		var that=this;
		var userVal=oEvent.getSource().getParent().getParent().getContent()[2].getValue();
		var userId=that.userId;
		var selTaskUri=that.selTaskUri;
		if((userId==undefined)||(userId=="")||(userVal=="")){
			sap.ui.commons.MessageBox.show("Plese select an user to nominate",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			oEvent.getSource().getParent().getParent().getContent()[2].setValue("");
			var nominateModel = new sap.ui.model.json.JSONModel();
			var nominatePayload ={
					   "nominatedUserId": userId,
					   "taskInstanceURI" : "true",
					   "taskInstanceId": selTaskUri
					};
			var nominatePayload = {"bNominationReqt":{
					  "nominatedUserId": userId,
					  "taskInstanceURI" : "true",
					  "taskInstanceId": selTaskUri
					}};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			nominateModel.loadData("/utilweb/rest/bpm/nominateTask",JSON.stringify(nominatePayload),false,"POST",false,false,oHeader);
			if(nominateModel.getData()){
				sap.ui.commons.MessageBox.show(nominateModel.getData().message,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
					that.Btn_cancel();
				});
			}
		}else{
			if(that.busyDialog){
				that.busyDialog.open();
			}
			var nominateModel = new sap.ui.model.json.JSONModel();
			var nominatePayload ={
					   "nominatedUserId": userId,
					   "taskInstanceURI" : "true",
					   "taskInstanceId": selTaskUri
					};
			var nominatePayload = {"bNominationReqt":{
					  "nominatedUserId": userId,
					  "taskInstanceURI" : "true",
					  "taskInstanceId": selTaskUri
					}};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			nominateModel.loadData("/utilweb/rest/bpm/nominateTask",JSON.stringify(nominatePayload),false,"POST",false,false,oHeader);
			if(nominateModel.getData()){
				sap.ui.commons.MessageBox.show(nominateModel.getData().message,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
					that.Btn_cancel();
					that.searchTask();
					that.busyDialog.close();
				});
			}
		}
	},*/
	
	Btn_nominate:function(oEvent){
		var that=this;
		var userVal=oEvent.getSource().getParent().getParent().getContent()[2].getValue();
		var userId=that.userId;
		var selTaskUri=that.selTaskUri;
		if((userId==undefined)||(userId=="")||(userVal=="")){
			sap.ui.commons.MessageBox.show("Please select a user to nominate",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			oEvent.getSource().getParent().getParent().getContent()[2].setValue("");
		}else{
			if(that.busyDialog){
				that.busyDialog.open();
			}
		var soapMessage = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sch=\"http://www.badgerlms.com/webservices/resource/schemas\">"
			+ "<soapenv:Header/>"
			+ "<soapenv:Body>"
			+ "<yq1:nominateTask xmlns:yq1=\"http://kaust.com/service/bpm/\">"
		    + "<bpmTaskNominationReqt>"
		    + "<nominatedUserId>"
		    +userId
		    +"</nominatedUserId>"
		    
		    + "<nominatedUserUniqueId>"
		    +false
		    +"</nominatedUserUniqueId>"
		    
		    + "<taskInstanceId>"
		    +selTaskUri
		    +"</taskInstanceId>"
		    
		    + "<taskInstanceURI>"
		    +true
		    +"</taskInstanceURI>"
		    
		    +"</bpmTaskNominationReqt>"
		    +"</yq1:nominateTask>"
			+ "</soapenv:Body>" + "</soapenv:Envelope>";

		$.ajax( {
			url :  "/UtilBpmServiceWsdlService/UtilBpmServiceWsdl?wsdl",            //"https://kaust1.badgerlms.com:8443/WebServices/Resource?wsdl",
			type : "POST",
			async : false,
			data : soapMessage,
			dataType : "xml",
			contentType : "text/xml; charset=\"utf-8\"",
			success : function(data, textStatus, jqXHR) {
			xmldoc = jqXHR.responseXML;
			
			if(xmldoc.getElementsByTagName('success').length!=0 && xmldoc.getElementsByTagName('success')[0].childNodes[0].length!=0){
				if(xmldoc.getElementsByTagName('success')[0].childNodes[0].nodeValue=="true"){
					sap.ui.commons.MessageBox.show("Task nominated successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
						that.Btn_cancel();
						//that.searchTask(that.rfsno);
						var taskMgmtModel=new sap.ui.model.json.JSONModel();
						var soapMessage = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:sch=\"http://www.badgerlms.com/webservices/resource/schemas\">"
							+ "<soapenv:Header/>"
							+ "<soapenv:Body>"
							+ "<yq1:getAllOpenTasks xmlns:yq1=\"http://kaust.com/service/bpm/\">"
						    + "<bpmProcessDto>"
						    + "<requestId>"
						    +that.rfsno
						    +"</requestId>"
						    +"<loggedInUserId>"+loggedinUserModel.getData().userId+"</loggedInUserId>"
						    + "<processNm>RFS</processNm>"
						    +"</bpmProcessDto>"
						    +"</yq1:getAllOpenTasks>"
							+ "</soapenv:Body>" + "</soapenv:Envelope>";

					$.ajax( {
						url :  "/UtilBpmServiceWsdlService/UtilBpmServiceWsdl?wsdl",            //"https://kaust1.badgerlms.com:8443/WebServices/Resource?wsdl",
						type : "POST",
						async : false,
						data : soapMessage,
						dataType : "xml",
						contentType : "text/xml; charset=\"utf-8\"",
						success : function(data, textStatus, jqXHR) {
						xmldoc = jqXHR.responseXML;

						var bpmTaskDtoList = [];
						
						if(xmldoc.getElementsByTagName('success').length!=0 && xmldoc.getElementsByTagName('success')[0].childNodes[0].length!=0){
							if(xmldoc.getElementsByTagName('success')[0].childNodes[0].nodeValue=="true"){
								if(xmldoc.getElementsByTagName('bpmTaskDtoList').length!=0 && xmldoc.getElementsByTagName('bpmTaskDtoList')[0].childNodes[0].length!=0){
									for( var int = 0; int < xmldoc.getElementsByTagName("bpmTaskDtoList").length; int++) {
										var bpmTaskDto = {
												taskFullName : "",
												taskOwnerNames : "",
												taskStatus : "",
												taskUri:""
										};
										if (xmldoc.getElementsByTagName("taskFullName")[int] && xmldoc.getElementsByTagName("taskFullName")[int].childNodes[0]) {
											bpmTaskDto.taskFullName = xmldoc.getElementsByTagName("taskFullName")[int].childNodes[0].nodeValue;
										}
										if (xmldoc.getElementsByTagName("taskOwnerNames")[int] && xmldoc.getElementsByTagName("taskOwnerNames")[int].childNodes[0]) {
											bpmTaskDto.taskOwnerNames = xmldoc.getElementsByTagName("taskOwnerNames")[int].childNodes[0].nodeValue;
										}
										if (xmldoc.getElementsByTagName("taskStatus")[int] && xmldoc.getElementsByTagName("taskStatus")[int].childNodes[0]) {
											bpmTaskDto.taskStatus = xmldoc.getElementsByTagName("taskStatus")[int].childNodes[0].nodeValue;
										}
										if (xmldoc.getElementsByTagName("taskUri")[int] && xmldoc.getElementsByTagName("taskUri")[int].childNodes[0]) {
											bpmTaskDto.taskUri = xmldoc.getElementsByTagName("taskUri")[int].childNodes[0].nodeValue;
										}
									    bpmTaskDtoList.push(bpmTaskDto);
									}
									taskMgmtModel.setData({bpmTaskDtoList:bpmTaskDtoList});
									that.getView().setModel(taskMgmtModel,"taskMgmtModel");
									that.getView().getModel("taskMgmtModel").refresh();
									that.busyDialog.close();
								 } else {
									 taskMgmtModel.setData();
										that.getView().setModel(taskMgmtModel,"taskMgmtModel");
										that.getView().getModel("taskMgmtModel").refresh();
										sap.ui.commons.MessageBox.show("No data was fetched",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
								 }
							} else {
								taskMgmtModel.setData();
								that.getView().setModel(taskMgmtModel,"taskMgmtModel");
								that.getView().getModel("taskMgmtModel").refresh();
								sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
							}
						} else {
							taskMgmtModel.setData();
							that.getView().setModel(taskMgmtModel,"taskMgmtModel");
							that.getView().getModel("taskMgmtModel").refresh();
							sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
						}
					},
					error : function(data) {
						}
					});
						that.busyDialog.close();
					});
				}else{
					sap.ui.commons.MessageBox.show("Incorrect status",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
					that.loginDialog.close();
				}
			}
		},
		error : function(data) {
			}
		});
		that.busyDialog.close();
		}
	},
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.TaskManagement
*/
//	onBeforeRendering: function() {
//		alert("before");
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.TaskManagement
*/
//	onAfterRendering: function() {
//		alert("after");
//	},

	nominate: function(oEvent){
		var that=this;
		that.loginDialog = sap.ui.xmlfragment("corelabs.fragments.nominate", that);
		that.getView().addDependent(that.loginDialog);
		that.loginDialog.addStyleClass("sapUiSizeCompact");
		//sap.ui.getCore().byId('userList').setValue("");
		//sap.ui.getCore().byId('userList').setPlaceholder("Enter atleast 4 characters");
		that.selTaskUri=oEvent.getSource().getBindingContext("taskMgmtModel").getObject().taskUri;
		that.loginDialog.open();
	},

	Btn_cancel: function(){
		this.loginDialog.close();
	}
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.TaskManagement
*/
//	onExit: function() {
//
//	}

});