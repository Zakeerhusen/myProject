jQuery.sap.declare("kaust.ui.kitsDataAccess.Component");
sap.ui.core.UIComponent.extend("kaust.ui.kitsDataAccess.Component", {
	metadata : {
		name : "KITS - Administrative Access Request",
		version : "1.0",
		config : {
			resourceBundle : "i18n/i18n.properties",
		},
		rootView : "kaust.ui.kitsDataAccess.view.App",
		includes : ["css/style.css"],
		routing : {
			config : {
				viewType : "XML",
				viewPath : "kaust.ui.kitsDataAccess.view",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "",
				view : "DataCenter",
				targetControl : "idAppControl"
			}]
		}
	},

/**	Initialization of the component*/
	init : function() {
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
//		Used to instantiate the root control
//		set i18n model
		var mConfig = this.getMetadata().getConfig();
		var rootPath = jQuery.sap.getModulePath("kaust.ui.kitsDataAccess");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");

		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		var oRouter = this.getRouter();
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
//		create the views based on the URL/hash
		oRouter.initialize();
	}
})