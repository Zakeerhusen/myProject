jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.DocumentReview", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf servicescopeandchargesform.DocumentReview
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	var that = this;
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "DocumentReview") {
			that.getView().byId("suggetItems").setValue("");
			var oTable = that.getView().byId("reviewDocTable");
			if(oTable.getModel("reviewDocModel")!=undefined){
		 	oTable.getModel("reviewDocModel").setData();
		 	oTable.getModel("reviewDocModel").refresh();
			}
		}});
	that.selUser="";
	},
	
	
	findReviewDoc:function(evt){
		var that=this;
		if(that.selUser!=""){
			var userId=that.selUser;		
		
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var reviewDocPayload={
//				"businessDocType":"1",
				"operationId":userId,
//				"operationName":"RFS007"
				"operationNameEmpty":"true"
				};
				var reviewDocModel=new sap.ui.model.json.JSONModel();
				reviewDocModel.loadData("/cc_ecm/file/readDocuments",JSON.stringify(reviewDocPayload),false,"POST",false,false,oHeader);
				if(reviewDocModel.getData()){
					if(reviewDocModel.getData().documentManagerDtoList==undefined){
					reviewDocModel.getData().documentManagerDtoList=[];
					}
					else if(!(reviewDocModel.getData().documentManagerDtoList instanceof Array)){
					reviewDocModel.getData().documentManagerDtoList=[reviewDocModel.getData().documentManagerDtoList];
					}
					if(reviewDocModel.getData().documentManagerDtoList!=undefined){	
					var dtoList=reviewDocModel.getData().documentManagerDtoList;
					var length=dtoList.length;
					for(var i=0;i<length;i++){
					if(dtoList[i].createdDateValue!=""){
					dtoList[i].createdDateValue = getFormattedDate(new Date(dtoList[i].createdDateValue));
							}
						}
					}
					var oTable = that.getView().byId("reviewDocTable");
					 	oTable.setModel(reviewDocModel,"reviewDocModel");
					 	reviewDocModel.refresh();
					}else{
					if(reviewDocModel.getData()){
					}
					reviewDocModel.getData().documentManagerDtoList=[];
					that.getView().byId("suggetItems").setValue("");
				}
		}else{
				var userId="";
				that.getView().byId("suggetItems").setValue("");
				sap.ui.commons.MessageBox.show("Please select a user",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
	},
	
	
	handleSuggest : function(oEvent){
		var that= this;
		this.selUser="";
		var autoUser = oEvent.getParameter("suggestValue");
		var oSearchUserModel = new sap.ui.model.json.JSONModel();
		if (autoUser.length > 3) {
			var searchPayload ={"userNm" : autoUser};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),false,"POST",false,false,oHeader);
			if((oSearchUserModel.getData()) && (oSearchUserModel.getData().userDtos!=undefined) && (oSearchUserModel.getData().userDtos instanceof Array)){
				that.getView().setModel(oSearchUserModel,"userSearchModel");
			}
			else if((oSearchUserModel.getData()) && (!(oSearchUserModel.getData().userDtos instanceof Array))){
					oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];
					that.getView().setModel(oSearchUserModel,"userSearchModel");
			}else{
				//that.getView().byId("suggetItems").setValue("");
				//sap.ui.commons.MessageBox.show("Please enter user name for suggestion",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}else{
			if(that.getView().getModel("userSearchModel")!=undefined){
				that.getView().getModel("userSearchModel").setData();
				that.getView().getModel("userSearchModel").refresh();
			}	
		}
	},
	
	
	itemSelected : function(oEvt){
		var that=this;
		var userId=oEvt.getParameter("selectedItem").getAdditionalText();
		var userName=oEvt.getParameter("selectedItem").getText();
		oEvt.getSource().setValue(userName);
		this.selUser=userId;
	},
	
	onNameChange:function(oEvent){
		var name= oEvent.getSource().getValue();
		if(name.trim() != "" && (this.selUser == undefined || this.selUser == "")){
			oEvent.getSource().setValue("");
			sap.ui.commons.MessageBox.show("Please select a user",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		if(name.trim() == ""){
			this.selUser="";
		}
	}
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.DocumentReview
*/

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf servicescopeandchargesform.DocumentReview
*/

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.DocumentReview
*/
//	onExit: function() {
//
//	}

});
//var reviewDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
