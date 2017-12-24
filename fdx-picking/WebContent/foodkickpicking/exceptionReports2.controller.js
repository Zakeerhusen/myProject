sap.ui.controller("foodkickpicking.exceptionReports2", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.exceptionReports2
*/
	index : "",
	onInit: function() {
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	var that = this;
	var view = this.getView();

	var inputPendingScan = that.getView().byId("scanPendingBC");
	inputPendingScan.setValue("");
	setTimeout(function(){
			inputPendingScan.focus();
			}, 1200);
	
	this.getView().byId("uNameinDetailsPage").setModel(oLoginJsonModel);
	this.getView().byId("uNameinDetailsPage").bindContext("/");
	
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "exceptionReports2") {

			//clearing the flag -- that.requestSent = false; -> so that all new requests are sent.

			that.requestSent = false;// signifies no request are sent at this moment.
			currentView = oEvent.getParameter("name");
			
			var oDialog = that.getView().byId("BusyDialog");
			oDialog.open();
			
			inputPendingScan.onsapenter=(function(oEvent) {
				sap.m.InputBase.prototype.onsapenter.apply(inputPendingScan,arguments);
				var input=inputPendingScan.getValue();
				that.scanPendingMaterial(input);
			}).bind(that);
			
			// consuming the service for batch picking confirmation
			var imDate = new Date().toSqlFormat();
			var urlString = server+"sap/opu/odata/SAP/ZFK_REPORTS_SRV/";
			var batchPickModel = new sap.ui.model.odata.ODataModel(urlString,true);
			
			batchPickModel.read("/RepdefSet(ImDate=datetime'"+imDate+"')", null,null, true, function(oData){
				batchPick = oData.BatchPick;
			}, function(oError){
				oDialog.close();
				var inputScanBC = that.getView().byId("scanInput");

				jQuery.sap.require("sap.m.MessageBox");
				if(oError.response.statusCode=="500"){
					sound.play();
					sap.m.MessageBox.error("Internal System Error",{
						onClose : function(oAction){
							setTimeout(function(){
								inputScanBC.setValue("");
								inputScanBC.focus();
							      }, 400);
						}
					});
				}else{
					sound.play();
					if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
						sap.m.MessageBox.error("Invalid Scan",{
					          onClose: function(oAction) { 
							setTimeout(function(){
								inputScanBC.setValue("");
								inputScanBC.focus();
							      }, 400);
					          }
					      });
					}else{
					sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
						onClose : function(oAction){
							setTimeout(function(){
								inputScanBC.setValue("");
								inputScanBC.focus();
							      }, 400);
						}
					});
					}
				}
			});
			
			that.getView().byId("tolValues").setVisible(false);
			
			var materials = oExceptionJsonModel.getData();
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
			oExceptionJsonModel.setData(materials);
									
			var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
			that.getView().byId("pendingMatGrid").setModel(oExceptionJsonModel);
			that.getView().byId("pendingMatGrid").bindContext("/results"+context.getPath());
			
			that.getView().byId("detailsToolBar").setModel(oExceptionJsonModel);
			that.getView().byId("detailsToolBar").bindContext("/results"+context.getPath());
			that.index = context.getPath();
			
			var material = oExceptionJsonModel.getData().results[that.index.split("/")[1]]
			pickQuantity = material.Picqty;
			weightIndicator = material.Wind;
			
			if(oExceptionJsonModel.getData().results[that.index.split("/")[1]].Buom=="LB"){
				that.getView().byId("tolValues").setVisible(true);
			}
			if(parseInt(materials.results[0].Pph)<parseInt(pphThreshold)){
				that.getView().byId("pphValue").addStyleClass("pphValueRed");
			}else{
				that.getView().byId("pphValue").addStyleClass("pphValueGreen");
			}
			if(weightIndicator=="2"||weightIndicator=="3"||batchPick=="X"){
				that.getView().byId("incDecOpPlus2").setVisible(true);
				that.getView().byId("incDecOpMinus2").setVisible(true);
			}else{
				that.getView().byId("incDecOpPlus2").setVisible(false);
				that.getView().byId("incDecOpMinus2").setVisible(false);	
			}
			if(weightIndicator!="3"){
				
				that.getView().byId("scaleImageP").setVisible(false);
			}
			if(weightIndicator=="2"){
				that.getView().byId("scanPendingBC").setPlaceholder("Scan Confirm Barcode");	
			}else if(weightIndicator=="1"){
				that.getView().byId("scanPendingBC").setPlaceholder("Scan Product Barcode");	
			}else if(weightIndicator=="3"){
				that.getView().byId("scanPendingBC").setPlaceholder("Scan Weight Barcode");
			}
			oDialog.close();
		}
	});
	},
	
	navBack : function(){
//		this.readPendingMaterial();
		this.oRouter.myNavBack("exceptionReports");
	},

	readPendingMaterial : function(material,index){
		var oDialog = this.getView().byId("BusyDialog");
		oDialog.open();
//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		var that = this;
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
				oExceptionJsonModel.setData(materials);
				
				if(!jQuery.isEmptyObject(materials.results[index])&&(material.Sku==materials.results[index].Sku)){
					that.getView().byId("pendingMatGrid").bindContext("/results/"+index);
					that.getView().byId("detailsToolBar").bindContext("/results/"+index);
					
					var inputPendingScan = that.getView().byId("scanPendingBC");
					inputPendingScan.setValue("");
					setTimeout(function(){
							inputPendingScan.focus();
							}, 1200);
				}else{
					that.oRouter.myNavBack("exceptionReports");
				}
				}else{
					that.oRouter.myNavBack("scanCheckout");
				}
				oDialog.close();
			}, function(oError){
				oDialog.close();
				jQuery.sap.require("sap.m.MessageBox");
				if(oError.response.statusCode=="500"){
					sound.play();
					sap.m.MessageBox.error("Internal System Error",{
						onClose : function(oAction){
							var inputPendingScan = that.getView().byId("scanPendingBC");
							setTimeout(function(){
									inputPendingScan.setValue("");
									inputPendingScan.focus();
									}, 600);
						}
					});
				}else{
					sound.play();
					sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
						onClose : function(oAction){
							var inputPendingScan = that.getView().byId("scanPendingBC");
							setTimeout(function(){
									inputPendingScan.setValue("");
									inputPendingScan.focus();
									}, 600);
						}
					});
				}
			});

	},
	
	scanPendingMaterial: function(input){

		var index = this.index.split("/")[1];
//		var inputBC = oEvent.getSource().getValue();
		
		//get the material obj
		var material = oExceptionJsonModel.getData().results[index];
//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		var deliverNum = oOrderJsonModel.getData().model.DeliveryNo;
		var skuNum = material.Sku;
		
		material.Upc=input;
		material.Exceptionpick="X";
		material.Zexception="";
		var that = this;
		oModel = that.getView().getModel();
		if(this.requestSent){
			//console.log('another req in process.. Wait..');
			sap.m.MessageToast.show("Request is in progress. Kindly wait...",{})
			return;
		}
		this.requestSent = true;

		oModel.update("/OrdPicktasksSet(IOrder='"+orderNum+"',DelNum='"+deliverNum+"',Sku='"+skuNum+"')", material, null,
		          function(oData){
		         	console.log("update success");
		         	
		         	that.readPendingMaterial(material,index);
		         	that.requestSent = false;
		},
		         function(oError){

						jQuery.sap.require("sap.m.MessageBox");
						if(oError.response.statusCode=="500"){

							sap.m.MessageBox.error("Internal System Error",{
								onClose : function(oAction){
								that.requestSent = false;
									var inputPendingScan = that.getView().byId("scanPendingBC");
									setTimeout(function(){
											inputPendingScan.setValue("");
											inputPendingScan.focus();
											}, 600);
								}
							});
							sound.play();
						}else{

							if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
								sap.m.MessageBox.error("Invalid Scan",{
							          onClose: function(oAction) {
							          that.requestSent = false;
									var inputPendingScan = that.getView().byId("scanPendingBC");
									setTimeout(function(){
											inputPendingScan.setValue("");
											inputPendingScan.focus();
											}, 600);
							          }
							      });
							      sound.play();
							}else{
							sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
								onClose : function(oAction){
								that.requestSent = false;
									var inputPendingScan = that.getView().byId("scanPendingBC");
									setTimeout(function(){
											inputPendingScan.setValue("");
											inputPendingScan.focus();
											}, 600);
								}
							});
							}
						}
					});

	},
	
	incValue : function(){
		var that = this;
		var text = this.getView().byId("itemCount");
		var value = parseInt(text.getText());
		if((weightIndicator==3&&value>=1)||(value<pickQuantity&&value>=1)){
		value++;
		}
		text.setText(value.toString());
		
		var inputPendingScan = that.getView().byId("scanPendingBC");
		inputPendingScan.setValue("");
		setTimeout(function(){
				inputPendingScan.focus();
				}, 1200);
	},
	
	decValue : function(){
		var that = this;
		var text = this.getView().byId("itemCount");
		var value = parseInt(text.getText());
		if((weightIndicator==3&&value>1)||value<=pickQuantity&&value>1){
		value--;
		}
		text.setText(value.toString());
		
		var inputPendingScan = that.getView().byId("scanPendingBC");
		inputPendingScan.setValue("");
		setTimeout(function(){
				inputPendingScan.focus();
				}, 1200);
		
	},
	logout : function(){
		var router = this.oRouter;
		sap.ui.controller("foodkickpicking.requestOrder").logout(router);
	}


/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.exceptionReports2
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.exceptionReports2
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.exceptionReports2
*/
//	onExit: function() {
//
//	}

});