sap.ui.controller("fullscreenapp.ExceptionReport", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf fullscreenapp.ExceptionReport
*/
	_oDialog1 : "",
	_oDialog4 : "",
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "exception") {
				that.onException();
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf fullscreenapp.ExceptionReport
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf fullscreenapp.ExceptionReport
*/
//	onAfterRendering: function() {
//		var object = this.getView().getModel('logUserJson').getData().UserRepBut.results;
//		for(var i = 0; i<object.length; i++){
//			if(object[i].ReportId==="02" && object[i].ActiveButt==="02"){
//				this.getView().byId("conException").setEnabled(false);
//				this.getView().byId("conSwpException").setEnabled(false);
//			}
//			if(object[i].ReportId==="02" && object[i].ActiveButt==="03"){
//				this.getView().byId("srtException").setEnabled(false);
//				this.getView().byId("srtSwpException").setEnabled(false);
//			}
//		}
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf fullscreenapp.ExceptionReport
*/
//	onExit: function() {
//
//	}
	onDateChange : function() {
		var that= this;
		/*var date = new Date(this.getView().byId("DP1").getValue());
		var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
		var selectedDate = year + "-" + month + "-" + day;
		this.oDate.push(selectedDate);
		this.onOverview();
		this.onException();
		return selectedDate;*/
//		this.onOverview();
		this.onException();
		
		
	},
	
	returnSelectedDate:function(){
		var date = new Date(this.getView().getModel('jsonModel2').getProperty('/dateValue'));
		var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
		var selectedDate = year + "-" + month + "-" + day;
		return selectedDate;
	},
	
	onException : function() {
		var a = [];
		var b= [];
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel.read("ExceptionsSet?$filter=ImDelDate eq datetime'"+ val+ "T00:00:00' and ImPlant eq '"+ plant + "'",null,null,true,
				function(oData, oResponse) {
					var array = [];
					if (!(oData.results instanceof Array)) {
						array.push(oData.results);
					} else {
						array = oData.results;
					}
					/*for (var i = 0; i < array.length; i++) {
						var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern : "hh:mm:ss a"});
						var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
						var dispTime = array[i].DispatchTime;
						if(dispTime.ms===0){
							array[i].DispatchTime = "00:00:00 AM"
						}
						else{
							array[i].DispatchTime = timeFormat.format(new Date(dispTime.ms+ TZOffsetMs));
						}
					}*/
					for (var i = 0; i < array.length; i++) {
						array[i].DispatchTime = dateConvertion(array[i].DispatchTime, "hh:mm:ss a");
					}
					var jsonModel3 = that.getView().getModel('jsonModel3');
					jsonModel3.oData["ExceptionsSet"] = array;
//					sap.ui.controller("fdx_report.TabsView").oJSONModel3.refresh();
					jsonModel3.refresh();
				},
				function(oError) {
					that.getView().getModel('jsonModel3').setData(a);
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
	},
	/** this method is used to remove the swipe content when user selects any row
	 * 
	 */
	onSelectionChange:function(oEvent){	
		var oTable = oEvent.getSource();
		var selectedItems = oTable.getSelectedItems();
		if(selectedItems.length===0){
			if (!this._oSwipeContent) {
				this._oSwipeContent = sap.ui.xmlfragment("sap.ui.demo.fragments.SwipeContent", this);
				this.getView().addDependent(this._oSwipeContent);
			}
			oTable.setSwipeContent(this._oSwipeContent)
			
		}
		else{
			oTable.setSwipeContent();
		}
		oTable.removeSelections(true);
		if(oEvent.getParameter('selected')){
			oTable.setSelectedItem(oEvent.getParameter('listItem'));
			this.getView().byId('idExceptionActions').setVisible(true);
		}
		else{
			//set exception buttons invisible
			this.getView().byId('idExceptionActions').setVisible(false);
		}
		
	},
	
	onExcRowSelect : function(oEvent) {
		this.onSelectionChange(oEvent);//to remove/re-add swipe content
		excInd = oEvent.getParameter("listItem").getBindingContextPath().split("/")[2];
		var object = this.getView().getModel("jsonModel3").oData.ExceptionsSet[excInd];
		coSku = object.Sku;
		coOrdId = object.Orderid;
		coOrgLoc = object.Origlocation;
	},
	
	onReasonChange1 : function() {
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel
			.read("ReasonsSet",
					null,
					null,
					true,
					function(oData, oResponse) {
						reasonArray = oData.results;
						var sCheck = [];
						for (var i = 0; i < reasonArray.length; i++) {
							var obj = {};
							if (reasonArray[i].ReasonType == "S") {
								obj["ReasonS"] = (reasonArray[i].Reason
										+ "-" + reasonArray[i].ReasonText);
								sCheck.push(obj);
							} else {
							}
						}
						var x = {};
						x["store"] = sCheck;
						/*sap.ui
								.controller("fdx_report.TabsView").oJSONModel10
								.setData(x);*/
						var jsonModel10 = that.getView().getModel('jsonModel10');
						jsonModel10.setData(x);
						sap.ui
								.getCore()
								.byId("store3")
								.setModel(jsonModel10);
					},
					function(oError) {
						sap.m.MessageToast
								.show(jQuery
										.parseXML(oError.response.body));
					});
},
onConfirmException : function() {
	if(this.getView().byId("idProductsTable9").getSelectedItem()==undefined || this.getView().byId("idProductsTable9").getSelectedItem()==null){
		sound.play();
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.alert("Select an Item to CONFIRM");
	}
	else{
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		var val = this.returnSelectedDate(); //returnSelectedDate
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		var b = this.getView().byId("idProductsTable9").getSelectedItem().sId;
		var split = b.split("-");
		var conInd = split[4];
		oModel.read("ExceptionsSet(ImDelDate=datetime'"+val+"T00:00:00',ImPlant='"+plant+"',Orderid='"+coOrdId+"',Sku='"+coSku+"',Origlocation='"+coOrgLoc+"')",null,null,true,
				function(oData, oResponse) {
					ConObject = oData;
					qty = oData.Qty;
					wind = oData.Wind;
					buom = oData.Buom;
					var oConfirmJsonModel = that.getView().getModel('oConfirmJsonModel');
					oConfirmJsonModel.setData(oData);
					if(oData.Buom=="LB"){
						that.getView().addDependent(that._oDialog1);
						that._oDialog1.open();
						setTimeout(function() {
							sap.ui.getCore().byId("conWgt1").focus();
						}, 400);
						sap.ui.getCore().byId("conWgt1").onsapenter =(function(oEvent) {
							sap.m.InputBase.prototype.onsapenter.apply(sap.ui.getCore().byId("conWgt1"),arguments);
							that.onConfirm(oEvent);
						});
						sap.ui.getCore().byId("confirm1").setModel(oConfirmJsonModel);
						sap.ui.getCore().byId("confirm1").bindContext("/");
						if(batchPick==="X"|| oData.Wind==="2"||oData.Wind==="3"){
							batch = true;
							sap.ui.getCore().byId("plusbtn1").setVisible(true);
							sap.ui.getCore().byId("minusbtn1").setVisible(true);
						}
						else{
							batch = false;
						}
						if(oData.Excode==="WEIGHT EXCEPTION"){
							sap.ui.getCore().byId("conf1UName").setValue("");
							sap.ui.getCore().byId("conf1Pass").setValue("");
							sap.ui.getCore().byId("d1Hb06").setVisible(true);
							sap.ui.getCore().byId("d1Hb07").setVisible(true);
						}else{
							sap.ui.getCore().byId("d1Hb06").setVisible(false);
							sap.ui.getCore().byId("d1Hb07").setVisible(false);
						}
					}
					else if(oData.Buom=="EA"){
						that.getView().addDependent(that._oDialog4);
						that._oDialog4.open();
						setTimeout(function() {
							sap.ui.getCore().byId("conWgt2").focus();
						}, 400);
						sap.ui.getCore().byId("conWgt2").onsapenter =(function(oEvent) {
							sap.m.InputBase.prototype.onsapenter.apply(sap.ui.getCore().byId("conWgt2"),arguments);
							that.onConfirm(oEvent);
						});
						sap.ui.getCore().byId("confirm2").setModel(oConfirmJsonModel);
						sap.ui.getCore().byId("confirm2").bindContext("/");
						if(batchPick==="X"|| oData.Wind==="2"||oData.Wind==="3"){
							batch = true;
							sap.ui.getCore().byId("plusbtn2").setVisible(true);
							sap.ui.getCore().byId("minusbtn2").setVisible(true);
						}
						else{
							batch = false;
						}
					}
				},
				function(oError) {
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
		if (!this._oDialog1) {
			this._oDialog1 = sap.ui.xmlfragment("sap.ui.demo.fragments.Dialog1", this);
		}
		if (!this._oDialog4) {
			this._oDialog4 = sap.ui.xmlfragment("sap.ui.demo.fragments.Dialog3", this);
		}
	}
},

onConfirm : function() {
	if(batch){
		this.excConfirm();
		if(excep){
			if(buom=="LB"){
				sap.ui.getCore().byId("conWgt1").setValue("");
				this.closeDialog1();
			}
			else if(buom=="EA"){
				sap.ui.getCore().byId("conWgt2").setValue("");
				this.closeDialog4();
			}
		}
		else{
		}
	}
	else{
		this.excConfirm();
		if(buom=="LB"){
			sap.ui.getCore().byId("conWgt1").setValue("");
			if(excep){
				sap.ui.getCore().byId("conQty1").setText(parseInt(sap.ui.getCore().byId("conQty1").getText())-1);
				if(parseInt(sap.ui.getCore().byId("conQty1").getText())>0){
					setTimeout(function() {
						sap.ui.getCore().byId("conWgt1").focus();
					}, 400);
				}
				else{
					this.closeDialog1();
				}
			}
		}
		else if(buom=="EA"){
			sap.ui.getCore().byId("conWgt2").setValue("");
			if(excep){
				sap.ui.getCore().byId("conQty2").setText(parseInt(sap.ui.getCore().byId("conQty2").getText())-1);
				if(parseInt(sap.ui.getCore().byId("conQty2").getText())>0){
					setTimeout(function() {
						sap.ui.getCore().byId("conWgt2").focus();
					}, 400);
				}
				else{
					this.closeDialog4();
				}
			}
		}
	}
},

excConfirm : function() {
	var that = this;
	var status;
	excep = false;
	var object = ConObject;
	var orderId = object.Orderid;
	var orderDesc = object.Desc;
	var orderqty = 0;
	if(buom=="LB"){
		orderqty = parseInt(sap.ui.getCore().byId("conQty1").getText());
	}
	else if(buom=="EA"){
		orderqty = parseInt(sap.ui.getCore().byId("conQty2").getText());
	}
	object.Qty = orderqty;
	var location = object.Origlocation;
	var sku = object.Sku;
	object.Exception = 'C';
	if(buom == "EA"){
		object.Upcweight = sap.ui.getCore().byId("conWgt2").getValue();
	}else if(buom == "LB"){
		object.Upcweight = sap.ui.getCore().byId("conWgt1").getValue();
		object.Username = sap.ui.getCore().byId("conf1UName").getValue();
		object.Password = sap.ui.getCore().byId("conf1Pass").getValue();
	}
	if(/^[a-zA-Z0-9- ]*$/.test(object.Upcweight) == false){
		excep = false;
		sound.play();
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.alert("Special characters are not allowed in UPC/Weight field",{
			onClose : function(){
				if(buom == "EA"){
					sap.ui.getCore().byId("conWgt2").setValue("");
				}else if(buom == "LB"){
					sap.ui.getCore().byId("conWgt1").setValue("");
				}
				setTimeout(function(){
					if(buom == "EA"){
						sap.ui.getCore().byId("conWgt2").focus();
					}else if(buom == "LB"){
						sap.ui.getCore().byId("conWgt1").focus();
					}
					}, 500);
			}
		});
		setTimeout(function(){
			$(document.activeElement).blur();
			},150);
	}
	else{
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		var oModel = this.getView().getModel('myOdataModel');
		oModel.update("/ExceptionsSet(ImDelDate=datetime'"+ val + "T00:00:00',ImPlant='"+ plant + "',Orderid='"+ orderId + "',Sku='" + sku+ "',Origlocation='" + location+ "')",object,null,
				function(oData) {
					excep = true;
					status = "success";
					console.log("update success");
				},
				function(oError) {
					excep = false;
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value,{
						onClose : function(){
							if(buom == "EA"){
								sap.ui.getCore().byId("conWgt2").setValue("");
							}else if(buom == "LB"){
								sap.ui.getCore().byId("conWgt1").setValue("");
							}
							setTimeout(function(){
								if(buom == "EA"){
									sap.ui.getCore().byId("conWgt2").focus();
								}else if(buom == "LB"){
									sap.ui.getCore().byId("conWgt1").focus();
								}
								}, 500);
						}
					});
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
	}
},

closeDialog1 : function() {
	sap.ui.getCore().byId("plusbtn1").setVisible(false);
	sap.ui.getCore().byId("minusbtn1").setVisible(false);
	sap.ui.getCore().byId("conWgt1").setValue("");
	this._oDialog1.close();
	this.onException();
	var oTable = this.getView().byId("idProductsTable9");
	oTable.removeSelections();
	this.enableSwipeContent(oTable);
	excInd = 0;
},

closeDialog4 : function() {
	sap.ui.getCore().byId("plusbtn2").setVisible(false);
	sap.ui.getCore().byId("minusbtn2").setVisible(false);
	sap.ui.getCore().byId("conWgt2").setValue("");
	this._oDialog4.close();
	this.onException();
	var oTable = this.getView().byId("idProductsTable9");
	oTable.removeSelections();
	this.enableSwipeContent(oTable);
	excInd = 0;
},

_oDialog2 : "",
onShortException : function() {
	if (!this._oDialog2) {
		this._oDialog2 = sap.ui.xmlfragment("sap.ui.demo.fragments.Dialog2", this);
	}
	this.getView().addDependent(this._oDialog2);
	this.onReasonChange1();
	var object = this.getView().getModel("jsonModel3").oData.ExceptionsSet[excInd];
	sap.ui.getCore().byId("srtPass").setValue("");
	sap.ui.getCore().byId("srtUName").setValue("");
	sap.ui.getCore().byId("srtDesc").setText(object.Desc);
	sap.ui.getCore().byId("srOrdIdc").setText(object.Orderid);
	sap.ui.getCore().byId("srtQty").setText(object.Qty);
	sap.ui.getCore().byId("store3").setValue("");
	this._oDialog2.open();
	var myDatePicker = sap.ui.getCore().byId('store3');
	myDatePicker.attachBrowserEvent('keydown',function(evt){
		evt.preventDefault();
	});
},

onShort : function() {
	var that = this;
	console.log("entered update");
	var status;
	var object = this.getView().getModel("jsonModel3").oData.ExceptionsSet[excInd];
	var orderId = object.Orderid;
	var orderDesc = object.Desc;
	var orderqty = object.Qty;
	var location = object.Origlocation;
	var sku = object.Sku;
	var reason = sap.ui.getCore().byId("store3").getValue();
	var split = reason.split("-");
	var reason1 = split[0];
	object.Reason = reason1;
	object.Username = sap.ui.getCore().byId("srtUName").getValue();
	object.Password = sap.ui.getCore().byId("srtPass").getValue();
	var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern : "hh:mm:ss a"});
	var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
	var milliSecTime = new Date(timeFormat.parse(object.DispatchTime).getTime()- TZOffsetMs).getTime();
	object.DispatchTime = {
			__edmType : "Edm.Time",
			ms : milliSecTime
	};
	object.Exception = 'S';
	var val = this.returnSelectedDate();
	var store = this.returnSelectedStore();
	var split = store.split("-");
	var plant = store;
	var oModel = this.getView().getModel('myOdataModel');
	oModel.update("/ExceptionsSet(ImDelDate=datetime'"+ val + "T00:00:00',ImPlant='"+ plant + "',Orderid='"+ orderId + "',Sku='" + sku+ "',Origlocation='" + location+ "')",object,null,
			function(oData) {
				status = "success";
				console.log("update success");
				that.onException();
				that.closeDialog2();
			},
			function(oError) {
				object.DispatchTime = milliSecTime;
				status = "error";
				sound.play();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
				setTimeout(function(){
					$(document.activeElement).blur();
					},150);
			}
	);
	sap.ui.getCore().byId("store3").setSelectedItem(new sap.ui.core.Item({}));
	var oTable = that.getView().byId("idProductsTable9");
	
	oTable.removeSelections();
	this.enableSwipeContent(oTable);
},

closeDialog2 : function() {
	var that= this;
	sap.ui.getCore().byId("store3").setSelectedItem(new sap.ui.core.Item({}));
	sap.ui.getCore().byId("srtPass").setValue("");
	sap.ui.getCore().byId("srtUName").setValue("");
	var oTable = that.getView().byId("idProductsTable9");
	oTable.removeSelections();
	this.enableSwipeContent(oTable);
	
	this._oDialog2.close();
},
enableSwipeContent:function(oTable){
	
	var selectedItems = oTable.getSelectedItems();
	if(selectedItems.length===0){
		if (!this._oSwipeContent) {
			this._oSwipeContent = sap.ui.xmlfragment("sap.ui.demo.fragments.SwipeContent", this);
			this.getView().addDependent(this._oSwipeContent);
		}
		oTable.setSwipeContent(this._oSwipeContent)
		
	}
	else{
		oTable.setSwipeContent();
	}
	oTable.removeSelections(true);
	this.getView().byId('idExceptionActions').setVisible(false);
},
onSwipe:function(oEvent){
	var that = this;
	var listItem = oEvent.getParameter('listItem');
	var oTable = that.getView().byId("idProductsTable9");
	oTable.getSwipeContent().setBindingContext(oEvent.getParameter('listItem'));
	
},
onConfirmExceptionWithSwipe:function(oEvent){
	var that = this;
	var oTable = that.getView().byId("idProductsTable9");
	oTable.fireSelectionChange({
			listItem:oTable.getSwipeContent().getBindingContext(),
			listItems:[oTable.getSwipeContent().getBindingContext()],
			selected:true
	});
	this.onConfirmException(oEvent);
	
},
onShortExceptionWithSwipe:function(oEvent){
	var that = this;
	var oTable = that.getView().byId("idProductsTable9");
	oTable.fireSelectionChange({
			listItem:oTable.getSwipeContent().getBindingContext(),
			listItems:[oTable.getSwipeContent().getBindingContext()],
			selected:true
	});
	this.onShortException(oEvent);
	
},
returnSelectedStore:function(){
	var selectedStore = this.getView().getModel('jsonModel2').getProperty('/selectedStore');
	return selectedStore;
},

applySearchPatternToListItem: function(i, searchValue) {
    if (searchValue == "") {
        return true;
    }
    var property = this.getView().getModel("jsonModel3").getData().ExceptionsSet[i.getBindingContextPath().split("/")[2]];
    for (var k in property) {
        var v = property[k];
    	if (typeof v == "string") {
            if (v.toLowerCase().indexOf(searchValue) != -1) {
                return true;
            }
        }
    }
    return false;
},

search : function(oEvt){
	var searchValue = oEvt.getSource().getValue();
	searchValue = searchValue.toLowerCase();
    var items = this.getView().byId("idProductsTable9").getItems();
    var v;
    var count = 0;
    var g = null;
    var C = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i] instanceof sap.m.GroupHeaderListItem) {
            if (g) {
                if (C == 0) {
                    g.setVisible(false);
                } else {
                    g.setVisible(true);
                    g.setCount(C);
                }
            }
            g = items[i];
            C = 0;
        } else {
            v = this.applySearchPatternToListItem(items[i], searchValue);
            items[i].setVisible(v);
            if (v) {
                count++;
                C++;
            }
        }
    }
    if (g) {
        if (C == 0) {
            g.setVisible(false);
        } else {
            g.setVisible(true);
            g.setCount(C);
        }
    }
    return count;
},
_oDialog : "",
onExcSort : function(){
	if (!this._oDialog) {
		this._oDialog = sap.ui.xmlfragment("sap.ui.demo.fragments.ExcSorting", this);
	}
	// toggle compact style
	jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
	this._oDialog.open();
},
excSort : function(oEvent) {
	var oView = this.getView();
	var oTable = oView.byId("idProductsTable9");
	var mParams = oEvent.getParameters();
	var oBinding = oTable.getBinding("items");
	var aSorters = [];
	if (mParams.groupItem) {
	var sPath = mParams.groupItem.getKey();
	var bDescending = mParams.groupDescending;
	var vGroup = this.mGroupFunctions[sPath];
	aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
	}
	var sPath = mParams.sortItem.getKey();
	var bDescending = mParams.sortDescending;
	aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	oBinding.sort(aSorters);
},

onOrderListDblClk : function(oEvent) {
	var orderId = oEvent.getSource().getBindingContext('jsonModel3').getObject().Orderid;
	var c  =[];
	var that = this;
	var val = this.returnSelectedDate();
	var plant = this.returnSelectedStore();
	var oModel = this.getView().getModel('myOdataModel');
	that.getView().getModel('displayOrderDetailsModel').setProperty('/model','')
	that.getView().getModel('displayOrderDetailsModel').setProperty('/items','')
	oModel.read("StoreDelWinOrderlistSet(ImVdatu=datetime'"+ val+ "T00%3A00%3A00',ImWerks='"+ plant + "',Salesorder='"+ orderId + "')/OrderItemsdet",null,null,true,
			function(oData, oResponse) {
		that.getView().getModel('displayOrderDetailsModel').setProperty("/items",oData);
		if (!that._oOrderDetails) {
			that._oOrderDetails = sap.ui.xmlfragment('idOrdDtlsFrag',"sap.ui.demo.fragments.DisplayOrderDetails",that);
			that.getView().addDependent(that._oOrderDetails);
			that._oOrderDetails.setModel(that.getView().getModel('displayOrderDetailsModel'))
		}
		that._oOrderDetails.open();
	},
	function(oError) {
		that.getView().getModel('displayOrderDetailsModel').setData(c);
		sound.play();
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
		setTimeout(function(){
			$(document.activeElement).blur();
		},150);
	}
	);
	oModel.read("StoreDelWinOrderlistSet(ImVdatu=datetime'"+ val+ "T00%3A00%3A00',ImWerks='"+ plant + "',Salesorder='"+ orderId + "')/OrderDetails",null,null,true,
			function(oData, oResponse) {
		oData.DispatchTime = "@ "+ dateConvertion(oData.DispatchTime, "hh:mm:ss a");
		oData.SetupdoneTime = "@ "+ dateConvertion(oData.SetupdoneTime, "hh:mm:ss a");
		oData.PickingstartTime = "@ "+ dateConvertion(oData.PickingstartTime, "hh:mm:ss a");
		oData.PickingdoneTime = "@ "+ dateConvertion(oData.PickingdoneTime, "hh:mm:ss a");
		oData.OffloadedTime = "@ "+ dateConvertion(oData.OffloadedTime, "hh:mm:ss a");
		oData.CheckoutTime = "@ "+ dateConvertion(oData.CheckoutTime, "hh:mm:ss a");
		oData.AtcheckoutTime = "@ "+ dateConvertion(oData.AtcheckoutTime, "hh:mm:ss a");
		oData.AtstagingTime = "@ "+ dateConvertion(oData.AtstagingTime, "hh:mm:ss a");
		that.getView().getModel('displayOrderDetailsModel').setProperty("/model" , oData);
	},
	function(oError) {
		that.getView().getModel('displayOrderDetailsModel').setData(c);
		sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
		setTimeout(function(){
			$(document.activeElement).blur();
		},150);
	}
	);
},
/******************** Details Order code Start **************/

onSkuDblClk : function(oEvent) {
	var sku = oEvent.getSource().getBindingContext('jsonModel3').getObject().Sku;
	var c  =[];
	var that = this;
	var val = this.returnSelectedDate();
	var plant = this.returnSelectedStore();
	var oModel = this.getView().getModel('myOdataModel');
	that.getView().getModel('displaySkuSummaryModel').setProperty('/items','');
	that.getView().getModel('displaySkuSummaryModel').setProperty('/model','');
	oModel.read("SkuSummarySet?$filter= ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "' and Matnr eq '"+ sku + "'",null,null,true,
			function(oData, oResponse) {
		that.getView().getModel('displaySkuSummaryModel').setProperty("/items",oData.results);
		if (!that._oSkuDetails) {
			that._oSkuDetails = sap.ui.xmlfragment('idSkuFrag',"sap.ui.demo.fragments.SkuDetails",that);
			that.getView().addDependent(that._oSkuDetails);
			that._oSkuDetails.setModel(that.getView().getModel('displaySkuSummaryModel'));
		}
		that._oSkuDetails.open();
//		that.onValueSku(upcSku);
	},
	function(oError) {
		that.getView().getModel('displaySkuSummaryModel').setData(c);
		sound.play();
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
		setTimeout(function(){
			$(document.activeElement).blur();
		},150);
	}
	);
},

onValueSku : function(oEvent){
	var that = this;
	var c  =[];
	var index = oEvent.getSource().getBindingContextPath().split("/")[2];
	var object = this.getView().getModel("displaySkuSummaryModel").getData().items[index];
	var sku = object.Matnr;
	var val = this.returnSelectedDate();
	var plant = this.returnSelectedStore();
	that.getView().getModel('displaySkuSummaryModel').setProperty('/model','');
	var oModel = this.getView().getModel('myOdataModel');
	oModel.read("SkuSummarySet(ImVdatu=datetime'" + val+ "T00:00:00',ImWerks='"+ plant + "',Matnr='" + sku+ "')/SkuInvMatnr",null,null,true,
		function(oData, oResponse) {
			var array = [];
			if (!(oData.results instanceof Array)) {
				array.push(oData.results);
			} else {
				array = oData.results;
			}
			for ( var i = 0; i < array.length; i++) {
				if (array[i].Wdatu != null) {
					var date = new Date(array[i].Wdatu);
					var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
					var selectedDate = day+ "-" + month + "-"+ year;
					array[i].Wdatu = selectedDate;    
				}
			}
			that.getView().getModel('displaySkuSummaryModel').setProperty("/model",oData.results);
		//	that._oSkuDetails.setModel(that.getView().getModel('displayInvModel'));
		},
		function(oError) {
			that.getView().getModel('displaySkuSummaryModel').setData(c);
			sound.play();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
			setTimeout(function(){
				$(document.activeElement).blur();
			},150);
		}
	);
},

_oDialog10 : "",
onOrderDetSort : function(){
	if (!this._oDialog10) {
		this._oDialog10 = sap.ui.xmlfragment("sap.ui.demo.fragments.OrderDetailSorting", this);
	}
	// toggle compact style
	jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog10);
	this._oDialog10.open();
},

