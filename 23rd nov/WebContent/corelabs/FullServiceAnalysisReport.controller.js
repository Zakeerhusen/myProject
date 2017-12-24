jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.FullServiceAnalysisReport", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust_corelabs.FullServiceAnalysisReport
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		
		if(!this.busyDialog){
		    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
		    this.getView().addDependent(this.busyDialog);
		    this.busyDialog.addStyleClass("sapUiSizeCompact");
	    }
		
		var that =this;
		that.disableAllBtns();
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			dateValue: new Date()
		});
		that.getView().setModel(oModel,"dateModel");
		
		taskId=that.getTask();
		if(taskId!=""){
			this.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.repRejtask", this);
		    this.getView().addDependent(this.rejectDialog);
		    this.rejectDialog.addStyleClass("sapUiSizeCompact");
		    
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var taskJsonModel= new sap.ui.model.json.JSONModel();
		var oDBModel = new sap.ui.model.json.JSONModel();
		var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
		taskDataODataModel.read("/InputData('"+taskId+"')/DO_RFS",null, null,false,
	  		function(oData,oRes){
				  taskJsonModel.setData(oData);
				  that.getView().setModel(taskJsonModel,"taskJsonModel");
				  var taskData =  taskJsonModel.getData(); 
				  that.getView().byId('repRfsNo').setValue(taskData.rfsNo);
				  
				  var reportNo =taskData.rfsNo.replace(taskData.rfsNo.charAt(0),"2");
				  that.getView().byId('repNo').setValue(reportNo);
				  
				  oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+taskData.rfsNo,null,false);
				  that.getView().setModel(oDBModel,"oDBModel");
				  
				  if(taskData.userTypeNo==1){
					  that.getView().byId('nonInternal').setVisible(false);  
				  }else{
					  that.getView().byId('nonInternal').setVisible(true);
				  }
				  
				  if(oDBModel.getData().sampleDto){
					  that.getView().byId('repNoOfSam').setValue(oDBModel.getData().sampleDto.numberOfSamples);
				  }
				  
				 /* if (oData.taskNo === 14) {
						//Deepak Changes
							
							
					}
				  */
				  if(oDBModel.getData().reportDto){
					 // "createdDate":that.getEstComplDate(that.getView().byId('repDp').getValue()),
					 // 	var creatdDate = new Date(oDBModel.getData().reportDto.createdDate); 
					 // 	that.getView().byId('repDp').setDateValue(creatdDate);
						that.getView().byId('repRfsNo').setValue(oDBModel.getData().reportDto.reportReqNo);
						that.getView().byId('repSamDataSpec').setValue(oDBModel.getData().reportDto.samplesDataSpec);
						that.getView().byId('repSerScope').setValue(oDBModel.getData().reportDto.serviceScope);
						that.getView().byId('repSam').setValue(oDBModel.getData().reportDto.samples);
						that.getView().byId('repSummOfAnalMthd').setValue(oDBModel.getData().reportDto.summaryOfAnalyticalMethods);
						that.getView().byId('repResults').setValue(oDBModel.getData().reportDto.results);
						that.getView().byId('repInstMthdAppld').setValue(oDBModel.getData().reportDto.methodAppliedDescription);
						that.getView().byId('repPreparedBy').setValue(oDBModel.getData().reportDto.preparedBy);
						if(oDBModel.getData().reportDto.requesterComment!=undefined){
							that.getView().byId('reqRepComments').setValue(oDBModel.getData().reportDto.requesterComment);
						}
						if(oDBModel.getData().reportDto.feedBackRating!=undefined){
						that.getView().byId('feedComm').setValue(oDBModel.getData().reportDto.feedbackComment);
						var ratingIndex;
						if(oDBModel.getData().reportDto.feedBackRating=="Excellent"){
							ratingIndex=0;
						}else if(oDBModel.getData().reportDto.feedBackRating=="Good"){
							ratingIndex=1;
						}else if(oDBModel.getData().reportDto.feedBackRating=="Average"){
							ratingIndex=2;
						}else if(oDBModel.getData().reportDto.feedBackRating=="Poor"){
							ratingIndex=3;
						}
						that.getView().byId('feedRadioBtn').setSelectedIndex(ratingIndex);
						}
				  }
				  
				  var requesterModel =new sap.ui.model.json.JSONModel();
				  requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
				  that.getView().setModel(requesterModel,"reportRequesterModel");
				  
				  if(!(oDBModel.getData().requestHeaderDto.labDirectorId.indexOf("_")>-1)){
					  var dirNameModel =new sap.ui.model.json.JSONModel();
					  dirNameModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.labDirectorId,null,false);
					  that.getView().byId("repApprByDir").setValue(dirNameModel.getData().firstNm+" "+dirNameModel.getData().lastNm); 
				  }
				  
				  if(taskData.taskNo==14){
						that.getView().byId('lmFrfs').setVisible(true);
						var modelData = oDBModel.getData();
						var serviceScopeSolData =  "";
						if (modelData.serviceAreaDto.aimOfStudy) {
							serviceScopeSolData += modelData.serviceAreaDto.aimOfStudy + ", " ;
						}if (modelData.serviceAreaDto.expectedData) {
							serviceScopeSolData += modelData.serviceAreaDto.expectedData + ", ";
						}if (modelData.serviceAreaDto.method) {
							serviceScopeSolData += modelData.serviceAreaDto.method + ", ";
						}if (serviceScopeSolData) {
							serviceScopeSolData = serviceScopeSolData.substring(0, serviceScopeSolData.length-2);
						}
						
						var samplesDataSpec =  "";
							if (modelData.sampleDto.sampleDataSpecifications) {
								samplesDataSpec += modelData.sampleDto.sampleDataSpecifications + ", " ;
							}if (modelData.sampleDto.specificInstruction) {
								samplesDataSpec += modelData.sampleDto.specificInstruction + ", " ;
							}if (samplesDataSpec) {
								samplesDataSpec = samplesDataSpec.substring(0, samplesDataSpec.length-2);
							}
							
						/*var sampleData = "";
						if (modelData.serviceScopeDto.sampleClarification) {
							sampleData += modelData.serviceScopeDto.sampleClarification + ", " ;
						}
						if (modelData.serviceScopeDto.sampleClarification) {
							sampleData += modelData.serviceScopeDto.deliverable + ", "  ;
						}
						if (modelData.serviceScopeDto.sampleClarification) {
							sampleData += modelData.serviceScopeDto.methodApplied + ", " ;
						}if (sampleData) {
							sampleData = sampleData.substring(0, sampleData.length-2);
						}*/
					//	modelData.reportDto.samplesDataSpec = samplesDataSpec;
					//	modelData.reportDto.samples = sampleData;
					//	modelData.reportDto.serviceScope = serviceScopeSolData;
						that.getView().byId('repSamDataSpec').setValue(samplesDataSpec);
						that.getView().byId('repSerScope').setValue(serviceScopeSolData);
					//	that.getView().byId('repSam').setValue(sampleData);
						
						that.getView().byId('fileUploader').setEnabled(true);
						that.getView().byId('repFileUpBtn').setEnabled(true);
						//that.disableAllSscFields();
						var teamMemModel = new sap.ui.model.json.JSONModel();
						var loginPayload ={
								   "loggedInUser" : "true"
								};
						var oHeader= {"Content-Type":"application/json;charset=utf-8"};
						teamMemModel.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
						that.getView().byId('repPreparedBy').setValue(teamMemModel.getData().displayNm);
					}
				  else if(taskData.taskNo==16){
					  if(oDBModel.getData().requestHeaderDto.statusDesc=="Service accepted and pending Feedback"){
						  that.getView().byId('rtRepAcceptance').setVisible(false);
						  that.getView().byId('reqAcceptanceSec').setVisible(true); 
							that.getView().byId('reqFeedSec').setVisible(true);
							that.getView().byId('feedRadioBtn').setEnabled(true);
							that.getView().byId('feedComm').setEnabled(true);
							that.getView().byId('rqFeedsubmit').setVisible(true); 
						}else{
							that.getView().byId('reqAcceptanceSec').setVisible(true); 
							that.getView().byId('reqRepComments').setEnabled(true);
							that.getView().byId('rtRepAcceptance').setVisible(true);
							}
					  that.disableAllFields();
				  }else if(taskData.taskNo==17){
					
					  that.getView().byId('lmRfsClosure').setVisible(true);
					  that.getView().byId('reqFeedSec').setVisible(true);
					  that.getView().byId('reqAcceptanceSec').setVisible(true); 
					  if((oDBModel.getData().sampleDto.isReturnSamples==true ||oDBModel.getData().sampleDto.isReturnSamples=="true")&&oDBModel.getData().requestHeaderDto.labId!="CWS"){
						  that.getView().byId('retSamBtn').setVisible(true); 
					  }
					  	that.disableAllFields();
					  }else if (taskData.taskNo==18){
						  that.getView().byId('lmSamReturn').setVisible(true);
						  that.getView().byId('reqFeedSec').setVisible(true);
						  that.getView().byId('reqAcceptanceSec').setVisible(true);
						  //Hide service summary when return sample
						  that.getView().byId('reportSec').setVisible(true);
						  that.disableAllFields();
					  }else if (taskData.taskNo==19){
						  that.getView().byId('clcInvoice').setVisible(true);
						  that.getView().byId('reqFeedSec').setVisible(true);
						  that.getView().byId('reqAcceptanceSec').setVisible(true); 
						  that.disableAllFields();
					  }
				  
				  var dbStatus= oDBModel.getData().requestHeaderDto.statusDesc;
				  if(dbStatus=="RFS Rejected"||dbStatus=="Scope and Charges Rejected" ||(oDBModel.getData().reportDto==undefined &&taskData.taskNo!=14)){
					  	that.getView().byId('reportSec').setVisible(false);
					  	that.getView().byId('reqAcceptanceSec').setVisible(false);
					  	that.getView().byId('reqFeedSec').setVisible(false);
				  }
				  
		 },function(oError){
	  			sap.ui.commons.MessageBox.show("Error while fetching Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			        });
		
		}else{
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("RFSFormTask").attachMatched(this._loadRFS, this);
		}
	//	that.readTableData();//commented as unable to fetch login id
},

