jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.PIApprovalRequest", {

/**
 * Called when a controller is instantiated and its View controls (if available)
 * are already created. Can be used to modify the View before it is displayed,
 * to bind event handlers and do other one-time initialization.
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
	onInit: function() {
	var that = this;
	this.delCount = 0;	
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	if(!this.busyDialog){
	    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
	    this.getView().addDependent(this.busyDialog);
	    this.busyDialog.addStyleClass("sapUiSizeCompact");
    }
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "PIApprovalRequest") {
			var tData=that.getView().byId("idPITable").getItems();
			var tDataLen=tData.length-1;
			if(tDataLen>0){
				for(var i=0;i<tDataLen;i++){
					that.getView().byId('idPITable').removeItem(tData[i]);
				}
			}else if(tDataLen<0){
				that.add();
			}
			that.loadPage();
			}
		});	
	},
	
	
	loadPage : function(){
			var that = this;
		//	that.getView().byId('idPITable').setMode("None");
			var tData=that.getView().byId("idPITable").getItems();
			var tDataLen=tData.length;
			for(var k=0;k<tDataLen;k++){
				tData[k].getCells()[1].setValue("");
				tData[k].getCells()[2].setValue("");
				tData[k].getCells()[3].setValue("");
				tData[k].getCells()[3].setTooltip("");
				tData[k].getCells()[4].setValue("");
				tData[k].getCells()[4].setTooltip("");
				tData[k].getCells()[5].setValue("");
				tData[k].getCells()[5].setTooltip("");
			}
			var piReqTableModel = new sap.ui.model.json.JSONModel();
			var tableData ={
					"userDtos":[],
					"piApprovalDtos":[],
					"uiAction":""
					};
			piReqTableModel.setData(tableData);
			that.getView().byId("idPITable").setModel(piReqTableModel);
		
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				dateValue: new Date()
			});
			that.getView().setModel(oModel,"dateModel");
	},
	
	
	add:function(){
		this.delCount = 0;	
		var that=this;
		userId = "";
	//	that.getView().byId('idPITable').setMode("None");
		that.getView().byId("piSubmitBtn").setEnabled(true);
		var pIdArray=[];
		var tableItems=that.getView().byId("idPITable").getItems();
		var piTableLength= tableItems.length;
		for(var i=0;i<piTableLength;i++){
			if(tableItems[i].getProperty('selected')){
			tableItems[i].setProperty('selected')==false;
			}
		var item1=tableItems[i].getCells()[1].getValue();
		if(item1!=""){
		pIdArray.push(item1);
			}
		}
		if(pIdArray.length==tableItems.length){
		var clItem= new sap.m.ColumnListItem({
		cells:[
		      new sap.m.Input({visible:false}),
		      new sap.m.Input({enabled:false}),
		      new sap.m.Input({
		    	  filterSuggests:false,
		   	  showSuggestion:true,
		   	  placeholder : "Enter atleast 4 characters",
		   	  maxLength:50,
		   	  suggest: function(evt){
		   	  that.handleSuggest(evt);
		   	  },
		   	  suggestionItems:{
		   	                   path:'userSearchModel>/userDtos',
		   	                   template: new sap.ui.core.ListItem({
		   	                   	text:'{userSearchModel>displayNm}',
		   	                   	additionalText:"{userSearchModel>userId}"
		   	                   })
		   	  },
		   	  suggestionItemSelected:function(oEvt){
		   		  that.itemSelected(oEvt);
		   	  },
		   	  change:function(oEvt){
		   		  that.onNameChange(oEvt);
		   	  },
		   	  liveChange : function(oEvent){
		   		  that.itemDel(oEvent);
		   	  }}),
		      new sap.m.Input({editable:false}).addStyleClass("piReqTblCell tooltip"),
		      new sap.m.Input({editable:false}).addStyleClass("piReqTblCell tooltip"),
		      new sap.m.Input({editable:false}).addStyleClass("piReqTblCell tooltip"),
		      new sap.m.DatePicker({dateValue:{
		    	  path:'dateModel>/dateValue'},
		      enabled:false,
	    	  displayFormat:"dd/MM/yyyy" })
		      ]});
		that.getView().byId("idPITable").addItem(clItem);
		}
		else{
			sap.ui.commons.MessageBox.show("Row cannot be empty. Please remove unused rows",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}
	},
	
	selectionChange:function(oEvt){
		/*var that =this;
		var selItemsLen=oEvt.getSource().getSelectedItems().length;
		if(selItemsLen>0){
			that.getView().byId("piSubmitBtn").setEnabled(true);
		}
		else{
			that.getView().byId("piSubmitBtn").setEnabled(false);
		}*/
	},
	
	onNameChange:function(oEvent){
		var name= oEvent.getSource().getValue();
		if(name.trim() != "" && (userId == undefined || userId == "")){
			oEvent.getSource().setValue("");
			sap.ui.commons.MessageBox.show("Please select PI name from suggested options",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		if(name.trim() == ""){
			userId="";
		}
	},
	
	deleteRule: function(evt){
		var that =this;
	//	that.getView().byId('idPITable').setMode("MultiSelect");
		//that.getView().byId("piSubmitBtn").setEnabled(false);
		var tableItems=this.getView().byId('idPITable').getItems();
		var selItems=this.getView().byId('idPITable').getSelectedItems();
		var selItemsLen=selItems.length;
		//if(this.delCount > 0){ 		
			if(selItemsLen>0){
				for(var i=0;i<selItemsLen;i++){
					if(selItems[i].getCells()[1].getValue() && that.getView().byId('idPITable').getModel().getData().userDtos!=undefined){
						that.findAndRemove(that.getView().byId('idPITable').getModel().getData().userDtos, "userIdOrKaustId", selItems[i].getCells()[1].getValue());
					}
					this.getView().byId('idPITable').removeItem(selItems[i]);
					if(i==(selItemsLen-1)){
						// that.getView().byId('idPITable').setMode("None");
					}
				}
			//	this.delCount = 0;  
				return ;  			
			}
			else{
				sap.ui.commons.MessageBox.show("Please select an item to remove",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
		//}
		//this.delCount++;			
},

findAndRemove :function (array, property, value) {
	  array.forEach(function(result, index) {
	    if(result[property] === value) {
	      array.splice(index, 1);     //Remove from array
	    }    
	  });
	},
	

	itemDel : function(oEvent){
		var that =this;
		//var suggetItems= that.getView().byId("suggetItems").getValue();
		var suggetItems= oEvent.getSource().getValue();
		var userListItem = oEvent.getSource().getParent();
		var tData=that.getView().byId("idPITable").getItems();
		if(userListItem.getCells()[1].getValue()&&that.getView().byId('idPITable').getModel().getData().userDtos!=undefined){
		that.findAndRemove(that.getView().byId('idPITable').getModel().getData().userDtos, "userIdOrKaustId", userListItem.getCells()[1].getValue());
		}
		if(suggetItems==""){
			userListItem.getCells()[1].setValue("");
			userListItem.getCells()[3].setValue("");
			userListItem.getCells()[4].setValue("");
			userListItem.getCells()[5].setValue("");
			userListItem.getCells()[4].setTooltip("");
			userListItem.getCells()[5].setTooltip("");
		}
	},

	handleSuggest : function(oEvent){
		var that= this;
		var tData=that.getView().byId("idPITable").getItems();
		var userListItem = oEvent.getSource().getParent();
		var autoUser = oEvent.getParameter("suggestValue");
		oSearchUserModel = new sap.ui.model.json.JSONModel();
			if(userListItem.getCells()[1].getValue()&&that.getView().byId('idPITable').getModel().getData().userDtos!=undefined){
				that.findAndRemove(that.getView().byId('idPITable').getModel().getData().userDtos, "userIdOrKaustId", userListItem.getCells()[1].getValue());
			}
			userListItem.getCells()[1].setValue("");
			userListItem.getCells()[3].setValue("");
			userListItem.getCells()[4].setValue("");
			userListItem.getCells()[5].setValue("");
			userListItem.getCells()[4].setTooltip("");
			userListItem.getCells()[5].setTooltip("");
			
		if (autoUser.length > 3) {
			var searchPayload ={"userNm" : autoUser};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),false,"POST",false,false,oHeader);
			if(oSearchUserModel.getData()==undefined){
				userListItem.getCells()[1].setValue("");
				userListItem.getCells()[3].setValue("");
				userListItem.getCells()[4].setValue("");
				userListItem.getCells()[5].setValue("");
				userListItem.getCells()[4].setTooltip("");
				userListItem.getCells()[5].setTooltip("");
				that.getView().getModel("userSearchModel").setData();
				that.getView().getModel("userSearchModel").refresh();
			}else{
				if(!(oSearchUserModel.getData().userDtos instanceof Array)){
					oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];
				}
				that.getView().setModel(oSearchUserModel,"userSearchModel");
			}
		}else{
			if(that.getView().getModel("userSearchModel")!=undefined){
				that.getView().getModel("userSearchModel").setData();
				that.getView().getModel("userSearchModel").refresh();
				}	
		}
	},	
	
	itemSelected : function(oEvt){
		
		userId=oEvt.getParameter("selectedItem").getAdditionalText();
		var userIdCaps=userId.toUpperCase();
		var that= this;
		var tableUserData = oEvt.getParameter("selectedItem").getBindingContext("userSearchModel").getObject();
		var userListItem = oEvt.getSource().getParent();
//		that.piUserUniqueId=tableUserData.userUniqueId;
//		that.fName= tableUserData.firstNm;
//		that.lName= tableUserData.lastNm;
		
		var oPktIdJsonModel = new sap.ui.model.json.JSONModel();
		oPktIdJsonModel.loadData(urlInc+"PocketIds?$filter=(UserId eq '"+userIdCaps+"')&$select=UserId,PocketIdNo&$format=json",null,false);
		if(oPktIdJsonModel.getData().d.results.length>0){
		var oPILstJsonModel = new sap.ui.model.json.JSONModel();
		var orgNm="",deptNm="",subCatType="",pos="",telephone="",mob="",country="",custAcNo="",kaustId="",degreeType="",userIdOrKaustId="";
		oPILstJsonModel.loadData("/utilweb/rest/user/auth/read/"+userId,null,false);
		if(!(oPILstJsonModel.oData==undefined)){
			orgNm =oPILstJsonModel.getData().orgNm;
			deptNm= oPILstJsonModel.getData().deptNm;
			subCatType= oPILstJsonModel.getData().subCategoryType;
			pos= oPILstJsonModel.getData().position;
			telephone= oPILstJsonModel.getData().telephone;///remove
			mob= oPILstJsonModel.getData().mobile;
			country= oPILstJsonModel.getData().countryNm;
			custAcNo= oPILstJsonModel.getData().custAcNo;
			kaustId= oPILstJsonModel.getData().kaustId;
			degreeType= oPILstJsonModel.getData().degreeType;
			userIdOrKaustId = oPILstJsonModel.getData().userIdOrKaustId;
		}else{
		oPILstJsonModel.loadData(urlKaustUser+"UserID(KaustID='',UserId='"+userId+"')?$format=json",null,false);
		if(oPILstJsonModel.getData().d){
			orgNm =oPILstJsonModel.getData().d.Orgname;
			//uId = oPILstJsonModel.getData().d.UserId; 
			deptNm= oPILstJsonModel.getData().d.Deptname;
			subCatType= oPILstJsonModel.getData().d.Subcategorytype;
			pos= oPILstJsonModel.getData().d.Position;
			telephone= oPILstJsonModel.getData().d.Office;
			mob= oPILstJsonModel.getData().d.Mobile;
			country= "";
			custAcNo= "";
			kaustId= oPILstJsonModel.getData().d.KaustID;
			degreeType= oPILstJsonModel.getData().d.DegreeType;
			userIdOrKaustId = oPILstJsonModel.getData().d.KaustID;
			}
		}
		if(userIdOrKaustId!=""){
		userListItem.getCells()[1].setValue(userIdOrKaustId);
		userListItem.getCells()[3].setValue(tableUserData.emailId);
		userListItem.getCells()[4].setValue(deptNm);
		userListItem.getCells()[4].setTooltip(deptNm);
		userListItem.getCells()[5].setValue(orgNm);
		userListItem.getCells()[5].setTooltip(orgNm);
		if(that.getView().byId('idPITable').getModel().getData().userDtos==undefined){
			var piReqTableModel = new sap.ui.model.json.JSONModel();
			var tableData ={
					"userDtos":[],
					"piApprovalDtos":[],
					"uiAction":""
					};
			piReqTableModel.setData(tableData);
			that.getView().byId("idPITable").setModel(piReqTableModel);
		}
		
		that.getView().byId('idPITable').getModel().getData().userDtos.push({
			"userId":userId,
			"firstNm":tableUserData.firstNm,
			"lastNm":tableUserData.lastNm,
			"displayNm":tableUserData.displayNm,
			"userUniqueId":tableUserData.userUniqueId,
			"emailId":tableUserData.emailId,
			"position":pos,
			"orgNm":orgNm,
			"deptNm":deptNm,
			"telephone":telephone,
			"mobile":mob,
			"countryNm":country,
			"custAcNo":custAcNo,
			"kaustId":kaustId,
			"degreeType":degreeType,
			"subCategoryType":subCatType,
			"createdDate":userListItem.getCells()[6].getValue(),
			"userIdOrKaustId":userIdOrKaustId
			});
		}else{
			sap.ui.commons.MessageBox.show("PI not in system, please select other PI",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			userListItem.getCells()[2].setValue("");
			}
		}else{
			sap.ui.commons.MessageBox.show("Selected PI has no Pocket ID, please select other PI",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			userListItem.getCells()[2].setValue("");
		}
	},

	validatePIRequest:function(){
		var that=this;
		if(that.busyDialog){
			that.busyDialog.open();
		}
		var piTableItems=that.getView().byId("idPITable").getItems();
		var pIdArr=[];
		var tableData=that.getView().byId('idPITable').getModel().getData().userDtos;
		var loggedInUser = loggedinUserModel.getData();
		var pos="", orgNm="",deptNm="",telephone="",mobile="",kaustId="",degreeType="",subCatType="",country="",custAcNo="",userIdOrKaustId="";
		if(userTypeModel.getData().message=="INTERNAL"){
			var gwLoggedInUser = gwLoginUserModel.getData().d;
			pos=gwLoggedInUser.Position;
			orgNm=gwLoggedInUser.Orgname;
			deptNm=gwLoggedInUser.Deptname;
			telephone=gwLoggedInUser.Office;
			mobile=gwLoggedInUser.Mobile;
			kaustId=gwLoggedInUser.KaustID;
			degreeType=gwLoggedInUser.DegreeType;
			subCatType=gwLoggedInUser.Subcategorytype;
			userIdOrKaustId = gwLoggedInUser.KaustID;
		
		}else if(userTypeModel.getData().message=="RPT"){
			var oRptJsonModel = new sap.ui.model.json.JSONModel();
			oRptJsonModel.loadData("/utilweb/rest/user/auth/read/"+loggedInUser.userId,null,false);
			if(!(oRptJsonModel.oData==undefined)){
				orgNm =oRptJsonModel.getData().orgNm;
				deptNm= oRptJsonModel.getData().deptNm;
				subCatType= oRptJsonModel.getData().subCategoryType;
				pos= oRptJsonModel.getData().position;
				telephone= oRptJsonModel.getData().telephone;///remove
				mobile= oRptJsonModel.getData().mobile;
				country= oRptJsonModel.getData().countryNm;
				custAcNo= oRptJsonModel.getData().custAcNo;
				kaustId= oRptJsonModel.getData().kaustId;
				degreeType= oRptJsonModel.getData().degreeType;
				userIdOrKaustId = oRptJsonModel.getData().userIdOrKaustId;
			}
		}
		var piTableItemsLen=piTableItems.length;
		for(var i=0;i<piTableItemsLen;i++){
			var pidValue=piTableItems[i].getCells()[1].getValue();
			if(pidValue!=""){
				if(!(pIdArr.indexOf(pidValue)>-1)){
				pIdArr.push(pidValue);
				}
				else{sap.ui.commons.MessageBox.show("Cannot select same PI, please select other PI",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				that.busyDialog.close();
				return;
				}
			}
		}
		if(pIdArr.length<piTableItems.length || piTableItems.length==0){
			sap.ui.commons.MessageBox.show("Fill all fields or remove blank PI ID record",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			that.busyDialog.close();
		}else{
			var tableDataLen=tableData.length;
			for(var i=0;i<tableDataLen;i++){
				that.getView().byId('idPITable').getModel().getData().piApprovalDtos.push(
						{"piId":tableData[i].userId,
							"userId":loggedInUser.userId,
							"displayNm":tableData[i].displayNm,
							"userUniqueId":tableData[i].userUniqueId
						});
			}
			tableData.push({ 
				"userId":loggedInUser.userId,
				"firstNm":loggedInUser.firstNm,
				"lastNm":loggedInUser.lastNm,
				"displayNm":loggedInUser.displayNm,
				"userUniqueId":loggedInUser.userUniqueId,
				"emailId":loggedInUser.emailId,
				"position":pos,
				"orgNm":orgNm,
				"deptNm":deptNm,
				"telephone":telephone,
				"mobile":mobile,
				"countryNm":country,
				"custAcNo":custAcNo,
				"kaustId":kaustId,
				"degreeType":degreeType,
				"subCategoryType":subCatType,
				"userIdOrKaustId":userIdOrKaustId
				//"createdDate":userListItem.getCells()[6].getValue()
			});
			that.getView().byId('idPITable').getModel().getData().uiAction="SUBMIT";
			that.submit();
		}
},

submit : function(){
	var that =this;
	var dbDataModel=new sap.ui.model.json.JSONModel();
	var loggedInUser = loggedinUserModel.getData();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	var tData=that.getView().byId("idPITable").getItems();
	var jsonPayload = 	that.getView().byId('idPITable').getModel().getData();			
	dbDataModel.loadData("/utilweb/rest/piapprovalreq/userpiapproval",JSON.stringify(jsonPayload),false,"POST",false,false,oHeader);
						
	if(dbDataModel.getData().approvalResponseDtos){		
	var startProcessSvcURL = "/bpmodata/startprocess.svc/kaust.com/kcl~rfs~bpm/KCL_RFS_PI_Approval_Process_Initiated_By_The_User/"; 
	var processStartODataModel = new sap.ui.model.odata.ODataModel(startProcessSvcURL, true);
	 if(!(dbDataModel.getData().approvalResponseDtos instanceof Array)){
		 dbDataModel.getData().approvalResponseDtos=[dbDataModel.getData().approvalResponseDtos];
	 		}
					var startData = {};
					startData.ProcessStartEvent = {};
					var piUniqueId="";
					var piName ="";
					var dbDataModelLen=dbDataModel.getData().approvalResponseDtos.length;
					var message = "";
					var isSuccess = true;
					var jsonPayloadLen=jsonPayload.piApprovalDtos.length;
					for(var i=0;i<dbDataModelLen;i++){
						var dbResponseData = dbDataModel.getData().approvalResponseDtos[i];
						for(var j=0; j<jsonPayloadLen;j++){
							if(dbResponseData.piId==jsonPayload.piApprovalDtos[j].piId){
								piUniqueId=jsonPayload.piApprovalDtos[j].userUniqueId;
								piName = jsonPayload.piApprovalDtos[j].displayNm;
							}
						}
						data1 ={
								requestId : dbResponseData.requestId,
								requesterUid : loggedInUser.userUniqueId,
								requesterNm : loggedInUser.displayNm,
								piUid : piUniqueId,
								piNm: piName,
								supportTeamUid : "ROLE.UME_ROLE_PERSISTENCE.un:CL_SUPPORT_TASK_OWNER"
						};	

			startData.ProcessStartEvent.DO_PI_Approval = data1;
			processStartODataModel.create('/StartData', startData, null,  
			function(oData,oResponse) {  
				message += "PI approval request has been submitted with Request ID "+dbResponseData.requestId+" to "+piName + "\n ";
			},  
			function(oEvent) {
				message += "Error, please try again  \n";
				isSuccess = false;
						}); 
			
			if (!isSuccess) {
				break;
						}
					}
			if (isSuccess) {
				sap.ui.commons.MessageBox.show(message,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
						function(){
//							if(that.busyDialog){
								that.busyDialog.close();
//							}
//							window.location.reload(false);
					var tDataLen=tData.length-1;
					if(tDataLen>0){
						for(var i=0;i<tDataLen;i++){
							that.getView().byId('idPITable').removeItem(tData[i]);
						}
					}
					that.loadPage();
				});
			} else {
				sap.ui.commons.MessageBox.show("An error occurred while submitting the data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				that.busyDialog.close();
				}
			}
		else{sap.ui.commons.MessageBox.show(dbDataModel.getData().listMessage,sap.ui.commons.MessageBox.Icon.ERROR,"Error");}
				var tDataLen=tData.length;
				for(var k=0;k<tDataLen;k++){
					tData[k].getCells()[1].setValue("");
					tData[k].getCells()[2].setValue("");
					tData[k].getCells()[3].setValue("");
					tData[k].getCells()[4].setValue("");
					tData[k].getCells()[5].setValue("");
					tData[k].getCells()[3].setTooltip("");
					tData[k].getCells()[4].setTooltip("");
					tData[k].getCells()[5].setTooltip("");
				}
				that.getView().byId('idPITable').getModel().oData={};
				that.getView().byId('idPITable').getModel().refresh();
}


/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
// onBeforeRendering: function() {
//
// },

/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
// onAfterRendering: function() {
//
// },

/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf corelabs.PIApprovalRequest
 */
// onExit: function() {
//
// }

});
var userId = "";