searchOrdDetails : function(oEvt){
	var searchValue = oEvt.getSource().getValue();
	searchValue = searchValue.toLowerCase();
    var items = sap.ui.getCore().byId("idOrdDtlsFrag--idOrderDetailsTable").getItems();
    var v;
    var count = 0;
    var g = null;
    var C = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i] instanceof sap.m.GroupHeaderListItem) {
            if (g) {
                if (C == 0) {
                    g.setVisible(false);
                } else {
                    g.setVisible(true);
                    g.setCount(C);
                }
            }
            g = items[i];
            C = 0;
        } else {
            v = this.applySearchPatternToListItemDisplayDtls(items[i], searchValue);
            items[i].setVisible(v);
            if (v) {
                count++;
                C++;
            }
        }
    }
    if (g) {
        if (C == 0) {
            g.setVisible(false);
        } else {
            g.setVisible(true);
            g.setCount(C);
        }
    }
    return count;
},

applySearchPatternToListItemDisplayDtls: function(i, searchValue) {
    if (searchValue == "") {
        return true;
    }
    var property = this.getView().getModel("displayOrderDetailsModel").getData().items.results[i.getBindingContextPath().split("/")[3]];
    for (var k in property) {
        var v = property[k];
    	if (typeof v == "string") {
            if (v.toLowerCase().indexOf(searchValue) != -1) {
                return true;
            }
        }
    }
    return false;
},

