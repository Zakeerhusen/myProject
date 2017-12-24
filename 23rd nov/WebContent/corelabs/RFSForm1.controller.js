sap.ui.controller("corelabs.RFSForm1", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf corelabs.RFSForm
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	taskId=this.getTask();
	this.claim(taskId);
	},
	//save/submit/approve
	//1. field validations
	//2. db data save 
	//2.1 'rfs no' is retuned in NEW RFS view
	//3.1 check if taskId is there===> if taskId then its a task hence 'complete task' else 'start bpm'
	//3.2 if task and clicked 'save', nothing to be done in BPM but to be saved in DB.
	//3.3 if task and not 'save' then complete BPM task
	//4. start BPM, save button than uiaction is -1, submit than 1
	//5. task buttons - save -- (-1); submit/approve ---1; reject ---2
	
	
	//read
	//task click
	//claim
	//read task data
	//taskdata===> rfsNo
	//rfsNo used to read from DB
	//populate data on UI
	
	//0.1
	//NEW RFS Link - 'save', uiActionNo= -1 then
	// 'DRAFT RFS Task' for Requester with taskNo = 1;
	
	//0.2
	//NEW RFS Link - 'submit', uiActionNo= 1 then
	// If (External user(usertype==3) and Is New Requester = true) then 'RFS Review Task' for Lab Team Lead with taskNo = 4;
	// ELSE 'Acc Verify task' for Master Admin with taskNo = 2;
	
	//1.1
	//'DRAFT RFS Task'(taskNo = 1) - 'save', uiActionNo= -1 then
	// No new task only DB save
	
	//1.2
	//'DRAFT RFS Task'(taskNo = 1) - 'submit', uiActionNo= 1 then
	// If (External user(usertype==3) and Is New Requester = true) then 'RFS Review Task' for Lab Team Lead with taskNo = 4;
	// ELSE 'Acc Verify task' for Master Admin with taskNo = 2;
	
	//2.1
	//'Acc Verify task'(taskNo = 2) - 'Document Required', uiActionNo= 3 then
	//'Doc Upload Confirm Task' for Requester with taskNo = 3;
	
	//2.2
	//'Acc Verify task'(taskNo = 2) - 'Verified', uiActionNo= 1 then
	// 'RFS Review Task' for Lab Team Lead with taskNo = 4;
	
	//3.1
	//'Doc Upload Confirm Task'(taskNo = 3) - 'Submit', uiActionNo= 1 then
	//'Acc Verify task' for Master Admin with taskNo = 2;
	
	//4.1
	//'RFS Review Task'(taskNo = 4) - 'Pending Sample/Design'{depending upon lan this button and its text will change}, uiActionNo= 3 then
	//'Sample/Design Upload Confirm Task' for Requester with taskNo = 5;
	
	//4.2
	//'RFS Review Task'(taskNo = 4) - 'Reject', uiActionNo= 2 then
	// BPM flow will end.
	
	//4.3
	//'RFS Review Task'(taskNo = 4) - 'Approve', uiActionNo= 1 then
	// db save but no bpm task completion
	/////In case, user close the window and open again, you have to open the SSC view, it will be done based taskNo and status 
	// "SSC" form will appear with 'Submit' button
	//////on submit click, 'Director Review Task' for Lab Director with taskNo = 6;
	
	//5.1
	//'Sample/Design Upload Confirm Task'(taskNo = 5) - 'Submit', uiActionNo= 1 then
	//'RFS Review Task' for Lab Team Lead with taskNo = 4;
	
	//6.1
	//'Director Review Task'(taskNo = 6) - 'Reject', uiActionNo= 2 then
	//'SSC Re-Review Task' for Lab Team Lead with taskNo = 7;
	
	//6.2
	//'Director Review Task'(taskNo = 6) - 'Approve', uiActionNo= 1 then
	//'SSC Acceptance Task' for Requester with taskNo = 8;
	
	//7.1
	//'SSC Re-Review Task'(taskNo = 7) - 'Submit', uiActionNo= 1 then
	//'Director Review Task' for Lab Director with taskNo = 6;
	
	//8.1
	//'SSC Acceptance Task'(taskNo = 8) - 'Reject', uiActionNo= 2 then
	//'SSC Reject Task' for Lab Team Lead with taskNo = 9;
	
	//8.2
	//'SSC Acceptance Task'(taskNo = 8) - 'Request Change', uiActionNo= 3 then
	//'SSC Re-Review Task' for Lab Team Lead with taskNo = 7;
	
	//8.3
	//'SSC Acceptance Task'(taskNo = 8) - 'Approve', uiActionNo= 1 then
	//if(isPIAuthorized person required?){ 'PI authorised Person Task' for PI/Authorised Per with taskNo =10 }
	//else{'Lab Member selection Task' for Lab Team Lead with taskNo =11}
	
	//9.1
	//'SSC Rejection Task'(taskNo = 9) -[in UI, Lab Memeber need to be selected--scientiset ] 'Submit', uiActionNo= 1 then
	//'RFS closure Task' for Lab Member with taskNo = "17";
	
	//10.1
	//'PI authorised Person Task'(taskNo = 10) - 'Reject', uiActionNo= 2 then
	//'SSC Reject Task' for Lab Team Lead with taskNo = 9;
	
	//10.2
	//'PI authorised Person Task'(taskNo = 10) - 'Request Change', uiActionNo= 3 then
	//'SSC Re-Review Task' for Lab Team Lead with taskNo = 7;
	
	//10.3
	//'PI authorised Person Task'(taskNo = 10) - 'Approve', uiActionNo= 1 then
	//'Lab Member selection Task' for Lab Team Lead with taskNo =11
	
	//11.1
	//'Lab Member selection Task'(taskNo = 11) -[in UI, Lab Memeber need to be selected--scientiset ] 'Submit', uiActionNo= 1 then
	//if(is SLA Verify required?){ 'SLA/paymnet verify Task' for master admin with taskNo =12 }
	//else{'fullfill rFs task' for Lab Member with taskNo =14}
	
	//12.1
	//'SLA/paymnet verify Task'(taskNo = 12) - 'Verify', uiActionNo= 1 then
	//'fullfill rFs task' for Lab Member with taskNo =14
	
	//12.2
	//'PI authorised Person Task'(taskNo = 12) - 'SLA Verification Rqrd', uiActionNo= 3 then
	//'Payment doc upload confirm Task' for Lab Team Lead with taskNo = 13;

	//13.1
	//'Payment doc upload confirm Task'(taskNo = 13) - 'Submit', uiActionNo= 1 then
	//'SLA/paymnet verify Task' for master admin with taskNo =12 
	
	//14.1
	//'fullfill rFs task'(taskNo = 14) - 'Reqd Sample/Design', uiActionNo= 3 then
	//'Design/Sample Resubmission Confirm task' for Requester with taskNo =15
	
	//14.2
	//'fullfill rFs task'(taskNo = 14) - 'Work in Progress', uiActionNo= 1 then
	// Ui changes to Report - button 'Submit'
	// on click of submit 'Report Acceptance' for Requester with taskNo =16
	
	//15.1
	//'Design/Sample Resubmission Confirm task'(taskNo = 15) - 'Submit', uiActionNo= 1 then
	//'fullfill rFs task' for Lab Member with taskNo =14
	
	//16.1
	//'Report Acceptance'(taskNo = 16) - 'Reject', uiActionNo= 2 then
	//'fullfill rFs task' for Lab Member with taskNo =14
	
	//16.2
	//'fullfill rFs task'(taskNo = 16) - 'Accept', uiActionNo= 1 then
	// Ui changes to feedback - button 'Submit'
	// on click on submit 'RFS closure Task' for Lab member taskNo =17
	
	//17.1
	//'RFS closure Task'(taskNo = 17) - 'Sample Reqd to be returned', uiActionNo= 3 then
	//'Sample Return task' for Lab Member with taskNo =18
	
	//17.2
	//'RFS closure Task'(taskNo = 17) - 'RFS Fulfilled'(submit), uiActionNo= 1 then
	//'Invoicing Task' for CLC  taskNo =19
	
	//18.1
	//'Sample Return task'(taskNo = 18) - 'Submit', uiActionNo= 1 then
	//'RFS closure Task' for Lab member taskNo =17
	
	//19.1
	//'Invoicing Task'(taskNo = 19) - '(submit), uiActionNo= 1 then
	//Process ends :-)
	
	save : function(){
		var that =this;
		var uiAction = -1;
		var data = that.getData(uiAction);
			//Save data in  DB 
	},
	
	submit : function(){
		var that =this;
		var uiAction = 1;
		var data = that.getData(uiAction);
		//save in db
		data = that.getView().getModel("taskJsonModel").getData();
		that.completeTask(data);
	},
	
	getData: function(uiAction){
		var loggedInUser = loggedinUserModel.getData();
		var data1={
		rfsNo : "test1",
		requesterUid : loggedInUser.userUniqueId,
		requesterNm : loggedInUser.displayNm,
		uiActionNo :uiAction,                           // 1 for submit/approve    2 for reject  -1 for save 3 - exta action (like pending sample)
		userTypeNo: 1,                     // 1 - internal 2- rpt   3-external
		isNewRequester:true,               // service from bhaskar 
		isAccountVerificationReqd:true,    // tbd
		isSlaVerificationReqd:true,       	//tbd
		isPiAuthPerReqd:true };				// from userData for ext by checkbox, internal if PI and user are same its false
		return data1;
	},
	
	getTask : function(){
		var that= this;
		var taskId = getValFromQueryString('taskId');
		alert(taskId);
		return taskId;
	},
	
	claim : function(taskId){
		var that=this;
		 var taskSvcURL = "/bpmodata/tasks.svc";  
			var taskODataModel = new sap.ui.model.odata.ODataModel(taskSvcURL);
			 taskODataModel.create("/Claim?InstanceID='"+taskId+"'", null, null,
			            function(oData,oResponse) {  
				 alert('claim success');
				 that.readorUpdateTaskData(taskId);
			        },  
			        function(oError) {
			       	 alert('claim failed');
			        });   
	},
	
	readorUpdateTaskData : function(taskId){
		var that =this;
		 var taskJsonModel= new sap.ui.model.json.JSONModel();
		 var oReadTaskModel = new sap.ui.model.json.JSONModel();
		 var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
		  taskDataODataModel.read("/InputData('"+taskId+"')/DO_RFS",null, null,false,
		  		function(oData,oRes){
			  taskJsonModel.setData(oData);
			  var taskData =  taskJsonModel.getData();              //that.getView().getModel("taskJsonModel").getData();   
				
			  if(taskData.taskNo==2){
				  that.getView().byId('masterAdmBtn').setVisible(true);
					that.getView().byId('labTeamBtn').setVisible(false);
					that.getView().byId('requsterBtn').setVisible(false);
				}
			  else if(taskData.taskNo==4){
					that.getView().byId('labTeamBtn').setVisible(true);
					that.getView().byId('requsterBtn').setVisible(false);
					that.getView().byId('masterAdmBtn').setVisible(false);
				}
				else{
					that.getView().byId('labTeamBtn').setVisible(false);
					that.getView().byId('requsterBtn').setVisible(true);
					that.getView().byId('masterAdmBtn').setVisible(false);
				}
			  that.getView().setModel(taskJsonModel,"taskJsonModel");
				        alert('data read successfully');
				       // that.getPktId(oReadTaskModel.getData().piApprovalDtos.piId);
				        },function(oError){
		  			alert("error");
				        });	
	},
	
	completeTask : function(taskData){
		var that=this;
		 var outputData={};
		  outputData.DO_RFS=taskData;
		  var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true);
				  taskDataODataModel.create("/OutputData",outputData,null,
						  function(oData){
					alert("RFS Task is complted");
					/*---- oData----
					 DO_RFS:Object
					EDM_Key:"51a9ce554fdc11e6c25c00000354068e_O_1"
					__metadata:Object
					isAccountVerificationReqd:true
					isNewRequester:	true
					isPiAuthPerReqd	:true
					isSlaVerificationReqd:true
					processId:	"518296784fdc11e6ba1c00000354068e"
					requesterNm	:"Rahul Billorey"
					requesterUid:"USER.CORP_LDAP.billorr"
					rfsNo:"test1"
					taskNo	:2
					uiActionNo:-1
					userTypeNo:	0   */
					
				  },function(oError){
					  //alert("Not completed "+oError);
					alert("Error in Completing RFS Task");
				  });
	},
	
	toSAS : function() {
		var oControl = this.getView().byId("idIcon");
		oControl.setSelectedKey("Tab2");
	},
	toRIS : function() {
		var oControl = this.getView().byId("idIcon");
		oControl.setSelectedKey("Tab1");
	},
	
	sasUPloadEvt : function(){
		var that= this;
		that.getView().byId('sasAttach').setVisible(false);
		that.getView().byId('sasUpload').setVisible(true);
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf corelabs.RFSForm
*/
//	onBeforeRendering: function() {
//		alert("before");
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf corelabs.RFSForm
*/
//	onAfterRendering: function() {
//		alert("after");
//	},
	
//	onBeforeShow: function(){
//		alert("show");
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf corelabs.RFSForm
*/
//	onExit: function() {
//
//	}

});