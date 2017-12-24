sap.ui.controller("fdx_checkout.Checkout2",{
	
	onInit : function() {
		orderNo="";
		that = this;
		that.getView().byId("sysTimeId").setText(startTime());
		setInterval(function(){ that.getView().byId("sysTimeId").setText(startTime(that)); }, 1000);
		that.getView().byId("sysDayId").setText(dateTimeFormat2);
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.getRoute("Checkout2").attachMatched(this._loadCheckout, this);
		
		var orderId = that.getView().byId("orderNo");
		var wtBarcode =that.getView().byId("oScanWt");
		orderId.onsapenter=(function(oEvent) {
		that.getOrderDetail();
		}).bind(that);
		/*wtBarcode.onsapenter=(function(oEvent) {
			sap.ui.controller("fdx_checkout.Checkout2").accept();
			}).bind(sap.ui.controller("fdx_checkout.Checkout2"));*/
		/*sap.ui.getCore().byId("oScanWt").onsapenter=(function(evt) {
			sap.m.InputBase.prototype.onsapenter.apply(that,arguments);
			//var input=id.getValue();
			sap.ui.controller("fdx_checkout.Checkout2").accept(); *//** the on change method **//*
		}).bind(that);*/
		
		
	},
	_loadCheckout : function(oEvent){
		setTimeout(function(){
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 400);
		this._loginId = oEvent.getParameter("arguments").loginId;
		if(oLoginJsonModel.oData && !oLoginJsonModel.oData.Zempid){
			sap.ui.controller("fdx_checkout.Checkout").getLoginService(this._loginId, false);
		}
		this.onInitHelper(this._loginId);
		var that = this;
		idleInterval = setInterval(function(){
			 idleTime1 = idleTime1 + 0.5;  // for 1/2 minutes
			    if (idleTime1 >= idleTime) {
			    	that.onLoggingOut();
			    	
			    }
		}, 30000);
	},
	onInitHelper : function(){
		empId = oLoginJsonModel.getData().Zempid;
		authenticationLevel = oLoginJsonModel.getData().Authlevel;
		var fullName = oLoginJsonModel.getData().Zfullname;
		werks = oLoginJsonModel.getData().Werks;
		that.getView().byId("fullNameId").setText(fullName);

		var loginDate = new Date();
		/*if(sap.ui.Device.system.desktop){
			that.getView().byId("idProductsTable").setVisibleRowCount(6);
		}else{
			that.getView().byId("idProductsTable").setVisibleRowCount(4);
		}*/
		that.getView().byId("idProductsTable").setVisibleRowCount(5);
		dateTimeFormat3 = (loginDate.getMonth() + 1)+ "/"+ loginDate.getDate() + "/"+ loginDate.getFullYear() + " "+ formatAMPM(loginDate);
		dateTime = (loginDate.getFullYear())+"-"+(loginDate.getMonth()+1)+ "-"+(loginDate.getDate());
		that.getView().byId("loginTimeId").setText(dateTimeFormat3);
		var customDataToStoreDate = new sap.ui.core.CustomData({
			key:'time',
			value :loginDate,
			writeToDom:false
		});
		that.getView().byId("loginTimeId").addCustomData(customDataToStoreDate);
		setInterval(function(){
			that.getView().byId("DurTimeId").setText(durTime(that));
		}, 1000);
		that.getView().byId("DurTimeId").setText(dateTimeFormat2);
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		that.getFooterOrderDetail();
		
		//Search Module Methods - - - 
		that.getSkuData();
		that.getMaterialData();
	},
	getSkuData :function(){
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("MatDescSet?$filter=Werks eq'"+werks+"'", null, null, true, function(oData){
			oCurrentToteSearchJsonModel.setData(oData);
		},function(oError){
			snd.play();
			sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
				onClose: function(oAction) { 
					setTimeout(function(){
						that.getView().byId("orderNo").setValue("");
						that.getView().byId("orderNo").focus();
					}, 400);
				}
			});
		});
		
	},
	getMaterialData : function(){
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("MatEanSet", null, null, true, function(oData){
			oCurrentToteSearchJsonModel1.setData(oData); 
		},function(oError){
			snd.play();
			sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
				onClose: function(oAction) { 
					setTimeout(function(){
						that.getView().byId("orderNo").setValue("");
						that.getView().byId("orderNo").focus();
					}, 400);
				}
			});
		});	
	},
	getFooterOrderDetail : function(){
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("/StoreOrderDetailsSet(ImDelDate=datetime'"+dateTime+"T00:00:00',ImPlant='"+ werks + "')",null,null,true,
				function(oData) {
			oCheckoutJsonModel.setData(oData);
			that.getView().setModel(oCheckoutJsonModel,"cModel");
			setTimeout(function() {
				that.getView().byId("orderNo").setValue("");
				that.getView().byId("orderNo").focus();
			}, 800);
		},function(oError) {
			snd.play();
			jQuery.sap.require("sap.m.MessageBox");
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error",{
					onClose: function(oAction) { 
						setTimeout(function(){
							that.getView().byId("orderNo").setValue("");
							that.getView().byId("orderNo").focus();
						}, 400);
					}
				});
			}else{
				snd.play();
				sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML,{
					onClose: function(oAction) { 
						setTimeout(function(){
							that.getView().byId("orderNo").setValue("");
							that.getView().byId("orderNo").focus();
						}, 400);
					}
				});
			}
		});	
	},
	getCheckOrderSetDetail : function(orderNoOrTote){
		var assetId = oLoginJsonModel.getData().AssetId;
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("/CheckOrdersSet(SalesOrder='"+ orderNoOrTote+ "',ImEmpid='"+ empId+ "',ImAsset='"+assetId+"',ImPlant='"+ werks + "')",
				null,null,true,function(oData) {
			oCheckOrderSetJsonModel.setData(oData);
			that.getView().byId("oHBox1").setModel(oCheckOrderSetJsonModel);
			orderNo = oCheckOrderSetJsonModel.getData().SalesOrder;
			var currentTote = oCheckOrderSetJsonModel.getData().Ztote;
			that.getView().byId("currentToteId").setText(currentTote);

			if (oCheckOrderSetJsonModel.getData().LastName == ""|| oCheckOrderSetJsonModel.getData().LastName == null) {
				var customerName = oCheckOrderSetJsonModel.getData().FirstName;
			} else {
				var customerName = oCheckOrderSetJsonModel.getData().FirstName+ ","+ oCheckOrderSetJsonModel.getData().LastName;
			}
			var customerAddress = oCheckOrderSetJsonModel.getData().City+ ","+ oCheckOrderSetJsonModel.getData().State+ ","+ oCheckOrderSetJsonModel.getData().PostalCode;
			var deliveryWindow = oCheckOrderSetJsonModel.getData().DlvWindow;
			that.getView().byId("customerName").setText(customerName);
			that.getView().byId("customerAddress").setText(customerAddress);
			that.getView().byId("orderNo1").setText(orderNo);
			that.getView().byId("deliveryWindow").setText(deliveryWindow);
			var delDate = oCheckOrderSetJsonModel.getData().DelDate;
			if(delDate.toString().indexOf("GMT")!=-1){
				var delDatee =new Date((new Date(0).getTimezoneOffset()*60*1000)+ delDate.getTime()).getDate();
				if(delDatee<10){
					delDatee = "0"+delDatee;
				}
				that.getView().byId("deliveryDate").setText((delDate.getMonth()+1)+"/"+delDatee+"/"+delDate.getFullYear());
			}else{
				that.getView().byId("deliveryDate").setText(delDate.substr(5,2)+"/"+delDate.substr(8,2)+"/"+delDate.substr(0,4));
			}
			that.getView().byId("remainingPick").setText(oCheckOrderSetJsonModel.getData().RemPacks);
			that.getView().byId("custAddress").setText(oCheckOrderSetJsonModel.getData().Address);
			that.onOrdHeaderSetRead();
			that.getOrderDetailTableData();
		},
		function(oError) {
			setTimeout(function(){
				that.getView().byId("orderNo").setValue("");
				that.getView().byId("orderNo").focus();
			}, 400);
			snd.play();
			jQuery.sap.require("sap.m.MessageBox");
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error");
			}else if(oError.response.body.includes("xml")){
				sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
			}
			else{
				sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
			}
		});
},

