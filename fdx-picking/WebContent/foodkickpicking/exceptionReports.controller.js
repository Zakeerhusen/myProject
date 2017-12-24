sap.ui.controller("foodkickpicking.exceptionReports", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.exceptionReports
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		var view = this.getView();
		var inputScanCO = that.getView().byId("inputScanCheckout");
		setTimeout(function(){
				inputScanCO.setValue("");
				inputScanCO.focus();
				}, 1200);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "exceptionReports") {

				currentView = oEvent.getParameter("name");
				
				var oDialog = that.getView().byId("BusyDialog");
				oDialog.open();
				
				inputScanCO.onsapenter=(function(oEvent) {
					sap.m.InputBase.prototype.onsapenter.apply(inputScanCO,arguments);
					var input=inputScanCO.getValue();
					that.scanCheckout(input);
				}).bind(that);
				
//				orderNum = oOrderJsonModel.getData().model.SalesOrder;

				var strUrl =server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
				var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
				
					oModel.read("OrdHeaderSet('"+orderNum+"')/OrderPickTasks?$filter=Zexception ne ' '", null, null, true, function(oData){
						var materials = oData;
						
						if(materials.results.length>0){
							for(i in materials.results ){
								var currentMat = materials.results[i];
								var val = currentMat.Items.split(".");
								var val2 = currentMat.Picqty.split(".");
								if(parseInt(val[1])==0){
									currentMat.Items=val[0];
								}
								if(parseInt(val2[1])==0){
									currentMat.Picqty=val2[0];
								}
							}
						
						pickQuantity = materials.results[0].Picqty;
						weightIndicator = materials.results[0].Wind;
						oExceptionJsonModel.setData(materials);
						oDialog.close();
						}
					}, function(oError){
						oDialog.close();
						jQuery.sap.require("sap.m.MessageBox");
						
						if(oError.response.statusCode=="500"){
							sound.play();
							sap.m.MessageBox.error("Internal System Error");
						}else{
							sound.play();
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
						}
					});
			}
		});
		
		
		this.getView().byId("idExcepReports").setModel(oExceptionJsonModel);
		this.getView().byId("totalQty").setModel(oExceptionJsonModel);
		this.getView().byId("totalQty").bindContext("/results/0");
	},

	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.exceptionReports
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.exceptionReports
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.exceptionReports
*/
//	onExit: function() {
//
//	},
	displayPendingItemDetail : function(oEvent){
		var oDialog = this.getView().byId("BusyDialog");
		oDialog.open();
		
		var index =  oEvent.getSource().getBindingContext().getPath().split("/")[2];
		this.oRouter.myNavBack("exceptionReports2",{
			contextPath : index
		});
		oDialog.close();
	},
	
	scanCheckout : function(input){

//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		var that = this;
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
		oModel = that.getView().getModel();
		oModel.update("/OrdHeaderSet('"+orderNum+"')", dataObj, null,
		          function(oData){
		         	console.log("update success");
		         	var inputCO = that.getView().byId("inputScanCheckout");
					setTimeout(function(){
							inputCO.setValue("");
							inputCO.focus();
							}, 600);
				
		         	that.oRouter.myNavBack("requestOrder");
		         	var emptyObj={reports:[]};
		         	oExceptionJsonModel.setData(emptyObj);
		},
		         function(oError){

						jQuery.sap.require("sap.m.MessageBox");
						 if(oError.response.statusCode=="500"){
							sound.play();
							sap.m.MessageBox.error("Internal System Error",{
								onClose : function(oAction){
								var inputCO = that.getView().byId("inputScanCheckout");
								setTimeout(function(){
										inputCO.setValue("");
										inputCO.focus();
										}, 600);
							}
						});
						}else{
							sound.play();
							if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
								sap.m.MessageBox.error("Invalid Scan",{
							          onClose: function(oAction) { 
									var inputCO = that.getView().byId("inputScanCheckout");
									setTimeout(function(){
											inputCO.setValue("");
											inputCO.focus();
											}, 600);
							          }
							      });
							}else{
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
								onClose : function(oAction){
								var inputCO = that.getView().byId("inputScanCheckout");
								setTimeout(function(){
										inputCO.setValue("");
										inputCO.focus();
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