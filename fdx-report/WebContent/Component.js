jQuery.sap.declare("sap.ui.demo.Component");
sap.ui.core.UIComponent.extend("sap.ui.demo.Component", {
	metadata : {
		routing : {
			config: {
				viewType: "XML",
				viewPath: "fullscreenapp",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [
						{
							pattern: "",
							name: "login",
							view: "loginPage",
							targetControl: "idAppControl"
							},
							{	pattern: "overview",
								name: "overview",
								view: "View",
//								clearTarget: true,
								targetControl: "idAppControl",
							subroutes : [
				             {
									pattern: "overview2",
									name: "overview2",
									view: "View2",
									targetControl: "SplitApp",
									targetAggregation: "detailPages"
//									targetAggregation: "masterPages"
							     
				             },
							 {
								pattern: "exception",
								name: "exception",
								view: "ExceptionReport",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "picking",
								name: "picking",
								view: "picking",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "orderlist",
								name: "orderlist",
								view: "orderlist",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "reprintLabel",
								name: "reprintLabel",
								view: "reprintLabel",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "orderDetails",
								name: "orderDetails",
								view: "OrderDetails",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "userManagement",
								name: "userManagement",
								view: "UserManagement",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "skuSummary",
								name: "skuSummary",
								view: "skuSummary",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    },
						    {
								pattern: "picker",
								name: "picker",
								view: "picker",
								targetControl: "SplitApp",
								targetAggregation: "detailPages"
						    }
						    ]
					    },
					   
					    ]
		}
	},
	init : function() {
		// 1. some very generic requires  
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		jQuery.sap.require("sap.ui.demo.MyRouter");
		// 2. call overridden init (calls createContent)  
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		// 3a. monkey patch the router  
		var router = this.getRouter();
		router.myNavBack = sap.ui.demo.MyRouter.myNavBack;
		// 4. initialize the router  
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
		router.initialize();
	},
	destroy : function() {
		if (this.routeHandler) {
			this.routeHandler.destroy();
		}
		// call overridden destroy  
		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
	},
	createContent : function() {
		// create root view  
		var oView = sap.ui.view({
			id : "app",
			viewName : "fullscreenapp.loginPage",
			type : "XML",
		});
		var strUrl = "http://10.40.3.33:8000/sap/opu/odata/SAP/ZFK_REPORTS_SRV/";
		var myOdataModel = new sap.ui.model.odata.ODataModel(strUrl,true);
		this.setModel(myOdataModel,'myOdataModel');
		var jsonModel4 = new sap.ui.model.json.JSONModel();
		var jsonModel3 = new sap.ui.model.json.JSONModel();
		var jsonModel1 = new sap.ui.model.json.JSONModel();
		var jsonModel = new sap.ui.model.json.JSONModel();
		var jsonModel2 = new sap.ui.model.json.JSONModel();
		var deafultstoreModel = new sap.ui.model.json.JSONModel();
		var oConfirmJsonModel = new sap.ui.model.json.JSONModel();
		var logUserJson = new sap.ui.model.json.JSONModel();
		var storejsonModel = new sap.ui.model.json.JSONModel([]);// this is the default value
		var jsonModel10 = new sap.ui.model.json.JSONModel([]);
		var jsonModel5 = new sap.ui.model.json.JSONModel();
		var jsonModel8 = new sap.ui.model.json.JSONModel();
		var transCartModel = new sap.ui.model.json.JSONModel();
		var printJSonModel = new sap.ui.model.json.JSONModel();
		var displayOrderDetailsModel = new sap.ui.model.json.JSONModel();
		var displaySkuSummaryModel = new sap.ui.model.json.JSONModel();
		var displayInvModel = new sap.ui.model.json.JSONModel();
		var userModel = new sap.ui.model.json.JSONModel();
		var userDetailsModel = new sap.ui.model.json.JSONModel();
		var oProfileIdModel = new sap.ui.model.json.JSONModel();
		var jsonModel9 = new sap.ui.model.json.JSONModel();
		var oSkuInvJsonModel = new sap.ui.model.json.JSONModel();
		this.setModel(jsonModel1,'jsonModel1');
		this.setModel(printJSonModel,'printJSonModel');
		this.setModel(logUserJson,'logUserJson');
		this.setModel(jsonModel3,'jsonModel3');
		this.setModel(jsonModel4,'jsonModel4');
		this.setModel(jsonModel2,'jsonModel2');
		this.setModel(jsonModel,'jsonModel');
		this.setModel(deafultstoreModel,'deafultstoreModel');
		this.setModel(deafultstoreModel,'oConfirmJsonModel');
		this.setModel(transCartModel,'transCartModel');
		this.setModel(jsonModel10,'jsonModel10');
		this.setModel(storejsonModel, "storejsonModel");
		this.setModel(jsonModel5,'jsonModel5');
		this.setModel(jsonModel8,'jsonModel8');
		this.setModel(displayOrderDetailsModel,'displayOrderDetailsModel');
		this.setModel(displaySkuSummaryModel,'displaySkuSummaryModel');
		this.setModel(displayInvModel,'displayInvModel');
		this.setModel(userModel,'userModel');
		this.setModel(userDetailsModel,'userDetailsModel');
		this.setModel(oProfileIdModel,'oProfileIdModel');
		this.setModel(jsonModel9, "jsonModel9");
		this.setModel(oSkuInvJsonModel, "oSkuInvJsonModel");
		/*
		 * Setting default date for Reports 
		 */
		jsonModel2.setData({
			dateValue : new Date(),
			selectedStore:''
			});
		this.onDefaultStore();
		return oView;
	},
	
	onDefaultStore : function() {
//		this.oDate.length = 0;
		var date = new Date(this.getModel('jsonModel2').getProperty('/dateValue'));
		var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
		var selectedDate = year + "-" + month + "-" + day;
//		this.oDate.push(selectedDate);
		var oModel = this.getModel('myOdataModel');
		var that = this;
//		var val = this.oDate[0];
		oModel.read("RepdefSet(ImDate=datetime'" + selectedDate+ "T00:00:00')",null,null,false,
				function(oData, oResponse) {
				that.getModel('deafultstoreModel').setData(oData);
//					var store = that.getView().byId("store").setValue(oData.Store+"-"+oData.Name1);
					var item = {
							Werks:oData.Store,
							Name1:oData.Name1
					};
					that.getModel('storejsonModel').getData().push(item);
					that.getModel('storejsonModel').refresh();
					that.getModel('jsonModel2').setProperty('/selectedStore',oData.Store);
					that.getModel('jsonModel2').refresh();
				},
				function(oError) {
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
	}
});