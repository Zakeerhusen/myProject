sap.ui.controller("fullscreenapp.reprintLabel", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf fullscreenapp.reprintLabel
*/
	onInit: function() {

		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "reprintLabel") {
				that.onReasonChange();
				that.onPrintChange();
				that.oReprintLabel();
			}
		});
	
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf fullscreenapp.reprintLabel
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf fullscreenapp.reprintLabel
*/
//	onAfterRendering: function() {
//		var object = this.getView().getModel('logUserJson').getData().UserRepBut.results;
//		for(var i = 0; i<object.length; i++){
//			if(object[i].ReportId==="09" && object[i].ActiveButt==="09"){
//				this.getView().byId("reprintTab").setMode("None");
//			}
//		}
//	},
	
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
	
	applySearchPatternToListItem: function(i, searchValue) {
	    if (searchValue == "") {
	        return true;
	    }
	    var property = this.getView().getModel("jsonModel5").getData().ReprintSet[i.getBindingContextPath().split("/")[2]];
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
	
	_oDialog13 : "",
	onReprintSort : function(){
		 if (!this._oDialog13) {
			 this._oDialog13 = sap.ui.xmlfragment("sap.ui.demo.fragments.ReprintSorting", this);
			 }
			 // toggle compact style
			 jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog13);
			 this._oDialog13.open()
	},
	
	reprintSort : function(oEvent){
		var oView = this.getView();
		var oTable = oView.byId("reprintTab");
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
	
	
	search : function(oEvt){
		var searchValue = oEvt.getSource().getValue();
		searchValue = searchValue.toLowerCase();
	    var items = this.getView().byId("reprintTab").getItems();
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
	
	
	oReprintLabel : function() {
		var a =[];
		var that = this;
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("ReprintSet/?$filter=ImDate eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "'",null,null,true,
				function(oData, oResponse) {
					var array = [];
					if (!(oData.results instanceof Array)) {
						array.push(oData.results);
					} else {
						array = oData.results;
					}
					for (var i = 0; i < array.length; i++) {
						array[i].PrintTime = dateConvertion(array[i].PrintTime, "hh:mm:ss a");
					}
					var jsonModel5 = that.getView().getModel('jsonModel5');
					jsonModel5.oData["ReprintSet"] = array;
					jsonModel5.refresh();
				},
				function(oError) {
					that.getView().getModel('jsonModel5').setData(a);

					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
		
	},

	onReasonChange : function() {
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel.read("ReasonsSet",null,null,true,
				function(oData, oResponse) {
			reasonArray = oData.results;
			var sCheck = [];
			var pCheck = [];
			for (var i = 0; i < reasonArray.length; i++) {
				var obj = {};
				if (reasonArray[i].ReasonType == "P") {
					obj["ReasonP"] = (reasonArray[i].Reason+ "-" + reasonArray[i].ReasonText);
					pCheck.push(obj);
				} else {

				}
			}
			var x = {};
			x["results"] = pCheck;
			that.getView().getModel('jsonModel10').setData(x);

		},
		function(oError) {
			sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
		}
		);
	},
	
	onPrintChange : function() {
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel.read("StorePrintersSet",null,null,true,
				function(oData, oResponse) {
					that.getView().getModel('printJSonModel').setData(oData);
					sap.ui.getCore().byId("printer").setModel(that.getView().getModel('printJSonModel'));
				},
				function(oError) {
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
	},
	
	onBagIdChange:function(oEvent){
		if (!this._oReprintReason) {
			this._oReprintReason = sap.ui.xmlfragment("sap.ui.demo.fragments.ReprintReason", this);
			this.getView().addDependent(this._oReprintReason);
			this._oReprintReason.setModel(this.getView().getModel('jsonModel10'));
		}
		var row = oEvent.getParameter('listItem').getBindingContext('jsonModel5').getObject();
		this.getView().getModel('jsonModel10').setProperty('/OrderId', row.ImOrdbag);
		this.getView().getModel('jsonModel10').setProperty('/selectedReason',null);
		this._oReprintReason.open();
		
	},
	onCancel:function(){
		this._oReprintReason.close();
	},
	reprintOrder : function() {
		var that = this;
		var val = this.returnSelectedDate();
//		var store = this.getView().byId("store").getValue();
//		var split = store.split("-");
		if(this.getView().getModel('jsonModel10').getProperty('/selectedReason')==null){
			sap.m.MessageToast.show('Please Select a reason code');
			return;
		}
		var plant =this.returnSelectedStore();
		var orderId = this.getView().getModel('jsonModel10').getProperty('/OrderId');
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("ReprintSet(ImDate=datetime'" + val+ "T00:00:00',ImOrdbag='"+ orderId + "',ImWerks='"+ plant + "')",null,null,true,
				function(oData, oResponse) {
			reprintObject = oData;
			that.getView().getModel('jsonModel4').setData(oData);
			var reason = that.getView().getModel('jsonModel10').getProperty('/selectedReason');
			var split1 = reason.split("-");
			var reason1 = split1[0];
			reprintObject.Reason = reason1;
			oModel.update("/ReprintSet(ImDate=datetime'" + val+ "T00:00:00',ImOrdbag='"+ orderId + "',ImWerks='"+ plant + "')",reprintObject,null,
					function(oData) {
				status = "success";
				console.log("success");
				jQuery.sap.require("sap.m.MessageToast");
				sap.m.MessageToast.show("Reprint is successful");
				var oTable = that.getView().byId("reprintTab");
				oTable.removeSelections();
				that.oReprintLabel();
				that._oReprintReason.close();
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
			//that.getView().byId("reason").setSelectedItem(new sap.ui.core.Item({}));
			//var oTable = this.getView().byId("reprintTab");
			//oTable.removeSelections();
		},
		function(oError) {
			that.getView().getModel('jsonModel4').setData([]);
			sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
		}
		);
	},
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf fullscreenapp.reprintLabel
*/
//	onExit: function() {
//
//	}

});

var sound = new Audio("background_sound/beep.mp3");