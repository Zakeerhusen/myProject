jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.PIRegistration", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kost.PItask
*/
	onInit: function() {
	this.delRegCount = 0;	//Code Added by Sharique
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	var that= this;
	
	var userId=loggedinUserModel.getData().userId;
	var userIdCaps =userId.toUpperCase();
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
	this.getView().byId("piTable").setModel(piReqTableModel);
	
	this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "PIRegistration") {
			that.getView().byId('piTable').setMode("None");
		}});
	},
	
onAdd : function(){
		this.delRegCount = 0;	//Code Added by Sharique
		var that=this;
		that.getView().byId('piTable').setMode("None");
		that.getView().byId("piRegisterBtn").setEnabled(true);
		var pIdArray=[];
		var tableItems=that.getView().byId("piTable").getItems();
		var piTableLength= tableItems.length;
		for(var i=0;i<piTableLength;i++)
		{
			if(tableItems[i].getProperty('selected'))
			{
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
		   	  showSuggestion:true,
		   	  placeholder : "Enter atleast 4 characters",
		   	  suggest: function(evt)
		   	  {
		   	  
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
		   	  liveChange : function(oEvent){
		   		  that.itemDel(oEvent);
		   	  }
		      }),
		      new sap.m.Input({enabled:false}),
		      
		      new sap.m.ComboBox({
		    	  items:{
		    	  path:'oPktIdJsonModel>/d/results',
		    	  template: new sap.ui.core.Item({
 	                   	text:'{oPktIdJsonModel>PocketIdNo}',
 	                   key:'{oPktIdJsonModel>UserId}'
 	                	   })
		      			}
		      		})
		      ]
		});
		this.getView().byId("piTable").addItem(clItem);
	}
		else{
			sap.ui.commons.MessageBox.show("Please fill in the empty row",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
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
	
	deleteRule: function(evt){
		var that =this;
		that.getView().byId('piTable').setMode("MultiSelect");
//		that.getView().byId("piRegisterBtn").setEnabled(false);
		var tableItems=this.getView().byId('piTable').getItems();
		var selItems=this.getView().byId('piTable').getSelectedItems();
		var selItemsLen=selItems.length;
		/*if(this.delRegCount==0)
		{
			that.getView().byId("piRegisterBtn").setEnabled(true);
		}*/
		if(this.delRegCount > 0){ 		//Code Added by Sharique
			if(selItemsLen>0){
				for(var i=0;i<selItemsLen;i++){
					if(selItems[i].getCells()[0].getValue()&& that.getView().byId('piTable').getModel().getData().userDtos!=undefined){
						that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "kaustId", selItems[i].getCells()[0].getValue());
					}
					this.getView().byId('piTable').removeItem(selItems[i]);
					if(i==(selItemsLen-1)){
						that.getView().byId('piTable').setMode("None");
					}
				}
			}
			else{
				sap.ui.commons.MessageBox.show("Select an Item to Remove",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
		}
		
		/*var sItemsLen=this.getView().byId('piTable').getSelectedItems().length;
		
		if(sItemsLen>0)
		{
			that.getView().byId("piRegisterBtn").setEnabled(true);
		}
		else
		{
			that.getView().byId("piRegisterBtn").setEnabled(false);
		}*/
		this.delRegCount++;			//Code Added by Sharique
},

findAndRemove :function (array, property, value) {
	  array.forEach(function(result, index) {
	    if(result[property] === value) {
	      //Remove from array
	      array.splice(index, 1);
	    }    
	  });
	},
	
	itemDel : function(oEvent){
		var that =this;
		var suggetItems= that.getView().byId("suggItems").getValue();
	//	var tData=that.getView().byId("piTable").getItems();
		var userListItem = oEvent.getSource().getParent();
		if(userListItem.getCells()[0].getValue()&& that.getView().byId('piTable').getModel().getData().userDtos!=undefined){
			that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "kaustId", userListItem.getCells()[0].getValue());
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
		//if(autoUser.length < 4){
			if(userListItem.getCells()[0].getValue()&& that.getView().byId('piTable').getModel().getData().userDtos!=undefined){
				that.findAndRemove(that.getView().byId('piTable').getModel().getData().userDtos, "kaustId", userListItem.getCells()[0].getValue());
			}
			userListItem.getCells()[0].setValue("");
			userListItem.getCells()[2].setValue("");
		//}
		if (autoUser.length > 3) {
			var searchPayload ={
					   "userNm" : autoUser
					  // "minNoOfCharsInput" : "0",
					   //"maxNoOfUsersOutput" : "10"
					};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			oSearchUserModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),true,"POST",false,false,oHeader);
			if(oSearchUserModel.getData()==undefined){
				userListItem.getCells()[0].setValue("");
				userListItem.getCells()[2].setValue("");
			}else{
				if(!(oSearchUserModel.getData().userDtos instanceof Array)){
					oSearchUserModel.getData().userDtos=[oSearchUserModel.getData().userDtos];
					//set the value if only one value
				}
				that.getView().setModel(oSearchUserModel,"oSearchUserModel");
			}
		}
	},	
	

	itemSelected : function(oEvt){
		
		var userId=oEvt.getParameter("selectedItem").getAdditionalText();
		var that= this;
		
		var tableUserData = oEvt.getParameter("selectedItem").getBindingContext("oSearchUserModel").getObject();
	
		//var uName=e.getSource().getValue();
		var oPILstJsonModel = new sap.ui.model.json.JSONModel();
		
		var orgNm="",deptNm="",subCatType="",pos="",telephone="",mob="",country="",custAcNo="",kaustId="",degreeType="";
		
		oPILstJsonModel.loadData("/utilweb/rest/user/auth/read/"+userId,null,false);
		if(!(oPILstJsonModel.oData==undefined)){
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
		}
		}
		var userListItem = oEvt.getSource().getParent();
		
		if(kaustId!=""){
		userListItem.getCells()[0].setValue(kaustId);
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
			"subCategoryType":subCatType
		});
		}
		else{
			//alert("No such User");
			sap.ui.commons.MessageBox.show("No such User in GW",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		for(var i=0;i<piTableLen;i++)
		{
			var pidValue=piTableItems[i].getCells()[0].getValue();
			var pktId= piTableItems[i].getCells()[3].getValue();
			if(pidValue!="" && pktId!="")
			{
				if(!(pIdArr.indexOf(pidValue)>-1)){
				pIdArr.push(pidValue);
				}
				else{sap.ui.commons.MessageBox.show("Same User can't be selected",sap.ui.commons.MessageBox.Icon.ERROR,"Error");return;}
			}
			else{
//				piTableItems[i].getCells()[1].setValueState(sap.ui.core.ValueState.Error);
//				piTableItems[i].getCells()[3].setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Please Select User with KAUST ID and Assign Pocket ID",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				return;
			}
		}
		if(pIdArr.length<piTableItems.length || piTableItems.length==0){
			sap.ui.commons.MessageBox.show("Fill all Details or Remove blank Record",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}else{
			var tDataSize = tableData.length;
			var piTableItemsLen=piTableItems.length;
			for(var i=0;i<tDataSize;i++){
				for(var k=0; k<piTableItemsLen;k++){
					if(piTableItems[k].getCells()[0].getValue()==tableData[i].kaustId){
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
					"subCategoryType":gwLoggedInUser.Subcategorytype});
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
	//	var pktId = that.getView().byId('comboBox').getValue();
	//	var pktId = oEvt.getSource().getValue();
		var tData=that.getView().byId("piTable").getItems();
		
		var dbOutputData = 	that.getView().byId('piTable').getModel().getData();	
			
			var piRegisterModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			
			
			piRegisterModel.loadData("/utilweb/rest/piapprovalreq/userpiapproval",JSON.stringify(dbOutputData),false,"POST",false,false,oHeader);
			if(piRegisterModel.getData().approvalResponseDtos){
				//alert("PI Registration Completed Successfully With Request ID: " +piRegisterModel.getData().requestId);
				sap.ui.commons.MessageBox.show("PI Registration Completed Successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success");
				var tDataLen=tData.length;
				for(var k=0;k<tDataLen;k++){
					tData[k].getCells()[0].setValue("");
					tData[k].getCells()[1].setValue("");
					tData[k].getCells()[2].setValue("");
					tData[k].getCells()[3].setValue("");
				}
				that.getView().byId('piTable').getModel().oData={};
				that.getView().byId('piTable').getModel().refresh();
			}
			else{
				//alert("Failed to Register");
				sap.ui.commons.MessageBox.show("Failed to Register",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
			that.onInit();	
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

