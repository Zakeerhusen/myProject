jQuery.sap.declare("kaust.ui.kitsportaccess.Component");
sap.ui.core.UIComponent.extend("kaust.ui.kitsportaccess.Component", {
	metadata : {
		name : "KAUST KITS - PORT Access",
		version : "1.0",
		config : {
			resourceBundle : "i18n/i18n.properties",
		},
		rootView : "kaust.ui.kitsportaccess.view.App",
		includes : ["css/style.css"],
		routing : {
			config : {
				viewType : "XML",
				viewPath : "kaust.ui.kitsportaccess.view",
				targetAggregation : "pages",
				clearTarget : false
			},
			routes : [ {
				pattern : "",
				name : "RequestForm",
				view : "RequestForm",
				targetControl : "idAppControl",
			} ]
		}
	},

	// Initialization of the component
	init : function() {
		// Used to instantiate the root control
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		// create the views based on the URL/hash
        this.getRouter().initialize();
		// set i18n model
		var mConfig = this.getMetadata().getConfig();
		var rootPath = jQuery.sap.getModulePath("kaust.ui.kitsportaccess");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ rootPath, mConfig.resourceBundle ].join("/")
		});
		this.setModel(i18nModel, "i18n");
	}
})