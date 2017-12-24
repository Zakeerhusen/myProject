jQuery.sap.declare("sap.ui.demo.Component");
sap.ui.core.UIComponent.extend("sap.ui.demo.Component", {
	metadata : {
		dependencies : {
		libs : ["sap.ui.layout","sap.ui.unified"],
		components : []
		},
		includes:[
          "./css/style1.css"
          ],
		routing : {
			config: {
				viewType: "XML",
				viewPath: "corelabs",
				targetAggregation: "pages",
				clearTarget: false
			},
			routes : [{
				pattern: "Dashboard",
				name: "Dashboard",
				view: "Dashboard",
				targetControl: "idAppControl",
				subroutes: [{
					pattern: "Report",
					name: "Report",
					view: "Report",
					subroutes: [{
						pattern: "RFSFormTask/{id}",
						name: "RFSFormTask",
						view: "RFSFormTask",
						subroutes: [{
							pattern: "DocumentReview",
							name: "DocumentReview",
							view: "DocumentReview",
							subroutes: [{
								pattern: "ChangePassword",
								name: "ChangePassword",
								view: "ChangePassword",
								subroutes: [{
									pattern: "PIApprovalRequest",
									name: "PIApprovalRequest",
									view: "PIApprovalRequest",
									subroutes: [{
										pattern: "PIRegistration",
										name: "PIRegistration",
										view: "PIRegistration",
										subroutes: [{
											pattern: "labSelection",
											name: "labSelection",
											view: "labSelection",
											subroutes: [{
												pattern: "RFSForm",
												name: "RFSForm",
												view: "RFSForm",
													subroutes: [{
													pattern: "TaskManagement",
													name: "TaskManagement",
													view: "TaskManagement",
														subroutes: [{
														pattern: "RolesManagement",
														name: "RolesManagement",
														view: "RolesManagement",
														subroutes: [{
															pattern: "MyDocuments",
															name: "MyDocuments",
															view: "MyDocuments",
															subroutes: [{
																pattern: "PI_Approver_List",
																name: "PI_Approver_List",
																view: "PI_Approver_List",
																subroutes: [{
																	pattern: "Registered_User_List",
																	name: "Registered_User_List",
																	view: "Registered_User_List",
																	subroutes: [{
																		pattern: "UpdateProfile",
																		name: "Registration",
																		view: "Registration"
																					}]	
																				}]	
																			}]	
																		}]		
																	}]		
																}]		
															}]	
														}]
													}]
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
		
		// var startProcessSvcURL = "http://115.110.70.122:50000/bpmodata/startprocess.svc/com.incture/srm~bpm/SRM_Process/"; 
		//http://sthcibpdqq1.kaust.edu.sa:50500
		//var startProcessSvcURL = "/bpmodata/startprocess.svc/kaust.com/kcl~rfs~bpm/KCL_RFS_PI_Approval_Process_Initiated_By_The_User/"; 
	//		var processStartODataModel = new sap.ui.model.odata.ODataModel(startProcessSvcURL, true);
	//		this.setModel(processStartODataModel,'processStartODataModel');
			
			
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
			viewName : "corelabs.App",
			type : "XML"
		});
	/*	
		var url= "sthcigwdq1.kaust.edu.sa:8005";
		var strUrl = "http://"+url+"/sap/opu/odata/sap/ZHRTRS0001TSR_GASC/";
		var myOdataModel = new sap.ui.model.odata.ODataModel(strUrl,true);
		this.setModel(myOdataModel,'myOdataModel');*/
		

		
		
	/*	var oReportModel = new sap.ui.model.json.JSONModel();
		oView.setModel(oReportModel, "oReportModel");*/
		//oView.byId("idAppControl").setDefaultTransitionName("show");
		return oView;
	}
	
	
});

