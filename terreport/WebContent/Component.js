jQuery.sap.declare("kaust.ui.kitsterreport.Component");
sap.ui.core.UIComponent.extend("kaust.ui.kitsterreport.Component", {
	metadata : {
		name : "KAUST KITS - TER REPORT",
		version : "1.0",
		config : {
			resourceBundle : "i18n/i18n.properties",
		},
		rootView : "kaust.ui.kitsterreport.view.App",
		includes : ["css/style.css"],
		routing : {
			config : {
				viewType : "XML",
				viewPath : "kaust.ui.kitsterreport.view",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "TerReport",
				view : "TerReport",
				targetControl : "idAppControl",
			} ]
		}
	},

	// Initialization of the component
	/*init : function() {
		jQuery.sap.require("sap.ui.core.routing.History");

	    jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		// Used to instantiate the root control
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		// create the views based on the URL/hash
        this.getRouter().initialize();
		// set i18n model
		var mConfig = this.getMetadata().getConfig();
		var rootPath = jQuery.sap.getModulePath("kaust.ui.kitsterreport");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");
	}*/
	
	// Initialization of the component
	init : function() {
		// Used to instantiate the root control
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		// create the views based on the URL/hash
        this.getRouter().initialize();
		// set i18n model
		var mConfig = this.getMetadata().getConfig();
		var rootPath = jQuery.sap.getModulePath("kaust.ui.kitsterreport");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");
	}
})