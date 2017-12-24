jQuery.sap.require("sap.ui.commons.MessageBox");
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
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "PI_Approver_List") {
			that.userId="";
			that.userNameId="";
			that.initializeDateRange();
			that.onClear();
			that.onPress();
		}
	});
	
	var device=sap.ui.Device;
	if(device.browser.name == "sf"){
	/*	this.getView().byId("dateRange").setWidth("111%");*/
	}
	else if(device.browser.name == "ff"){
		this.getView().byId("piAppClearBtn").addStyleClass("marginLeftPIListff");
	}
	},
	
	handleSuggest : function(oEvent) {
		var that = this;
		that.userId= "";
		var autoUser = oEvent.getParameter("suggestValue");
		oSearchUserModel = new sap.ui.model.json.JSONModel();
		autoUser=autoUser.trim();
		if (autoUser.length > 3) {
		var searchPayload = {
		"userNm" : autoUser
		};
		var oHeader = {
		"Content-Type" : "application/json;charset=utf-8"
		};
		oSearchUserModel.attachRequestCompleted(function(oEvent){
			that.getView().byId("piname").setBusy(false);
			var oSearchUserModel= oEvent.getSource();
				if (!(oSearchUserModel.getData().userDtos instanceof Array)) {
				oSearchUserModel.getData().userDtos = [oSearchUserModel.getData().userDtos];
				}
				oSearchUserModel.refresh();
		});
		that.getView().byId("piname").setBusy(true);
		oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser", JSON.stringify(searchPayload), true, "POST", false, false, oHeader);
		that.getView().setModel(oSearchUserModel, "userSearchModel");
		}else{
			if(that.getView().getModel("userSearchModel")!=undefined){
				that.getView().getModel("userSearchModel").setData();
				that.getView().getModel("userSearchModel").refresh();
				}	
		}
	},
	
	handleSuggestUserName : function(oEvent) {
		var that = this;
		that.userNameId="";
		var autoUser = oEvent.getParameter("suggestValue");
		oSearchUserModelUser = new sap.ui.model.json.JSONModel();
		autoUser=autoUser.trim();
		if (autoUser.length > 3) {
		var searchPayload = {"userNm" : autoUser};
		var oHeader = {"Content-Type" : "application/json;charset=utf-8"};
		oSearchUserModelUser.attachRequestCompleted(function(oEvent){
			that.getView().byId("userName").setBusy(false);
			var oSearchUserModelUser= oEvent.getSource();
				if (!(oSearchUserModelUser.getData().userDtos instanceof Array)) {
					oSearchUserModelUser.getData().userDtos = [oSearchUserModelUser.getData().userDtos];
				}
				oSearchUserModelUser.refresh();
		});
		that.getView().byId("userName").setBusy(true);
		oSearchUserModelUser.loadData("/utilweb/rest/ume/auth/searchuser", JSON.stringify(searchPayload), true, "POST", false, false, oHeader);
		that.getView().setModel(oSearchUserModelUser, "oSearchUserModelUser");
		}else{
			if(that.getView().getModel("oSearchUserModelUser")!=undefined){
				that.getView().getModel("oSearchUserModelUser").setData();
				that.getView().getModel("oSearchUserModelUser").refresh();
				}	
		}
	},

	itemSelected : function(oEvt){
		var that=this;
		that.userId=oEvt.getParameter("selectedItem").getAdditionalText();
	},
	
	itemSelectedUserName: function(oEvt){
		var that=this;
		that.userNameId=oEvt.getParameter("selectedItem").getAdditionalText();
	},
	onUserNameChange:function(oEvent){
		var name= oEvent.getSource().getValue();
		if(name.trim() != "" && (this.userNameId == undefined || this.userNameId == "")){
			oEvent.getSource().setValue("");
			sap.ui.commons.MessageBox.show("Please select user name from suggested options",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		if(name.trim() == ""){
			this.userNameId="";
		}
	},
	
	onNameChange:function(oEvent){
		var name= oEvent.getSource().getValue();
		if(name.trim() != "" && (this.userId == undefined || this.userId == "")){
			oEvent.getSource().setValue("");
			sap.ui.commons.MessageBox.show("Please select PI name from suggested options ",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		if(name.trim() == ""){
			this.userId="";
		}
	},
	
	onPress: function(){
		var that = this;
		/*if(that.userId === ""){
			if(that.getView().getModel("oPIApprovalListJsonModel")){
				that.getView().getModel("oPIApprovalListJsonModel").setData({});
				that.getView().getModel("oPIApprovalListJsonModel").refresh();
			}
			that.getView().byId('piname').setValueState("Error");
			return;
		//	sap.ui.commons.MessageBox.show("Invalid user",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			that.getView().byId('piname').setValue("");
			var oPIApprovalListJsonModel = new sap.ui.model.json.JSONModel();
			oPIApprovalListJsonModel.setData();
			that.getView().setModel(oPIApprovalListJsonModel,"oPIApprovalListJsonModel");
		}else{*/
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
			    "toDate":toDate,
			    "userRoleBaseQuery":true,
			    "userId":that.userNameId
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
		oPIApprovalListJsonModel.loadData(urlInc,JSON.stringify(payload),false,"POST",false,false,oHeader);
		that.getView().setModel(oPIApprovalListJsonModel,"oPIApprovalListJsonModel");
		//}
	},
	
	onClear : function(){
		var that=this;
		that.getView().byId('piname').setValue("");
		that.getView().byId('piname').setValueState("None");
		that.getView().byId('userName').setValue("");
		that.getView().byId('userName').setValueState("None");
		that.userId="";
		that.userNameId="";
		this.initializeDateRange();
		if(that.getView().getModel("oPIApprovalListJsonModel")){
			that.getView().getModel("oPIApprovalListJsonModel").setData({});
			that.getView().getModel("oPIApprovalListJsonModel").refresh();
		}
		that.onPress();
	},
	
	initializeDateRange: function(){
		this.getView().byId("dateRange").$().find("input").attr("readonly", true);
		var toDate=new Date();
		var fromDate= new Date("2016-01-01");
		this.getView().byId("dateRange").setDateValue(fromDate);
		this.getView().byId("dateRange").setSecondDateValue(toDate);
	},
	
	dwnldExcel : function(){
		var that = this;
		var oExport = new  sap.ui.core.util.Export({
		// Type that will be used to generate the content. Own ExportType's can be created to support other formats
		exportType : new  sap.ui.core.util.ExportTypeCSV({
			separatorChar : ","
		}),
		// Pass in the model created above
		models : this.getView().getModel("oPIApprovalListJsonModel"),
		// binding information for the rows aggregation
		rows : {
			path : "/piApprovalDto"
		},
		// column definitions with column name and binding info for the content 
		
		columns : [{
			name : "Request ID",
			template : {
				content : "{requestId}"
			}
		},{
			name : "User ID",
			template : {
				content : "{userId}"
			}
		} ,{
			name : "User Name",
			template : {
				content : "{userName}"
			}
		},{
			name : "PI Name",
			template : {
				content : "{piName}"
			}
		},{
			name : "PI KAUST ID",
			template : {
				content : "{piKaustId}"
			}
		},{
			name : "Assigned Pocket ID",
			template : {
				content : "{pocketId}"
			}
		},
		,{
			name : "User KAUST ID",
			template : {
				content : "{kaustId}"
			}
		},{
			name : "User Email ID",
			template : {
				content : "{emailId}"
			}
		},{
			name : "User Department",
			template : {
				content : "{deptNm}"
			}
		},{
			name : "User Telephone",
			template : {
				content : "{telephone}"
			}
		},{
			name : "User Mobile",
			template : {
				content : "{mobile}"
			}
		},{
			name : "User Position",
			template : {
				content : "{position}"
			}
		},{
			name : "User Type of Organization",
			template : {
				content : "{orgTypeNm}"
			}
		},{
			name : "User Organization Name",
			template : {
				content : "{orgNm}"
			}
		},
		{
			name : "User Type",
			template : {
				content : "{userType}"
			}
		},{
			name : "User Country",
			template : {
				content : "{countryNm}"
			}
		},{
			name : "User Post Code",
			template : {
				content : "{postCode}"
			}
		}
		,{
			name : "User Address",
			template : {
				content : "{address}"
			}
		}
		
		,{
			name : "PI Email ID",
			template : {
				content : "{piEmailId}"
			}
		}
		,{
			name : "PI Telephone",
			template : {
				content : "{piTelephone}"
			}
		}
		,{
			name : "PI Type of Organization",
			template : {
				content : "{piOrgTypeNm}"
			}
		}
		,{
			name : "PI Organization Name",
			template : {
				content : "{piOrgNm}"
			}
		}
		,{
			name : "PI User Type",
			template : {
				content : "{piUserType}"
			}
		},{
			name : "PI Country",
			template : {
				content : "{piCountryNm}"
			}
		},{
			name : "PI Post Code",
			template : {
				content : "{piPostCode}"
			}
		},{
			name : "PI Address",
			template : {
				content : "{piAddress}"
			}
		},{
			name : "Created Date",
			template : {
				content : {
					parts: ["createdDate"],
					formatter : function(value){
						if(value){
							var formattedDate = value.substr(8,2)+"/"+value.substr(5,2)+"/"+value.substr(0,4);
							return formattedDate;
						}else{
							return null;
						}
					}
				}
			}
		},{
			name : "Modified Date",
			template : {
				content : {
					parts: ["modifiedDate"],
					formatter : function(value){
						if(value){
							var formattedDate = value.substr(8,2)+"/"+value.substr(5,2)+"/"+value.substr(0,4);
							return formattedDate;
						}else{
							return null;
						}
					}
				}
			}
		},{
			name : "Status",
			template : {
				content : "{status}"
			}
		}]
	});
	// download exported file 
		oExport.saveFile("PI_Approved_Users_Report");
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
	onBeforeRendering: function() {
		var that=this;
		that.getView().byId("dateRange").$().find("input").attr("readonly", true);

	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
	onAfterRendering: function() {	
		var that=this;
		that.getView().byId("dateRange").$().find("input").attr("readonly", true);
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.PI_Approver_List
*/
//	onExit: function() {
//
//	}

});