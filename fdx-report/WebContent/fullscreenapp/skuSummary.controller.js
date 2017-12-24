sap.ui.controller("fullscreenapp.skuSummary", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf fullscreenapp.skuSummary
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "skuSummary") {
				that.onSkuSummary();
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf fullscreenapp.skuSummary
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf fullscreenapp.skuSummary
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf fullscreenapp.skuSummary
*/
//	onExit: function() {
//
//	}

	onSkuSummary : function() {
		var that = this;
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var plant = store;
		var jsonModel1 = that.getView().getModel("jsonModel1"); 
		var oSkuInvJsonModel = this.getView().getModel("oSkuInvJsonModel");
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("SkuSummarySet?$filter=ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "'",null,null,false,
				function(oData, oResponse) {
					jsonModel1.setData(oData);
					jsonModel1.refresh();
					oSkuInvJsonModel.setData([]);
					that.getView().byId("skuSummaryTbl").setModel(jsonModel1);
					setTimeout(function(){
						that.onPendThresh();
					},500);
				},
				function(oError) {
					that.getView().byId("skuSummaryTbl").getModel().setData([]);
//					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
					},150);
				}
		);
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
	
	applySearchPatternToListItem: function(i, searchValue, source) {
	    if (searchValue == "") {
	        return true;
	    }
	    
	    var property = "";
	    if(source.getSource().getId().split("--")[1] === "skuSrch"){
	    	property = this.getView().getModel("jsonModel1").getData().results[i.getBindingContextPath().split("/")[2]];
	    }
	    else if(source.getSource().getId().split("--")[1] === "inventorySrch"){
	    	property = this.getView().getModel("oSkuInvJsonModel").getData().SkuSummarySet[i.getBindingContextPath().split("/")[2]];
	    }
	    
	    
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
		var oSkuInvJsonModel = this.getView().getModel("oSkuInvJsonModel");
		
		var items = "";
		if(oEvt.getSource().getId().split("--")[1] === "skuSrch"){
			oSkuInvJsonModel.setData([]);
			oSkuInvJsonModel.refresh();
			this.getView().byId("inventorySrch").setValue(null);
			items = this.getView().byId("skuSummaryTbl").getItems();
			this.getView().byId("printBtn").setEnabled(false);
		}
		else if(oEvt.getSource().getId().split("--")[1] === "inventorySrch"){
			items = this.getView().byId("inventoryTbl").getItems();
		}
		
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
	            v = this.applySearchPatternToListItem(items[i], searchValue, oEvt);
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
	
	onskuSort: function(){
		if (!this._oDialog8) {
			this._oDialog8 = sap.ui.xmlfragment("sap.ui.demo.fragments.SkuSorting", this);
		}
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog8);
		this._oDialog8.open()
	},
	
	skuSort: function(oEvent) {
		var oView = this.getView();
		var oTable = oView.byId("skuSummaryTbl");
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
	
	onUPCClick : function(oEvent) {
		var index = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
		var object = this.getView().getModel("jsonModel1").getData().results[index];
		var sku = object.Matnr;
		var that = this;
		var val = this.returnSelectedDate();
		var plant = this.returnSelectedStore();
		var jsonModel9 = that.getView().getModel("jsonModel9"); 
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("MatUpcsSet?$filter= ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "' and Matnr eq '"+ sku + "'",null,null,true,
		function(oData, oResponse) {
			jsonModel9.setData(oData);
			that.onAllUPC();
			sap.ui.getCore().byId("upcTable").setModel(jsonModel9);
		},
		function(oError) {
			sound.play();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
			setTimeout(function(){
				$(document.activeElement).blur();
			},150);
		});
	},
	
	onAllUPC : function() {
		if (!this._oDialogUPC) {
			this._oDialogUPC = sap.ui.xmlfragment("sap.ui.demo.fragments.UPCDialog", this);
		}
		this.getView().addDependent(this._oDialogUPC);
		this._oDialogUPC.open();
	},

	closeAllUPc : function() {
		this._oDialogUPC.close();
	},
	
	onPendButton : function() {
		var that = this;
		var val = this.returnSelectedDate();
		var plant = this.returnSelectedStore();
		var jsonModel1 = that.getView().getModel("jsonModel1"); 
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("SkuSummarySet?$filter=ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "' and Pendhist ne 0",null,null,true,
		function(oData, oResponse) {
			console.log(oData);
			jsonModel1.setData(oData);
			that.getView().byId("skuSummaryTbl").setModel(jsonModel1);
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
	},
	
	onValueSku : function(oEvent){
		var that = this;
		var index = oEvent.getSource().getBindingContextPath().split("/")[2];
		var object = this.getView().getModel("jsonModel1").getData().results[index];
		var sku = object.Matnr;
		var val = this.returnSelectedDate();
		var plant = this.returnSelectedStore();
		var oSkuInvJsonModel = this.getView().getModel("oSkuInvJsonModel");
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("SkuSummarySet(ImVdatu=datetime'" + val+ "T00:00:00',ImWerks='"+ plant + "',Matnr='" + sku+ "')/SkuInvMatnr",null,null,true,
			function(oData, oResponse) {
				if(oData.results.length > 0){
					that.getView().byId("printBtn").setEnabled(true);
				}
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
				oSkuInvJsonModel.oData["SkuSummarySet"] = array;
				oSkuInvJsonModel.refresh();
			},
			function(oError) {
				sound.play();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
			}
		);
	},
	
	onPrintInvent : function() {
		var val = this.returnSelectedDate();
		var plant = this.returnSelectedStore();
		var jsonModel = this.getView().getModel("jsonModel");
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("SkuInvSet(ImVdatu=datetime'" + val+ "T00:00:00',ImWerks='"+ plant + "',Matnr='')",null,null,true,
			function(oData, oResponse) {
				var array = [];
				if (!(oData instanceof Array)) {
					array.push(oData);
				} else {
					array = oData;
				}
				jsonModel.oData["SkuInvSet"] = array;
				jsonModel.refresh();
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
	},
	
	onPendThresh : function(){
		var penOrLimit =parseInt(this.getView().getModel('logUserJson').getData().Pendalert);
		var items = this.getView().byId('skuSummaryTbl').getItems();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var penOrd = item.getCells()[6].getText();
			if(penOrd>=penOrLimit){
				var id = item.getCells()[6].getId();
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
	
	onSkuChange : function(sku) {
		var that = this;
		var val = this.returnSelectedDate();
		var plant = this.returnSelectedStore();
		var jsonModel1 = that.getView().getModel("jsonModel1"); 
		var oSkuInvJsonModel = this.getView().getModel("oSkuInvJsonModel");
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("SkuSummarySet?$filter= ImVdatu eq datetime'"+ val+ "T00:00:00' and ImWerks eq '"+ plant + "' and Matnr eq '"+ sku + "'",null,null,true,
				function(oData, oResponse) {
					jsonModel1.setData(oData);
					jsonModel1.refresh();
					oSkuInvJsonModel.setData([]);
					that.getView().byId("skuSummaryTbl").setModel(jsonModel1);
					setTimeout(function(){
						that.onPendThresh();
					},500);
			},
			function(oError) {
				that.getView().byId("skuSummaryTbl").getModel().setData([]);
//				sound.play();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
				setTimeout(function(){
					$(document.activeElement).blur();
				},150);
			}
		);
	},
});