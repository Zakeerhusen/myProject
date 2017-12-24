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
	this.loginDialog = sap.ui.xmlfragment("corelabs.fragments.nominate", this);
    this.getView().addDependent(this.loginDialog);
    this.loginDialog.addStyleClass("sapUiSizeCompact");
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.TaskManagement
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.TaskManagement
*/
//	onAfterRendering: function() {
//
//	},

nominate: function(oEvent)
{
this.loginDialog.open();
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