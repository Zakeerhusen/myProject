sap.ui.controller("foodkickpicking.scanCheckout", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.scanCheckout
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		var view = this.getView();
		var inputCOScan = that.getView().byId("inputScanCheckout");
		setTimeout(function(){
			inputCOScan.setValue("");
			inputCOScan.focus();
				}, 1200);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "scanCheckout") {
				//by rahul
					that.getView().byId('idLogOutButtonCheckOut').setVisible(false);
				//by rahul
				var oDialog = that.getView().byId("BusyDialog");
				oDialog.open();
				
				currentView = oEvent.getParameter("name");
				inputCOScan.onsapenter=(function(oEvent) {
					sap.m.InputBase.prototype.onsapenter.apply(inputCOScan,arguments);
					var input=inputCOScan.getValue();
					that.scanCheckout(input);
				}).bind(that);
				
//				orderNum = oOrderJsonModel.getData().model.SalesOrder;
				var strUrl =server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/"
					var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
				
//					oModel.read("OrdHeaderSet('0022733785')", null, null, true, function(oData){
						oModel.read("OrdHeaderSet('"+orderNum+"')", null, null, true, function(oData){

						oReportJsonModel.setData(oData);
						oDialog.close();
						that.getView().byId('idLogOutButtonCheckOut').setVisible(true);

					}, function(oError){
						oDialog.close();
						that.getView().byId('idLogOutButtonCheckOut').setVisible(true);
						jQuery.sap.require("sap.m.MessageBox");
						
						if(oError.response.statusCode=="500"){
							sound.play();
							sap.m.MessageBox.error("Invalid Request");
						}else{
							sound.play();
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
						}
					});
						
						that.getView().setModel(oModel);
			}
		});
	},
	
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.scanCheckout
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.scanCheckout
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.scanCheckout
*/
//	onExit: function() {
//
//	}
	
	
	scanCheckout : function(input){

//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		var that = this;
//		var inputCheckout = this.getView().byId("inputScanCheckout").getValue();
		var dataObj=oReportJsonModel.getData();
		if(input==""){
			jQuery.sap.require("sap.m.MessageBox");
			sound.play();
			sap.m.MessageBox.error("Checkout Station value cannot be empty ",{
				onClose : function(oAction){
				var inputCOScan = that.getView().byId("inputScanCheckout");
				setTimeout(function(){
					inputCOScan.setValue("");
					inputCOScan.focus();
						}, 600);
			}
			});
		}else{
		dataObj.ZcheckStation=input;
//		dataObj.Ztote="T121213";		
		oModel = that.getView().getModel();
		oModel.update("/OrdHeaderSet('"+orderNum+"')", dataObj, null,
		          function(oData){
			that.getView().byId("inputScanCheckout").setValue("");
		         	console.log("update success");
		         	that.oRouter.myNavBack("requestOrder");
		},
		         function(oError){
			that.getView().byId("inputScanCheckout").setValue("");
						jQuery.sap.require("sap.m.MessageBox");
						 if(oError.response.statusCode=="500"){
							sound.play();
							sap.m.MessageBox.error("Internal System Error",{
								onClose : function(oAction){
								var inputCOScan = that.getView().byId("inputScanCheckout");
								setTimeout(function(){
									inputCOScan.setValue("");
									inputCOScan.focus();
										}, 600);
							}
							});
						}else{
							sound.play();
							if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
								sap.m.MessageBox.error("Invalid Scan",{
							          onClose: function(oAction) { 
									var inputCOScan = that.getView().byId("inputScanCheckout");
									setTimeout(function(){
										inputCOScan.setValue("");
										inputCOScan.focus();
											}, 600);
							          }
							      });
							}else{
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
								onClose : function(oAction){
								var inputCOScan = that.getView().byId("inputScanCheckout");
								setTimeout(function(){
									inputCOScan.setValue("");
									inputCOScan.focus();
										}, 600);
							}
							});
							}
						}
					});
		}
	},
	
	logout : function(){
		var router = this.oRouter;
		sap.ui.controller("foodkickpicking.requestOrder").logout(router);
	}

});