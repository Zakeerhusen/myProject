sap.ui.controller("corelabs.FeedbackForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust_corelabs.FeedbackForm
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		var that =this;
		that.disableAllBtns();
		taskId=that.getTask();
		if(taskId!=""){
		    
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
				  that.getView().byId('feedRfsNo').setValue(taskData.rfsNo);
				  
				  var reportNo =taskData.rfsNo.replace(taskData.rfsNo.charAt(0),"2");
				  that.getView().byId('feedRepNo').setValue(reportNo);
				  
				  oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+taskData.rfsNo,null,false);
				  that.getView().setModel(oDBModel,"oDBModel");
				  
				  if(oDBModel.getData().reportDto!=undefined){
					  that.getView().byId('feedComm').setValue(oDBModel.getData().reportDto.feedbackComment);
					  that.getView().byId('feedRadioBtn').setSelectedIndex(oDBModel.getData().reportDto.feedBackRating);
				  }
				  
				  var requesterModel =new sap.ui.model.json.JSONModel();
				  requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
				  that.getView().setModel(requesterModel,"feedbackRequesterModel");
				  if(taskData.taskNo==16){
					  that.getView().byId('feedComm').setEnabled(true);
					  that.getView().byId('rqFeedsubmit').setVisible(true);
					  that.getView().byId('exc').setEnabled(true);
					  that.getView().byId('good').setEnabled(true);
					  that.getView().byId('avg').setEnabled(true);
					  that.getView().byId('poor').setEnabled(true);
				  }
				  
		 },function(oError){
	  			sap.ui.commons.MessageBox.show("Error while fetching Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			        });
		
		}else{
			//this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//this.oRouter.getRoute("RFSFormTask").attachMatched(this._loadRFS, this);
		}
	},
	
	getTask : function(){
		var that= this;
		var tId = getValFromQueryString('taskId');
		return tId;
	},
	
	completeTask : function(taskData){
		var that=this;
		 var outputData={};
		  outputData.DO_RFS=taskData;
		  var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true);
				  taskDataODataModel.create("/OutputData",outputData,null,
						  function(oData){
					  sap.ui.commons.MessageBox.show("Submitted Successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
								function(){
						  callCloseDialog();
						});
				  },function(oError){
					  sap.ui.commons.MessageBox.show("Error in Submitting RFS task",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				  });
	},
	
	// feed back Submission tasko = 16
	
	rqFeedSub : function(){
		var that =this;
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		// get UI Data
		dbData.reportDto.feedBackRating= that.getView().byId("feedRadioBtn").getSelectedIndex();
		dbData.reportDto.feedbackComment= that.getView().byId('feedComm').getValue();
		dbData.requestHeaderDto.statusDesc="Feedback received";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=1;
			that.completeTask(data);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	
	
	disableAllBtns : function(){
		var that =this;
		
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust_corelabs.FeedbackForm
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust_corelabs.FeedbackForm
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust_corelabs.FeedbackForm
*/
//	onExit: function() {
//
//	}

});