getOrderDetailTableData : function(){
	var assetId = oLoginJsonModel.getData().AssetId;
	var oModel = that.getView().getModel('myOdataModel');
	oModel.read("/CheckOrdersSet(SalesOrder='"+ orderNo+ "',ImEmpid='"+ empId+ "',ImAsset='"+assetId+"',ImPlant='"+ werks + "')/CheckPickTasks",
			null,null,true,function(oData) {
		that.onPendingButtonEnable();
		that.onPrintButtonEnable();
		//that.getView().byId("oToggBtn").setEnabled(true);
		setTimeout(function() {
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 400);
		oCheckPickTasksJsonModel.setData(oData);
		that.getView().byId("idProductsTable").setModel(oCheckPickTasksJsonModel);
		var oTable = that.getView().byId("idProductsTable");
		oTable._oVSb.attachScroll(function() {
			sap.ui.controller("fdx_checkout.Checkout2").formateRows();
		});
		sap.ui.controller("fdx_checkout.Checkout2").formateRows();
		oTable.getColumns()[3].shouldRender();

	},
	function(oError) {
		setTimeout(function() {
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 400);
		jQuery.sap.require("sap.m.MessageBox");
		snd.play();
		if(oError.response.statusCode=="500"){
			sap.m.MessageBox.error("Internal System Error");
		}else{
			sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
				onClose: function(oAction) { 
				setTimeout(function(){
					that.getView().byId("orderNo").setValue("");
					that.getView().byId("orderNo").focus();
				}, 400);
			}
			});
		}
	});
},