_loadRFS : function(oEvt){
	var that = this;
	var rfsNo=oEvt.getParameter("arguments").id;
	
	
	var oDBModel = new sap.ui.model.json.JSONModel();
	oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+rfsNo,null,false);
	that.getView().setModel(oDBModel,"oDBModel");
	
	if(oDBModel.getData().reportDto){
			that.getView().byId('repRfsNo').setValue(oDBModel.getData().reportDto.reportReqNo);
			that.getView().byId('repSamDataSpec').setValue(oDBModel.getData().reportDto.samplesDataSpec);
			that.getView().byId('repSerScope').setValue(oDBModel.getData().reportDto.serviceScope);
			that.getView().byId('repSam').setValue(oDBModel.getData().reportDto.samples);
			that.getView().byId('repSummOfAnalMthd').setValue(oDBModel.getData().reportDto.summaryOfAnalyticalMethods);
			that.getView().byId('repResults').setValue(oDBModel.getData().reportDto.results);
			that.getView().byId('repInstMthdAppld').setValue(oDBModel.getData().reportDto.methodAppliedDescription);
	  }
	  
	  var requesterModel =new sap.ui.model.json.JSONModel();
	  requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
	  that.getView().setModel(requesterModel,"reportRequesterModel");
	  that.disableAllFields();
},

