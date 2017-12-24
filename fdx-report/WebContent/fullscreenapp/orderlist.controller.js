sap.ui.controller("fullscreenapp.orderlist", {

	/**
	* Called when a controller is instantiated and its View controls (if available) are already created.
	* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	* @memberOf fullscreenapp.OrderList
	*/
		
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var that=this;
			this.oRouter.attachRoutePatternMatched(function(oEvent) {
				if (oEvent.getParameter("name") === "orderlist") {
					that.onOrderList();
				}
			});
		},

	/**
	* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	* (NOT before the first rendering! onInit() is used for that one!).
	* @memberOf fullscreenapp.ExceptionReport
	*/
//		onBeforeRendering: function() {
	//
//		},

	/**
	* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	* This hook is the same one that SAPUI5 controls get after being rendered.
	* @memberOf fullscreenapp.ExceptionReport
	*/
//		onAfterRendering: function() {
//			var object = this.getView().getModel('logUserJson').getData().UserRepBut.results;
//			for(var i = 0; i<object.length; i++){
//				if(object[i].ReportId==="04" && object[i].ActiveButt==="05"){
//					this.getView().byId("reqNew").setEnabled(false);
//				}
//			}
//		},

	/**
	* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	* @memberOf fullscreenapp.ExceptionReport
	*/
//		onExit: function() {
	//
//		}
		
		
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
		
		
		printVisible : function(oValue) {
			if (oValue === "PRINT") {
				return true;
			} else {
				return false;
			}
		},
		
		
		applySearchPatternToListItem: function(i, searchValue) {
		    if (searchValue == "") {
		        return true;
		    }
		    var property = this.getView().getModel("jsonModel4").getData().results[i.getBindingContextPath().split("/")[2]];
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
		    var items = this.getView().byId("idProductsTable3").getItems();
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
		
		
		onPrint : function(oEvent) {
			var that = this;
			var oTable = this.getView().byId("idProductsTable3");
			oTable.setSelectedItem(oEvent.getSource().getParent());
			sap.m.MessageBox.confirm("Are you sure you want to print ?", {
			    title: "Confirm Print", 
			    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],// default
			    onClose: function(oAction) { 
			    	console.log('called');
			    	that.fnDoPrint(oAction);
			    }   ,                                  // default
			    styleClass: "" ,                                      // default
			    });
			
			
		},
		fnDoPrint:function(oAction){
			
			var oTable = this.getView()
			.byId("idProductsTable3");
			if(oAction=='YES'){
				var salesOrd = oTable.getSelectedItem().getBindingContext().getObject().Salesorder;
				var val = this.returnSelectedDate();
				var plant = this.returnSelectedStore();
				var oModel = this.getView().getModel('myOdataModel');
				oModel.read("StoreDelWinOrderlistSet(ImVdatu=datetime'"+ val + "T00:00:00',ImWerks='" + plant+ "',Salesorder='" + salesOrd + "')", null,null, true,
						function(oData, oResponse) {
							sap.m.MessageToast.show("Order Successfully printed");
						}, 
						function(oError) {
							sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
						}
				);
			}
			
		},
		onDateChange : function() {
			var that= this;
			/*var date = new Date(this.getView().byId("DP1").getValue());
			var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
			var selectedDate = year + "-" + month + "-" + day;
			this.oDate.push(selectedDate);
			this.onOverview();
			this.onException();
			return selectedDate;*/
//			this.onOverview();
			this.onOrderList();
			
			
		},
		
		
		onNewRequest : function(){
			var that = this;
			var val = this.returnSelectedDate();
			var store = this.returnSelectedStore();
			var split = store.split("-");
			var plant = store;
			var oModel = this.getView().getModel('myOdataModel');
			oModel.read("ReqordpriSet(ImVdatu=datetime'"+val+"T00%3A00%3A00',ImPlant='"+plant+"')",null,null,true,
					function(oData, oResponse) {
						console.log("read success display");
						that.onOrderList();
					},
					function(oError) {
						sound.play();
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
						setTimeout(function(){
							$(document.activeElement).blur();
							},150);
						that.onOrderList();
					}
			);	
		},
		
		onOrderList : function() {
			var a = [];
			var that = this;
			var val = this.returnSelectedDate();
			var store = this.returnSelectedStore();
			var split = store.split("-");
			var plant = store;
			var oModel = this.getView().getModel('myOdataModel');
			oModel.read("StoreDelWinOrderlistSet/?$filter=ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "'",null,null,false,
					function(oData, oResponse) {
						var jsonModel4 = that.getView().getModel('jsonModel4');
						jsonModel4.setData(oData);
						for (var i = 0; i < oData.results.length; i++) {
							oData.results[i].Delwins = dateConvertion(oData.results[i].Delwins, "hh:mm ");
							oData.results[i].Delwine = dateConvertion(oData.results[i].Delwine, "hh:mm ");
						}
						that.getView().byId("idProductsTable3").setModel(jsonModel4);
						ovDClk = false;
						setTimeout(function(){
							that.onPendThresh();
						},500);
					},
					function(oError) {
						that.getView().getModel('jsonModel4').setData(a);
						sound.play();
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
						setTimeout(function(){
							$(document.activeElement).blur();
							},150);
					}
			);
		},
		_oDialog9 : "",
		onOrderSort : function(){
			if (!this._oDialog9) {
				this._oDialog9 = sap.ui.xmlfragment("sap.ui.demo.fragments.OrderListSorting", this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog9);
			this._oDialog9.open();
		},

		orderSort : function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("idProductsTable3");
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
		/********** Display Order Fragent Code *******************************/
		onOrderListDblClk : function(oEvent) {
			//	
			var orderId = oEvent.getSource().getBindingContext().getObject().Salesorder;

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
					that._oOrderDetails = sap.ui.xmlfragment('idPickOrdDtlsFrag',"sap.ui.demo.fragments.DisplayOrderDetails",that);
					that.getView().addDependent(that._oOrderDetails);
					that._oOrderDetails.setModel(that.getView().getModel('displayOrderDetailsModel'))
				}
				//sap.ui.core.UIComponent.getRouterFor(that).getView('fullscreenapp.OrderDetails').getController().onOrderIdChange();
				//sap.ui.getCore().byId("idOrdDtlsFrag--orderId").setValue(orderId);
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
//				that.getView().getModel('jsonModel3').setData({"model" : oData});
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
		searchOrdDetails : function(oEvt){
			var searchValue = oEvt.getSource().getValue();
			searchValue = searchValue.toLowerCase();
			var items = sap.ui.getCore().byId("idPickOrdDtlsFrag--idOrderDetailsTable").getItems();
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
		onCloseOrderDetails:function(){
			this._oOrderDetails.close();
		},
		/*************** Display Order Fragment Over *************************/
		
		
		onPendThresh : function(){
			var penOrLimit =parseInt(this.getView().getModel('logUserJson').getData().Pendalert);
			var items = this.getView().byId('idProductsTable3').getItems();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var penOrd = item.getCells()[4].getText();
				if(penOrd>=penOrLimit){
					var id = item.getCells()[4].getId();
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
		
		fnRenderViewAccToDeliveryWindow : function(delWindow) {
			var that = this;
			var val = this.returnSelectedDate();
			var plant = this.returnSelectedStore();
			var oModel = this.getView().getModel('myOdataModel');
			oModel.read("StoreDelWinSet(ImVdatu=datetime'"+ val + "T00:00:00',ImWerks='"+ plant + "',Delwindow='"+ delWindow + "')/DelWinOrders",null,null,true,
					function(oData, oResponse) {
				var jsonModel4 = that.getView().getModel('jsonModel4');
				jsonModel4.setData(oData)
				that.getView().byId("idProductsTable3").setModel(jsonModel4);
				jsonModel4.refresh();
			},
			function(oError) {
				sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
			}
			);
		},
		
		onNavToOrderDtls:function(oEvent){
			var orderId = oEvent.getSource().getModel().getProperty('/model/ImVbeln');
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo('orderDetails',{},true);
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').byId('orderId').setValue(orderId);
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').getController().onOrderIdChange();
			}

	});

var ovDClk = false;

var sound = new Audio("background_sound/beep.mp3");