searchSku : function(oEvt){
	var searchValue = oEvt.getSource().getValue();
	searchValue = searchValue.toLowerCase();
    var items = sap.ui.getCore().byId("idSkuFrag--skuSummaryTbl").getItems();
    var v;
    var count = 0;
    var g = null;
    var C = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i] instanceof sap.m.GroupHeaderListItem) {
            if (g) {
                if (C == 0) {
                    g.setVisible(false);
                } else {
                    g.setVisible(true);
                    g.setCount(C);
                }
            }
            g = items[i];
            C = 0;
        } else {
            v = this.applySearchPatternToSku(items[i], searchValue);
            items[i].setVisible(v);
            if (v) {
                count++;
                C++;
            }
        }
    }
    if (g) {
        if (C == 0) {
            g.setVisible(false);
        } else {
            g.setVisible(true);
            g.setCount(C);
        }
    }
    return count;
},

applySearchPatternToSku: function(i, searchValue) {
    if (searchValue == "") {
        return true;
    }
    var property = this.getView().getModel("displaySkuSummaryModel").getData().items[i.getBindingContextPath().split('/')[2]];
    for (var k in property) {
        var v = property[k];
    	if (typeof v == "string") {
            if (v.toLowerCase().indexOf(searchValue) != -1) {
                return true;
            }
        }
    }
    return false;
},

