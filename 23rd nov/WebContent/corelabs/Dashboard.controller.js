jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.Dashboard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf corelabs.Dashboard
*/
	onInit: function() {

		if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	
		/** Logged In User Service --->*/
		var loginPayload ={
		  "loggedInUser" : "true",
		  "dashboardLinksReqd" : "true"
		};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		this.getView().setBusy(true);
		loggedinUserModel.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
		this.getView().setBusy(false);
		var userId=loggedinUserModel.getData().userId;
	
	
		userTypeModel.loadData("/utilweb/rest/user/auth/userType",null,false);
	
		if(userTypeModel.getData().message=="INTERNAL"){
		gwLoginUserModel.loadData(urlKaustUser+"UserID(KaustID='',UserId='"+userId+"')?$format=json",null,false);
		}
	
		var that=this;
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "Dashboard") {
			that.initializeDateInputs();
			that.initializeComboBoxForReadOnly();
			
			var revenueVisible=loggedinUserModel.getData().userDashboardLink.dashboardRevenue;
			that.getView().byId("idIcon").setSelectedKey("Tab1");
			if(revenueVisible=== "true"){
			that.getView().byId("iconTab2").setVisible(true);
			}else{
			that.getView().byId("iconTab2").setVisible(false);
			}
			that.loadPage();
		   }
		});
	},	
	
	loadPage: function(){
		 var oModel = new sap.ui.model.json.JSONModel(); 
		 var payload= this.getDashboardPaylod();
		 var valid=this.validatePayload(payload);
		 if(valid){
			 var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			 var url= "/kclrfs/rest/requestheader/reportDashboard";
			 this.getView().byId("idVizFrame").setBusy(true);
			 this.getView().byId("idVizFrame1").setBusy(true);
			 var that=this;
			 oModel.attachRequestCompleted(function(oEvent){
				 that.getView().byId("idVizFrame").setBusy(false);
				 that.getView().byId("idVizFrame1").setBusy(false);
				 
				 var oModel= oEvent.getSource();
				 var data=oModel.getData();
				 if(!(data.dashboardSearchDataList && data.dashboardSearchDataList.dashboardStatusSearchTypeList)){
					 data.dashboardSearchDataList={};
					 data.dashboardSearchDataList.dashboardStatusSearchTypeList=[];
				 }
				 if(data.dashboardSearchDataList.dashboardStatusSearchTypeList.length === 0){
					 sap.m.MessageToast.show("No data available for current selection");
				 }else{
					 sap.m.MessageToast.show("Data search successful");
				 }
				 that.getView().setModel(oModel);
				 
				 if(payload.searchCriteria === "BY_RFS"){
					 if(payload.serviceType === "true"){
						 that.createByRFSGraphForService(oModel);
					 }else{
						 that.createByRFSGraph(oModel);
					 }
				 }else{
					 if(payload.lab === "true"){
						 that.createByRevenueGraph(oModel);
					 }else{
						that.createByRevenueGraphForOrg(oModel); 
					 }
				 }
			 });
			 oModel.loadData(url,JSON.stringify(payload),true,"POST",false,false,oHeader);
			
		 }else{
			 var oModel=this.getView().getModel();
			 var data={};
			 data.dashboardSearchDataList={};
			 data.dashboardSearchDataList.dashboardStatusSearchTypeList=[];
			 if(!oModel){
				oModel= new sap.ui.model.json.JSONModel(); 
			 }
			 oModel.setData(data);
			 this.getView().setModel(oModel);
		 }
	},
	
	getDashboardPaylod: function(){
		var payload= {};
		var oSelectedTab = this.getView().byId("idIcon").getSelectedKey();
		if(oSelectedTab === "Tab1"){
			payload.searchCriteria = "BY_RFS";
			payload= this.getDashboardPayloadByRFS(payload);
		}else{
			payload.searchCriteria = "BY_REVENUE";
			payload= this.getDashboardPayloadByRevenue(payload);
		}
		
		return payload;
	},
	
	getDashboardPayloadByRFS: function(payload){
		jQuery.sap.require("sap.ui.core.format.DateFormat");
		var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern : "yyyy-MM-ddTHH:mm:ss"
		});
		
		var fromDate = new Date(this.getView().byId("fromYear").getValue()+"-"+this.getView().byId("fromMon").getValue()+"-01");
		var utc= fromDate.getTime() - (fromDate.getTimezoneOffset() * 60000);
		fromDate= new Date(utc + (3600000));
		payload.fromDate= oDateFormat.format(fromDate,true); 
		
		var toDate = new Date(this.getView().byId("toYear").getValue()+"-"+this.getView().byId("toMon").getValue()+"-01");
		var y = toDate.getFullYear(), m = toDate.getMonth();
		var lastDay = new Date(y, m + 1, 0);
		utc= lastDay.getTime() - (lastDay.getTimezoneOffset() * 60000);
		lastDay= new Date(utc + (3600000));
		payload.toDate= oDateFormat.format(lastDay,true); 
		
		payload.userType= this.getView().byId("userType").getValue();
		if(payload.userType === "All"){
			payload.userType="";
		}
		
		var rfsStatus= this.getView().byId("radioBtn").getSelectedIndex();
		if(rfsStatus === 0){
			payload.rfsStatus="true";
			payload.serviceType="false";
		}else{
			payload.rfsStatus="false";
			payload.serviceType="true";
		}
		
		return payload;
	},
	
	getDashboardPayloadByRevenue: function(payload){
		payload.fromYear=this.getView().byId("fromYear1").getValue();
		payload.toYear=this.getView().byId("toYear1").getValue();
		payload.fromQuarter= this.getView().byId("fromMon1").getValue();
		payload.toQuarter=this.getView().byId("toMon1").getValue();
		payload.userType= this.getView().byId("userType1").getValue();
		
		if(payload.userType === "All"){
			payload.userType="";
		}
				
		var lab= this.getView().byId("radioBtn1").getSelectedIndex();
		if(lab === 0){
			payload.lab="false";
			payload.orgName="true";
		}else{
			payload.lab="true";
			payload.orgName="false";
		}
		
		return payload;
	},
	
	validatePayload: function(payload){
		var err=false;
		if(payload.searchCriteria === "BY_REVENUE"){
			if(parseInt(payload.fromYear) > parseInt(payload.toYear)){
				err=true;
			}else if(parseInt(payload.fromYear) === parseInt(payload.toYear)){
				var fromQ= parseInt(payload.fromQuarter.substr(1,1));
				var toQ= parseInt(payload.toQuarter.substr(1,1));
				if( fromQ > toQ){
					err=true;
				}
			}else{
				var valid= this.isValidYearDiff(payload.fromYear, payload.fromQuarter, payload.toYear,payload.toQuarter);
				if(!valid){
					sap.ui.commons.MessageBox.show("Date Range should be less than 2 years !",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					return false;
				}
			}
		}else{
			if(payload.fromDate > payload.toDate){
				err=true;
			}else{
				var yrs= this.calculateYearDiff(payload.fromDate, payload.toDate);
				if(yrs > 1){
					sap.ui.commons.MessageBox.show("Date Range should be less than 2 years !",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					return false;
				}
			}
		}
		if(err){
			sap.ui.commons.MessageBox.show("To date cannot be less than From date !",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			return false;
		}
		return true;
	},
	
	calculateYearDiff: function(fromDate, toDate){
		fromDate= new Date(fromDate);
		toDate= new Date(toDate);
	    fromYear = fromDate.getFullYear();
	    fromMonth = fromDate.getMonth();
	    fromDay = fromDate.getDate();
	    toYear = toDate.getFullYear();
	    toMonth = toDate.getMonth();
	    toDay = toDate.getDate();
	    diff = toYear - fromYear; 

	    if(toMonth <= fromMonth){
	    	diff--;
	    }

	    if(fromMonth - 1 == toMonth && toDay < fromDay){
	    	diff--;
	    }
	    return diff;
	},
	
	isValidYearDiff: function(fromYear, fromQuarter, toYear, toQuarter){
		if(parseInt(toYear) - parseInt(fromYear) > 2){
			return false;
		}
		if(parseInt(toYear) - parseInt(fromYear) === 2){
			if(parseInt(toQuarter.substring(1)) > parseInt(fromQuarter.substring(1))){
				return false;
			}
		}
		return true;
	},
	
	createByRFSGraph: function(oModel){
		var oVizFrame = this.getView().byId('idVizFrame');
		oVizFrame.removeAllFeeds();
		oVizFrame.destroyDataset();
		oVizFrame.destroyFeeds();
		oVizFrame.destroyLayoutData();
		
		oVizFrame.setModel(oModel);
		
		oVizFrame.setVizProperties({
				title:{
					text : "Status Graph"
				},
				tooltip:{visible:true}
				});
		/** Create data-set for the chart **/
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [{
				name : 'Lab',
				value : "{labName}"},{
				name : 'Status',
				value : "{statusName}"}],
			               
			measures : [
			        {
					name : 'No. of RFS',
					value : '{statusValue}'
					}],
			             
			data : {
				path : "/dashboardSearchDataList/dashboardStatusSearchTypeList/"
			}
		});		
		oVizFrame.setDataset(oDataset);
		/** Set feed with axis **/
		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "valueAxis",
		      'type': "Measure",
		      'values': ["No. of RFS"]
		    }), 
		    feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			  'uid': "categoryAxis",
			  'type': "Dimension",
			  'values': ["Lab"]
			}),
		    feedColorAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "color",
		      'type': "Dimension",
		      'values': ["Status"]
		    });
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.addFeed(feedColorAxis);
	},
	
	createByRFSGraphForService: function(oModel){
		var oVizFrame = this.getView().byId('idVizFrame');
		oVizFrame.removeAllFeeds();
		oVizFrame.destroyDataset();
		oVizFrame.destroyFeeds();
		oVizFrame.destroyLayoutData();
		
		
		oVizFrame.setModel(oModel);
		
		oVizFrame.setVizProperties({
				title:{
					text : "Status Graph"
				},
				tooltip:{visible:true}});
		/** Create data-set for the chart **/
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [{
				name : 'Lab',
				value : "{labName}"},{
				name : 'Service',
				value : "{serviceName}"}],
			               
			measures : [
			        {
					name : 'No. of RFS',
					value : '{serviceValue}'
					}],
			             
			data : {
				path : "/dashboardSearchDataList/dashboardStatusSearchTypeList/"
			}
		});		
		oVizFrame.setDataset(oDataset);
		/** Set feed with axis **/
		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "valueAxis",
		      'type': "Measure",
		      'values': ["No. of RFS"]
		    }), 
		    feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			  'uid': "categoryAxis",
			  'type': "Dimension",
			  'values': ["Lab"]
			}),
		    feedColorAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "color",
		      'type': "Dimension",
		      'values': ["Service"]
		    });
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.addFeed(feedColorAxis);
	},
	
	createByRevenueGraph: function(oModel){
		var oVizFrame = this.getView().byId('idVizFrame1');
		oVizFrame.removeAllFeeds();
		oVizFrame.destroyDataset();
		oVizFrame.destroyFeeds();
		oVizFrame.destroyLayoutData();
		
		var oModel= this.updateQuarterYearData(oModel);
		
		oVizFrame.setModel(oModel);
		
		oVizFrame.setVizProperties({
				title:{
					text : "Revenue Graph"
				},
				tooltip:{visible:true}});
		/** Create data-set for the chart **/
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [{
				name : 'Quarter',
				value : "{quarterName}"},{
				name : 'Type',
				value : "{labName}"}],
			               
			measures : [
			        {
					name : 'Revenue (USD)',
					value : '{labValue}'
					}],
			             
			data : {
				path : "/dashboardSearchDataList/dashboardStatusSearchTypeList/"
			}
		});		
		oVizFrame.setDataset(oDataset);
		/** Set feed with axis **/
		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "valueAxis",
		      'type': "Measure",
		      'values': ["Revenue (USD)"]
		    }), 
		    feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			  'uid': "categoryAxis",
			  'type': "Dimension",
			  'values': ["Quarter"]
			}),
		    feedColorAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "color",
		      'type': "Dimension",
		      'values': ["Type"]
		    });
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.addFeed(feedColorAxis);
	},
	
	createByRevenueGraphForOrg: function(oModel){
		var oVizFrame = this.getView().byId('idVizFrame1');
		oVizFrame.removeAllFeeds();
		oVizFrame.destroyDataset();
		oVizFrame.destroyFeeds();
		oVizFrame.destroyLayoutData();
		
		var oModel= this.updateQuarterYearData(oModel);
		oVizFrame.setModel(oModel);
		
		oVizFrame.setVizProperties({
				title:{
					text : "Revenue Graph"
				},
				tooltip:{visible:true}});
		/** Create data-set for the chart **/
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions : [{
				name : 'Quarter',
				value : "{quarterName}"},{
				name : 'Organization',
				value : "{orgName}"}],
			               
			measures : [
			        {
					name : 'Revenue (USD)',
					value : '{orgNameValue}'
					}],
			             
			data : {
				path : "/dashboardSearchDataList/dashboardStatusSearchTypeList/"
			}
		});		
		oVizFrame.setDataset(oDataset);
		/** Set feed with axis **/
		var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "valueAxis",
		      'type': "Measure",
		      'values': ["Revenue (USD)"]
		    }), 
		    feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			  'uid': "categoryAxis",
			  'type': "Dimension",
			  'values': ["Quarter"]
			}),
		    feedColorAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
		      'uid': "color",
		      'type': "Dimension",
		      'values': ["Organization"]
		    });
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.addFeed(feedColorAxis);
	},
	
	clickGraph: function(oEvent){
		debugger;
		var data= oEvent.getParameter("data")[0];
		var type= (data.data["Service"] || data.data["Status"] || data.data["Organization"] || data.data["Type"]);
		var value= "", label="";
		if(data.data["Revenue (USD)"]){
			value=" "+data.data["Revenue (USD)"];
			label="Revenue:";
		}else{
			value=" "+data.data["No. of RFS"];
			label="No of RFS:";
		}
		var popup= new sap.m.Popover({
			placement : sap.m.PlacementType.Top, 
			showHeader : false,
			title : undefined, 
			offsetX : 0, 
			offsetY : 0, 
			contentWidth : "180px",
			contentHeight : "55px", 
			bounce : true, 
			content : [
			            new sap.ui.layout.Grid({
			        	defaultSpan: "L12 M12 S12",
						position : sap.ui.layout.GridPosition.Left,
						content : [
						           new sap.m.HBox({alignItems:"Start",items:[new sap.m.Text({text:type}).addStyleClass("dashboardGrid")]}),
						           new sap.m.HBox({alignItems:"Start",items:[new sap.m.Text({text:label}),
						                  						             new sap.m.Text({text:value}).addStyleClass("dashboardGrid")]}),                                          
						           ]
			            	})
			           ]
		});
		popup.openBy(data.target);
	},
	
	updateQuarterYearData: function(oModel){
		if(oModel.getData() && oModel.getData().dashboardSearchDataList && oModel.getData().dashboardSearchDataList.dashboardStatusSearchTypeList){
			var oData=oModel.getData();
			var arr= oData.dashboardSearchDataList.dashboardStatusSearchTypeList;
			for(var i=0;i<arr.length;i++){
				arr[i].quarterName= "("+arr[i].revenueYear+") "+arr[i].quarterName;
			}
			oData.dashboardSearchDataList.dashboardStatusSearchTypeList= arr;
			oModel.setData(oData);
		}
		return oModel;
	},
	
	onSearch : function (oEvt) {
		 var that =this;
		 var oSelectedIndex = that.getView().byId("radioBtn").getSelectedIndex();
		 
		var userType = that.getView().byId("userType").getSelectedItem();
	   
		var aFilters = [];
		var filter="";
		that.loadPage();
	},
	
	handleIconTabBarSelect: function (oEvent) {
		var that = this;
		sKey = oEvent.getParameter("key");
		that.clear();
		that.loadPage();
	},
	
	clear : function(){
		var that= this;
		that.initializeDateInputs();
		that.getView().byId("userType").setValue("All");
		that.getView().byId("userType1").setValue("All");
		that.getView().byId("radioBtn").setSelectedIndex(0);
		that.getView().byId("radioBtn1").setSelectedIndex(0);
		that.loadPage();
	},
	
	clearRevenue : function(){
		var that= this;
		that.initializeDateInputs();
		that.getView().byId("userType1").setValue("All");
	},
	
	initializeDateInputs: function(){
		var currentYear= (new Date()).getFullYear();
		var yearArr=[];
		for(var i=2016; i<= currentYear+5; i++){
			var obj={"year":i, "key": i};
			yearArr.push(obj);
		}
		var oModel=new sap.ui.model.json.JSONModel(yearArr);
		this.getView().setModel(oModel,"yearModel");
		
		this.getView().byId("fromYear").setValue(currentYear);
		this.getView().byId("toYear").setValue(currentYear);
		
		this.getView().byId("fromYear1").setValue(currentYear);
		this.getView().byId("toYear1").setValue(currentYear);
		
		var currentMon= (new Date()).getMonth();
		this.getView().byId("toMon").setSelectedKey(currentMon);
	},

	initializeComboBoxForReadOnly: function(){
		var oCombo = this.getView().byId("fromYear");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("toYear");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("fromYear1");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("toYear1");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("fromMon");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("toMon");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("fromMon1");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("toMon1");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("userType");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		oCombo = this.getView().byId("userType1");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oComboInner = this.$().find('.sapMInputBaseInner');
			var oID = oComboInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf corelabs.Dashboard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf corelabs.Dashboard
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf corelabs.Dashboard
*/
//	onExit: function() {
//
//	}

});