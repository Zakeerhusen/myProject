sap.ui.controller("corelabs.Homepage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
	/*onBeforeShow : function(){
		location.reload(true);
	},*/
	 
	onInit: function() {
	
	/*var loginPayload ={
			   "loggedInUser" : "true",
			   "userId" : ""
			};
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	loggedinUserModel.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);

	var userId=loggedinUserModel.getData().userId;
	
	
	userTypeModel.loadData("/utilweb/rest/user/auth/userType",null,false);
	
	if(userTypeModel.getData().message=="INTERNAL"){
		gwLoginUserModel.loadData(urlKaustUser+"UserID(KaustID='',UserId='"+userId+"')?$format=json",null,false);
	}*/
	
	
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData({
		dateValue: new Date()
	});
	this.getView().setModel(oModel,"dateModel");
}	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
//	onAfterRendering: function() {
//		
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
//	onExit: function() {
//
//	}
})