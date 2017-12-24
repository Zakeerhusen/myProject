jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.PIRegistration", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kost.PItask
*/
	onInit: function() {
	this.delRegCount = 0;	
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	if(!this.busyDialog){
	    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
	    this.getView().addDependent(this.busyDialog);
	    this.busyDialog.addStyleClass("sapUiSizeCompact");
    }	
	var that= this;
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "PIRegistration") {
			var tData=that.getView().byId("piTable").getItems();
			var tDtLen = tData.length - 1;
			if(tDtLen>0){
				for(var i=0;i<tDtLen;i++){
					that.getView().byId('piTable').removeItem(tData[i]);
				}
			}else if(tDtLen<0){
				that.onAdd();
			}
			that.loadPage();
			that.attachReadOnly(tData[0].getCells()[3]);
		}});
	},
	
	attachReadOnly: function(cell1){
		cell1.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapUiTfInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},cell1);
	},
	
loadPage : function(){
			var that = this;
		//	that.getView().byId('piTable').setMode("None");
			var piTableItems=that.getView().byId("piTable").getItems();
			var piTableLen = piTableItems.length;
			for(var i=0;i<piTableLen;i++){
				piTableItems[i].getCells()[0].setValue();
				piTableItems[i].getCells()[1].setValue();
				piTableItems[i].getCells()[2].setValue();
				piTableItems[i].getCells()[3].setValue();
			}
			var logUserId=loggedinUserModel.getData().userId;
			var userIdCaps =logUserId.toUpperCase();
			//that.getView().byId('pktId').setValue("");
			var oPktIdJsonModel = new sap.ui.model.json.JSONModel();
			oPktIdJsonModel.loadData(urlInc+"PocketIds?$filter=(UserId eq '"+userIdCaps+"')&$select=UserId,PocketIdNo&$format=json",null,false);
			that.getView().setModel(oPktIdJsonModel,"oPktIdJsonModel");
			
			var piReqTableModel = new sap.ui.model.json.JSONModel();
			var tableData ={
					"userDtos":[],
					"piApprovalDtos":[],
					"uiAction":""
					};
			piReqTableModel.setData(tableData);
			that.getView().byId("piTable").setModel(piReqTableModel);
	},
	
