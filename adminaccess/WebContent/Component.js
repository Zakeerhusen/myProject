jQuery.sap.declare("kaust.ui.kitsAdminAccess.Component");
sap.ui.core.UIComponent.extend("kaust.ui.kitsAdminAccess.Component", {
	metadata : {
		name : "KITS - Administrative Access Request",
		version : "1.0",
		config : {
			resourceBundle : "i18n/i18n.properties",
		},
		rootView : "kaust.ui.kitsAdminAccess.view.App",
		includes : ["css/style.css"],
		routing : {
			config : {
				viewType : "XML",
				viewPath : "kaust.ui.kitsAdminAccess.view",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "main",
				view : "main",
				targetControl : "idAppControl"
			}]
		}
	},

	// Initialization of the component
	init : function() {
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		// Used to instantiate the root control
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		var oRouter = this.getRouter();
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
		// create the views based on the URL/hash
		oRouter.initialize();
		// set i18n model
		var mConfig = this.getMetadata().getConfig();
		var rootPath = jQuery.sap.getModulePath("kaust.ui.kitsAdminAccess");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");
	}
})