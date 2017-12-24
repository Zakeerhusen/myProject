sap.ui.controller("fullscreenapp.loginPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf testbed.loginPage
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf testbed.loginPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf testbed.loginPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf testbed.loginPage
*/
//	onExit: function() {
//
//	}
	onLogin:function(oEvent){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
//		var userId = that.getView().byId("userId").getValue();
//		var password = that.getView().byId("password").getValue();
//		var oModel = this.getView().getModel('myOdataModel');
//		oModel.read("UserdetSet(Username='"+userId+"',Password='"+password+"')/?$expand=UserRepBut,UserRep",null,null,true,
//				function(oData, oResponse) {
//					console.log("Succesfully logged in");
//					that.getView().getModel('deafultstoreModel').setData(oData);
//					that.getView().getModel('logUserJson').setData(oData);
					oRouter.navTo('overview2',{});
//					var item = {
//							Werks:oData.Store,
//							Name1:oData.StoreName
//					};
//					that.getView().getModel('storejsonModel').getData().push(item);
//					that.getView().getModel('storejsonModel').refresh();
//					that.getView().getModel('jsonModel2').setProperty('/selectedStore',oData.Store);
//					that.getView().getModel('jsonModel2').refresh();
//				},
//				function(oError) {
////					sound.play();
//					jQuery.sap.require("sap.m.MessageBox");
//					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
//					setTimeout(function(){
//						$(document.activeElement).blur();
//						},150);
//					that.onOrderList();
//				}
//		);	
	}

});