searchInvn : function(oEvt){
	var searchValue = oEvt.getSource().getValue();
	searchValue = searchValue.toLowerCase();
    var items = sap.ui.getCore().byId("idSkuFrag--inventoryTbl").getItems();
    var v;
    var count = 0;
    var g = null;
    var C = 0;
    for (var i = 0; i < items.length; i++) {
        if (items[i] instanceof sap.m.GroupHeaderListItem) {
            if (g) {
                if (C == 0) {
                    g.setVisible(false);
                } else {
                    g.setVisible(true);
                    g.setCount(C);
                }
            }
            g = items[i];
            C = 0;
        } else {
            v = this.applySearchPatternToInventory(items[i], searchValue);
            items[i].setVisible(v);
            if (v) {
                count++;
                C++;
            }
        }
    }
    if (g) {
        if (C == 0) {
            g.setVisible(false);
        } else {
            g.setVisible(true);
            g.setCount(C);
        }
    }
    return count;
},

applySearchPatternToInventory: function(i, searchValue) {
    if (searchValue == "") {
        return true;
    }
    var property = this.getView().getModel("displaySkuSummaryModel").getData().model[i.getBindingContextPath().split('/')[2]];
    for (var k in property) {
        var v = property[k];
    	if (typeof v == "string") {
            if (v.toLowerCase().indexOf(searchValue) != -1) {
                return true;
            }
        }
    }
    return false;
},

