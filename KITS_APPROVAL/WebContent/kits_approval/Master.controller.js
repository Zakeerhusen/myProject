sap.ui.controller("kits_approval.Master", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kits_approval.Master
*/
	onInit: function() {
		var test = jQuery.sap.getUriParameters();
	    if(test.mParams.taskId){
	    var taskId = test.mParams.taskId[0];
	    //taskId="2f83f03a988a11e798bf00000357cc2e";
		if(taskId!=""){
			//this.loadTaskView(taskId);
			var url = "https://sthcigwdq1.kaust.edu.sa:8006/sap/bc/ui5_ui5/sap/zui5_approvers/index.html?sap-ui-language=EN&sap-ui-appcache=false&sap-language=EN&sap-client=260&sap-locale=en_US&sap-rtl=&sap-accessibility=&sap-config-mode=true&taskId="+taskId;
			window.open(url,"_self");
			}
	    }
	},
	
	loadTaskView : function(){
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kits_approval.Master
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kits_approval.Master
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kits_approval.Master
*/
//	onExit: function() {
//
//	}

});