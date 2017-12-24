sap.ui.controller("foodkickpicking.loginToFR1", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.loginToFR1
*/
	onInit: function() {
	
		
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		
		var userName = that.getView().byId("userName");
		setTimeout(function(){
			userName.focus();
		      }, 1200);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "loginToFR1") {
			
			currentView = oEvent.getParameter("name");
			
			
			var password =  that.getView().byId("password");
			
			userName.onsapenter=(function(oEvent) {
				sap.m.InputBase.prototype.onsapenter.apply(userName,arguments);
				setTimeout(function(){
					password.focus();
				      }, 1200);	
			}).bind(that);
			
			password.onsapenter=(function(oEvent) {
				sap.m.InputBase.prototype.onsapenter.apply(password,arguments);
				var pwd=password.getValue();
				that.loginToAbap(pwd);
			}).bind(that);
			
		}
		});
	},
		
		loginToAbap : function(pwd){
		
		
//			var oView = sap.ui.getCore().byId("app");
			var userName =  this.getView().byId("userName");
			var password = this.getView().byId("password");
			var oDialog = this.getView().byId("BusyDialog");
			oDialog.open();
			var strUrl = server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
		    var oModel = new sap.ui.model.odata.ODataModel(strUrl,true,userName.getValue(),pwd);
//		    parentApp.setModel(oModel);
		    var that= this;
		    oModel.attachMetadataFailed(null,function(oEvent){
		    	oDialog.close();
		    	oModel.destroy();
		    	sound.play();
		    	jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error("Login Authentication Failed",{
							onClose : function(){
						userName.setValue("");
						password.setValue("");
						setTimeout(function(){
							userName.focus();
					}, 1200);
					}
					});
		    },null);
		    
		    oModel.attachMetadataLoaded(null,function(oEvent){
		    	parentApp.setModel(oModel);
		    	oDialog.close();
		    //	oModel.destroy();
				that.oRouter.navTo("login");
		    },null);
		    
		 
		}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.loginToFR1
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.loginToFR1
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.loginToFR1
*/
//	onExit: function() {
//
//	}

});