sap.ui.controller("corelabs.Registered_User_List", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf servicescopeandchargesform.Registered_User_List
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		var oCountryJsonModel = new sap.ui.model.json.JSONModel();
		var urlInc ="/utilweb/GWProxyServlet?sap/opu/odata/sap/ZGW_BPM_RFS_SERVICES_SRV/";
		oCountryJsonModel.loadData(urlInc+"Countrys?$format=json",null,true);
		this.getView().byId('country').setModel(oCountryJsonModel,"oCountryJsonModel");
		this.userId="";
		this.initializeDateRange();
		this.initializeComboBoxForReadOnly();
		
		this.onPress();
	},
	
	onPress: function(){
		var that = this;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var oRegisteredUserListJsonModel = new sap.ui.model.json.JSONModel();
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
			    "countryNm":that.getView().byId('country').getValue(),
			    "userId":that.userId,
			    "orgNm":that.getView().byId('orgType').getValue(),
			    "fromDate":fromDate,
			    "toDate":toDate
			};
		var urlInc ="/utilweb/rest/user/auth/registeredUsersSearch/0";
		that.getView().byId("userTable").setBusy(true);
		oRegisteredUserListJsonModel.attachRequestCompleted(function(oEvent){
			that.getView().byId("userTable").setBusy(false);
			var oModel=oEvent.getSource();
			if(!(oModel.getData().userDto instanceof Array)){
				oModel.getData().userDto=[oModel.getData().userDto];
			}
			oModel.refresh();
		});
		oRegisteredUserListJsonModel.loadData(urlInc,JSON.stringify(payload),true,"POST",false,false,oHeader);
		that.getView().setModel(oRegisteredUserListJsonModel,"oRegisteredUserListJsonModel");
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
			that.getView().byId("piname").setBusy(false);
			var oSearchUserModel=oEvent.getSource();
			if (!(oSearchUserModel.getData().userDto instanceof Array)) {
			oSearchUserModel.getData().userDto = [oSearchUserModel.getData().userDto ];
			}
		});
		that.getView().byId("piname").setBusy(true);
		oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser", JSON.stringify(searchPayload), true, "POST", false, false, oHeader);
		that.getView().setModel(oSearchUserModel, "userSearchModel");
		}
	},

	itemSelected : function(oEvt){
		var that=this;
		that.userId=oEvt.getParameter("selectedItem").getAdditionalText();
		that.getView().byId("piname").setTooltip(oEvt.getParameter("selectedItem").getText());
	},

	onClear: function(){
		var that=this;
		that.getView().byId('piname').setValue("");
		that.getView().byId('orgType').setValue("");
		that.getView().byId('country').setValue("");
		that.userId="";
		that.initializeDateRange();
		that.getView().getModel("oRegisteredUserListJsonModel").setData({});
		that.getView().getModel("oRegisteredUserListJsonModel").refresh();
	},
	
	initializeDateRange: function(){
		var toDate=new Date();
		var fromDate= new Date("2016-01-01");
		this.getView().byId("dateRange").setDateValue(fromDate);
		this.getView().byId("dateRange").setSecondDateValue(toDate);
	},
	
	initializeComboBoxForReadOnly: function(){
		var oCombo = this.getView().byId("country");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
	}
		
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.Registered_User_List
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.Registered_User_List
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.Registered_User_List
*/
//	onExit: function() {
//
//	}

});