onAdd : function(){
		this.delRegCount = 0;	
		var that=this;
		userId="";
	//	that.getView().byId('piTable').setMode("None");
		that.getView().byId("piRegisterBtn").setEnabled(true);
		var pIdArray=[];
		var tableItems=that.getView().byId("piTable").getItems();
		var piTableLength= tableItems.length;
		for(var i=0;i<piTableLength;i++){
			if(tableItems[i].getProperty('selected')){
				tableItems[i].setProperty('selected')==false;
			}
		var item1=tableItems[i].getCells()[0].getValue();
		if(item1!=""){
		pIdArray.push(item1);
			}
		}
		if(pIdArray.length==tableItems.length){
		var clItem= new sap.m.ColumnListItem({
		cells:[
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
		   	                   path:'oSearchUserModel>/userDtos',
		   	                   template: new sap.ui.core.ListItem({
		   	                   	text:'{oSearchUserModel>displayNm}',
		   	                   	additionalText:"{oSearchUserModel>userId}"
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
		   	  }
		      }),
		      new sap.m.Input({enabled:false}),
		      new sap.ui.commons.ComboBox({
		    	  maxPopupItems:12,
		    	  width:"100%",
		    	  placeholder:"Select Pocket ID",
		    	  items:{
		    	  path:'oPktIdJsonModel>/d/results',
		    	  template: new sap.ui.core.ListItem({
 	                   	text:'{oPktIdJsonModel>PocketIdNo}',
 	                   	key:'{oPktIdJsonModel>UserId}'
 	                	   })
		      			}
		      		})
		      ]
		});
		that.getView().byId("piTable").addItem(clItem);
		that.attachReadOnly(clItem.getCells()[3]);
	}
		else{
			sap.ui.commons.MessageBox.show("Row cannot be empty. Please remove unused rows",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}},
		
	selectionChange:function(oEvt){
			/*var that =this;
			var selItemsLen=oEvt.getSource().getSelectedItems().length;
			if(selItemsLen>0)
			{
				that.getView().byId("piRegisterBtn").setEnabled(true);
			}
			else
			{
				that.getView().byId("piRegisterBtn").setEnabled(false);
			}*/
	},
	
	onNameChange:function(oEvent){
		var name= oEvent.getSource().getValue();
		if(name.trim() != "" && (userId == undefined || userId == "")){
			oEvent.getSource().setValue("");
			sap.ui.commons.MessageBox.show("Please select user from suggested options",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		if(name.trim() == ""){
			userId="";
		}
	},
	
	deleteRule: function(evt){
		var that =this;
	//	that.getView().byId('piTable').setMode("MultiSelect");
	//	that.getView().byId("piRegisterBtn").setEnabled(false);
		var tableItems=this.getView().byId('piTable').getItems();
		var selItems=this.getView().byId('piTable').getSelectedItems();
		var selItemsLen=selItems.length;

	//	if(this.delRegCount){ 		
			if(selItemsLen>0){
				for(var i=0;i<selItemsLen;i++){
					if(selItems[i].getCells()[0].getValue()&& that.getView().byId('piTable').getModel().getData().userDtos!=undefined){
						that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "userIdOrKaustId", selItems[i].getCells()[0].getValue());
					}
					this.getView().byId('piTable').removeItem(selItems[i]);
					if(i==(selItemsLen-1)){
					//	that.getView().byId('piTable').setMode("None");
					}
				}
			}
			else{
				sap.ui.commons.MessageBox.show("Please select an item to remove",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
	//	}
	//	this.delRegCount++;			
},

findAndRemove :function (array, property, value) {
	  array.forEach(function(result, index) {
	    if(result[property] === value) {
	      array.splice(index, 1);       //Remove from array
	    }    
	  });
	},
	
	itemDel : function(oEvent){
		var that =this;
		var suggetItems= that.getView().byId("suggItems").getValue();
	//	var tData=that.getView().byId("piTable").getItems();
		var userListItem = oEvent.getSource().getParent();
		if(userListItem.getCells()[0].getValue()&& that.getView().byId('piTable').getModel().getData().userDtos!=undefined){
			that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "userIdOrKaustId", userListItem.getCells()[0].getValue());
			}
		if(suggetItems==""){
			//tData[0].getCells()[0].setValue("");
			//tData[0].getCells()[1].setValue("");
			//tData[0].getCells()[2].setValue("");
			userListItem.getCells()[0].setValue("");
			userListItem.getCells()[2].setValue("");
		}
	},
	
	handleSuggest : function(oEvent){
		var that= this;
		//var tData=that.getView().byId("piTable").getItems();
		var autoUser = oEvent.getParameter("suggestValue");
		var userListItem = oEvent.getSource().getParent();
		oSearchUserModel = new sap.ui.model.json.JSONModel();
			if(userListItem.getCells()[0].getValue()&& that.getView().byId('piTable').getModel().getData().userDtos!=undefined){
				that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "userIdOrKaustId", userListItem.getCells()[0].getValue());
			}
			userListItem.getCells()[0].setValue("");
			userListItem.getCells()[2].setValue("");
			if (autoUser.length > 3) {
				var searchPayload ={
					   "userNm" : autoUser
					   // "minNoOfCharsInput" : "0",
					   //"maxNoOfUsersOutput" : "10"
					};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),false,"POST",false,false,oHeader);
			if(oSearchUserModel.getData()==undefined){
				userListItem.getCells()[0].setValue("");
				userListItem.getCells()[2].setValue("");
				that.getView().getModel("oSearchUserModel").setData();
				that.getView().getModel("oSearchUserModel").refresh();
			}else{
				if(!(oSearchUserModel.getData().userDtos instanceof Array)){
					oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];  //set the value if only one value
				}
				that.getView().setModel(oSearchUserModel,"oSearchUserModel");
			}
		}else{
			if(that.getView().getModel("oSearchUserModel")!=undefined){
				that.getView().getModel("oSearchUserModel").setData();
				that.getView().getModel("oSearchUserModel").refresh();
			}	
		}
	},	
	

	itemSelected : function(oEvt){
		var that= this;
		var userListItem = oEvt.getSource().getParent();
		userId=oEvt.getParameter("selectedItem").getAdditionalText();
		var tableUserData = oEvt.getParameter("selectedItem").getBindingContext("oSearchUserModel").getObject();
		//var uName=e.getSource().getValue();
		var oPILstJsonModel = new sap.ui.model.json.JSONModel();
		
		var orgNm="",deptNm="",subCatType="",pos="",telephone="",mob="",country="",custAcNo="",kaustId="",degreeType="",userIdOrKaustId="";
		oPILstJsonModel.loadData("/utilweb/rest/user/auth/read/"+userId,null,false);
		if(!(oPILstJsonModel.oData==undefined)){
			if(oPILstJsonModel.oData.userType=="EXTERNAL"){
				sap.ui.commons.MessageBox.show("External user cannot be registered.",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				userListItem.getCells()[1].setValue("");
				return;	
				}
			orgNm =oPILstJsonModel.getData().orgNm;
			deptNm= oPILstJsonModel.getData().deptNm;
			subCatType= oPILstJsonModel.getData().subCategoryType;
			pos= oPILstJsonModel.getData().position;
			telephone= oPILstJsonModel.getData().telephone;
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
		
		if(userIdOrKaustId=="" || userIdOrKaustId==undefined){
			sap.ui.commons.MessageBox.show("KAUST ID does not exist for the selected user.",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			userListItem.getCells()[1].setValue("");
		}else{
			userListItem.getCells()[0].setValue(userIdOrKaustId);
			userListItem.getCells()[2].setValue(tableUserData.emailId);
			that.getView().byId('piTable').getModel().getData().userDtos.push({
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
				"userIdOrKaustId":userIdOrKaustId
			});
		}
	},
	
	validateRegister:function(){
		var that=this;
		var piTableItems=that.getView().byId("piTable").getItems();
		var pIdArr=[];
		var tableData=that.getView().byId('piTable').getModel().getData().userDtos;
		var loggedInUser = loggedinUserModel.getData();
		var gwLoggedInUser = gwLoginUserModel.getData().d;
		var piTableLen = piTableItems.length;
		for(var i=0;i<piTableLen;i++){
			var pidValue=piTableItems[i].getCells()[0].getValue();
			var pktId= piTableItems[i].getCells()[3].getValue();
			if(pidValue!="" && pktId!=""){
				if(!(pIdArr.indexOf(pidValue)>-1)){
				pIdArr.push(pidValue);
				}else{sap.ui.commons.MessageBox.show("Same user cannot be selected more than once",sap.ui.commons.MessageBox.Icon.ERROR,"Error");return;}
			}
			else{
				sap.ui.commons.MessageBox.show("Please select user and assign Pocket ID",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				return;
			}
		}
		if(pIdArr.length<piTableItems.length || piTableItems.length==0){
			sap.ui.commons.MessageBox.show("Fill all fields or remove blank record",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}else{
			var tDataSize = tableData.length;
			var piTableItemsLen=piTableItems.length;
			for(var i=0;i<tDataSize;i++){
				for(var k=0; k<piTableItemsLen;k++){
					if(piTableItems[k].getCells()[0].getValue()==tableData[i].userIdOrKaustId){
						pktId= piTableItems[k].getCells()[3].getValue();
					that.getView().byId('piTable').getModel().getData().piApprovalDtos.push(
							{"piId":loggedInUser.userId,
								"userId":tableData[i].userId,
								"pocketId":pktId,
								"status": "REGISTERED"
							});
				
					tableData.push({
					"userId":loggedInUser.userId,
					"firstNm":loggedInUser.firstNm,
					"lastNm":loggedInUser.lastNm,
					"displayNm":loggedInUser.displayNm,
					"userUniqueId":loggedInUser.userUniqueId,
					"emailId":loggedInUser.emailId,
					"position":gwLoggedInUser.Position,
					"orgNm":gwLoggedInUser.Orgname,
					"deptNm":gwLoggedInUser.Deptname,
					"telephone":gwLoggedInUser.Office,
					"mobile":gwLoggedInUser.Mobile,
					//"countryNm":country,
					//"custAcNo":custAcNo,
					"kaustId":gwLoggedInUser.KaustID,
					"degreeType":gwLoggedInUser.DegreeType,
					"subCategoryType":gwLoggedInUser.Subcategorytype,
					"userIdOrKaustId":tableData[i].userIdOrKaustId});
					}
				}
			}
			that.getView().byId('piTable').getModel().getData().uiAction="REGISTER";
			that.register();
		}
},
	
	register : function(oEvt){
		var that =this;
		var loggedInUser = loggedinUserModel.getData();
		var tData=that.getView().byId("piTable").getItems();
		
		var dbOutputData = 	that.getView().byId('piTable').getModel().getData();	
			
			var piRegisterModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			piRegisterModel.loadData("/utilweb/rest/piapprovalreq/userpiapproval",JSON.stringify(dbOutputData),false,"POST",false,false,oHeader);
			if(piRegisterModel.getData().approvalResponseDtos){
				var tDataLen=tData.length;
				for(var k=0;k<tDataLen;k++){
					tData[k].getCells()[0].setValue("");
					tData[k].getCells()[1].setValue("");
				//	tData[k].getCells()[1].clearSelection();
					tData[k].getCells()[2].setValue("");
					tData[k].getCells()[3].setValue("");
				}
				that.getView().byId('piTable').getModel().oData={};
				that.getView().byId('piTable').getModel().refresh();
				//that.onInit();
				sap.ui.commons.MessageBox.show("PI registration completed successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
						function(){
//					if(that.busyDialog){
//						that.busyDialog.open();
//					}
//					window.location.reload(false);
					var tDtLen = tData.length - 1;
					if(tDtLen>0){
						for(var i=0;i<tDtLen;i++){
							that.getView().byId('piTable').removeItem(tData[i]);
						}
					}
					that.loadPage();
				});
			}
			else{
				sap.ui.commons.MessageBox.show("Registration failed",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kost.PItask
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kost.PItask
*/
	onAfterRendering: function() {
		$(".pktClass").find("input").attr("readonly", true);
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kost.PItask
*/
//	onExit: function() {
//
//	}

});
var userId = "";
