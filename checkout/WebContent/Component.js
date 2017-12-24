jQuery.sap.declare("sap.ui.demo.Component");
sap.ui.core.UIComponent.extend("sap.ui.demo.Component", {
	metadata : {
		routing : {
			config: {
				viewType: "XML",
				viewPath: "fdx_checkout",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [
				{
					pattern: "",
					name: "Checkout",
					view: "Checkout",
					targetControl: "idAppControl",
					subroutes : [{
						pattern: "Checkout2/{loginId}",
						name: "Checkout2",
						view: "Checkout2"
					}]
			    }]
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
			viewName : "fdx_checkout.App",
			type : "XML"
		});

		var url = GetData("/freshdirect/user/applicationProperty/gatewayhost");
		var strUrl = "http://"+url+"/sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/";
		var myOdataModel = new sap.ui.model.odata.ODataModel(strUrl,true);
		this.setModel(myOdataModel,'myOdataModel');
		oView.byId("idAppControl").setDefaultTransitionName("show");
		return oView;
	}
});