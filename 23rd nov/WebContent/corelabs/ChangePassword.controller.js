jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.ChangePassword", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf uilogin.ChangePassword
*/
	onInit: function() {
		if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	},
	
	validate : function(){
		var that=this;
		var oldPwd=that.getView().byId('oldpwdipt').getValue();
		var newPwd=that.getView().byId('newpwdipt').getValue();
		var renewPwd=that.getView().byId('renewpwdipt').getValue();
		if(oldPwd==""|oldPwd==null){
			 sap.ui.commons.MessageBox.show("Please Enter Old Password",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter Old Password");
		}else if(newPwd==""||newPwd==null){
			sap.ui.commons.MessageBox.show("Please Enter New Password",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter New Password");
		}else if(renewPwd==""||renewPwd==null){
			sap.ui.commons.MessageBox.show("Please Re-Enter Password",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Re-Enter Password ");
		}else{
			that.confirmPassword();
		}
	},
	
	confirmPassword:function(){

		var that = this;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};

		var oldPwd=that.getView().byId('oldpwdipt').getValue();
		var newPwd=that.getView().byId('newpwdipt').getValue();
		var renewPwd=that.getView().byId('renewpwdipt').getValue();

		if(newPwd!=renewPwd){
			sap.ui.commons.MessageBox.show("Entered Passwords do not match",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		//alert("Entered Passwords do not match");
		}
		else{
		var changePasswordPayload={
		 "oldPassword":oldPwd,
		 "newPassword":newPwd,
		 "passwordChangeRequired":"false"
		};
		var dbDataModel=new sap.ui.model.json.JSONModel();
		dbDataModel.loadData("/utilweb/rest/ume/auth/changePassword",JSON.stringify(changePasswordPayload),false,"POST",false,false,oHeader);
		if(dbDataModel.getData().status=="SUCCESS" || dbDataModel.getData().status=="FAILURE"){
		//alert(dbDataModel.getData().listMessage);
		 sap.ui.commons.MessageBox.show(dbDataModel.getData().message,sap.ui.commons.MessageBox.Icon.INFORMATION,"Information","OK", function(){
			// that.oRouter.navTo("Dashboard");
		 });
		}
		else{
		//alert("Password Change Failed");
		sap.ui.commons.MessageBox.show("Password Change Failed",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		}
		that.getView().byId('oldpwdipt').setValue("");
		that.getView().byId('newpwdipt').setValue("");
		that.getView().byId('renewpwdipt').setValue("");
		}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf uilogin.ChangePassword
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf uilogin.ChangePassword
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf uilogin.ChangePassword
*/
//	onExit: function() {
//
//	}

});
