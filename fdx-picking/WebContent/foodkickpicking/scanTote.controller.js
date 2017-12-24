sap.ui.controller("foodkickpicking.scanTote", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.scanTote
*/
	onInit: function() {

		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		var view = this.getView();
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "scanTote") {
				currentView = oEvent.getParameter("name");
				var inputScanTote = that.getView().byId("scanToteInput");

				inputScanTote.setValue("");
				setTimeout(function(){
					inputScanTote.focus();
				      }, 1200);
				inputScanTote.onsapenter=(function(oEvent) {
					sap.m.InputBase.prototype.onsapenter.apply(inputScanTote,arguments);
					var input=inputScanTote.getValue();
					that.navToDisplayView(input);
				}).bind(that);
				
				
				/*orderNum = oOrderJsonModel.getData().model.SalesOrder;*/

				var strUrl =server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
				var oOrderoDataModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
				
				var empId =  oLoginJsonModel.getData().Zempid;
				var plant = oLoginJsonModel.getData().Werks;
				var delDate = new Date().toSqlFormat();
				console.log(delDate);
				
				oOrderoDataModel.read("OrdHeaderToteSet(Zempid='"+empId+"',IpAddr='1.1.1.1',DelDate=datetime'"+delDate+"',Plant='"+plant+"')", null, null, true, function(oData){
					oData.DelDate=oData.DelDate.toMmDdYyyy();
					oOrderJsonModel.setData({"model":oData});
					
					//var jsonModel = oOrderJsonModel.getData();
					//oOrderJsonModel.setData({"model":jsonModel});
					
					that.getView().byId("orderDet").setModel(oOrderJsonModel);
					that.getView().byId("orderDet").bindContext("/model");
				}, function(oError){
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					 if(oError.response.statusCode=="500"){
						sap.m.MessageBox.error("Internal System Error");
					}else{
						sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
					}
				});
				
			
				
				var strUrl =server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
				var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
				
					oModel.read("/OrdHeaderSet('"+orderNum+"')", null, null, true, function(oData){

						oReportJsonModel.setData(oData);
						that.getView().byId("toteId").setVisible(false);
						if(oReportJsonModel.getData().Ztote!=""){
						that.getView().byId("toteId").setVisible(true);
						that.getView().byId("toteId").setModel(oReportJsonModel);
						that.getView().byId("toteId").bindContext("/");
						}
//						that.onAfterRendering();
					}, function(oError){
						jQuery.sap.require("sap.m.MessageBox");
						 if(oError.response.statusCode=="500"){
							sap.m.MessageBox.error("Internal System Error");
						}else{
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
						}
//						inputScanTote.focus();
					});
				
			}
		});
	
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.scanTote
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.scanTote
*/
//	onAfterRendering: function() {
//		
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.scanTote
*/
//	onExit: function() {
//
//	}
	
	navBack : function (){
		this.oRouter.myNavBack("requestOrder",null);
	},
	
	navToDisplayView : function(input){
		var oDialog = this.getView().byId("BusyDialog");
		oDialog.open();

		var that = this;
//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		
		var strUrl =server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
		var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
		
		oModel.read("/OrdHeaderSet('"+orderNum+"')", null, null, true, function(oData){

				oReportJsonModel.setData(oData);
//				that.getView().byId("scanToteInput").setValue("");

				if(oReportJsonModel.getData().Status==7){
				that.oRouter.myNavBack("scanCheckout");
				}else if(oReportJsonModel.getData().Status==8){
				that.oRouter.myNavBack("exceptionReports");	
				}else{
				that.getView().getController().updateTote(input);
				}
				that.getView().byId("BusyDialog").close()
			}, function(oError){
				that.getView().byId("BusyDialog").close();
				jQuery.sap.require("sap.m.MessageBox");
				if(oError.response.statusCode=="500"){
					sound.play();
					sap.m.MessageBox.error("Internal System Error",{
				          onClose: function(oAction) { 
				        	  var inputTote = that.getView().byId("scanToteInput");

				        	  inputTote.setValue("");
								setTimeout(function(){
										inputTote.focus();
								}, 400);
				          }
				      });
				}else{
					sound.play();
					if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
						sap.m.MessageBox.error("Invalid Scan",{
					          onClose: function(oAction) { 
							var inputTote = that.getView().byId("scanToteInput");

				        	  inputTote.setValue("");
								setTimeout(function(){
										inputTote.focus();
								}, 400);
					          }
					      });
					}else{
					sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
				          onClose: function(oAction) { 
			        	  var inputTote = that.getView().byId("scanToteInput");

			        	  inputTote.setValue("");
							setTimeout(function(){
									inputTote.focus();
							}, 400);
			          }
			      });
				}
				}
			});
		

	},
	
	updateTote : function(input){
//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		var that =this;
//		var inputScanTote = this.getView().byId("scanToteInput").getValue();
		var dataObj=oReportJsonModel.getData();
		dataObj.Ztote = input;
		oModel = that.getView().getModel();
		oModel.update("/OrdHeaderSet('"+orderNum+"')", dataObj, null,
		          function(oData){
		         	console.log("update success");
		         	that.oRouter.myNavBack("displayOrder");
		         	that.getView().byId("BusyDialog").close();
		},
		         function(oError){
			that.getView().byId("BusyDialog").close();
						jQuery.sap.require("sap.m.MessageBox");
						if(oError.response.statusCode=="500"){
							sound.play();
							sap.m.MessageBox.error("Internal System Error",{
						          onClose: function(oAction) { 
					        	  var inputTote = that.getView().byId("scanToteInput");

					        	  inputTote.setValue("");
									setTimeout(function(){
											inputTote.focus();
									}, 400);
					          }
					      });
						}else{
							sound.play();
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
						          onClose: function(oAction) { 
					        	  var inputTote = that.getView().byId("scanToteInput");

					        	  inputTote.setValue("");
									setTimeout(function(){
											inputTote.focus();
									}, 400);
					          }
					      });
						}
					});
	},
	
	logout : function(){
	var router = this.oRouter;
	sap.ui.controller("foodkickpicking.requestOrder").logout(router);
	}
});