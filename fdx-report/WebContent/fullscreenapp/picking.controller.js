sap.ui.controller("fullscreenapp.picking", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf pickcheckout.picking
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "picking") {
				that.onPickingCheckMonitor();
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf pickcheckout.picking
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf pickcheckout.picking
*/
//	onAfterRendering: function() {
//		var object = this.getView().getModel('logUserJson').getData().UserRepBut.results;
//		for(var i = 0; i<object.length; i++){
//			if(object[i].ReportId==="03" && object[i].ActiveButt==="04"){
//				this.getView().byId("transferWork").setEnabled(false);
//			}
//		}
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf pickcheckout.picking
*/
//	onExit: function() {
//
//	}
	
	onPickingCheckMonitor : function() {
		var that= this;
		var deviceTable = this.getView().byId("deviceTable");
		var checkoutTable = this.getView().byId("checkoutTable");
		var pickChart = this.getView().byId("pickDevChart");
		var checkChart = this.getView().byId("checkDevChart");
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		var deviceData = [];
		var checkoutData = [];
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("PickCheckMoniSet?$filter=ImVdatu eq datetime'"+val+"T00:00:00' and ImWerks eq '"+plant+"'",null,null,true,
				function(oData, oResponse) {
					that.getView().getModel('jsonModel').setData(oData);
					that.getView().byId("deviceDetailsTable").setModel(that.getView().getModel('jsonModel'));
				},
				function(oError) {
					that.getView().byId("deviceDetailsTable").getModel().setData([]);
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
		oModel.read("SummCartsSet(ImVdatu=datetime'"+val+"T00:00:00',ImWerks='"+plant+"')",null,null,true,
				function(oData, oResponse) {
					deviceData.push({"Type":"Picking Device","SetUp":oData.PickSet,"Picking":oData.PickPick,"Offload":oData.PickOff,"Inactive":oData.PickInact,"Total":oData.PickTot});
					checkoutData.push({"Type":"Check Out","SetUp":oData.CheckSet,"Picking":oData.CheckPick,"Offload":oData.CheckOff,"Inactive":oData.CheckInact,"Total":oData.CheckTot});
					var deviceModel = new sap.ui.model.json.JSONModel();
					deviceModel.setData({
						data: deviceData
					});
					deviceTable.setModel(deviceModel);
					deviceTable.bindItems("/data", that.getView().byId("deviceItem"));
					
					var checkoutModel = new sap.ui.model.json.JSONModel();
					checkoutModel.setData({
						data: checkoutData
					});
					checkoutTable.setModel(checkoutModel);
					checkoutTable.bindItems("/data", that.getView().byId("checkoutItem"));
					
					//Picking Device Chart
					var pickDeviceData = [];
					pickDeviceData.push({"Status":"Set Up","Count":+oData.PickSet});
					pickDeviceData.push({"Status":"Picking","Count":+oData.PickPick});
					pickDeviceData.push({"Status":"Offload","Count":+oData.PickOff});
					pickDeviceData.push({"Status":"Inactive","Count":+oData.PickInact});
					var pickDeviceModel = new sap.ui.model.json.JSONModel();
					pickChart.setModel(pickDeviceModel);
					pickDeviceModel.setData(pickDeviceData);
					that.getView().byId("pickDevTotal").setText("Total: " + oData.PickTot);
					
					//CheckOut Device Chart
					var checkDeviceData = [];
					checkDeviceData.push({"Status":"Set Up","Count":+oData.CheckSet});
					checkDeviceData.push({"Status":"Picking","Count":+oData.CheckPick});
					checkDeviceData.push({"Status":"Offload","Count":+oData.CheckOff});
					checkDeviceData.push({"Status":"Inactive","Count":+oData.CheckInact});
					var checkDeviceModel = new sap.ui.model.json.JSONModel();
					checkChart.setModel(checkDeviceModel);
					checkDeviceModel.setData(checkDeviceData);
					that.getView().byId("checkoutTotal").setText("Total: " + oData.CheckTot);
				},
				function(oError) {
					that.getView().byId("deviceTable").getModel().setData(a);
					that.getView().byId("checkoutTable").getModel().setData(a);
					that.getView().byId("pickDevChart").getModel().setData(a);
					that.getView().byId("checkDevChart").getModel().setData(a);
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
	},
	
	onPickingDeviceListPress : function(oEvent){
		this.getView().byId("gridViewDevice").setVisible(true);
		this.getView().byId("listViewDevice").setVisible(false);
		this.getView().byId("deviceTable").setVisible(false);
		this.getView().byId("pickDevChart").setVisible(true);
		this.getView().byId("pickDevTotal").setVisible(true);
	},
	
	onPickingDeviceGridPress : function(oEvent){
		this.getView().byId("gridViewDevice").setVisible(false);
		this.getView().byId("listViewDevice").setVisible(true);
		this.getView().byId("deviceTable").setVisible(true);
		this.getView().byId("pickDevChart").setVisible(false);
		this.getView().byId("pickDevTotal").setVisible(false);
	},
	
	onCheckoutListPress : function(oEvent){
		this.getView().byId("gridViewCheckout").setVisible(true);
		this.getView().byId("listViewCheckout").setVisible(false);
		this.getView().byId("checkoutTable").setVisible(false);
		this.getView().byId("checkDevChart").setVisible(true);
		this.getView().byId("checkoutTotal").setVisible(true);
	},
	
	onCheckoutGridPress : function(oEvent){
		this.getView().byId("gridViewCheckout").setVisible(false);
		this.getView().byId("listViewCheckout").setVisible(true);
		this.getView().byId("checkoutTable").setVisible(true);
		this.getView().byId("checkDevChart").setVisible(false);
		this.getView().byId("checkoutTotal").setVisible(false);
	},
	
	returnSelectedStore:function(){
		var selectedStore = this.getView().getModel('jsonModel2').getProperty('/selectedStore');
		return selectedStore;
	},
	
	returnSelectedDate:function(){
		var date = new Date(this.getView().getModel('jsonModel2').getProperty('/dateValue'));
		var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
		var selectedDate = year + "-" + month + "-" + day;
		return selectedDate;
	},
	_oDialog14 : "",
	onPickCheckSort: function(){
		if (!this._oDialog14) {
			this._oDialog14 = sap.ui.xmlfragment("sap.ui.demo.fragments.PickingCheckSorting", this);
		}
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog14);
		this._oDialog14.open();
	},

	pickCheckSort: function(oEvent) {
		var oView = this.getView();
		var oTable = oView.byId("deviceDetailsTable");
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
	applySearchPatternToListItem: function(i, searchValue) {
	    if (searchValue == "") {
	        return true;
	    }
	    var property = this.getView().byId("deviceDetailsTable").getModel().getData().results[i.getBindingContextPath().split("/")[2]];
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
	    var items = this.getView().byId("deviceDetailsTable").getItems();
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
	
	onPickExMonSelect : function(oEvent){
		pickInd = oEvent.getParameter("listItem").getBindingContextPath().split("/")[2];
		orderId = this.getView().getModel("jsonModel").getData().results[pickInd].Vbeln;
	},
	
	_oDialog3 : "",
	ontransferWork : function() {
		if(this.getView().byId("deviceDetailsTable").getSelectedItem()==undefined || this.getView().byId("deviceDetailsTable").getSelectedItem()==null){
//			sound.play();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert("Select a cart to transfer");
		}
		else{
			var val = this.returnSelectedDate();
			var plant = this.returnSelectedStore();
			var oModel = this.getView().getModel('myOdataModel');
			var status = this.getView().getModel("jsonModel").getData().results[pickInd].CartType;
			var that = this;
			oModel.read("PickCheckMoniSet?$filter=ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "' and CartType eq '"+ status+ "' and Avilable eq 'X'",null,null,true,
					function(oData, oResponse) {
						that.getView().getModel('transCartModel').setData(oData);
						if (!that._oDialog3) {
							that._oDialog3 = sap.ui.xmlfragment("sap.ui.demo.fragments.TransferWork",that);
						}
						that.getView().addDependent(that._oDialog3);
						that._oDialog3.setModel(that.getView().getModel('transCartModel'));
						that._oDialog3.open();
						var myDatePicker = sap.ui.getCore().byId('toCart');
						myDatePicker.attachBrowserEvent('keydown',function(evt){
							evt.preventDefault();
						});
						var object = that.getView().getModel("jsonModel").getData().results[pickInd];
						sap.ui.getCore().byId("twork").setValue(object.CartId);
						sap.ui.getCore().byId("toCart").setValue("");
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
		}
	},
	
	onTWOk : function() {
		var twDetail = this.getView().getModel("jsonModel").getData().results[pickInd];
		twDetail.ToCartId = sap.ui.getCore().byId('toCart').getValue();
		fromCart = twDetail.CartId;
		var that = this;
		var val = this.returnSelectedDate();
		var plant = this.returnSelectedStore();
		var oModel = this.getView().getModel('myOdataModel');
		oModel.update("PickCheckMoniSet(ImAsset='" + fromCart+ "',ImVdatu=datetime'" + val+ "T00:00:00',ImWerks='"+ plant + "')",twDetail,null,
				function(oData) {
					status = "success";
					console.log("update success display");
					that.onPickingCheckMonitor();
					sap.ui.getCore().byId("toCart").setSelectedItem(new sap.ui.core.Item({}));
					var oTable = that.getView().byId("deviceTable");
					oTable.removeSelections();
					that.closeDialog3();
				},
				function(oError) {
					status = "error";
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
	},

	closeDialog3 : function() {
		this._oDialog3.close();
	},
	
	onOrderListDblClk : function(oEvent) {
		//	
			var orderId = oEvent.getSource().getBindingContext().getObject().Vbeln;
			
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
					that._oOrderDetails = sap.ui.xmlfragment('idOrdDtlsFragInPicking',"sap.ui.demo.fragments.DisplayOrderDetails",that);
					that.getView().addDependent(that._oOrderDetails);
					that._oOrderDetails.setModel(that.getView().getModel('displayOrderDetailsModel'))
				}
				//sap.ui.core.UIComponent.getRouterFor(that).getView('fullscreenapp.OrderDetails').getController().onOrderIdChange();
				//sap.ui.getCore().byId("idOrdDtlsFrag--orderId").setValue(orderId);
				that._oOrderDetails.open();
			},
			function(oError) {
				that.getView().getModel('displayOrderDetailsModel').setData(c);
				//that.getView().byId("idOrderDetailsTable").setModel(sap.ui.controller("fdx_report.TabsView").oJSONModel8);
				//TODO -set model to fragment
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
//				that.getView().getModel('jsonModel3').setData({"model" : oData});
				that.getView().getModel('displayOrderDetailsModel').setProperty("/model" , oData);
				//that.getView().byId("VB1").setModel(sap.ui.controller("fdx_report.TabsView").oJSONModel3);
				//that.getView().byId("VB1").bindContext("/model");
//				sap.ui.getCore().byId('idOrdDtlsFrag--VB1').bindContext("/model");
				//that.getView().byId("VB2").setModel(sap.ui.controller("fdx_report.TabsView").oJSONModel3);
//				that.getView().byId("VB2").bindContext("/model");
//				sap.ui.getCore().byId('idOrdDtlsFrag--VB2').bindContext("/model");
				//that.orderAutoRefresh();
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
		

		/*returnSelectedDate:function(){
			var date = new Date(this.getView().getModel('jsonModel2').getProperty('/dateValue'));
			var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
			var selectedDate = year + "-" + month + "-" + day;
			return selectedDate;
		},

		returnSelectedStore:function(){
			var selectedStore = this.getView().getModel('jsonModel2').getProperty('/selectedStore');
			return selectedStore;
		},*/

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
		    var items = sap.ui.getCore().byId("idOrdDtlsFragInPicking--idOrderDetailsTable").getItems();
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
		
		onNavToOrderDtls:function(oEvent){
			var orderId = oEvent.getSource().getModel().getProperty('/model/ImVbeln');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo('orderDetails',{},true);
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').byId('orderId').setValue(orderId);
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').getController().onOrderIdChange();
		}


});
var pickInd;
var orderId;