getTask : function(){
	var that= this;
	var tId = getValFromQueryString('taskId');
	return tId;
},

getUIData:function(){
	var that=this;
	//"repKaustAccNo","repPreparedBy","repSerSumm","repNoOfSam","","","","","","","repApprByDir"];
	var reportDto={
		//	"createdDate":that.getEstComplDate(that.getView().byId('repDp').getDateValue()),
			"preparedBy":that.getView().byId('repPreparedBy').getValue(),
			"reportReqNo":that.getView().byId('repRfsNo').getValue(),
			"samplesDataSpec":that.getView().byId('repSamDataSpec').getValue(),
			"serviceScope":that.getView().byId('repSerScope').getValue(),
			"samples":that.getView().byId('repSam').getValue(),
			"summaryOfAnalyticalMethods":that.getView().byId('repSummOfAnalMthd').getValue(),
			"results":that.getView().byId('repResults').getValue(),
			"methodAppliedDescription":that.getView().byId('repInstMthdAppld').getValue()
	};
	return reportDto;
},

getEstComplDate : function(dateValue){
	var that =this;
	if(dateValue!=null &&dateValue!=undefined && dateValue!=""){
	var yyyy = dateValue.getFullYear().toString();
	var mm = (dateValue.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = dateValue.getDate().toString();
	var hh="00";
	var min="00";
	var sec="00";
	return yyyy+"-" + (mm[1]?mm:"0"+mm[0])+"-" + (dd[1]?dd:"0"+dd[0])+"T"+(hh[1]?hh:"0"+hh[0])+":"+(min[1]?min:"0"+min[0])+":"+(sec[1]?sec:"0"+sec[0]);
	}
},

completeTask : function(taskData,msg){
	var that=this;
	 var outputData={};
	  outputData.DO_RFS=taskData;
	  var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
	  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true);
			  taskDataODataModel.create("/OutputData",outputData,null,
					  function(oData){
				  sap.ui.commons.MessageBox.show(msg,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
							function(){
					  callCloseDialog();
					});
			  },function(oError){
				  sap.ui.commons.MessageBox.show("Task already submitted",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			  });
},

	//Deepak
	pendingTask : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('taskapprComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter Comments");
		}else{
			var that =this;
			//db save for (comments)
			var dbData = that.getView().getModel("oDBModel").getData();
			var reportDto = that.getUIData();
			dbData.reportDto=reportDto;
			dbData.requestHeaderDto.statusDesc="Pending Sample/Design";
			dbData.reportDto.labTeamMemberComment = comments;
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			that.pendingDialog.close();
			if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Sample requirement submitted";
				var data = that.getView().getModel("taskJsonModel").getData();
				data.uiActionNo=3;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
//'fullfill rFs task' for Lab Member with taskNo =14
lmFulfilRfsSamReqd : function(){
		var that = this;
		if (!that.pendingDialog) {
			that.pendingDialog = sap.ui.xmlfragment("corelabs.fragments.apprCommentBox", this);
			that.getView().addDependent(this.pendingDialog);
			that.pendingDialog.addStyleClass("sapUiSizeCompact");
		}
		 this.pendingDialog.open();
		 
	
},

closeDialog : function(){
	var that = this;
	that.pendingDialog.close();
},

lmFulfilWip : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	var reportDto = that.getUIData();
	dbData.reportDto=reportDto;
	dbData.requestHeaderDto.statusDesc="Service Report Sent";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
		//dont close dialog show submit button.
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

close: function(oEvent){
	var that= this;
	oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
	that.rejectDialog.close();
	},

//'Report Acceptance' for Requester with taskNo =16
	
	/*rqRepRej : function(oEvt){
		//oEvt.getSource().getId().split("--")[1]
		var that = this;
		that.rejectDialog.open();
	},*/
	
	//toReject : function(){
	rqRepRej: function(){
	var that=this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Service Report Rejected";
	dbData.reportDto.requesterComment= that.getView().byId('reqRepComments').getValue();
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Rejected";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=2;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

rqRepAcceptance : function(){
	var that=this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Service accepted and pending Feedback";  //Service Accepted & Pending Feedback
	dbData.reportDto.requesterComment= that.getView().byId('reqRepComments').getValue();
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
//		var data = that.getView().getModel("taskJsonModel").getData();
//		data.uiActionNo=1;
//		that.completeTask(data);
		that.getView().byId('rtRepAcceptance').setVisible(false);
		that.getView().byId('reqFeedSec').setVisible(true);
		that.getView().byId('feedRadioBtn').setEnabled(true);
		that.getView().byId('feedComm').setEnabled(true);
		that.getView().byId('rqFeedsubmit').setVisible(true);
		
		//sap.ui.controller("corelabs.RFSFormTask").check();
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},


//feed back Submission tasko = 16

rqFeedSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	// get UI Data
	dbData.reportDto.feedBackRating= that.getView().byId("feedRadioBtn").getSelectedButton().getText();
	dbData.reportDto.feedbackComment= that.getView().byId('feedComm').getValue();
	dbData.requestHeaderDto.statusDesc="Feedback Received";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},


commentTask : function(oEvent){
	var that = this;
	var comments = sap.ui.getCore().byId('comm').getValue().trim();
	if(comments==""||comments==null){
		sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		//alert("Please Enter Comments");
	}else{
		var that =this;
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Sample Returned";
		dbData.reportDto.labTeamMemberComment = comments;
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Sample to be returned has been submitted";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=3;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	}
},
//'RFS closure Task' for Lab member taskNo =17
lmRfsCloseSamReqToRet : function(){
	var that = this;
	if (!that.commDialog) {
		that.commDialog = sap.ui.xmlfragment("corelabs.fragments.commentBox", this);
		that.getView().addDependent(this.commDialog);
		that.commDialog.addStyleClass("sapUiSizeCompact");
	}
	that.commDialog.open();
},

closeCommDialog : function(){
	var that = this;
	that.commDialog.close();
},


/*//'RFS closure Task' for Lab member taskNo =17
lmRfsCloseSamReqToRet : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Sample Returned";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=3;
		that.completeTask(data);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},*/
lmRfsCloseSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="RFS Fulfilled";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

//'Sample Return task' for Lab Member with taskNo =18
lmSamRetSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Sample Returned";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

//'Invoicing Task' for CLC  taskNo =19
clcInvoiceSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Completed";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

disableAllBtns : function(){
	var that =this;
	
	that.getView().byId('rqFeedsubmit').setVisible(false);
	that.getView().byId('lmFrfs').setVisible(false);
	that.getView().byId('rtRepAcceptance').setVisible(false);
	
	that.getView().byId('lmRfsClosure').setVisible(false);
	that.getView().byId('lmSamReturn').setVisible(false);
	that.getView().byId('clcInvoice').setVisible(false);
},

disableAllFields:function(evt){
	var that=this;
		var aId=["repfname","replname","repOrgNm","repKaustId","repdept","repTel","repAddr","repCountry","repPostcode","repKaustAccNo","repPreparedBy","repNoOfSam","repSamDataSpec","repSerScope","repSam","repSummOfAnalMthd","repResults","repInstMthdAppld","repApprByDir"];
		for(var i=0;i<aId.length;i++){
		var oControl = that.getView().byId(aId[i]);
		if((oControl.getEnabled())){
			oControl.setEnabled(false);
		}
	}
},


// File upload

handleUploadPress:function(evt){
	var that=this;
	if(that.busyDialog){
		that.busyDialog.open();
	}
		that.fileUpload();
},

removeFromTable:function(oEvent){
	var that=this;
	var myAttchmentTbl = that.getView().byId("idMyAttchmentTbl");
	var adata=myAttchmentTbl.getModel("reportDocModel").getData().docData;
	var selItems=myAttchmentTbl.getSelectedItems();
	if(selItems.length>0)
	{
		for (var j=adata.length-1; j>=0; j--)
		{			
			if(adata[j].delFlag)
			{
				this.deleteFromRepository(adata[j]);
				adata.splice(j, 1);
			}
		}
	}
	else
	{
		sap.ui.commons.MessageBox.show("Select a row to delete", "ERROR", "Error");
	}
	that.getView().byId("idMyAttchmentTbl").removeSelections();
	reportDocModel.refresh();
},

deleteFromRepository: function(delObj)
{
	 var that=this;
	 var deleteParameters =   {
			 "appName":delObj.appName,
			 "fileName":delObj.fileName,
			 "filePath":delObj.filePath,
			 "fileId":delObj.App_Name,
			 "id":delObj.id,
			 "operationId":delObj.operationId
			};
	 var url = "/cc_ecm/file/delete" ;
		
		$.ajax( {
			url : url,
			type : "POST",
			async : false,
			dataType : "json",
			data : JSON.stringify(deleteParameters),
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				sap.ui.commons.MessageBox.show("Deleted successfully", "SUCCES", "Success");

			},
			error : function(data,jqXHR) {
				sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
			}
		});
},

fileUpload : function() {
	that = this;
	var pageId = this.getView().getId();
	if (document.getElementById(pageId+"--fileUploader-fu")) {
		if (document.getElementById(pageId+"--fileUploader-fu").files[0] != null) {
			var file = document.getElementById(pageId+"--fileUploader-fu").files[0];
		}
	}
	else if (document.getElementById(pageId+"--sampleFileUploader-fu")) {
		if (document.getElementById(pageId+"--sampleFileUploader-fu").files[0] != null) {
			var file = document.getElementById(pageId+"--sampleFileUploader-fu").files[0];
		}
	}
	if(file ==null){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(
				"Please browse a document first", {
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function(oAction) { 
					// * do something 
					}
				}
		);
		return;
	}
	if (file.name.length > 255) {
		// sap.ui.getCore().byId("dialogUpload").close();
		//	jQuery.sap.require("sap.ui.commons.MessageBox");
		sap.ui.commons.MessageBox.show(
				"File name too long!!",
				sap.ui.commons.MessageBox.Icon.WARNING,
				"Important Information",
				[ sap.ui.commons.MessageBox.Action.OK ],
				fnCallbackConfirm,
				sap.ui.commons.MessageBox.Action.OK);
		function fnCallbackConfirm() {
		}
		return;
	}
	// validating file size
	if (file && (file.size / 1024 / 1024) > 5) {
		//jQuery.sap.require("sap.ui.commons.MessageBox");
		sap.ui.commons.MessageBox.show(
				"File size more than 5MB is not allowed",
				sap.ui.commons.MessageBox.Icon.WARNING,
				"Important Information",
				[ sap.ui.commons.MessageBox.Action.OK ],
				fnCallbackConfirm,
				sap.ui.commons.MessageBox.Action.OK);
		function fnCallbackConfirm() {
		}
		return;
	}
	if (file && window.File && window.FileList && window.FileReader) {
		var reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onload = function(evt) {
			var fileName = file.name;
			var byteArray2 = new Uint8Array(
					evt.target.result);

			var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
			var UniqueFileId = new Date().getTime();

				that.createFile("CLRFS_REPORT", UniqueFileId,fileName, fileEncodedData);
		};
	}
},

uint8ToString : function(buf) {
	var i, length, out = '';
	for (i = 0, length = buf.length; i < length; i += 1) {
		out += String.fromCharCode(buf[i]);
	}
	return out;
},


createFile : function(applicationArea, UniqueFileId,
		fileName, file) {

	var that=this;
	
	var userId=loggedinUserModel.getData().userId;
	var sectionId="report";
	var rfsno=that.getView().byId('repRfsNo').getValue();
	var uploadPayload = {
		    "appName":applicationArea,
		    "folderName":rfsno,
		    "file":file,
		    "fileName":fileName,
		    "operationId":userId,
		    "operationName":rfsno,		//added this for rfs number
		    "businessDocType":sectionId,
		    "status":"ACTIVE"
	};

	var newFile = {};
	var uploadUrl="/cc_ecm/file/upload";
	
	$.ajax( {
		url : uploadUrl,
		type : "POST",
		async : false,
		dataType : "json",
		data : JSON.stringify(uploadPayload),
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var newFile ={};
			var docManagerDto=jqXHR.responseJSON.docManagerDto;
			newFile.fileId=docManagerDto.fileId;
			newFile.fileName=docManagerDto.fileName;
			newFile.updatedDate=docManagerDto.updatedDate;
			newFile.createdDate=docManagerDto.createdDate;
			newFile.businessDocType=docManagerDto.businessDocType;
			newFile.appName=docManagerDto.appName;
			newFile.id=docManagerDto.id;
			newFile.operationId=docManagerDto.operationId;
			newFile.status=docManagerDto.status;
			newFile.filePath=docManagerDto.filePath;
			newFile.createdBy=docManagerDto.createdBy;
			newFile.createdDateValue= that.getFormattedDate(new Date(docManagerDto.createdDateValue));
			newFile.delFlag=false;
			
			if(newFile.status != null) {
				if (newFile.status == "SUCCESS") {
  					
						var oTable = that.getView().byId("idMyAttchmentTbl");
						itemsLen=oTable.getItems().length;
						newFile.slno=itemsLen+1;
						/*if(oTable.getModel("reportDocModel").getData().documentManagerDtoList==undefined)
						{
							oTable.getModel("reportDocModel").getData().documentManagerDtoList=[];
						}*/
						/*reportDocModel.getData().documentManagerDtoList.push(newFile);
						oTable.setModel(reportDocModel,"reportDocModel");
						reportDocModel.refresh();*/
						oTable.getModel("reportDocModel").getData().documentManagerDtoList.push(newFile);
						oTable.getModel("reportDocModel").refresh();
						
					sap.ui.commons.MessageBox.show("File Uploaded Successfully ", "SUCCESS", "Upload Success");
				}else{
  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
  				}
  				that.getView().byId("fileUploader").setValue("");
  			}else{
	  			sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Error");
	  		}
			that.busyDialog.close();
		},
		error : function(data,jqXHR) {
			sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
			that.busyDialog.close();
		}
	});
},

readTableData:function(evt){
	var that=this;
	var rfsno=that.getView().byId('repRfsNo').getValue();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	var readDocPayload={
			"businessDocType":"report",
//			"operationId":userId
			"operationName":rfsno
			};
			var reportDocModel=new sap.ui.model.json.JSONModel();
			reportDocModel.loadData("/cc_ecm/file/readDocuments",JSON.stringify(readDocPayload),false,"POST",false,false,oHeader);
			if(reportDocModel.getData()){

				if (reportDocModel.getData() && reportDocModel.getData().documentManagerDtoList && (!(reportDocModel.getData().documentManagerDtoList instanceof Array))) {
					reportDocModel.getData().documentManagerDtoList=[reportDocModel.getData().documentManagerDtoList];
				}
				else if(reportDocModel.getData().documentManagerDtoList==undefined)
					{
					reportDocModel.getData().documentManagerDtoList=[];
					}
				
				var dtoList = reportDocModel.getData().documentManagerDtoList;
				var length = dtoList.length;
				for ( var i = 0; i < length; i++) {
					if (dtoList[i].createdDateValue != "") {
						dtoList[i].createdDateValue = that.getFormattedDate(new Date(dtoList[i].createdDateValue));
					}
				}
				
				var oTable = that.getView().byId("idMyAttchmentTbl");
					oTable.setModel(reportDocModel,"reportDocModel");
					reportDocModel.refresh();
			}
},

getFormattedDate:function(date) {
	  var year = date.getFullYear();
	  var month = (1 + date.getMonth()).toString();
	  month = month.length > 1 ? month : '0' + month;
	  var day = date.getDate().toString();
	  day = day.length > 1 ? day : '0' + day;
	  return day + '/' + month + '/' + year;
	  
},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust_corelabs.FullServiceAnalysisReport
*/
	onBeforeRendering: function() {
		var that=this;
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust_corelabs.FullServiceAnalysisReport
*/
	onAfterRendering: function() {
		var that=this;
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
		that.readTableData();
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust_corelabs.FullServiceAnalysisReport
*/
//	onExit: function() {
//
//	}

});

//var reportDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});