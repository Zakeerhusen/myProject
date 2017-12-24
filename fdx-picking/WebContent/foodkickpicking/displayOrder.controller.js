sap.ui.controller("foodkickpicking.displayOrder", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.displayOrder
*/
	onInit: function() {

		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		that.getView().byId("tolValues").setVisible(false);

		var inputScanBC = that.getView().byId("scanInput");
		setTimeout(function(){
			inputScanBC.setValue("");
			inputScanBC.focus();
		      }, 1200);
		
		this.getView().byId("uNameinDetailsPage").setModel(oLoginJsonModel);
		this.getView().byId("uNameinDetailsPage").bindContext("/");
		
		/*if(exceptionIndicator==1){
		this.getView().byId("matGrid").setBusy(true);
		}*/
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "displayOrder") {

				currentView = oEvent.getParameter("name");
				
				var oDialog = that.getView().byId("BusyDialog");
				oDialog.open();

				inputScanBC.onsapenter=(function(oEvent) {
					sap.m.InputBase.prototype.onsapenter.apply(inputScanBC,arguments);
					var input=inputScanBC.getValue();
					that.scanInputValue(input);
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
				
				
				//consuming the service to display the materials
//				orderNum = oOrderJsonModel.getData().model.SalesOrder;
				var strUrl = server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
				var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
				
				oModel.read("/OrdHeaderSet('"+orderNum+"')/?$expand=OrderPickTasks", null, null, true, function(oData){

					var materials = oData.OrderPickTasks;
					if(materials.results.length>0){
					for(i in materials.results ){
						var material = materials.results[i];
						
						var val = material.Items.split(".");
						var val2 = material.Picqty.split(".");
						if(parseInt(val[1])==0){
						material.Items=val[0];
						}
						if(parseInt(val2[1])==0){
						material.Picqty=val2[0];
						}
					}
					pickQuantity = materials.results[0].Picqty;
					weightIndicator = materials.results[0].Wind;
					
					if(materials.results[0].Buom=="LB"){
						that.getView().byId("tolValues").setVisible(true);
					}
					if(parseInt(materials.results[0].Pph)<parseInt(pphThreshold)){
						that.getView().byId("pphValue").addStyleClass("pphValueRed");
					}else{
						that.getView().byId("pphValue").addStyleClass("pphValueGreen");
					}
					if(weightIndicator=="2"||weightIndicator=="3"||batchPick=="X"){
						that.getView().byId("incDecOpPlus").setVisible(true);
						that.getView().byId("incDecOpMinus").setVisible(true);
					}else{
						that.getView().byId("incDecOpPlus").setVisible(false);
						that.getView().byId("incDecOpMinus").setVisible(false);
					}
					if(materials.results[0].Picklocscan==""){
						that.getView().byId("scanInput").setPlaceholder("Scan Location");
						that.getView().byId("exceptionBtn").setVisible(false);
					}else{
					that.getView().byId("exceptionBtn").setVisible(true);
					if(weightIndicator=="2"){
						that.getView().byId("scanInput").setPlaceholder("Scan Confirm Barcode");	
					}else if(weightIndicator=="1"){
						that.getView().byId("scanInput").setPlaceholder("Scan Product Barcode");	
					}else if(weightIndicator=="3"){
						that.getView().byId("scanInput").setPlaceholder("Scan Weight Barcode");
					}
					}
					oDetailJsonModel.setData(materials);
					}
					if(weightIndicator!="3"){
						that.getView().byId("scaleImage").setVisible(false);
					}
					
					
					
					if(!jQuery.isEmptyObject(materials.results[0])&&materials.results[0].Zexception!=""){
						that.oRouter.myNavBack("exceptionReports");
					}else if(!jQuery.isEmptyObject(materials.results[0])&&materials.results[0].Zexception==""){
						that.getView().byId("matGrid").bindContext("/results/0");
						that.getView().byId("detailsToolBar").bindContext("/results/0");
						
					}else{
						that.oRouter.myNavBack("scanCheckout");	
					}
					oDialog.close();
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
				that.getView().byId("matGrid").setModel(oDetailJsonModel);
				that.getView().byId("detailsToolBar").setModel(oDetailJsonModel);
			}
		});
		
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.displayOrder
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.displayOrder
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.displayOrder
*/
	onExit: function() {
		if (this._oDialog) {
		      this._oDialog.destroy();
		    }
	},
	
	markException : function(oEvent) {
		
		exceptionIndicator=1;
		this.getView().byId("matGrid").setBusy(true);
		this.getView().byId("busyCloseBtn").setVisible(true);
		this.getView().byId("exceptionBtn").setVisible(false);
		this.getView().byId("exceptionTypes").setVisible(true);
		this.getView().byId("displayLogout").setVisible(false);
	},
	  
	markExceptionForItem :function(oEvent){
		var oButton = oEvent.getSource();
		//getting the current material object
		var that = this;
		var material = oDetailJsonModel.getData().results[0];
		
		var inputBC = this.getView().byId("scanInput").getValue();
		
		material.Upc = inputBC;
		material.Zexception = oButton.getText().substring(0,1);
		pickQuantity = material.Picqty;
		weightIndicator = material.Wind;

		 this.updateMaterial(material);
		
		//load next data once the update is done
		
			if(status=="success"){
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert("Item marked : "+oButton.getText(),{
				onClose :function(oAction){
					var inputScanBC = that.getView().byId("scanInput");
					setTimeout(function(){
							inputScanBC.setValue("");
							inputScanBC.focus();
							}, 600);
					that.getView().byId("matGrid").setBusy(false);
					that.getView().byId("busyCloseBtn").setVisible(false);
					that.getView().byId("displayLogout").setVisible(true);

				}
			});	
			this.readMaterial();
			this.getView().byId("exceptionBtn").setVisible(true);
			this.getView().byId("exceptionTypes").setVisible(false);
			var inputScanBC = that.getView().byId("scanInput");
			setTimeout(function(){
					inputScanBC.setValue("");
					inputScanBC.focus();
					}, 400);
			}else{
				var inputScanBC = that.getView().byId("scanInput");
				setTimeout(function(){
						inputScanBC.setValue("");
						inputScanBC.focus();
						}, 600);
				that.getView().byId("matGrid").setBusy(false);
				that.getView().byId("busyCloseBtn").setVisible(false);
				that.getView().byId("displayLogout").setVisible(true);

			}
	},
		
		
	scanInputValue : function(input){

		var that = this;
		
		var material = oDetailJsonModel.getData().results[0];
//		orderNum = oOrderJsonModel.getData().model.SalesOrder;
		
//		var input = this.getView().byId("scanInput").getValue();
		if(material.Picklocscan==""){
			material.Picklocscan = input;
			that.updateMaterial(material);
			if(status=="success"){
				material.Picklocscan = input;
				that.getView().byId("exceptionBtn").setVisible(true);
				if(weightIndicator=="2"){
					that.getView().byId("scanInput").setPlaceholder("Scan Confirm Barcode");	
				}else if(weightIndicator=="1"){
					that.getView().byId("scanInput").setPlaceholder("Scan Product Barcode");	
				}else if(weightIndicator=="3"){
					that.getView().byId("scanInput").setPlaceholder("Scan Weight Barcode");
				}
				var inputScanBC = that.getView().byId("scanInput");
				setTimeout(function(){
						inputScanBC.setValue("");
						inputScanBC.focus();
						}, 400);
			}else{
				that.readMaterial();
				var inputScanBC = that.getView().byId("scanInput");
				setTimeout(function(){
						inputScanBC.setValue("");
						inputScanBC.focus();
						}, 400);
			}
		}else {
		
			material.Upc = input;
			material.Picqty=this.getView().byId("itemCount").getText();
			pickQuantity = material.Picqty;
			weightIndicator = material.Wind;
			
			that.updateMaterial(material);
			if(status=="success"){
			that.readMaterial();
			var inputScanBC = that.getView().byId("scanInput");
			setTimeout(function(){
					inputScanBC.setValue("");
					inputScanBC.focus();
					}, 1000);
			}else{
				var inputScanBC = that.getView().byId("scanInput");
				setTimeout(function(){
						inputScanBC.setValue("");
						inputScanBC.focus();
						}, 1000);
			}
		}
		
	},	
	updateMaterial : function(material){
			console.log("entered update")
//			orderNum = oOrderJsonModel.getData().model.SalesOrder;
			var deliverNum = oOrderJsonModel.getData().model.DeliveryNo;
			var skuNum = material.Sku;
			
			var that = this;
			oModel = that.getView().getModel();
			oModel.update("/OrdPicktasksSet(IOrder='"+orderNum+"',DelNum='"+deliverNum+"',Sku='"+skuNum+"')", material, null,
			          function(oData){
						that.getView().byId("scanInput").setValue("");
						status="success";
						console.log("update success display");
			},
			         function(oError){
				that.getView().byId("scanInput").setValue("");
				status="error";
							jQuery.sap.require("sap.m.MessageBox");
							 if(oError.response.statusCode=="500"){
								sound.play();
								sap.m.MessageBox.error("Internal System Error",{
									onClose :function(oAction){
										var inputScanBC = that.getView().byId("scanInput");
										setTimeout(function(){
												inputScanBC.setValue("");
												inputScanBC.focus();
												}, 600);
									}
								});	
							}else{
								sound.play();
								if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
									sap.m.MessageBox.error("Invalid Scan",{
								          onClose: function(oAction) { 
										var inputScanBC = that.getView().byId("scanInput");
										setTimeout(function(){
												inputScanBC.setValue("");
												inputScanBC.focus();
												}, 600);
								          }
								      });
								}else{
								sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
									onClose :function(oAction){
										var inputScanBC = that.getView().byId("scanInput");
										setTimeout(function(){
												inputScanBC.setValue("");
												inputScanBC.focus();
												}, 600);
									}
								});	
								}
							}
							
						});
		},
		
	readMaterial: function(){
			console.log("entered read")
//			orderNum = oOrderJsonModel.getData().model.SalesOrder;
			var that= this;
			
			var strUrl = server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
			var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
			oModel.read("/OrdHeaderSet('"+orderNum+"')/?$expand=OrderPickTasks", null, null, true, function(oData){
				var materials = oData.OrderPickTasks;
				if(materials.results.length>0){
					console.log("enter1");
				for(i in materials.results ){
					console.log("enter2");
					var material = materials.results[i];
					var val = material.Items.split(".");
					var val2 = material.Picqty.split(".");
					if(parseInt(val[1])==0){
					material.Items=val[0];
					}
					if(parseInt(val2[1])==0){
					material.Picqty=val2[0];
					}
				}
				pickQuantity = materials.results[0].Picqty;
				weightIndicator = materials.results[0].Wind;
				that.getView().byId("tolValues").setVisible(false);
				if(materials.results[0].Buom=="LB"){
					that.getView().byId("tolValues").setVisible(true);
				}
				if(parseInt(materials.results[0].Pph)<parseInt(pphThreshold)){
					that.getView().byId("pphValue").addStyleClass("pphValueRed");
				}else{
					that.getView().byId("pphValue").addStyleClass("pphValueGreen");
				}
				if(weightIndicator=="2"||weightIndicator=="3"||batchPick=="X"){
					that.getView().byId("incDecOpPlus").setVisible(true);
					that.getView().byId("incDecOpMinus").setVisible(true);
				}else{
					that.getView().byId("incDecOpPlus").setVisible(false);
					that.getView().byId("incDecOpMinus").setVisible(false);	
				}
				if(materials.results[0].Picklocscan==""){
					that.getView().byId("scanInput").setPlaceholder("Scan Location");
					that.getView().byId("exceptionBtn").setVisible(false);
				}else{
					that.getView().byId("exceptionBtn").setVisible(true);
				if(weightIndicator=="2"){
					that.getView().byId("scanInput").setPlaceholder("Scan Confirm Barcode");	
				}else if(weightIndicator=="1"){
					that.getView().byId("scanInput").setPlaceholder("Scan Product Barcode");	
				}else if(weightIndicator=="3"){
					that.getView().byId("scanInput").setPlaceholder("Scan Weight Barcode");
				}
				}
				oDetailJsonModel.setData(materials);
				oDetailJsonModel.refresh();
				}
				that.getView().byId("scaleImage").setVisible(true);
				
				if(weightIndicator!="3"){
					that.getView().byId("scaleImage").setVisible(false);
				}
				
				if(!jQuery.isEmptyObject(materials.results[0])&&materials.results[0].Zexception!=""){
					that.oRouter.myNavBack("exceptionReports");
				}else if(!jQuery.isEmptyObject(materials.results[0])&&materials.results[0].Zexception==""){
					
					that.getView().byId("matGrid").bindContext("/results/0");
					that.getView().byId("detailsToolBar").bindContext("/results/0");
				}else{
					that.oRouter.myNavBack("scanCheckout");	
				}
			}, function(oError){
				jQuery.sap.require("sap.m.MessageBox");
				 if(oError.response.statusCode=="500"){
					sound.play();
					sap.m.MessageBox.error("Internal System Error",{
						onClose :function(oAction){
							var inputScanBC = that.getView().byId("scanInput");
							setTimeout(function(){
									inputScanBC.setValue("");
									inputScanBC.focus();
									}, 600);
						}
					});	
				}else{
					sound.play();
					if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
						sap.m.MessageBox.error("Invalid Scan",{
					          onClose: function(oAction) { 
							var inputScanBC = that.getView().byId("scanInput");
							setTimeout(function(){
									inputScanBC.setValue("");
									inputScanBC.focus();
									}, 600);
					          }
					      });
					}else{
					sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
						onClose :function(oAction){
							var inputScanBC = that.getView().byId("scanInput");
							setTimeout(function(){
									inputScanBC.setValue("");
									inputScanBC.focus();
									}, 600);
						}
					});	
					}
				}
			});
			
		},
	navToNext : function(){
			//if there are any pending items
			var dataObj = {};
			var that=this;
//			orderNum = oOrderJsonModel.getData().model.SalesOrder;

			var strUrl =server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
			var oModel =  new sap.ui.model.odata.ODataModel(strUrl,true);
			
				oModel.read("OrdHeaderSet('"+orderNum+"')/OrderPickTasks?$filter=Zexception ne ' '", null, null, true, function(oData){
					dataObj=oData.results;
					if(dataObj.length==0){
						that.oRouter.myNavBack("scanCheckout");
					}else{
						that.oRouter.myNavBack("exceptionReports");
					}
				}, function(oError){
					jQuery.sap.require("sap.m.MessageBox");
					
					if(oError.response.statusCode=="500"){
						sound.play();
						sap.m.MessageBox.error("Internal System Error");
					}else{
						sound.play();
						sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
					}
				});
		},
		
	incValue : function(){
			var text = this.getView().byId("itemCount");
			var value = parseInt(text.getText());
			if((weightIndicator==3&&value>=1)||(value<pickQuantity&&value>=1)){
			value++;
			}
			text.setText(value.toString());
			var inputScanBC = this.getView().byId("scanInput");
			inputScanBC.setValue("");
			setTimeout(function(){
				inputScanBC.focus();
			      }, 1200);
		},
		
	decValue : function(){
			var text = this.getView().byId("itemCount");
			var value = parseInt(text.getText());
			if((weightIndicator==3&&value>1)||value<=pickQuantity&&value>1){
			value--;
			}
			text.setText(value.toString());
			var inputScanBC = this.getView().byId("scanInput");
			inputScanBC.setValue("");
			setTimeout(function(){
				inputScanBC.focus();
			      }, 1200);
		},
		
	closeBusyGrid : function(){
		this.getView().byId("matGrid").setBusy(false);
		this.getView().byId("busyCloseBtn").setVisible(false);
		this.getView().byId("displayLogout").setVisible(true);
		this.getView().byId("exceptionTypes").setVisible(false);
		this.getView().byId("exceptionBtn").setVisible(true);
		var inputScanBC = this.getView().byId("scanInput");
		inputScanBC.setValue("");
		setTimeout(function(){
			inputScanBC.focus();
		      }, 1200);

	},
	logout : function(){
		this.getView().byId("matGrid").setBusy(false);

		var router = this.oRouter;
		sap.ui.controller("foodkickpicking.requestOrder").logout(router);
		}
		

});