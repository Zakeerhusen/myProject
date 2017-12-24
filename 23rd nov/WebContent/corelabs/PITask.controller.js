jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.PITask", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust_corelabs.PITask
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	this.getTask();
	this.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.rejectTaskComm", this);
    this.getView().addDependent(this.rejectDialog);
    this.rejectDialog.addStyleClass("sapUiSizeCompact");
	},

	getTask : function(){
		var that= this;
		that.taskId = getValFromQueryString('taskId');
		//alert(taskId);
		that.claim(that.taskId);
		
	},
	
	claim : function(taskId){
		var that=this;
		 var taskSvcURL = "/bpmodata/tasks.svc";  
			var taskODataModel = new sap.ui.model.odata.ODataModel(taskSvcURL);
			 taskODataModel.create("/Claim?InstanceID='"+taskId+"'", null, null,
			            function(oData,oResponse) {  
				// alert('claim success');
				 that.readTaskData(taskId);
			        },  
			        function(oError) {
			     //   	 alert('claim failed');
			        });   
	},
	
	readTaskData : function(taskId){
		var that =this;
		 var taskJsonModel= new sap.ui.model.json.JSONModel();
		 var oReadTaskModel = new sap.ui.model.json.JSONModel();
		 var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
		  taskDataODataModel.read("/InputData('"+taskId+"')/DO_PI_Approval",null, null,false,
		  		function(oData,oRes){
			  taskJsonModel.setData(oData);
			  that.getView().setModel(taskJsonModel,"taskJsonModel");
				        oReadTaskModel.loadData("/utilweb/rest/piapprovalreq/readPI/"+oData.requestId,null,false);
				        that.getView().setModel(oReadTaskModel,"oReadTaskModel");
				        //alert(taskJsonModel.getData().requesterNm );
				        that.getPktId(oReadTaskModel.getData().piApprovalDtos.piId);
				        },function(oError){
		  			//alert("error");
				        });	
	},
	
//	var loginPayload ={
//			   "loggedInUser" : "false",
//			   "uniqueId" : "false",
//			   "userId" : userId,
//			   "assignedRolesReqd":"false",
//			   "assignedGroupsReqd":"false"
//			};
//	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
//	loggedinUserModel.loadData("/utilweb/rest/ume/auth/userdetail"
	
	getPktId: function(userId){
		//userId="IBJEES";
		var that =this;
		var userIdCaps =userId.toUpperCase();
		//that.getView().byId('pktId').setValue("");
		var oPktIdJsonModel = new sap.ui.model.json.JSONModel();
		oPktIdJsonModel.loadData(urlInc+"PocketIds?$filter=(UserId eq '"+userIdCaps+"')&$select=UserId,PocketIdNo&$format=json",null,false);
		that.getView().byId('pktId').setModel(oPktIdJsonModel,"oPktIdJsonModel");
		//check instance as of pi reg
	
	},
	
	submitTask : function(evt){
		var that =this;
		var comments="";
		var uiAction= evt.getSource().getText().toUpperCase();
		if(uiAction=="APPROVE"){
			var status ="APPROVED";
			that.getView().getModel("taskJsonModel").getData().isApproved=true;
			that.completeTask(status,comments,uiAction);
		}else{
			that.rejectDialog.open();
		}
	},
	
	toReject : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('taskRejectionComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter Comments");
		}else{
		var uiAction= "REJECT";
		var status = "REJECTED";
		that.getView().getModel("taskJsonModel").getData().isApproved=false;
		that.completeTask(status,comments,uiAction);
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.close();}
	},
	
	close: function(oEvent){
		var that= this;
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.rejectDialog.close();
		},
		
	completeTask : function(status,comments,uiAction){
		var that=this;
		//sap.ui.controller("corelabs.PIApprovalRequest").getCurrentUser();
		//var userModel=sap.ui.controller("corelabs.PIApprovalRequest").getView().getModel("loggedinUserModel");
		var taskUserData=that.getView().getModel("oReadTaskModel").getData();
		var taskData = that.getView().getModel("taskJsonModel").getData();
		a=taskData.piNm.split(' ');
		var pktId = that.getView().byId('pktId').getValue();
		
		
		 
		var dbOutputData={
			"userDtos":[{
			"userId":taskUserData.userDtos.userId,
			"firstNm":taskUserData.userDtos.firstNm,
			"lastNm":taskUserData.userDtos.lastNm,
			"status":"ACTIVE",
			"userType":"INTERNAL"
			},
			{
			"userId":taskUserData.piApprovalDtos.piId,
			"firstNm":a[0],
			"lastNm":a[1],
			"status":"ACTIVE",
			"userType":"INTERNAL"
			}],
			"piApprovalDtos":[{
			   "requestId": taskData.requestId,
			   "userId":taskUserData.userDtos.userId,
			   "piId":taskUserData.piApprovalDtos.piId,
			   "pocketId":pktId,
			   "piComments":comments,
			   "status":status
			}],
			"uiAction":uiAction
			};
		
		var taskJsonLocalModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		
		if((pktId!="")||status== "REJECTED"){
		taskJsonLocalModel.loadData("/utilweb/rest/piapprovalreq/userpiapproval",JSON.stringify(dbOutputData),false,"POST",false,false,oHeader);
		var taskDataSvcURL = "/bpmodata/taskdata.svc/"+that.taskId;  
		/*var myHeaders = {
		"X-Requested-With" : "XMLHttpRequest",
		"Content-Type" : "application/json",
		"DataServiceVersion" : "2.0",
		"Accept" : "application/atom+xml,application/xml,application/atomsvc+xml"
		};*/
		  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true);
		 
		/*
		  taskDataODataModel.read("/InputData('"+taskId+"')/DO_PI_Approval",null, null,false,
			  		function(oData,oRes){
				  taskJsonModel.setData(oData);*/
		  var outputData={};
		  outputData.DO_PI_Approval=taskData;
				  taskDataODataModel.create("/OutputData",outputData,null,
						  function(oData){
					 // alert("Task is completed");
					  if(status =="APPROVED"){
						  //sap.m.MessageBox.alert("Approved Successfully");
						  //alert("Approved Successfully");
						  sap.ui.commons.MessageBox.show("Approved Successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
							  callCloseDialog();
						  });
					  }else{
						  //alert("Rejected Successful");
						  sap.ui.commons.MessageBox.show("Rejected",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information","OK",function(){
							  callCloseDialog();
						  });
					  }
					  
					
				  },function(oError){
					  //alert("Not completed "+oError);
					  sap.ui.commons.MessageBox.show("Error in Completing Task",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					  //sap.m.MessageBox.alert("Error in Completing Task");
				  });
				  
				//  window.location.href="/dashboard/index.html#bpminbox";
				//	 location.reload(true);
		}else{
			//alert("Please Select Assigned Pocket ID");
			sap.ui.commons.MessageBox.show("Please Select Assigned Pocket ID",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//sap.m.MessageBox.alert("Please Select Assigned Pocket ID");
		}
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust_corelabs.PITask
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust_corelabs.PITask
*/
	onAfterRendering: function() {
		var that = this;
		that.getView().byId("pktId").$().find("input").attr("readonly", true);
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust_corelabs.PITask
*/
//	onExit: function() {
//
//	}

});