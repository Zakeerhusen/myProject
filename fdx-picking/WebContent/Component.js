jQuery.sap.declare("sap.ui.demo.Component");
sap.ui.core.UIComponent.extend("sap.ui.demo.Component", {
	metadata : {
		routing : {
			config: {
				viewType: "XML",
				viewPath: "foodkickpicking",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes: [
				{
					pattern: "",
					name: "loginToFR1",
					view: "loginToFR1",
					targetControl: "idAppControl",
					subroutes : [{
						pattern: "login",
						name: "login",
						view: "login",
							subroutes : [{
						pattern: "requestOrder",
						name: "requestOrder",
						view: "requestOrder",
							subroutes : [{
								pattern: "scanTote",
								name: "scanTote",
								view: "scanTote",
								subroutes : [{
									pattern: "displayOrder",
									name: "displayOrder",
									view: "displayOrder",
									subroutes : [{
										pattern: "exceptionReports",
										name: "exceptionReports",
										view: "exceptionReports",
										subroutes : [{
											pattern: "exceptionReports2/{contextPath}",
											name: "exceptionReports2",
											view: "exceptionReports2"
											/*subroutes : [{
													pattern: "scanCheckout",
													name: "scanCheckout",
													view: "scanCheckout"
											}]*/
										}]
									},
									{
										pattern: "scanCheckout",
										name: "scanCheckout",
										view: "scanCheckout"
									}]
								}]
							}]
					}]
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
		if (this._oPopover) {
			this._oPopover.destroy();
		}
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
			viewName : "foodkickpicking.App",
			type : "XML"
		});
		
		parentApp = oView;
		
		oView.byId("idAppControl").setDefaultTransitionName("show");
		return oView;
	}
});
