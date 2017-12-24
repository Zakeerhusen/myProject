sap.ui.controller("fullscreenapp.View2", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf fullscreenapp.View2
	 */
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
this.getView().byId("numInput").setValue("500");
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "overview2") {
				var orderPlotArea= new sap.viz.ui5.types.Pie({
					colorPalette : ['#008000', '#FF0000', '#FFA500']
				});
				var packsPlotArea= new sap.viz.ui5.types.Pie({
					colorPalette : ['#008000', '#FF0000', '#FFA500']
				});
				var orderChart = that.getView().byId("orderChart");
				orderChart.setPlotArea(orderPlotArea);
				var packsChart = that.getView().byId("packsChart");
				packsChart.setPlotArea(packsPlotArea);
				that.onStoreChange();
//				that.onOverview();
				/*oModel.read("/Products", null, null, true, function(oData){

				}, function(oError){

				});*/
			}
		});
	},

	handlePress : function(oEvent){
		var context = oEvent.getSource().getBindingContext().getPath().substr(1);
		this.oRouter.navTo("View",{
			contextPath : context
		});
	},
ingUpShow : function(){
		var that = this;
		var a = this.getView().byId("numInput").getValue();
		a=parseInt(a);
		a=a+1;
		this.getView().byId("numInput").setValue(a);
		that.onDevWindowCheck();
	},
	
	imgDownShow : function(){
		var that = this;
		var a = this.getView().byId("numInput").getValue();
		a=parseInt(a);
		a=a-1;
		if(a!=0){
			this.getView().byId("numInput").setValue(a);
			that.onDevWindowCheck();
		}
	},
	
	onDevWindowCheck : function(){
		var that  = this;
		if(this.getView().byId("filterDispatched").getSelected() == false){
		var oModel = this.getView().getModel('myOdataModel');
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		
		var maxLgth = that.getView().byId("numInput").getValue();
		b=parseInt(maxLgth);
		oModel.read("StoreOverviewSet(ImVdatu=datetime'"+ val + "T00:00:00',ImWerks='"+ plant + "')/StoreDelWins?$top="+b,null,null,true,
				function(oData, oResponse) {
					var array = [];
					if (oData.results.length < b) {
						that.getView().byId("numInput").setValue(oData.results.length);
					}
					if (!(oData.results instanceof Array)) {
						array.push(oData.results);
					} else {
						array = oData.results;
					}
		
			for (var i = 0; i < array.length; i++) {
				array[i].Delwins = dateConvertion(array[i].Delwins, "hh:mm ");
				array[i].Delwine = dateConvertion(array[i].Delwine, "hh:mm ");
			}
			that.getView().getModel('jsonModel1').oData["StoreOverviewSet"] = array;
			that.getView().getModel('jsonModel1').refresh();
			//that.onMCheck();
			setTimeout(function(){
				that.onPendThresh();
				
			},500);
			
						},
		function(oError) {
			that.getView().getModel('jsonModel1').setData(a);
			
			sound.play();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
			setTimeout(function(){
				$(document.activeElement).blur();
			},150);
		}
		);
		}
		else {
			that.filterDispatched();
		}
	},
	onMCheck : function() {
		var items = this.getView().byId('idDeliveryWindowsTable').getItems();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var id = item.getCells()[0].getId();
			cell = item;
			var timeCell = item.getBindingContext('jsonModel1').getObject().Delwindow;
			var times = timeCell.split('-');
			var startDate = new Date();
			var endDate = new Date();
			var val = this.returnSelectedDate();
			var date = new Date(val).getDate();
			var month = new Date(val).getMonth();
			var currentDate = new Date();
			var hours = times[0].split(':')[0];
			var mins = times[0].split(':')[1];
			startDate.setDate(date);
			startDate.setMonth(month);
			startDate.setHours(jQuery.trim(hours));
			startDate.setMinutes(jQuery.trim(mins));
			startDate.setSeconds(0);
			hours = times[1].split(':')[0];
			mins = times[1].split(':')[1];
			endDate.setDate(date);
			endDate.setMonth(month);
			endDate.setHours(jQuery.trim(hours));
			endDate.setMinutes(jQuery.trim(mins));
			endDate.setSeconds(0);
			if (currentDate.getTime() >= startDate.getTime() && currentDate.getTime() <= endDate.getTime()) {
				today = true;
				item.addStyleClass('bglColor');
				var container = $('*');
				scrollTo = $('#'+id);
				container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
			} 
			else {
				today = false;
				item.removeStyleClass('bglColor');
			}
		}
	},
	
	
	filterDispatched : function() {
			var oModel = this.getView().getModel('myOdataModel');
			var that = this;
			var val = this.returnSelectedDate();
			var store = this.returnSelectedStore();
			var split = store.split("-");
			var plant = store;
			var maxLgth = that.getView().byId("numInput").getValue();
			b=parseInt(maxLgth);
			oModel.read("StoreOverviewSet(ImVdatu=datetime'"+val+"T00:00:00',ImWerks='"+plant+"')/StoreDelWins?$filter=DispComp eq 'X'&$top="+b,null,null,true,
					function(oData, oResponse) {
						var array = [];
						if (oData.results.length < b) {
							that.getView().byId("numInput").setValue(oData.results.length);
						}
						if (!(oData.results instanceof Array)) {
							array.push(oData.results);
						} else {
							array = oData.results;
						}
						for (var i = 0; i < array.length; i++) {
							array[i].Delwins = dateConvertion(array[i].Delwins, "hh:mm ");
							array[i].Delwine = dateConvertion(array[i].Delwine, "hh:mm ");
						}
						that.getView().getModel('jsonModel1').oData["StoreOverviewSet"] = array;
						that.getView().getModel('jsonModel1').refresh();
						that.onMCheck();
						setTimeout(function(){
							that.onPendThresh();
						},500);
						
						console.log("success");
					},
					function(oError) {
						sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
					}
			);

	},


	onOverview : function() {
		var a =[];
		var that = this;
		var oModel = this.getView().getModel('myOdataModel');
		var table = this.getView().byId("idProductsTable");
		var tableModel = new sap.ui.model.json.JSONModel();
		table.setModel(tableModel);
		var actable = this.getView().byId("activityTable");
		var actTableModel = new sap.ui.model.json.JSONModel();
		actable.setModel(actTableModel);
		var orderChart = this.getView().byId("orderChart");
		var chartModel = new sap.ui.model.json.JSONModel();
		orderChart.setModel(chartModel);
		var packChart = this.getView().byId("packsChart");
		var packchartModel = new sap.ui.model.json.JSONModel();
		packChart.setModel(packchartModel);
		var that = this;
		var orderListData = [];
		var activityData = [];
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		oModel.read("StoreOverviewSet(ImVdatu=datetime'"+val+"T00:00:00',ImWerks='"+plant+"')",null,null,true,
				function(oData, oResponse) {
					var array = [];
					if (!(oData instanceof Array)) {
						array.push(oData);
					} else {
						array = oData;
					}
					that.getView().getModel('jsonModel').oData["StoreOverviewSet"] = array;
					that.getView().getModel('jsonModel').refresh();
					//Table Data
					orderListData.push({"Type":"ORDERS","Inprgord":oData.Inprgord,"Placedord":oData.Placedord,"Pendingord":oData.Pendingord,"Total":oData.Ordertot});
					orderListData.push({"Type":"PACKS","Inprgord":oData.Prgpicks,"Placedord":oData.Placepicks,"Pendingord":oData.Penpicks,"Total":oData.Totpicks});
					tableModel.setData({
						data: orderListData
					});
					table.bindItems("/data", that.getView().byId("listItem"));
					//Activity Table
					activityData.push({"Category":"Pending Picks","Qty":oData.Penpickst,"perPacks":oData.Penpicksper});
					activityData.push({"Category":"Damages","Qty":oData.Dampikcs,"perPacks":oData.Dampicksper});
					activityData.push({"Category":"Quantity","Qty":oData.Qualpicks,"perPacks":oData.Qualpicksper});
					activityData.push({"Category":"QA","Qty":oData.Qaicksper,"perPacks":oData.Qapikcs});
					activityData.push({"Category":"Short","Qty":oData.Shortpicks,"perPacks":oData.Shortpicksper})
					actTableModel.setData({
						data: activityData
					});;
					actable.bindItems("/data", that.getView().byId("actlistItem"));
					//Order Chart Data
					var businessData = [];
					businessData.push({"Status":"In Progress Order","Count":+oData.Inprgord});
					businessData.push({"Status":"Placed Order","Count":+oData.Placedord});
					businessData.push({"Status":"Pending Order","Count":+oData.Pendingord});
					chartModel.setData(businessData);
					that.getView().byId("totalOrderText").setText(oData.Ordertot + " Orders");
					//Packs Chart Data
					var packsData = [];
					packsData.push({"Status":"In Progress Packs","Count":+oData.Prgpicks});
					packsData.push({"Status":"Placed Packs","Count":+oData.Placepicks});
					packsData.push({"Status":"Pending Packs","Count":+oData.Penpicks});
					packchartModel.setData(packsData);
					that.getView().byId("totalPacksText").setText(oData.Totpicks + " Packs");
					that.onDevWindowCheck();
			},
			function(oError) {
				that.getView().getModel('jsonModel1').setData(a);
				that.getView().byId("idProductsTable").getModel().setData(a);
				that.getView().byId("activityTable").getModel().setData(a);
				that.getView().byId("orderChart").getModel().setData(a);
				that.getView().byId("packsChart").getModel().setData(a);
				//sound.play();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
				setTimeout(function(){
					$(document.activeElement).blur();
				},150);
			}
		);
	},

	
	
	onOverviewRowSelect : function(oEvent) {
		ovDClk = true;
		var that = this;
		var b = oEvent.mParameters.listItem.sId;
		var split = b.split("-");
		var ind = split[4];
		var object = that.getView().getModel('jsonModel1').oData.StoreOverviewSet;
		delWindow = object[ind].Delwindow;
		this.onOverviewDblClk(delWindow);
		var oTable = this.getView().byId("idDeliveryWindowsTable");
		oTable.removeSelections();
	},
	
	
	onDateChange : function() {
		/*that= this;
		this.oDate.length = 0;
		var date = new Date(this.getView().byId("DP1").getValue());
		var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
		var selectedDate = year + "-" + month + "-" + day;
		this.oDate.push(selectedDate);
		this.onOverview();*/

		var that= this;
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var hash = oRouter._oRouter._prevMatchedRequest;
		if(hash === 'overview2'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.View2').getController().onOverview();
		}
		else if(hash === 'exception'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.ExceptionReport').getController().onException();
		}
		else if(hash === 'picking'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.picking').getController().onPickingCheckMonitor();
		}
		//	this.onOverview();
		//
	},

	onPressGoToDetail:function(oEvent){
		// Method is initially used to add style class to the clicked item 
		//and remove class from other items 
		var oListItems= this.getView().byId('masterList').getItems();
		for(var i =0;i<oListItems.length;i++){
			oListItems[i].removeStyleClass('activeListItem');
		}

		var oSelectedItem = oEvent.getSource();
		oSelectedItem.addStyleClass('activeListItem');
		var selectedTitle = oSelectedItem.getProperty('title');

		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		if(selectedTitle === 'Overview'){
			oRouter.navTo('overview2',{},false);
//			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.View').getController().onException();
		}
		else if(selectedTitle === 'Exceptions'){
			oRouter.navTo('exception',{},false);
//			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.ExceptionReport').getController().onException();
		}
		else if(selectedTitle === 'Picking Checkout Monitor'){
			oRouter.navTo('picking',{},false);
//			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.ExceptionReport').getController().onException();
		}
	},

	onListPress : function(oEvent){
		this.getView().byId("legendTable").setVisible(true);
		this.getView().byId("gridView").setVisible(true);
		this.getView().byId("listView").setVisible(false);
		this.getView().byId("idProductsTable").setVisible(false);
		this.getView().byId("packsChart").setVisible(true);
		this.getView().byId("orderChart").setVisible(true);
		this.getView().byId("totalOrderText").setVisible(true);
		this.getView().byId("totalPacksText").setVisible(true);
	},
	
	onGridPress : function(oEvent){
		this.getView().byId("legendTable").setVisible(false);
		this.getView().byId("gridView").setVisible(false);
		this.getView().byId("listView").setVisible(true);
		this.getView().byId("idProductsTable").setVisible(true);
		this.getView().byId("packsChart").setVisible(false);
		this.getView().byId("orderChart").setVisible(false);
		this.getView().byId("totalOrderText").setVisible(false);
		this.getView().byId("totalPacksText").setVisible(false);
	},

	onStoreChange : function() {
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel.read("StoresSet", null, null, true, 
				function(oData, oResponse) {
			//sap.ui.controller("fullscreenapp.View").oJSONModel.setData(oData.results);
			that.getView().getModel('storejsonModel').setData(oData.results);
			that.getView().getModel('storejsonModel').refresh();
//			that.getView().byId("store").setModel(that.getView().getModel('storejsonModel'));
			that.onDateChange();
		}, 
		function(oError) {
			sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
		}
		);
	},

	onPendThresh : function(){
		var penOrLimit =parseInt(this.getView().getModel('logUserJson').getData().Pendalert);
		var items = this.getView().byId('idDeliveryWindowsTable').getItems();
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

	applySearchPatternToListItem: function(i, searchValue) {
		if (searchValue == "") {
			return true;
		}
		var property = this.getView().getModel("jsonModel1").getData().StoreOverviewSet[i.getBindingContextPath().split("/")[2]];
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
		var items = this.getView().byId("idDeliveryWindowsTable").getItems();
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
	
	
	onOverviewDblClk : function(delWindow) {
		var that = this;
		var val = this.returnSelectedDate();
		var store = this.returnSelectedStore();
		var split = store.split("-");
		var plant = store;
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("StoreDelWinSet(ImVdatu=datetime'"+ val + "T00:00:00',ImWerks='"+ plant + "',Delwindow='"+ delWindow + "')/DelWinOrders",null,null,true,
				function(oData, oResponse) {
			var jsonModel3 = that.getView().getModel('jsonModel3');
			jsonModel3.setData(oData);
					that.getView().byId("idProductsTable3").setModel(jsonModel3);
					jsonModel4.refresh();
				},
				function(oError) {
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf fullscreenapp.View
	 */
//	onBeforeRendering: function() {

//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf fullscreenapp.View
	 */
//	onAfterRendering: function() {

//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf fullscreenapp.View
	 */
//	onExit: function() {

//	}
	
	onDeliveryWindowClick:function(oEvent){
		var delWindow = oEvent.getSource().getBindingContext('jsonModel1').getObject().Delwindow;
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo('orderlist',{},true);
		sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.orderlist').getController().fnRenderViewAccToDeliveryWindow(delWindow);
	}

});