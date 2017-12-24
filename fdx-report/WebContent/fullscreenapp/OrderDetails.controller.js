sap.ui.controller("fullscreenapp.OrderDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf fullscreenapp.OrderDetails
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "orderDetails") {
				that.onOrderIdChange();
				that.getView().byId('idOrderDtlsContainer').setVisible(false);
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf fullscreenapp.OrderDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf fullscreenapp.OrderDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf fullscreenapp.OrderDetails
*/
//	onExit: function() {
//
//	}
	
	onOrderIdChange : function() {
		var orderId = this.getView().byId("orderId").getValue();
		var that = this;
		var jsonModel = that.getView().getModel('jsonModel');
		var jsonModel1 = that.getView().getModel('jsonModel1');
		that.getView().byId("VB1").setModel(jsonModel1);
		that.getView().byId("VB2").setModel(jsonModel1);
		that.getView().byId("idOrderDetailsTable").setModel(jsonModel);
		if(orderId!=""){
//			if (_gInterval != undefined) {
//				that.orderAutoRefresh();
//			}
			var val = this.returnSelectedDate();
			var store = this.returnSelectedStore();//this.returnSelectedStore()
			var split = store.split("-");
			var plant = store;
			var oModel = this.getView().getModel('myOdataModel');
			oModel.read("OrderDetHeaderSet(ImDelDate=datetime'"+ val + "T00:00:00',ImPlant='"+ plant + "',ImVbeln='"+ orderId + "')",null,null,true,
					function(oData, oResponse) {
						that.getView().byId('idOrderDtlsContainer').setVisible(true);
						oData.DispatchTime = "@ "+ dateConvertion(oData.DispatchTime, "hh:mm:ss a");
						oData.SetupdoneTime = "@ "+ dateConvertion(oData.SetupdoneTime, "hh:mm:ss a");
						oData.PickingstartTime = "@ "+ dateConvertion(oData.PickingstartTime, "hh:mm:ss a");
						oData.PickingdoneTime = "@ "+ dateConvertion(oData.PickingdoneTime, "hh:mm:ss a");
						oData.OffloadedTime = "@ "+ dateConvertion(oData.OffloadedTime, "hh:mm:ss a");
						oData.CheckoutTime = "@ "+ dateConvertion(oData.CheckoutTime, "hh:mm:ss a");
						oData.AtcheckoutTime = "@ "+ dateConvertion(oData.AtcheckoutTime, "hh:mm:ss a");
						oData.AtstagingTime = "@ "+ dateConvertion(oData.AtstagingTime, "hh:mm:ss a");
						jsonModel1.setData({"model" : oData});
						that.getView().byId("VB1").bindContext("/model");
						that.getView().byId("VB2").bindContext("/model");
						oModel.read("OrderItemsSet/?$filter=ImDelDate eq datetime'"+ val+ "T00%3A00%3A00' and ImPlant eq '"+ plant + "' and ImVbeln eq '"+ orderId + "'",null,null,true,
								function(oData, oResponse) {	
									jsonModel.setData(oData);
									jsonModel.refresh();
									setTimeout(function(){
										that.onPendThresh();
									},500);
								},
								function(oError) {
									that.getView().byId("idOrderDetailsTable").getModel().setData([]);
									sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
								}
						);
					},
					function(oError) {
						that.getView().byId("VB2").getModel().setData([]);
						that.getView().byId("VB1").getModel().setData([]);
						that.getView().byId("orderId").setValue("");
						sound.play();
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
						setTimeout(function(){
							$(document.activeElement).blur();
							},150);
					}
			);
		}
		else{
			that.getView().byId("idOrderDetailsTable").getModel().setData([]);
			that.getView().byId("VB2").getModel().setData([]);
			that.getView().byId("VB1").getModel().setData([]);
		}
	},
	
	returnSelectedDate:function(){
		var date = new Date(this.getView().getModel('jsonModel2').getProperty('/dateValue'));
		var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
		var selectedDate = year + "-" + month + "-" + day;
		return selectedDate;
	},
	
	returnSelectedStore:function(){
		var selectedStore = this.getView().getModel('jsonModel2').getProperty('/selectedStore');
		return selectedStore;
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
	    var items = this.getView().byId("idOrderDetailsTable").getItems();
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
	
	applySearchPatternToListItem: function(i, searchValue) {
	    if (searchValue == "") {
	        return true;
	    }
	    var property = this.getView().getModel("jsonModel").getData().results[i.getBindingContextPath().split("/")[2]];
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
	
	onPendThresh : function(){
		var penOrLimit =parseInt(this.getView().getModel('logUserJson').getData().Pendalert);
		var items = this.getView().byId('idOrderDetailsTable').getItems();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var penOrd = item.getCells()[5].getText();
			if(penOrd>=penOrLimit){
				var id = item.getCells()[5].getId();
				var cellParent = $('#'+id)[0];
				cellParent.style.backgroundColor = "#FF6C60";
				cellParent.style.paddingLeft = "6px";
				cellParent.style.paddingRight = "6px";
				cellParent.style.paddingTop = "1px";
				cellParent.style.paddingBottom = "1px";
				cellParent.style.borderRadius = "3px";
				cellParent.style.color = "#fff";
			}
		}
	},
	
});
var sound = new Audio("background_sound/beep.mp3");