pickItemThroughMaterialUPC : function(){

	materialUPC = that.getView().byId("orderNo").getValue();
	var index1;
	for(j=0; j<materialUPC.length; j++){
		if(materialUPC.charAt(j)!=0){
			index1=j;
			break;
		}
	}
	var tempUpc;
	var matNo;
	var oModel = that.getView().getModel('myOdataModel');
	oModel.read("MatUPcSet?$filter=ImInput eq '" + orderNo + "'",null,null,true,function(oData) {
		oMaterialJsonModel.setData(oData);
		for(var i=0;i<oMaterialJsonModel.getData().results.length;i++){
			tempUpc = oMaterialJsonModel.getData().results[i].Upc;
			var index;
			for(j=0; j<tempUpc.length; j++){
				if(tempUpc.charAt(j)!=0){
					index=j;
					break;
				}
			}
			if(materialUPC.substring(index1) == tempUpc.substring(index)){
				matNo=oMaterialJsonModel.getData().results[i].Matnr;
				break;
			}
		}
		that.readSku(matNo,tempUpc);
	},function(oError) {
		setTimeout(function(){
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 400);
		jQuery.sap.require("sap.m.MessageBox");
		snd.play();
		if(oError.response.statusCode=="500"){
			sap.m.MessageBox.error("Internal System Error",{
				onClose: function(oAction) { 
				setTimeout(function(){
					that.getView().byId("orderNo").setValue("");
					that.getView().byId("orderNo").focus();
				}, 400);
			}
			});
		}else{
			snd.play();
			sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML,{
				onClose: function(oAction) { 
				setTimeout(function(){
					that.getView().byId("orderNo").setValue("");
					that.getView().byId("orderNo").focus();
				}, 400);
			}
			});
		}
		setTimeout(function() {
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 200);
	});
},

readSku : function(matNo,tempUpc){
	var oModel = that.getView().getModel('myOdataModel');
	oModel.read("CheckPicksSet(IOrder='"+ orderNo +"',Sku='"+ matNo +"')",
			null,null,true,function(oData) {
		var tempJsonModel = new sap.ui.model.json.JSONModel();
		tempJsonModel.setData(oData);
		var material =  tempJsonModel.getData();
		material.Upc=tempUpc;
		that.updateUpc(material,matNo);
	},function(oError) {
		setTimeout(function(){
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 400);
		jQuery.sap.require("sap.m.MessageBox");
		snd.play();
		if(oError.response.statusCode=="500"){
			sap.m.MessageBox.error("Internal System Error");
		}else{
			sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
		}
	});
},

updateUpc : function(material,matNo){
	var oModel = that.getView().getModel('myOdataModel');
	oModel.update("/CheckPicksSet(IOrder='"+ orderNo +"',Sku='"+ matNo +"')", material, null,
			function(oData){
		that.getOrderDetailTableData();
		var itemStatus="picked";
		if(itemStatus=="picked"){
			that.qtyOrWt(matNo);
			itemStatus="pending";
		}
	},function(oError) {
		setTimeout(function(){
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 400);
		jQuery.sap.require("sap.m.MessageBox");
		snd.play();
		if(oError.response.statusCode=="500"){
			sap.m.MessageBox.error("Internal System Error");
		}else{
			sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
		}
	});
},

getOrderDetail : function() {
	var orderNoOrToteID = that.getView().byId("orderNo").getValue();
	if(!oCheckPickTasksJsonModel.oData.results){
		//that.onOrdHeaderSetRead();
		that.getCheckOrderSetDetail(orderNoOrToteID);
	}else if((oCheckPickTasksJsonModel.oData.results.length == 0)){
		that.getCheckOrderSetDetail(orderNoOrToteID);
	}else{
		that.pickItemThroughMaterialUPC();
	}
},

formateRows : function() {
	var oTable = that.getView().byId("idProductsTable");
	var rowCount = oTable.getVisibleRowCount();
	if(oTable.getModel().getData().results.length < rowCount){
		rowCount = oTable.getModel().getData().results.length;
	}
	var rowStart = oTable.getFirstVisibleRow();
	var currentRowContext;
	for (var i = 0; i < rowCount; i++) {
		currentRowContext = oTable.getContextByIndex(rowStart + i);
		oTable.getRows()[i].$().removeClass("grade");
		var status = oTable.getModel().getProperty("Status", currentRowContext);
		var matType = oTable.getModel().getProperty("MatType", currentRowContext);
		var buom = oTable.getModel().getProperty("Buom", currentRowContext);
		var skuLocal = oTable.getModel().getProperty("Sku", currentRowContext);
		if (status == "X") {
			oTable.getRows()[i].$().addClass("grade");
		}
		if (matType == "F") {
			sap.ui.getCore().byId(oTable.getRows()[i].getCells()[0].getItems()[1].getId()).setVisible(true);
		}else if (matType == "") {
			sap.ui.getCore().byId(oTable.getRows()[i].getCells()[0].getItems()[1].getId()).setVisible(false);
		}
		if (oTable.getModel().getProperty("Buom", currentRowContext) == "EA") {
			var qty = parseInt(oCheckPickTasksJsonModel.oData.results[i+rowStart].Ordqty)
			+ "/"
			+ parseInt(oCheckPickTasksJsonModel.oData.results[i+rowStart].Picqty);
			oTable.getRows()[i].getCells()[3].setText(qty);
		} else {
			if(oTable.getModel().getProperty("Status", currentRowContext) =="X"){
				var wt = oCheckPickTasksJsonModel.oData.results[i+rowStart].ZzactWeight
				+ "/"
				+ oCheckPickTasksJsonModel.oData.results[i+rowStart].Weight+" LB";
				oTable.getRows()[i].getCells()[3].setText(wt);
			}else{
				var wt = oCheckPickTasksJsonModel.oData.results[i+rowStart].Weight+" LB";
				oTable.getRows()[i].getCells()[3].setText(wt);
			}
		}
	}
},

	navBack : function() {
		this.oRouter.navTo("Checkout");
	},
	
	rsc : function(e) {
		var oTable = that.getView().byId("idProductsTable");
		var idx = e.getParameters().rowIndex;
		$('#'+e.getParameter('cellControl').getParent().getId()).addClass('grade1');
		var cxt = oTable.getContextByIndex(idx);
			var path = cxt.sPath;
			var obj = oTable.getModel().getProperty(path);
			var lineSku = obj.Sku;
			var oModel = that.getView().getModel('myOdataModel');
			oModel.read("/CheckPicksSet(IOrder='"+orderNo+"',Sku='"+lineSku+"')",
					null,null,false,function(oData) {
				oDialogueJsonModel.setData(oData);
				weightIndicator = oDialogueJsonModel.getData().Wind;
				pickQuantity = oDialogueJsonModel.getData().Picqty;
				orderQuantity = oDialogueJsonModel.getData().Ordqty;
				status= oDialogueJsonModel.getData().Status;
				that.getView().setModel(oDialogueJsonModel,"dModel");
				if (status != "X") {
					$('#'+e.getParameter('cellControl').getParent().getId()).removeClass('grade1');
					if(oDialogueJsonModel.getData().Buom == "EA"){
						that.getDialog_EA();
					}else{
						that.getDialog_LB();
					}
				}
				$('#'+e.getParameter('cellControl').getParent().getId()).removeClass('grade1');
			},
			function(oError) {
				$('#'+e.getParameter('cellControl').getParent().getId()).removeClass('grade1');
				jQuery.sap.require("sap.m.MessageBox");
				snd.play();
				if(oError.response.statusCode=="500"){
					sap.m.MessageBox.error("Internal System Error");
				}else{
					sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
				}
				$('#'+e.getParameter('cellControl').getParent().getId()).removeClass('grade1');
			});
			$('#'+e.getParameter('cellControl').getParent().getId()).removeClass('grade1');
	},
	
	getDialog_EA : function(){
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment(
					"fdx_checkout.fragments.Dialog_EA", this);
			this.getView().addDependent(this._oDialog);
			if(authenticationLevel=="X"){
				sap.ui.getCore().byId("oBtn1").setVisible();
			}
		}
		sap.ui.getCore().byId("itemCount_EA").setText(parseInt(oDialogueJsonModel.getData().Ordqty));
		sap.ui.getCore().byId("reqQty_EA").setText(parseInt(oDialogueJsonModel.getData().Ordqty)+"/"+parseInt(oDialogueJsonModel.getData().Picqty));
		if(status==""){
			sap.ui.getCore().byId("oBtn3").setEnabled(true);
		}else{
			sap.ui.getCore().byId("oBtn3").setEnabled(false);
		}
		this._oDialog.open();
	},
	close : function() {
		this._oDialog.close();
		sap.ui.controller("fdx_checkout.Checkout2").formateRows();
	},
	
	_oDialog2 : "",
	getDialog_LB : function(){
		if (!this._oDialog2) {
			this._oDialog2 = sap.ui.xmlfragment(
					"fdx_checkout.fragments.Dialog_LB", this);
			this.getView().addDependent(this._oDialog2);
			
			if(authenticationLevel=="X"){
				sap.ui.getCore().byId("oBtn11").setVisible();
			}
		}
		setTimeout(function() {
			sap.ui.getCore().byId("oScanWt").setValue("");
			sap.ui.getCore().byId("oScanWt").focus();
		}, 400);
		sap.ui.getCore().byId("itemCount_LB").setText(parseInt(oDialogueJsonModel.getData().Ordqty));
		if(status==""){
			sap.ui.getCore().byId("oBtn33").setEnabled(true);
		}else{
			sap.ui.getCore().byId("oBtn33").setEnabled(false);
		}
		this._oDialog2.open();
		
		sap.ui.getCore().byId("oScanWt").onsapenter =(function(oEvent) {
			sap.m.InputBase.prototype.onsapenter.apply(sap.ui.getCore().byId("oScanWt"),arguments);
			that.accept();
		});
	},
	close1 : function() {
		this._oDialog2.close();
		sap.ui.controller("fdx_checkout.Checkout2").formateRows();
	},
	
	_oDialog4:"",
	getDialog_Weight_Tolerance : function(){
		if (!this._oDialog4) {
			this._oDialog4 = sap.ui.xmlfragment(
					"fdx_checkout.fragments.Dialog_Weight_Tolerance", this);
			this.getView().addDependent(this._oDialog4);
		}
		this._oDialog4.open();
	},
	
	close4 : function() {
		setTimeout(function() {
			sap.ui.getCore().byId("oScanWt").setValue("");
			sap.ui.getCore().byId("oScanWt").focus();
		}, 400);
		this._oDialog4.close();
	},
	
	accept : function() {
		var that = this;
		var material = oDialogueJsonModel.getData();
		material.Ordqty = material.Ordqty.toString();
		material.Picqty = material.Picqty.toString();
		var skuNum = material.Sku;
		var orderNo = material.IOrder;
		
		if(oDialogueJsonModel.getData().Buom == "EA"){
			material.Ordqty = sap.ui.getCore().byId("itemCount_EA").getText();
			var oModel = that.getView().getModel('myOdataModel');
			oModel.update("/CheckPicksSet(IOrder='" + orderNo+ "',Sku='" + skuNum + "')",material,null,function(oData) {
				//	that.getOrderDetailTableData();
				var itemStatus1="picked";
				that.close();
				that.getCheckOrderSetDetail(orderNo);
			},function(oError){
				snd.play();
				jQuery.sap.require("sap.m.MessageBox");
				if(oError.response.statusCode=="500"){
					sap.m.MessageBox.error("Internal System Error");
				}else if(oError.response.body.includes("xml")){
					sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
				}
				else{
					sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
				}
			});
		}else{
			var scanInput = sap.ui.getCore().byId("oScanWt").getValue();
			material.Ordqty = sap.ui.getCore().byId("itemCount_LB").getText();
			material.Upc = scanInput;
			var oModel = that.getView().getModel('myOdataModel');
			oModel.update("/CheckPicksSet(IOrder='" + orderNo+ "',Sku='" + skuNum + "')",material,null,function(oData) {
				setTimeout(function() {
					sap.ui.getCore().byId("oScanWt").setValue("");
					sap.ui.getCore().byId("oScanWt").focus();
				}, 400);
				that.getCheckOrderSetDetail(orderNo);
				//	that.getOrderDetailTableData();
				that.close1();
			},function(oError){
				setTimeout(function() {
					sap.ui.getCore().byId("oScanWt").setValue("");
					sap.ui.getCore().byId("oScanWt").focus();
				}, 400);
				jQuery.sap.require("sap.m.MessageBox");
				snd.play();
				if(oError.response.statusCode=="500"){
					sap.m.MessageBox.error("Internal System Error",{
						onClose: function(oAction) { 
						setTimeout(function(){
							sap.ui.getCore().byId("oScanWt").setValue("");
							sap.ui.getCore().byId("oScanWt").focus();
						}, 200);
					}
					});
				}else{
					var msg = jQuery.parseJSON(oError.response.body).error.message.value ;
					if(msg.includes("tolerance")){
						that.getDialog_Weight_Tolerance();
						setTimeout(function() {
							sap.ui.getCore().byId("oScanWt").setValue("");
							sap.ui.getCore().byId("oScanWt").focus();
						}, 400);
					}else{
						sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
							onClose: function(oAction) { 
							setTimeout(function(){
								sap.ui.getCore().byId("oScanWt").setValue("");
								sap.ui.getCore().byId("oScanWt").focus();
							}, 200);
						}
						});
					}
				}
			});
		}
	},
	
	markItem : function(oEvent) {
		var material = oDialogueJsonModel.getData();
		material.Ordqty = material.Ordqty.toString();
		material.Picqty = material.Picqty.toString();
		var skuNum = material.Sku;
		var orderNo = material.IOrder;
		var text = oEvent.getSource().getProperty("text");
		if(text=="Damage/Quality Issue"){
			material.Zexception = "D";
		}else if(text=="Short Item"){
			material.Zexception = "S";
		}else{
			material.Zexception = "W";
		}
		var oModel = that.getView().getModel('myOdataModel');
		oModel.update("/CheckPicksSet(IOrder='" + orderNo+ "',Sku='" + skuNum + "')",material,null,function(oData) {
			that.getOrderDetailTableData();
		},function(oError) {
			jQuery.sap.require("sap.m.MessageBox");
			snd.play();
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error");
			}else{
				sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
			}

		});
		if(oDialogueJsonModel.getData().Buom=="EA"){
			that.close();
		}else{
			if(text=="Mark Exception"){
				that.close4();
			}
			that.close1();
		}
		that.getOrderDetailTableData();
	},
	
	_oDialog1 : "",
	onPressPrint : function(){
		if (! this._oDialog1) {
			this._oDialog1 = sap.ui.xmlfragment("fdx_checkout.fragments.StageLocation", this);
		}
		var bagDetail = oStageLocationJsonModel.getData();
		if(bagDetail.StagingAreas==""){
			if(bagDetail.NoOfFbages=="" && bagDetail.NoOfBages==""){
				forozenCount=0;
				var itemCount = oCheckPickTasksJsonModel.getData().results.length;
				for(var i=0;i<itemCount;i++){
					if(oCheckPickTasksJsonModel.getData().results[i].MatType == "F"){
						++forozenCount;
					}
					if(forozenCount<1){
						sap.ui.getCore().byId("froBag").setValue("0");
					}else{
						sap.ui.getCore().byId("froBag").setValue("1");
						break;
					}
				}
				sap.ui.getCore().byId("regBag").setValue("1");
				that.disableStageLoc();
			}else{
				that.disableStageLoc();
				sap.ui.getCore().byId("froBag").setValue(bagDetail.NoOfFbages);
				sap.ui.getCore().byId("regBag").setValue(bagDetail.NoOfBages);
				sap.ui.getCore().byId("allDone").setEnabled(true);
				if(bagDetail.NoOfFbages<6){
					for(var i=1; i<=bagDetail.NoOfFbages; i++){
						sap.ui.getCore().byId("froSta"+i).setEditable(true);
					}
				}else{
					for(var i=1; i<=5; i++){
						sap.ui.getCore().byId("froSta"+i).setEditable(true);
					}
				}
				if(bagDetail.NoOfBages<6){
					for(var j=1; j<=bagDetail.NoOfBages; j++){
						sap.ui.getCore().byId("regSta"+j).setEditable(true);
					}
				}else{
					for(var j=1; j<=5; j++){
						sap.ui.getCore().byId("regSta"+j).setEditable(true);
					}
				}
			}
			sap.ui.getCore().byId("froBag").setEditable(true);
			sap.ui.getCore().byId("regBag").setEditable(true);
			sap.ui.getCore().byId("printBag").setEnabled(true);
			sap.ui.getCore().byId("froSta1").setValue("");
			sap.ui.getCore().byId("froSta2").setValue("");
			sap.ui.getCore().byId("froSta3").setValue("");
			sap.ui.getCore().byId("froSta4").setValue("");
			sap.ui.getCore().byId("froSta5").setValue("");
			sap.ui.getCore().byId("regSta1").setValue("");
			sap.ui.getCore().byId("regSta2").setValue("");
			sap.ui.getCore().byId("regSta3").setValue("");
			sap.ui.getCore().byId("regSta4").setValue("");
			sap.ui.getCore().byId("regSta5").setValue("");
		}else{
			sap.ui.getCore().byId("froBag").setValue(bagDetail.NoOfFbages);
			sap.ui.getCore().byId("regBag").setValue(bagDetail.NoOfBages);
			sap.ui.getCore().byId('froSta1').setValue(bagDetail.StageLocation1);
			sap.ui.getCore().byId('froSta2').setValue(bagDetail.StageLocation2);
			sap.ui.getCore().byId('froSta3').setValue(bagDetail.StageLocation3);
			sap.ui.getCore().byId('froSta4').setValue(bagDetail.StageLocation4);
			sap.ui.getCore().byId('froSta5').setValue(bagDetail.StageLocation5);
			sap.ui.getCore().byId('regSta1').setValue(bagDetail.StageLocation6);
			sap.ui.getCore().byId('regSta2').setValue(bagDetail.StageLocation7);
			sap.ui.getCore().byId('regSta3').setValue(bagDetail.StageLocation8);
			sap.ui.getCore().byId('regSta4').setValue(bagDetail.StageLocation9);
			sap.ui.getCore().byId('regSta5').setValue(bagDetail.StageLocation10);
			that.disableStageLoc();	
			sap.ui.getCore().byId("froBag").setEditable(false);
			sap.ui.getCore().byId("regBag").setEditable(false);
			sap.ui.getCore().byId("printBag").setEnabled(false);
		}
		this.getView().addDependent(this._oDialog1);
		this._oDialog1.open();
		sap.ui.getCore().byId("SplInst").setText(bagDetail.SplInst);
	},
	
	 trim :function(s) {
		s = s.replace(/(^\s*)|(\s*$)/gi, "");
		s = s.replace(/[ ]{2,}/gi, " ");
		s = s.replace(/\n /, "\n");
		return s;
	},
	
	onPrintBag : function(){
		var froBag = sap.ui.getCore().byId("froBag").getValue();
		var regBag = sap.ui.getCore().byId("regBag").getValue();
		froBag= that.trim(froBag);
		regBag= that.trim(regBag);
		
		if(isNaN(froBag)||isNaN(regBag)||froBag<0||froBag>99||regBag<0||regBag>99||froBag==""||regBag==""){
			jQuery.sap.require("sap.m.MessageBox");
			snd.play();
			sap.m.MessageBox.error("Invalid data, Valid values 0 - 99");
			sap.ui.getCore().byId("allDone").setEnabled(false);
		}
		/*else if(froBag<0 || froBag>5 || regBag<1 || regBag>5){
			snd.play();
			sap.m.MessageBox.error("Number of Bags should be between 1 to 5");
			sap.ui.getCore().byId("allDone").setEnabled(false);
		}*/
		else{
			sap.ui.getCore().byId("allDone").setEnabled(true);
			if(froBag<6){
				for(var i=1; i<=froBag; i++){
					sap.ui.getCore().byId("froSta"+i).setEditable(true);
				}
			}else{
				for(var i=1; i<=5; i++){
					sap.ui.getCore().byId("froSta"+i).setEditable(true);
				}
			}
			if(regBag<6){
				for(var j=1; j<=regBag; j++){
					sap.ui.getCore().byId("regSta"+j).setEditable(true);
				}
			}else{
				for(var j=1; j<=5; j++){
					sap.ui.getCore().byId("regSta"+j).setEditable(true);
				}
			}
			that.onOrdHeaderSetUpdate(froBag,regBag);
		}
	},

	onPressPending : function(oEvent) {
		oTable = that.getView().byId("idProductsTable");
		var assetId = oLoginJsonModel.getData().AssetId;
		if(oEvent.getSource().getProperty("text")=="Pending"){
			this.getView().byId("oToggBtn").setText("All");
			var oModel = that.getView().getModel('myOdataModel');
			oModel.read("CheckOrdersSet(SalesOrder='"+orderNo+"',ImEmpid='"+ empId +"',ImAsset='"+assetId+"',ImPlant='"+ werks +"')/CheckPickTasks?$filter=Status ne 'X'", null, null, true, function(oData){
				oPendingLinkJsonModel.setData(oData);
				oTable.setModel(oPendingLinkJsonModel);
				$(document).ready(function() {
					oTable._oVSb.attachScroll(function() {
						sap.ui.controller("fdx_checkout.Checkout2").formateRows();
					});
					sap.ui.controller("fdx_checkout.Checkout2").formateRows();
				});
			},function(oError){
				jQuery.sap.require("sap.m.MessageBox");
				snd.play();
				if(oError.response.statusCode=="500"){
					sap.m.MessageBox.error("Internal System Error");
				}else{
					sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
				}
			});
		}else{
			this.getView().byId("oToggBtn").setText("Pending");
			oTable.setModel(oCheckPickTasksJsonModel);
			$(document).ready(function() {
				oTable._oVSb.attachScroll(function() {
					sap.ui.controller("fdx_checkout.Checkout2").formateRows();
				});
				sap.ui.controller("fdx_checkout.Checkout2").formateRows();
			});
		}
	},
	
	incValue : function(){
		var text;
		if(oDialogueJsonModel.getData().Buom == "EA"){
			text = sap.ui.getCore().byId("itemCount_EA");
		}else{
			text = sap.ui.getCore().byId("itemCount_LB");
		}
		var value = parseInt(text.getText());
		if((weightIndicator==3&&value>=1)||(value<orderQuantity&&value>=1)){
			value++;
		}
		text.setText(value.toString());
	},

	decValue : function(){
		var text ;
		if(oDialogueJsonModel.getData().Buom == "EA"){
			text = sap.ui.getCore().byId("itemCount_EA");
		}else{
			text = sap.ui.getCore().byId("itemCount_LB");
		}
		var value = parseInt(text.getText());
		if((weightIndicator==3&&value>1)||value<=orderQuantity&&value>1){
			value--;
		}
		text.setText(value.toString());
	},
	
	
	handleErrorMessageBoxPress: function(oEvent) {
		var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
		MessageBox.error(
			"This is an error message!",
			{
				styleClass: bCompact? "sapUiSizeCompact" : ""
			}
		);
	},
	
	searchOnMaterialParameters : function(){
		that.getView().byId("idProductsTable");
	},
	
	onAllDone : function(){
		var bagDetail = oStageLocationJsonModel.getData();
		//bagDetail.NoOfFbages = sap.ui.getCore().byId('froBag').getValue();
		//bagDetail.NoOfBages = sap.ui.getCore().byId('regBag').getValue();
		bagDetail.StageLocation1 = sap.ui.getCore().byId('froSta1').getValue();
		bagDetail.StageLocation2 = sap.ui.getCore().byId('froSta2').getValue();
		bagDetail.StageLocation3 = sap.ui.getCore().byId('froSta3').getValue();
		bagDetail.StageLocation4 = sap.ui.getCore().byId('froSta4').getValue();
		bagDetail.StageLocation5 = sap.ui.getCore().byId('froSta5').getValue();
		bagDetail.StageLocation6 = sap.ui.getCore().byId('regSta1').getValue();
		bagDetail.StageLocation7 = sap.ui.getCore().byId('regSta2').getValue();
		bagDetail.StageLocation8 = sap.ui.getCore().byId('regSta3').getValue();
		bagDetail.StageLocation9 = sap.ui.getCore().byId('regSta4').getValue();
		bagDetail.StageLocation10 = sap.ui.getCore().byId('regSta5').getValue();
		//oStageLocationJsonModel.setData(bagDetail);
		var that = this;
		var oModel = that.getView().getModel('myOdataModel');
		oModel.update("/OrdHeaderSet('"+orderNo+"')", bagDetail, null,
				function(oData){
			status="success";
			that.onOrdHeaderSetRead();
			that.onOrderSummary();
		},
		function(oError){
			jQuery.sap.require("sap.m.MessageBox");
			snd.play();
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error");
			}else{
				sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
			}
			sap.ui.getCore().byId("froSta1").setValue("");
			sap.ui.getCore().byId("froSta2").setValue("");
			sap.ui.getCore().byId("froSta3").setValue("");
			sap.ui.getCore().byId("froSta4").setValue("");
			sap.ui.getCore().byId("froSta5").setValue("");
			sap.ui.getCore().byId("regSta1").setValue("");
			sap.ui.getCore().byId("regSta2").setValue("");
			sap.ui.getCore().byId("regSta3").setValue("");
			sap.ui.getCore().byId("regSta4").setValue("");
			sap.ui.getCore().byId("regSta5").setValue("");
			//that.disableStageLoc();
		});
	},
	
	onOrdHeaderSetRead : function(){
		var that = this;
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("OrdHeaderSet('"+orderNo+"')",null,null, true, 
				function(oData,oResponse){
			oStageLocationJsonModel.setData(oData);
		},function(oError){
			jQuery.sap.require("sap.m.MessageBox");
			snd.play();
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error");
			}else{
				sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
			}
		});
	},
	
	onOrdHeaderSetUpdate : function(froBag,regBag){
		var bagDetail = oStageLocationJsonModel.getData();
		bagDetail.NoOfFbages = froBag;
		bagDetail.NoOfBages = regBag;
		var oModel = that.getView().getModel('myOdataModel');
		oModel.update("/OrdHeaderSet('"+orderNo+"')", bagDetail, null,
				function(oData){
			status="success";
			that.onOrdHeaderSetRead();
		},
		function(oError){
			jQuery.sap.require("sap.m.MessageBox");
			if(oError.response.statusCode=="500"){
				sap.m.MessageBox.error("Internal System Error");
			}else{
				sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);

			}
		});
	},
	
	_oDialog3:"",
	onOrderSummary : function(){
		this._oDialog1.close();
		if (! this._oDialog3) {
			this._oDialog3 = sap.ui.xmlfragment("fdx_checkout.fragments.OrderSummary", this);
		}
		this.getView().addDependent(this._oDialog3);
		this._oDialog3.open();
		sap.ui.getCore().byId("VB1").setModel(oStageLocationJsonModel);
		sap.ui.getCore().byId("VB1").bindContext("/");
	},
	
	onPrintCancel : function(){
		sap.ui.controller("fdx_checkout.Checkout2").formateRows();
		this._oDialog1.close();
	},

	onOk : function(){
		that.onClearAll();
		that.getFooterOrderDetail();
		this._oDialog3.close();	
	},
	
	onClear : function (){
		setTimeout(function(){
			that.getView().byId("orderNo").setValue("");
			that.getView().byId("orderNo").focus();
		}, 200);
		that.getView().byId("printBtn").setEnabled(false);
		that.getView().byId("printLbl").setEnabled(false);
		that.getView().byId("oToggBtn").setEnabled(false);
		that.getView().byId("imageVBox").setVisible(false);
		that.getView().byId("globaltextId").setValue("");
		that.getView().byId("globaltextId1").setValue("");
		that.getView().byId("globaltextId2").setValue("");
		
		oCheckOrderSetJsonModel.oData = {};
		oCheckOrderSetJsonModel.refresh();
		oCheckPickTasksJsonModel.oData.results = [];
		oCheckPickTasksJsonModel.refresh();
		oDialogueJsonModel.oData = {};
		oDialogueJsonModel.refresh();
		oPendingLinkJsonModel.oData.results = [];
		oPendingLinkJsonModel.refresh();
		oMaterialJsonModel.oData = {};
		oMaterialJsonModel.refresh();
		oStageLocationJsonModel.oData = {};
		oStageLocationJsonModel.refresh();
		oDialogueJsonModel1.oData = {};
		oDialogueJsonModel1.refresh();
		
		that.getView().byId("customerName").setText("");
		that.getView().byId("customerAddress").setText("");
		that.getView().byId("orderNo1").setText("");
		that.getView().byId("deliveryWindow").setText("");
		that.getView().byId("deliveryDate").setText("");
		that.getView().byId("remainingPick").setText("");
		that.getView().byId("custAddress").setText("");
		that.getView().byId("currentToteId").setText("");
		that.getView().byId("oToggBtn").setText("Pending");
	},
	
	onClearAll :function(){
		that.onClear();
		oCheckoutJsonModel.oData = {};
		oCheckoutJsonModel.refresh();
	},

	onPrintButtonEnable : function(){
		var that = this;
		var assetId = oLoginJsonModel.getData().AssetId;
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("CheckOrdersSet(SalesOrder='"+orderNo+"',ImEmpid='"+empId+"',ImAsset='"+assetId+"',ImPlant='"+werks+"')/CheckPickTasks?$filter=Status eq ' '",null,null, true, 
				function(oData,oResponse){
			if(oData.results.length < 1){
				that.getView().byId("printBtn").setEnabled(true);
				that.getView().byId("printLbl").setEnabled(true);
			}
		},function(oError){
			var statusCode = oError.response.statusCode;
			jQuery.sap.require("sap.m.MessageBox");
			snd.play();
			if(statusCode==500){
				sap.m.MessageBox.alert("Internal System Error");
			}else{
				sap.m.MessageBox.alert(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
			}
		});
	},
	onPendingButtonEnable : function(){
		var that = this;
		var assetId = oLoginJsonModel.getData().AssetId;
		var oModel = that.getView().getModel('myOdataModel');
		oModel.read("CheckOrdersSet(SalesOrder='"+orderNo+"',ImEmpid='"+ empId +"',ImAsset='"+assetId+"',ImPlant='"+ werks +"')/CheckPickTasks?$filter=Status ne 'X'",null,null, true, 
				function(oData,oResponse){
			if(oData.results.length < 1){
				that.getView().byId("oToggBtn").setEnabled(false);
			}else{
				that.getView().byId("oToggBtn").setEnabled(true);
			}
		},function(oError){
			var statusCode = oError.response.statusCode;
			jQuery.sap.require("sap.m.MessageBox");
			snd.play();
			if(statusCode==500){
				sap.m.MessageBox.alert("Internal System Error");
			}else{
				sap.m.MessageBox.alert(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
			}
		});
	},
	
		handleSearchDesc: function(value) {
			return value.Maktg == that.globalTextval1;
		},
		
		handleSearchUpc: function(value) {
			return value.Maktg == that.globalTextval1;
		},
		
		
		skuImage : function(){
			that.globalTextval = that.getView().byId("globaltextId").getValue();
			that.onPressSKUShowImage(that.globalTextval);
		},
		
		descImage : function(){
			that.globalTextval = that.getView().byId("globaltextId1").getValue();
			var matnr_ref;
			for(j=0;j<descCheck.length;j++){
				if(that.globalTextval==descCheck[j].Maktg){
					matnr_ref = descCheck[j].Matnr;
				}
			}
			if(matnr_ref!="" ||matnr_ref!=null){
				that.onPressSKUShowImage(matnr_ref);
			}
		},
		
		upcImage : function(){
			that.globalTextval = that.getView().byId("globaltextId2").getValue();
			var matnr_ref;
			for(j=0;j<upcCheck.length;j++){
				if(that.globalTextval==upcCheck[j].Maktg){
					matnr_ref = upcCheck[j].Matnr;
				}
			}
			if(matnr_ref!="" ||matnr_ref!=null){
				that.onPressUPCShowImage(matnr_ref);
			}
		},
		
		onTextFieldChange : function(){
			that.getView().byId("imageVBox").setVisible(false);
			rbgSelectedIndex=that.getView().byId("RBG").getSelectedIndex();
			werks = oLoginJsonModel.getData().Werks;
			descCheck.splice(0,descCheck.length);
			upcCheck.splice(0,upcCheck.length);
			if(rbgSelectedIndex==0){
				var selectVal =this.getView().byId("globaltextId").getValue();
				var data = oCurrentToteSearchJsonModel.getData().results;
				var pCheck = [];
				for (var i = 0; i < data.length; i++) {
					var modelVal = data[i].Matnr;
					if (modelVal.startsWith(selectVal)) {
						var x = {};
						x["Matnr"] = (data[i].Matnr);
						pCheck.push(x);
					}
				}
				oCurrentToteSearchJsonModelTemp.setData({results : pCheck});
				that.getView().byId("globaltextId").setModel(oCurrentToteSearchJsonModelTemp);
			}else if(rbgSelectedIndex==1){
				var selectVal =this.getView().byId("globaltextId1").getValue().toUpperCase();;
				var data = oCurrentToteSearchJsonModel.getData().results;
				for (var i = 0; i < data.length; i++) {
					var modelVal = data[i].Maktg.toUpperCase();
					if (modelVal.startsWith(selectVal)) {
						var x = {};
						x["Maktg"] = (data[i].Maktg);
						x["Matnr"] = (data[i].Matnr);
						descCheck.push(x);
					}
				}
				oCurrentToteSearchJsonModelTemp.setData({results : descCheck});
				that.getView().byId("globaltextId1").setModel(oCurrentToteSearchJsonModelTemp);
			}else if(rbgSelectedIndex==2){
				var selectVal =this.getView().byId("globaltextId2").getValue();
				var data = oCurrentToteSearchJsonModel1.getData().results;
				for (var i = 0; i < data.length; i++) {
					var modelVal = data[i].Ean11;
					if (modelVal.startsWith(selectVal)) {
						var x = {};
						x["Ean11"] = (data[i].Ean11);
						x["Matnr"] = (data[i].Matnr);
						upcCheck.push(x);
					}
				}
				oCurrentToteSearchJsonModelTemp.setData({results : upcCheck});
				that.getView().byId("globaltextId2").setModel(oCurrentToteSearchJsonModelTemp);
			}
		},
		onPressSKUShowImage : function(matNo){
			var oModel = that.getView().getModel('myOdataModel');
			oModel.read("MaturlSet('"+matNo+"')", null, null, true, function(oData){
				oCurrentToteSearchJsonModel.oData["ImMatnr"] = oData.ImMatnr;
				oCurrentToteSearchJsonModel.oData["ExMatUrl"] = oData.ExMatUrl;
				oCurrentToteSearchJsonModel.refresh();
				that.getView().byId("imageVBox").setModel(oCurrentToteSearchJsonModel);
				that.getView().byId("imageVBox").setVisible(true);		
			},function(oError){
				snd.play();
				var statusCode = oError.response.statusCode;
				jQuery.sap.require("sap.m.MessageBox");
				if(statusCode==500){
					sap.m.MessageBox.alert("Internal System Error");
				}else{
					sap.m.MessageBox.alert(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
				}
			});	
		},
		onPressUPCShowImage : function(matNum){
			var oModel = that.getView().getModel('myOdataModel');
			oModel.read("MaturlSet('"+matNum+"')", null, null, true, function(oData){
				oCurrentToteSearchJsonModel1.oData["ImMatnr"] = oData.ImMatnr;
				oCurrentToteSearchJsonModel1.oData["ExMatUrl"] = oData.ExMatUrl;
				oCurrentToteSearchJsonModel1.refresh();
				that.getView().byId("imageVBox").setModel(oCurrentToteSearchJsonModel1);
				that.getView().byId("imageVBox").setVisible(true);
			},function(oError){
				var statusCode = oError.response.statusCode;
				snd.play();
				jQuery.sap.require("sap.m.MessageBox");
				if(statusCode==500){
					sap.m.MessageBox.alert("Internal System Error");
				}else{
					sap.m.MessageBox.alert(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
				}
			});
		},
		
		disableStageLoc : function(){
			sap.ui.getCore().byId("allDone").setEnabled(false);
			sap.ui.getCore().byId("froSta1").setEditable(false);
			sap.ui.getCore().byId("froSta2").setEditable(false);
			sap.ui.getCore().byId("froSta3").setEditable(false);
			sap.ui.getCore().byId("froSta4").setEditable(false);
			sap.ui.getCore().byId("froSta5").setEditable(false);
			sap.ui.getCore().byId("regSta1").setEditable(false);
			sap.ui.getCore().byId("regSta2").setEditable(false);
			sap.ui.getCore().byId("regSta3").setEditable(false);
			sap.ui.getCore().byId("regSta4").setEditable(false);
			sap.ui.getCore().byId("regSta5").setEditable(false);
		},
		
		onChangeRB : function() {
			that.getView().byId("imageVBox").setVisible(false);
			rbgSelectedIndex2=that.getView().byId("RBG").getSelectedIndex();
			if(rbgSelectedIndex2==0){
				that.getView().byId("globaltextId1").setVisible(false);
				that.getView().byId("globaltextId2").setVisible(false);
				that.getView().byId("globaltextId1").setValue("");
				that.getView().byId("globaltextId2").setValue("");
				setTimeout(function() {
					that.getView().byId("globaltextId").setValue("");
					that.getView().byId("globaltextId").focus();
				}, 200);
				that.getView().byId("globaltextId").setVisible(true);
			}else if(rbgSelectedIndex2==1){
				that.getView().byId("globaltextId").setVisible(false);
				that.getView().byId("globaltextId2").setVisible(false);
				that.getView().byId("globaltextId").setValue("");
				that.getView().byId("globaltextId2").setValue("");
				setTimeout(function() {
					that.getView().byId("globaltextId1").setValue("");
					that.getView().byId("globaltextId1").focus();
				}, 200);
				that.getView().byId("globaltextId1").setVisible(true);
			}else{
				that.getView().byId("globaltextId1").setVisible(false);
				that.getView().byId("globaltextId").setVisible(false);
				that.getView().byId("globaltextId").setValue("");
				that.getView().byId("globaltextId1").setValue("");
				setTimeout(function() {
					that.getView().byId("globaltextId2").setValue("");
					that.getView().byId("globaltextId2").focus();
				}, 200);
				that.getView().byId("globaltextId2").setVisible(true);
			}
		},
		
		onLoggingOut : function(){
			var empId =  oLoginJsonModel.getData().Zempid;
			var ipAddress = oLoginJsonModel.getData().IpAddr;
			var dataObj = {};
			dataObj.Zempid=empId;
			dataObj.IpAddr=ipAddress;
			
			var oModel = that.getView().getModel('myOdataModel');
			oModel.update("EmployeeSet(Zempid='"+empId+"',IpAddr='"+ipAddress+"')", dataObj, null,
					function(oData){
				 clearInterval(idleInterval);
				 idleInterval = undefined;
				
				that.onClearAll();
				that.oRouter.myNavBack("Checkout");
				
			},
			function(oError){
				jQuery.sap.require("sap.m.MessageBox");
				if(oError.response.statusCode=="500"){
					sap.m.MessageBox.error("Internal System Error");
				}else{
					sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value);
				}
			});

		},

		onPressPrintLabel : function(){
			var oModel = that.getView().getModel('myOdataModel');
			oModel.update("PrdLblPrtSet(ImVbeln='"+orderNo+"')",material,null,function(oData){
			},function(oError){
				var statusCode = oError.response.statusCode;
				snd.play();
				jQuery.sap.require("sap.m.MessageBox");
				if(statusCode==500){
					sap.m.MessageBox.alert("Internal System Error");
				}else{
					sap.m.MessageBox.alert(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
				}
			});
		}
});

//**************************************END OF CONTROLER*****************************//

var statusSku = "error";
function durTime(that){
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var sec = currentTime.getSeconds();
	var dur = currentTime.getDate();
	if (sec < 10){
		sec = "0" + sec;
	}
	if (minutes < 10){
		minutes = "0" + minutes;
	}
	var t_str = hours + ":" + minutes + ":" + sec + " ";
	if(hours > 11){
		t_str += "PM";
	} else {
		t_str += "AM";
	}
	var log = that.getView().byId("loginTimeId").getCustomData()[0].getValue();
//	var log = that.getView().byId("loginTimeId").getText();
	var dur = currentTime.getTime()-new Date(log).getTime();
	var secd =parseInt((dur/1000)%60);
	var mint =parseInt((dur/(1000*60))%60);
	var hrs =parseInt((dur/(1000*60*60))%24);
	if (secd < 10){
		secd = "0" + secd;
	}
	if (mint < 10){
		mint = "0" + mint;
	}
	if (hrs < 10){
		hrs = "0" + hrs;
	}
	dur = hrs+":"+mint+":"+secd;
	return dur;
//	setInterval(startTime(that), 1000);
}