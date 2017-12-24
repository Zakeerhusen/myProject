jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.RolesManagement", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf servicescopeandchargesform.RolesManagement
	 */
	onInit : function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
		//var oRequestModel = new sap.ui.model.json.JSONModel();
		//oRequestModel.loadData("Model/combobox.json", null, false);

		//this.getView().setModel(oRequestModel, "oRequestModel");
		var that = this;
		var oRoleJsonModel = new sap.ui.model.json.JSONModel();
		var rolePayload ={
		  "loggedInUser" : "true",
		  "applicableRoleListReqd": "true"
		};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		oRoleJsonModel.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(rolePayload),false,"POST",false,false,oHeader);
		if(!(oRoleJsonModel.getData().userRoleDtoList instanceof Array)){
			oRoleJsonModel.getData().userRoleDtoList=[oRoleJsonModel.getData().userRoleDtoList];
		}
		that.getView().setModel(oRoleJsonModel,"oRoleJsonModel");
	},
	roleSelection : function(oEvent){
		var that =this;
		var getRoleDataModel = new sap.ui.model.json.JSONModel();
		var selectedVal = oEvent.getParameters().selectedItem.getProperty("key");
		var obj = {
				  "roleId" : selectedVal
		};
		that.getView().setModel(getRoleDataModel, "getRoleDataModel");
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var url = "/utilweb/rest/ume/auth/userListByRoleOrUserIdList";
		getRoleDataModel.loadData(url, JSON.stringify(obj), false, "POST", false, false, oHeader);
		if (getRoleDataModel.getData() && getRoleDataModel.getData().userDtoList && (!(getRoleDataModel.getData().userDtoList instanceof Array))) {
			/*var arry = [];
			arry = getRoleDataModel.getData().userDtoList;
			getRoleDataModel.getData().userDtoList = arry;*/
			getRoleDataModel.getData().userDtoList = [getRoleDataModel.getData().userDtoList];
		}
		getRoleDataModel.refresh();
		that.getView().byId("roleOrUserPanelId").setVisible(true);
	},
	
	callRoleDialog:function(evt){
		var that=this;
		
		that.roleDialog.open();
		},

		cancelRole:function(){
		var that=this;
		sap.ui.getCore().byId("userList").setValue("");
		that.roleDialog.close();
		},

		
		deleteTabRow : function(oEvent){
			var tableModel = this.getView().getModel("getRoleDataModel");
			var tableModelData = tableModel.getData().userDtoList;
			var deleteRoleDataModel = new sap.ui.model.json.JSONModel();
			var url = "/utilweb/rest/ume/auth/removeUserFromRole";
			var rolId = this.getView().byId("comboRoleId").getSelectedKey();
			if (tableModelData) {
				for ( var i = 0;leng = tableModelData.length, i < leng; i++) {
					if (tableModelData[i].selectTableRow) {
						var obj = {
								"userId" : tableModelData[i].userId,
							    "roleId" : rolId
						};
						var oHeader= {"Content-Type":"application/json;charset=utf-8"};
						deleteRoleDataModel.loadData(url, JSON.stringify(obj), false, "POST", false, false, oHeader);
						if (deleteRoleDataModel.getData() && deleteRoleDataModel.getData().status === "SUCCESS") {
							tableModelData.splice(i,1);
							sap.ui.commons.MessageBox.show("User removed",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success");
							tableModel.refresh();
							return;
						}else{
							//alert("Service Error");
							sap.ui.commons.MessageBox.show("Error in removing",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
							return;
						}
					}else if(i==(tableModelData.length-1)){
						//alert("Select Row");
						sap.ui.commons.MessageBox.show("Please select a record to remove",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
					}
				}
			}
			tableModel.refresh();
		},
		
		
		addRoleData : function(oEvent){
			var combo = this.getView().byId("comboRoleId");
			var selectedKey = combo.getSelectedKey();
			if(selectedKey === ""){
				sap.ui.commons.MessageBox.show("Please select a role to assign",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
			else if (!this.roleDialog) {
				this.roleDialog = sap.ui.xmlfragment("corelabs.fragments.roleMgmt", this);
				this.getView().addDependent(this.roleDialog);
				this.roleDialog.addStyleClass("sapUiSizeCompact");	
			}
			else if(selectedKey != ""){
			this.userId="";
			this.roleDialog.open();
			}
			
		},
		handleSuggest : function(oEvent){
			var that= this;
		var autoUser = oEvent.getParameter("suggestValue");
			oSearchUserModel = new sap.ui.model.json.JSONModel();

	if (autoUser.length > 3) {
				var searchPayload ={"userNm" : autoUser};
				var oHeader= {"Content-Type":"application/json;charset=utf-8"};
				oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),false,"POST",false,false,oHeader);

	if(!(oSearchUserModel.getData().userDtos instanceof Array)){
						oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];
					}
					that.getView().setModel(oSearchUserModel,"userSearchModel");

	}	

	},

	itemSelected : function(oEvt){
		var that=this;
		that.userId=oEvt.getParameter("selectedItem").getAdditionalText();

		},
	
	assignRole : function(oEvt){
			var that = this;
			var url = "/utilweb/rest/ume/auth/addUserToRole";
			var tableModel = that.getView().getModel("getRoleDataModel");
			
			//var userId = that.getView().byId("userList").getAdditionalText();
			var rolId = that.getView().byId("comboRoleId").getSelectedKey();
			
			if(rolId!=""){
				if(that.userId==""||that.userId==undefined){
					sap.ui.commons.MessageBox.show("Please select user to assign role",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				}else {
					if(tableModel.getData()){
					var tableModelData = tableModel.getData().userDtoList;
					for(var i=0; i < tableModelData.length;i++ ){
						if(tableModelData[i].userId === that.userId){
							sap.ui.commons.MessageBox.show("User already exists",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");	
							return;
						}
					}}			
					var addRoleDataModel = new sap.ui.model.json.JSONModel();
					var oHeader= {"Content-Type":"application/json;charset=utf-8"};
					var obj = {
							 "userId" : that.userId,
							   "roleId" : rolId
					};
					addRoleDataModel.loadData(url, JSON.stringify(obj), false, "POST", false, false, oHeader);
					if (addRoleDataModel.getData() && addRoleDataModel.getData().status === "SUCCESS") {
						//tableModelData.push();
						sap.ui.commons.MessageBox.show("Assigned Successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
								function(){
							that.addToTable(rolId);
						});
					}
				
				}
			
			}else{
				sap.ui.commons.MessageBox.show("Please select a Role to add",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
			//tableModel.refresh();
	},
	
	addToTable : function(rolId){
		var that=this;
		var getRoleDataModel = new sap.ui.model.json.JSONModel();
		var obj = {
				  "roleId" : rolId
		};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var url = "/utilweb/rest/ume/auth/userListByRoleOrUserIdList";
		getRoleDataModel.loadData(url, JSON.stringify(obj), false, "POST", false, false, oHeader);
		if (getRoleDataModel.getData() && getRoleDataModel.getData().userDtoList && (!(getRoleDataModel.getData().userDtoList instanceof Array))) {
			getRoleDataModel.getData().userDtoList = [getRoleDataModel.getData().userDtoList];
		}
		that.getView().setModel(getRoleDataModel, "getRoleDataModel");
		that.getView().getModel("getRoleDataModel").refresh();
		that.cancelRole();
	},

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf servicescopeandchargesform.RolesManagement
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf servicescopeandchargesform.RolesManagement
 */
 onAfterRendering: function() {
		var that=this;
		that.getView().byId("comboRoleId").$().find("input").attr("readonly", true);
 }
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf servicescopeandchargesform.RolesManagement
 */
// onExit: function() {
//
// }
});