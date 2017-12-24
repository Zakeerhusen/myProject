sap.ui.controller("fullscreenapp.View", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf fullscreenapp.View
*/
	onInit: function() {
		jQuery.sap.require("sap.m.MessageBox");
		this.getView().byId("SplitApp-Master").setWidth("20%");
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that = this;
		
		var masterListData = [{
			title : "Overview",
			icon : "Images/overview_icon.png",
			count : 12
		},{
			title : "Exceptions",
			icon : "Images/exception_icon.png",
			count : 12
		},{
			title : "Picking Checkout Monitor",
			icon : "Images/pickingchk_icon.png",
			count : 12
		},{
			title : "Order List",
			icon : "Images/order_list_icon.png",
			count : 12
		},{
			title : "Order Details",
			icon : "Images/order_details_icon.png",
			count : 12
		},{
			title : "Picker",
			icon : "Images/picker_icon.png",
			count : 12
		},{
			title : "SKU Summary",
			icon : "Images/sku_sum_icon.png",
			count : 12
		},{
			title : "Reprint Label",
			icon : "Images/reprint_label_icon.png",
			count : 12
		},{
			title : "User Management",
			icon : "Images/user_mgmt_icon.png",
			count : 12
		}];
		
		var masterJsonModel = new sap.ui.model.json.JSONModel();
		masterJsonModel.setData({data : masterListData});
		var list = this.getView().byId("masterList");
		list.setModel(masterJsonModel);
		list.bindItems("/data", this.getView().byId("masterListItem"));
		
		/*this.oRouter.attachRoutePatternMatched(function(oEvent) {
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
				that.onOverview();
				oModel.read("/Products", null, null, true, function(oData){
					
				}, function(oError){
					
				});
			}
		});*/
		this.onAutoRefreshOn();
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			that.fnDetectMasterNavigation(oEvent);
		});
	},
	
	onMenuPress : function(oEvent){
		if(this.getView().byId("SplitApp-Master").getWidth() != "10%"){
			this.getView().byId("SplitApp-Master").setWidth("10%");
			var list = this.getView().byId("masterList");
			for(var i = 0 ; i < list.getItems().length; i++){
				list.getItems()[i].setTitle(null);
			}
		}
		else{
			var masterListData = [{
				title : "Overview",
				icon : "Images/overview_icon.png",
				count : 12
			},{
				title : "Exceptions",
				icon : "Images/exception_icon.png",
				count : 12
			},{
				title : "Picking Checkout Monitor",
				icon : "Images/pickingchk_icon.png",
				count : 12
			},{
				title : "Order List",
				icon : "Images/order_list_icon.png",
				count : 12
			},{
				title : "Order Details",
				icon : "Images/order_details_icon.png",
				count : 12
			},{
				title : "Picker",
				icon : "Images/picker_icon.png",
				count : 12
			},{
				title : "SKU Summary",
				icon : "Images/sku_sum_icon.png",
				count : 12
			},{
				title : "Reprint Label",
				icon : "Images/reprint_label_icon.png",
				count : 12
			},{
				title : "User Management",
				icon : "Images/user_mgmt_icon.png",
				count : 12
			}];
			this.getView().byId("SplitApp-Master").setWidth("20%");
			var list = this.getView().byId("masterList");
			for(var i = 0 ; i < list.getItems().length; i++){
				list.getItems()[i].setTitle(masterListData[i].title);
			}
		}
	},
	
	onMCheck : function() {
		var items = this.getView().byId('idDeliveryWindowsTable').getItems();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var id = item.getCells()[0].getId();
			cell = item;
			var timeCell = item.getCells()[0].getText();
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
	
	onOverview : function() {var a =[];
	var oModel = this.getView().getModel('myOdataModel');
	var table = this.getView().byId("idProductsTable");
	var actable = this.getView().byId("activityTable");
	var orderChart = this.getView().byId("orderChart");
	var packChart = this.getView().byId("packsChart");
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
				var tableModel = new sap.ui.model.json.JSONModel();
				tableModel.setData({
					data: orderListData
				});
				table.setModel(tableModel);
				table.bindItems("/data", that.getView().byId("listItem"));
				
				//Activity Table
				activityData.push({"Category":"Pending Picks","Qty":oData.Penpickst,"perPacks":oData.Penpicksper});
				activityData.push({"Category":"Damages","Qty":oData.Dampikcs,"perPacks":oData.Dampicksper});
				activityData.push({"Category":"Quantity","Qty":oData.Qualpicks,"perPacks":oData.Qualpicksper});
				activityData.push({"Category":"QA","Qty":oData.Qaicksper,"perPacks":oData.Qapikcs});
				activityData.push({"Category":"Short","Qty":"","perPacks":""});
				var actTableModel = new sap.ui.model.json.JSONModel();
				actTableModel.setData({
					data: activityData
				});
				actable.setModel(actTableModel);
				actable.bindItems("/data", that.getView().byId("actlistItem"));
				
				//Order Chart Data
				var businessData = [];
				businessData.push({"Status":"In Progress Order","Count":+oData.Inprgord});
				businessData.push({"Status":"Placed Order","Count":+oData.Placedord});
				businessData.push({"Status":"Pending Order","Count":+oData.Pendingord});
				var chartModel = new sap.ui.model.json.JSONModel();
				orderChart.setModel(chartModel);
				chartModel.setData(businessData);
				
				//Packs Chart Data
				var packsData = [];
				packsData.push({"Status":"In Progress Packs","Count":+oData.Prgpicks});
				packsData.push({"Status":"Placed Packs","Count":+oData.Placepicks});
				packsData.push({"Status":"Pending Packs","Count":+oData.Penpicks});
				var packchartModel = new sap.ui.model.json.JSONModel();
				packChart.setModel(packchartModel);
				packchartModel.setData(packsData);
				
				
				/** Service call for 2nd table
				 * 
				 */
//			var maxLgth = that.getView().byId("numInput").getValue();
//				b=parseInt(maxLgth);
				//TODO -- remove threshold value
				var b=4;
				
				oModel.read("StoreOverviewSet(ImVdatu=datetime'"+val+"T00:00:00',ImWerks='"+plant+"')/StoreDelWins?$top="+b,null,null,true,
						function(oData, oResponse) {
							var array = [];
							if (oData.results.length < b) {
//								that.getView().byId("numInput").setValue(oData.results.length);
							}
							if (!(oData.results instanceof Array)) {
								array.push(oData.results);
							} else {
								array = oData.results;
							}
							that.getView().getModel('jsonModel1').oData["StoreOverviewSet"] = array;
							that.getView().getModel('jsonModel1').refresh();
							//that.getView().byId("idProductsTable1").setModel(sap.ui.controller("fullscreenapp.View").oJSONModel1);
							
							setTimeout(function(){
								that.onMCheck();
								that.onPendThresh();
							},500);
						},
						function(oError) {
							that.getView().getModel('jsonModel1').setData(a);
							that.getView().getModel('jsonModel').setData(a);
							sound.play();
							jQuery.sap.require("sap.m.MessageBox");
							sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
							setTimeout(function(){
								$(document.activeElement).blur();
							},150);
						}
				);
				/**
				 * service call for 2nd method over
				 */
			},
			function(oError) {
				that.getView().getModel('jsonModel1').setData(a);
				that.getView().byId("idProductsTable").getModel().setData(a);
				that.getView().byId("activityTable").getModel().setData(a);
				that.getView().byId("orderChart").getModel().setData(a);
				that.getView().byId("packsChart").getModel().setData(a);
//				sound.play();
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
				setTimeout(function(){
					$(document.activeElement).blur();
				},150);
			}
	);},
	
	onDateChange : function() {

		that= this;
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

		else if(hash === 'orderlist'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.orderlist').getController().onOrderList();
		}
		else if(hash === 'reprintLabel'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.reprintLabel').getController().oReprintLabel();
		}
		else if(hash === 'orderDetails'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.OrderDetails').getController().onOrderIdChange();
		}
		else if(hash === 'userManagement'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.UserManagement').getController().onProfileIdChange();
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.UserManagement').getController().onUserManagement();
		}
		else if(hash === 'skuSummary'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.skuSummary').getController().onSkuSummary();
		}
		else if(hash === 'picker'){
			sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.picker').getController().onOrderIdChange();
		}

//		this.onOverview();
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
			oRouter.navTo('overview2',{},true);
		}
		else if(selectedTitle === 'Exceptions'){
			oRouter.navTo('exception',{},true);
		}
		else if(selectedTitle === 'Picking Checkout Monitor'){
			oRouter.navTo('picking',{},true);
		}
		else if(selectedTitle === 'Order List'){
			oRouter.navTo('orderlist',{},true);
		}
		else if(selectedTitle === 'Reprint Label'){
			oRouter.navTo('reprintLabel',{},true);
		}
		else if(selectedTitle === 'Order Details'){
			oRouter.navTo('orderDetails',{},true);
		}
		else if(selectedTitle === 'User Management'){
			oRouter.navTo('userManagement',{},true);
		}
		else if(selectedTitle === 'SKU Summary'){
			oRouter.navTo('skuSummary',{},true);
		}
		else if(selectedTitle === 'Picker'){
			oRouter.navTo('picker',{},true);
		}
		
	},
	
	onListPress : function(oEvent){
		this.getView().byId("legendTable").setVisible(true);
		this.getView().byId("gridView").setVisible(true);
		this.getView().byId("listView").setVisible(false);
		this.getView().byId("idProductsTable").setVisible(false);
		this.getView().byId("packsChart").setVisible(true);
		this.getView().byId("orderChart").setVisible(true);
	},
	
	onGridPress : function(oEvent){
		this.getView().byId("legendTable").setVisible(false);
		this.getView().byId("gridView").setVisible(false);
		this.getView().byId("listView").setVisible(true);
		this.getView().byId("idProductsTable").setVisible(true);
		this.getView().byId("packsChart").setVisible(false);
		this.getView().byId("orderChart").setVisible(false);
	},

	onStoreChange : function() {
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel.read("StoresSet", null, null, true, 
				function(oData, oResponse) {
					 that.getView().getModel('storejsonModel').setData(oData.results);
					 that.getView().byId("store").setModel(that.getView().getModel('storejsonModel'));
					 that.onDateChange();
				}, 
				function(oError) {
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
	},

	onPendThresh : function(){
		var penOrLimit =parseInt(0);
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
//			else{
//			var id = item.getCells()[4].getId();
//			var cellParent = $('#'+id).parent();
//			cellParent.css('background-color','white');
//			if(today){
//			var id = cell.getCells()[4].getId();
//			var cellParent = $('#'+id).parent();
//			cellParent.css('background-color','#80ffff');
//			}
//			}
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

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf fullscreenapp.View
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf fullscreenapp.View
*/
	onAfterRendering: function() {
		this.getView().byId("store").setModel(this.getView().getModel('storejsonModel'));
		this.onAutoRefreshOn();
//		var object = this.getView().getModel('logUserJson').getData().UserRepBut.results;
//		for(var i = 0; i<object.length; i++){
//			if(object[i].ActiveButt==="01"){
//				this.getView().byId("refreshPage").setEnabled(false);
//			}
//		}
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf fullscreenapp.View
*/
//	onExit: function() {
//
//	}
	
	fnDetectMasterNavigation:function(oEvent){
		var oListItems= this.getView().byId('masterList').getItems();
		for(var i =0;i<oListItems.length;i++){
			oListItems[i].removeStyleClass('activeListItem');
		}
		for(var i =0;i<oListItems.length;i++){
			if ((oEvent.getParameter("name") === "overview2") && 
					(oListItems[i].getProperty('title')=='Overview')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "exception") && 
					(oListItems[i].getProperty('title')=='Exceptions')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "picking") && 
					(oListItems[i].getProperty('title')=='Picking Checkout Monitor')){

				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "orderlist") && 
					(oListItems[i].getProperty('title')=='Order List')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "orderDetails") && 
					(oListItems[i].getProperty('title')=='Order Details')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "picker") && 
					(oListItems[i].getProperty('title')=='Picker')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "skuSummary") && 
					(oListItems[i].getProperty('title')=='SKU Summary')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "reprintLabel") && 
					(oListItems[i].getProperty('title')=='Reprint Label')){
				oListItems[i].addStyleClass('activeListItem');
			}
			else if ((oEvent.getParameter("name") === "userManagement") && 
					(oListItems[i].getProperty('title')=='User Management')){
				oListItems[i].addStyleClass('activeListItem');
			}
		}
		//if (oEvent.getParameter("name") === "overview2") {
	},
	
	onAutoRefreshOff:function(){
		
		var oDate = {ms:new Date().getTime()- (new Date(0).getTimezoneOffset()*60*1000)};
		var oDate=dateConvertion(oDate,'hh:mm a');
		this.getView().byId('idLastUpdateTime').setText('Updated today at:'+oDate);
		this.getView().byId('switchOn').setVisible(false);
		this.getView().byId('switchOff').setVisible(true);
clearInterval(_gIntervalvar);
		_gIntervalvar=undefined;
	},

		onAutoRefreshOn:function(){
//			var refRate = this.getView().getModel('logUserJson').getData().RefreshRate*1000;
			this.getView().byId('switchOff').setVisible(false);
			this.getView().byId('switchOn').setVisible(true);
			var that =this;
			_gIntervalvar = setInterval(function(){
				if(_gIntervalvar===undefined){
					return;
				}else{
					that.refreshPage();
				}
				
			},60000);
		},
		
		refreshPage:function(){
			
//			this.getView().byId('switchOff').setVisible(false);
//			this.getView().byId('switchOn').setVisible(true);
			var oDate = {ms:new Date().getTime() - (new Date(0).getTimezoneOffset() * 60*1000)};
			var oDate=dateConvertion(oDate,'hh:mm a');
			this.getView().byId('idLastUpdateTime').setText('Updated today at:'+oDate);
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
			else if(hash === 'orderlist'){
				sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.orderlist').getController().onOrderList();
			}
			else if(hash === 'skuSummary'){
				sap.ui.core.UIComponent.getRouterFor(this).getView('fullscreenapp.skuSummary').getController().onSkuSummary();
			}
		}

});
var sound = new Audio("background_sound/beep.mp3");
var _gIntervalvar=undefined;