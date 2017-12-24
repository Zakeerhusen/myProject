sap.ui.controller("corelabs.PI_Approver_List", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	var that= this;
	that.userId="";
	this.initializeDateRange();
	
	this.onPress();
	},
	
	handleSuggest : function(oEvent) {
		var that = this;
		var autoUser = oEvent.getParameter("suggestValue");
		oSearchUserModel = new sap.ui.model.json.JSONModel();
		
		if (autoUser.length > 3) {
		var searchPayload = {
		"userNm" : autoUser
		};
		var oHeader = {
		"Content-Type" : "application/json;charset=utf-8"
		};
		oSearchUserModel.attachRequestCompleted(function(oEvent){
			var oSearchUserModel= oEvent.getSource();
			if (!(oSearchUserModel.getData().userDtos instanceof Array)) {
				oSearchUserModel.getData().userDtos = [ oSearchUserModel.getData().userDtos ];
				}
		});
		oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser", JSON.stringify(searchPayload), true, "POST", false, false, oHeader);
		that.getView().setModel(oSearchUserModel, "userSearchModel");
		}
	},

	itemSelected : function(oEvt){
		var that=this;
		that.userId=oEvt.getParameter("selectedItem").getAdditionalText();
	},
	
	onPress: function(){
		var that = this;
		if(that.userId === ""){
			/*if(that.getView().getModel("oPIApprovalListJsonModel")){
				that.getView().getModel("oPIApprovalListJsonModel").setData({});
				that.getView().getModel("oPIApprovalListJsonModel").refresh();
			}
			that.getView().byId('piname').setValueState("Error");
			return;*/
		}
		that.getView().byId('piname').setValueState("None");
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var oPIApprovalListJsonModel = new sap.ui.model.json.JSONModel();
		jQuery.sap.require("sap.ui.core.format.DateFormat");
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern : "yyyy-MM-ddTHH:mm:ss"
		});
		var fromDate = that.getView().byId("dateRange").getDateValue();
		if(fromDate){
			var utc= fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000);
			fromDate= new Date(utc + (3600000));
			fromDate= oDateFormat.format(fromDate,true); 
		}
		var toDate = that.getView().byId("dateRange").getSecondDateValue();
		if(toDate){
			var utc= toDate.getTime() - (toDate.getTimezoneOffset() * 60000);
			toDate= new Date(utc + (3600000));
			toDate= oDateFormat.format(toDate,true); 
		}
		var payload={
			    "piId":that.userId,  
			    "status":"APR",
			    "fromDate":fromDate,
			    "toDate":toDate
			};
		var urlInc ="/utilweb/rest/piapprovalreq/searchUserPiApproval";
		that.getView().setBusy(true);
		oPIApprovalListJsonModel.attachRequestCompleted(function(oEvent){
			var oPIApprovalListJsonModel= oEvent.getSource();
			try{
			if(!(oPIApprovalListJsonModel.getData().piApprovalDto instanceof Array)){
				oPIApprovalListJsonModel.getData().piApprovalDto=[oPIApprovalListJsonModel.getData().piApprovalDto];
			}
			}catch(oError){
			console.log(oError);
			that.getView().setBusy(false);
			}
			that.getView().setBusy(false);
		});
		oPIApprovalListJsonModel.loadData(urlInc,JSON.stringify(payload),true,"POST",false,false,oHeader);
		//oPIApprovalListJsonModel.loadData(urlInc+"?$format=json",payload,null,false);
		that.getView().setModel(oPIApprovalListJsonModel,"oPIApprovalListJsonModel");
	},
	
	onClear : function(){
		var that=this;
		that.getView().byId('piname').setValue("");
		that.getView().byId('piname').setValueState("None");
		that.userId="";
		this.initializeDateRange();
		if(that.getView().getModel("oPIApprovalListJsonModel")){
			that.getView().getModel("oPIApprovalListJsonModel").setData({});
			that.getView().getModel("oPIApprovalListJsonModel").refresh();
		}
		that.onPress();
	},
	
	initializeDateRange: function(){
		var toDate=new Date();
		var fromDate= new Date("2016-01-01");
		this.getView().byId("dateRange").setDateValue(fromDate);
		this.getView().byId("dateRange").setSecondDateValue(toDate);
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
//	onExit: function() {
//
//	}

});