orderDetSort : function(oEvent) {
	var oView = this.getView();
	var oTable = oView.byId("idOrderDetailsTable");
	var mParams = oEvent.getParameters();
	var oBinding = oTable.getBinding("items");
	var aSorters = [];
	if (mParams.groupItem) {
	var sPath = mParams.groupItem.getKey();
	var bDescending = mParams.groupDescending;
	var vGroup = this.mGroupFunctions[sPath];
	aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
	}
	var sPath = mParams.sortItem.getKey();
	var bDescending = mParams.sortDescending;
	aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
	oBinding.sort(aSorters);
},
onCloseOrderDetails:function(){
	this._oOrderDetails.close();
},

onCloseSkuDetails:function(){
	this._oSkuDetails.close();
},

onNavToOrderDtls:function(oEvent){
	var orderId = oEvent.getSource().getModel().getProperty('/model/ImVbeln');
	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	oRouter.navTo('orderDetails',{},true);
	sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').byId('orderId').setValue(orderId);
	sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').getController().onOrderIdChange();
	},
	
	onNavSkuSummary:function(oEvent){
		var sku = oEvent.getSource().getModel().getProperty('/items/0/Matnr');
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo('skuSummary',{},true);
		sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.skuSummary').getController().onSkuChange(sku);
		},
/************************Details Order code End **************/
});
/**
*/
var coSku = "";
var coOrdId = "";
var coOrgLoc = "";
var _gInterval = undefined;
check = "";
a =[];  
var sound = new Audio("background_sound/beep.mp3");
var batchPick = "";
var refreshrate=0;
var coSku = "";
var coOrdId = "";
var coOrgLoc = "";
var qty = 0;
var wind = "";
var buom = "";
var oValueItem;
var pendalert;
var batch = false;
var ConObject;
var create = false;
var ovDClk = false;
var delWindow = "";
var cell;
var today = false;
var excep = false;
var reprintObject;
var flag = true;