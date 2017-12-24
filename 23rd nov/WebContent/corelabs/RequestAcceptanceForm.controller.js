jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.RequestAcceptanceForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf servicescopeandchargesform.RequestAcceptanceForm
*/
	onInit: function() {
	
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
		var that =this;
		that.disableAllBtns();
		taskId=that.getTask();
		if(taskId!=""){
			this.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.accRejTask", this);
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
				  oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+taskData.rfsNo,null,false);
				  that.getView().setModel(oDBModel,"oDBModel");
				  if(taskData.taskNo==8){
					  that.getView().byId('rtSscAcceptance').setVisible(true);
				  }else{
					  that.getView().byId('rtSscAcceptance').setVisible(false);
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

close: function(oEvent){
	var that= this;
	oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
	that.rejectDialog.close();
	},


	//'SSC Acceptance Task' for Requester with taskNo = 8;
	
	sscAccRej : function(oEvt){
		//oEvt.getSource().getId().split("--")[1]
		var that = this;
		that.rejectDialog.open();
	},
	toReject : function(){
		var that =this; 
		//db save for (comments)
		var comments = sap.ui.getCore().byId('accTaskRejectionComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter Comments");
		}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="SSC Reject";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=2;
			that.completeTask(data);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		}
	},
	sscAccReqCh : function(){
		var that =this; 
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="SSC Request Changed";
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
	},
	sscAccAppr : function(){
		var that =this; 
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Scope and Charges Approved";
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
		that.getView().byId('rtSscAcceptance').setVisible(false);
	}
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.RequestAcceptanceForm
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.RequestAcceptanceForm
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.RequestAcceptanceForm
*/
//	onExit: function() {
//
//	}
	
	
});