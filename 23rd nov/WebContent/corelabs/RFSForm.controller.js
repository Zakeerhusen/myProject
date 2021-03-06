jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.RFSForm", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf corelabs.RFSForm
*/
	
	onInit: function() {
//	this.rfsno="";
		docrfsno="";
		var that = this;
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		
		/*this.custAccDialog = sap.ui.xmlfragment("corelabs.fragments.customerAccount", this);
	    this.getView().addDependent(this.custAccDialog);
	    this.custAccDialog.addStyleClass("sapUiSizeCompact");*/
	    
	    if(!this.busyDialog){
		    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
		    this.getView().addDependent(this.busyDialog);
		    this.busyDialog.addStyleClass("sapUiSizeCompact");
	    }
		
		/*var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			dateValue: new Date()
		});
		that.getView().setModel(oModel,"dateModel"); */
	    
	    var currentDate=that.getFormattedDate(new Date());
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
			dateValue: currentDate
		});
		that.getView().setModel(oModel,"dateModel");
		
		if(userTypeModel.getData().message=="INTERNAL"){
			that.getView().byId("kaustuser").setVisible(true);
			that.getView().byId("nonkaustuser").setVisible(false);
			var loggedInData=loggedinUserModel.getData();
			var requesterId=loggedInData.userId;
			var Payload={
					   "userId":requesterId,
					   "status":"APR"
					};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			var rfsPocketIdModel = new sap.ui.model.json.JSONModel();
			rfsPocketIdModel.loadData("/utilweb/rest/piapprovalreq/searchUserPiApproval",JSON.stringify(Payload),false,"POST",false,false,oHeader);
			if(rfsPocketIdModel.getData()&& rfsPocketIdModel.getData().piApprovalDto && (!(rfsPocketIdModel.getData().piApprovalDto instanceof Array))){
				rfsPocketIdModel.getData().piApprovalDto=[rfsPocketIdModel.getData().piApprovalDto];
			}
			that.getView().setModel(rfsPocketIdModel,"rfsPocketIdModel");
			
			var requestInfoModel = new sap.ui.model.json.JSONModel();
			var loggedInData=loggedinUserModel.getData();
			var gwLoginData=gwLoginUserModel.getData().d;
			requestInfoModel.setData({"requestData":[{},{}]});
			requestInfoModel.getData().requestData[0]=loggedInData;
			requestInfoModel.getData().requestData[1]=gwLoginData;
			that.getView().setModel(requestInfoModel,"requestInfoModel");
			
		}else{
			that.getView().byId("kaustuser").setVisible(false);
			that.getView().byId("nonkaustuser").setVisible(true);
			if(userTypeModel.getData().message=="RPT"){
				that.getView().byId("rptPktId").setVisible(true);
				var loggedInData=loggedinUserModel.getData();
				var requesterId=loggedInData.userId;
				var Payload={
						   "userId":requesterId,
						   "status":"APR"
						};
				var oHeader= {"Content-Type":"application/json;charset=utf-8"};
				var rfsPocketIdModel = new sap.ui.model.json.JSONModel();
				rfsPocketIdModel.loadData("/utilweb/rest/piapprovalreq/searchUserPiApproval",JSON.stringify(Payload),false,"POST",false,false,oHeader);
				if(rfsPocketIdModel.getData()&& rfsPocketIdModel.getData().piApprovalDto && (!(rfsPocketIdModel.getData().piApprovalDto instanceof Array))){
					rfsPocketIdModel.getData().piApprovalDto=[rfsPocketIdModel.getData().piApprovalDto];
				}
				that.getView().setModel(rfsPocketIdModel,"rfsPocketIdModel");
			}else{
				that.getView().byId("rptPktId").setVisible(false);
			}
			/*var orgTypeModel = new sap.ui.model.json.JSONModel(); 
			orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
			that.getView().setModel(orgTypeModel,"orgTypeModel");*/
			
			var readUserProfileModel = new sap.ui.model.json.JSONModel();
			var emailId=loggedinUserModel.getData().emailId;
			readUserProfileModel.loadData("/utilweb/rest/user/auth/read/"+emailId,null,false);
			that.getView().setModel(readUserProfileModel,"userData"); 
			
			if(readUserProfileModel.getData().userType=="RPT"){
				that.getView().byId('iskrpt').setSelected(true);
			}
		}
		
		var repTypeModel = new sap.ui.model.json.JSONModel(); 
		repTypeModel.loadData("/kclrfs/rest/brm/reportArea",null,false);
		that.getView().setModel(repTypeModel,"repTypeModel");
		
		var delModeModel = new sap.ui.model.json.JSONModel(); 
		delModeModel.loadData("/kclrfs/rest/brm/sampleDeliveryMode",null,false);
		that.getView().setModel(delModeModel,"delModeModel");
		
		that.attachReadOnly();
		
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
		if (oEvent.getParameter("name") === "RFSForm") {
			that.onAfterRendering();
			
			that.oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			that.resetAllFields();
			that.getView().byId('pidcb').clearSelection();
			that.getView().byId('pidrpt').clearSelection();
			that.getView().byId('servarcb').clearSelection();
			that.getView().byId('cws_combobox').clearSelection();
			that.getView().byId('cwsSA').clearSelection();
			that.getView().byId('samDelMode').clearSelection();
			that.getView().byId('repType').clearSelection();
			if(docrfsno=="")
			{
			var rfsGenModel=new sap.ui.model.json.JSONModel();
			rfsGenModel.loadData("/utilweb/rest/seqNum/rfsNo",null,false);
			if(rfsGenModel.getData())
				{
				docrfsno=rfsGenModel.getData().message;
				}
			}
			
			that.getView().byId('idIcon').setSelectedKey("Tab1");
			that.getView().byId("submitrfs").setText("Next");
			
			dialog = new sap.m.BusyDialog();
			
			that.getView().byId('labName').setText(valueLab);
			if(valueLab=="Analytical Core Lab"){
				that.getView().byId('bsbeSample').setVisible(false);
				that.getView().byId("idIcon").getItems()[2].setVisible(true);
				that.getView().byId("idIcon").getItems()[3].setVisible(true); 
				that.getView().byId("cwsServ").setVisible(false);
				that.getView().byId("exCws").setVisible(true);
				that.getView().byId("cwsBd").setVisible(false);
				that.getView().byId("exCwsBd").setVisible(true);
				}
			else if(valueLab=="Imaging and Characterization"){
				that.getView().byId('bsbeSample').setVisible(false);
				that.getView().byId("idIcon").getItems()[2].setVisible(true);
				that.getView().byId("idIcon").getItems()[3].setVisible(true); 
				that.getView().byId("cwsServ").setVisible(false);
				that.getView().byId("exCws").setVisible(true);
				that.getView().byId("cwsBd").setVisible(false);
				that.getView().byId("exCwsBd").setVisible(true);
				}
			else if(valueLab=="Nanofabrication and Thin Film"){
				that.getView().byId('bsbeSample').setVisible(false);
				that.getView().byId("idIcon").getItems()[2].setVisible(true);
				that.getView().byId("idIcon").getItems()[3].setVisible(true); 
				that.getView().byId("cwsServ").setVisible(false);
				that.getView().byId("exCws").setVisible(true);
				that.getView().byId("cwsBd").setVisible(false);
				that.getView().byId("exCwsBd").setVisible(true);
				}
			else if(valueLab=="Biosciences and Bioengineering"){
				that.getView().byId('bsbeSample').setVisible(true);
				that.getView().byId("idIcon").getItems()[2].setVisible(true);
				that.getView().byId("idIcon").getItems()[3].setVisible(true); 
				that.getView().byId("cwsServ").setVisible(false);
				that.getView().byId("exCws").setVisible(true);
				that.getView().byId("cwsBd").setVisible(false);
				that.getView().byId("exCwsBd").setVisible(true);
				}
			else if(valueLab=="Central Workshops"){
				that.getView().byId("idIcon").getItems()[2].setVisible(false);
				that.getView().byId("idIcon").getItems()[3].setVisible(false);  
				that.getView().byId("cwsServ").setVisible(true);
				that.getView().byId("exCws").setVisible(false);
				that.getView().byId('bsbeSample').setVisible(false);
				that.getView().byId("cwsBd").setVisible(true);
				that.getView().byId("exCwsBd").setVisible(false);
				}
			else{
				that.getView().byId('bsbeSample').setVisible(false);
				that.getView().byId("idIcon").getItems()[2].setVisible(true);
				that.getView().byId("idIcon").getItems()[3].setVisible(true); 
				that.getView().byId("cwsServ").setVisible(false);
				that.getView().byId("exCws").setVisible(true);
				that.getView().byId("cwsBd").setVisible(false);
				that.getView().byId("exCwsBd").setVisible(false);
			}
			
			if(valueLab!="Central Workshops"){
			var sampleTypeModel = new sap.ui.model.json.JSONModel();
			sampleTypeModel.loadData("/kclrfs/rest/brm/sampleType/"+keyLab,null,false);
			var sampleSize=sampleTypeModel.getData().sampleTypeDto.length;
			for(var i=0;i<sampleSize;i++){
				if(sampleTypeModel.getData().sampleTypeDto[i].sampleStatus==="true"){
					sampleTypeModel.getData().sampleTypeDto[i].sampleStatus=true;
				}else if(sampleTypeModel.getData().sampleTypeDto[i].sampleStatus==="false"){
					sampleTypeModel.getData().sampleTypeDto[i].sampleStatus=false;
					}
				}
			that.getView().byId('sthbox').setModel(sampleTypeModel);
			}
			var serviceAreaModel = new sap.ui.model.json.JSONModel();
			serviceAreaModel.loadData("/kclrfs/rest/brm/serviceArea/"+keyLab,null,false);
			that.getView().byId('servarcb').setModel(serviceAreaModel);
			
			var userRoleMapModel = new sap.ui.model.json.JSONModel();
			userRoleMapModel.loadData("/kclrfs/rest/user/rfsAppRoles/"+keyLab,null,false);
			that.getView().setModel(userRoleMapModel,"userRoleMapModel");
			
			serviceDocModel.getData().documentManagerDtoList=[];
			serviceDocModel.refresh();
			sampleDocModel.getData().documentManagerDtoList=[];
			sampleDocModel.refresh();
		}
	});
	},
	
	 getFormattedDate:function(date) {
		  var year = date.getFullYear();
		  var month = (1 + date.getMonth()).toString();
		  month = month.length > 1 ? month : '0' + month;
		  var day = date.getDate().toString();
		  day = day.length > 1 ? day : '0' + day;
		  return day + '/' + month + '/' + year;
		  
	},
	
	attachReadOnly: function(){
		var oCombo = this.getView().byId("pidcb");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("pidrpt");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("servarcb");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("cws_combobox");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("cwsSA");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("samDelMode");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("repType");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
	},
	
	numberValidate:function(oEvt){
		var number = oEvt.getSource().getValue();
		oEvt.getSource().setValueState();
		var regex =  /^\d{1,3}$/;
		  if (!regex.test(number)) {
		  	sap.ui.commons.MessageBox.show("Invalid! Please Enter Numeric Value",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		    oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
		    oEvt.getSource().setValue("");
		  }else{
		  	oEvt.getSource().setValueState(sap.ui.core.ValueState.None);
		  }
	 },
	
	cwsSA : function(oEvt){
		var that = this;
		that.getView().byId('cwsSA').setPlaceholder("Select");
		that.getView().byId('cwsSA').clearSelection();
		var workShop = oEvt.getSource().getValue();
		var saCwsModel = new sap.ui.model.json.JSONModel();
		if(oEvt!=""){
			that.getView().byId('cwsSA').setEnabled(true);
		saCwsModel.loadData("/kclrfs/rest/brm/serviceArea/CWS/"+workShop,null,false);
		that.getView().byId('cwsSA').setModel(saCwsModel);
		}else{
			that.getView().byId('cwsSA').setEnabled(false);
		}
	},
	
	selectPI : function(evt){
		var that = this;
		var piId= evt.getParameters().selectedItem.getKey();
		var gwPIModel = new sap.ui.model.json.JSONModel();
	//	gwPIModel.loadData(urlKaustUser+"UserID(KaustID='',UserId='"+piId+"')?$format=json",null,false);
		gwPIModel.loadData("/utilweb/rest/user/auth/read/"+piId,null,false);
		that.getView().setModel(gwPIModel,"gwPIModel");
		evt.getSource().setValueState("None");
		evt.getSource().setValue(evt.getParameters().selectedItem.getText());
	},
		/*Btn_cancel : function(){
			this.labDialog.close();
		},*/
	samDelModeSel : function(){
		var that =this;
		if(that.getView().byId("samDelMode").getValue()=="Other methods, specify"){
			that.getView().byId("otherMthd").setVisible(true);
		}else{
			that.getView().byId("otherMthd").setVisible(false);
		}
	},
	
	
	toSAS : function() {
		var oControl = this.getView().byId("idIcon");
		oControl.setSelectedKey("Tab2");
	},
	toRIS : function() {
		var oControl = this.getView().byId("idIcon");
		oControl.setSelectedKey("Tab1");
	},
	
	sasUPloadEvt : function(){
		var that= this;
		that.getView().byId('sasAttach').setVisible(false);
		that.getView().byId('sasUpload').setVisible(true);
	},

	/*getData: function(uiAction){
		var that = this;
		var userType= userTypeModel.getData().message;
		var userNo = 0;
		var piAuthId="",piAuthUid="",isAuthPersonReqd=false;
		var loggedInUser = loggedinUserModel.getData();
			if(userType=="INTERNAL"){
				userNo =1;
				piAuthId=that.getView().byId('pidcb').getSelectedKey();
			}else if (userType=="RPT"){
				userNo =2;
				piAuthId=that.getView().byId('pidrpt').getSelectedKey();
			}else{
				userNo=3;
				piAuthId =that.getView().getModel("userData").getData().userId;
				isAuthPersonReqd = that.getView().getModel("userData").getData().isAuthPersonReqd;
			}
		// for PiAuthUid
			if(piAuthId!=""){
			var piUniqueIdModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			var piPayload = {
					"userId":piAuthId
			};
			piUniqueIdModel.loadData("/utilweb/rest/ume/auth/userdetail", JSON.stringify(piPayload), false, "POST", false, false, oHeader);
			piAuthUid=piUniqueIdModel.getData().userUniqueId;
			}
		//for IsNewRequester
		var newRequester;
		 var isNewRequesterModel =new sap.ui.model.json.JSONModel();
		 isNewRequesterModel.loadData("/kclrfs/rest/requestheader/isRequesterRaisedRFS/"+loggedInUser.userId,null,false);
		if(isNewRequesterModel.getData().success=="false"){
			newRequester = true;
		}else{
			newRequester = false;
		}
		
		var userRoleData=that.getView().getModel("userRoleMapModel").getData();
		var data1={
			rfsNo : "",
			requesterUid : loggedInUser.userUniqueId,
			requesterNm : loggedInUser.displayNm,
			uiActionNo :uiAction,                           // 1 for submit/approve    2 for reject  -1 for save 3 - exta action (like pending sample)
			userTypeNo: userNo,                     // 1 - internal 2- rpt   3-external
			isNewRequester:true,     //newRequester,               // service from bhaskar 
			isAccountVerificationReqd:false,    // tbd
			isSlaVerificationReqd:false,       	//tbd
			isPiAuthPerReqd:false,     //  isAuthPersonReqd
			piAuthPerUid: piAuthUid, 
			masterAdminUid: userRoleData.masterAdminUid,
			labTeamLeadUid: userRoleData.labTeamLeadUid,
			labDirectorUid: userRoleData.labDirectorUid,
			labTeamMemberUid : userRoleData.labTeamMemberUid,
			labAdminUid: userRoleData.labAdminUid,
			coreLabChargingUid: userRoleData.coreLabChargingUid,
			supportTeamUid : userRoleData.supportTeamUid
		};				// from userData for ext by checkbox, internal if PI and user are same its false
		return data1;
	},*/
	
	getData: function(uiAction){
		var that = this;
		var userType= userTypeModel.getData().message;
		var userNo = 0;
		var piAuthId="",piAuthUid="",isAuthPersonReqd=false, isAccountVerificationReqd=false, isSlaVerificationReqd=false;
		var loggedInUser = loggedinUserModel.getData();
			if(userType=="INTERNAL"){
				userNo =1;
				piAuthId=that.getView().byId('pidcb').getSelectedKey();
			}else if (userType=="RPT"){
				userNo =2;
				piAuthId=that.getView().byId('pidrpt').getSelectedKey();
			}else{
				userNo=3;
				piAuthId =that.getView().getModel("userData").getData().authPersonUserId;
				isAuthPersonReqd = that.getView().getModel("userData").getData().isAuthPersonReqd;
				if(isAuthPersonReqd=="true"){
					isAuthPersonReqd=true;
				}else{
					isAuthPersonReqd=false;
				}
			}
			
		// for PiAuthUid
			if(piAuthId!="" && piAuthId!=undefined){
			var piUniqueIdModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			var piPayload = {
					"userId":piAuthId
			};
			piUniqueIdModel.loadData("/utilweb/rest/ume/auth/userdetail", JSON.stringify(piPayload), false, "POST", false, false, oHeader);
			piAuthUid=piUniqueIdModel.getData().userUniqueId;
			}
		//for IsNewRequester
		var newRequester;
		 var isNewRequesterModel =new sap.ui.model.json.JSONModel();
		 isNewRequesterModel.loadData("/kclrfs/rest/requestheader/isRequesterRaisedRFS/"+loggedInUser.userId,null,false);
		if(isNewRequesterModel.getData().success=="false"){
			newRequester = true;
		}else{
			newRequester = false;
		}
		
		if(userType=="INTERNAL" ||newRequester == true){
			isAccountVerificationReqd=false;
		}else{
			isAccountVerificationReqd=true;
		}
		
		/*if(userType=="INTERNAL"){
			isSlaVerificationReqd=false;
		}else{
			isSlaVerificationReqd=true;
		}
		*/
		if(userType!="INTERNAL" && newRequester == true){
		isSlaVerificationReqd=true;
		}else{
		isSlaVerificationReqd=false;
		}
		
		var userRoleData=that.getView().getModel("userRoleMapModel").getData();
		var data1={
			rfsNo : "",
			requesterUid : loggedInUser.userUniqueId,
			requesterNm : loggedInUser.displayNm,
			uiActionNo :uiAction,                           // 1 for submit/approve    2 for reject  -1 for save 3 - exta action (like pending sample)
			userTypeNo: userNo,                     // 1 - internal 2- rpt   3-external
			isNewRequester:newRequester,     //newRequester,               // service from bhaskar 
			isAccountVerificationReqd:isAccountVerificationReqd,    // tbd
			isSlaVerificationReqd:isSlaVerificationReqd,       	//tbd
			isPiAuthPerReqd:isAuthPersonReqd,     //  isAuthPersonReqd
			labId :keyLab,
			piAuthPerUid: piAuthUid, 
			masterAdminUid: userRoleData.masterAdminUid,
			labTeamLeadUid: userRoleData.labTeamLeadUid,
			labDirectorUid: userRoleData.labDirectorUid,
			labTeamMemberUid : userRoleData.labTeamMemberUid,
			labAdminUid: userRoleData.labAdminUid,
			coreLabChargingUid: userRoleData.coreLabChargingUid,
			supportTeamUid : userRoleData.supportTeamUid
		};				// from userData for ext by checkbox, internal if PI and user are same its false
		return data1;
	},
	
	getEstComplDate : function(dateValue){
		var that =this;
		if(dateValue!=null &&dateValue!=undefined && dateValue!=""){
		var yyyy = dateValue.getFullYear().toString();
		var mm = (dateValue.getMonth()+1).toString(); // getMonth() is zero-based
		var dd  = dateValue.getDate().toString();
		var hh="00";
		var min="00";
		var sec="00";
		return yyyy+"-" + (mm[1]?mm:"0"+mm[0])+"-" + (dd[1]?dd:"0"+dd[0])+"T"+(hh[1]?hh:"0"+hh[0])+":"+(min[1]?min:"0"+min[0])+":"+(sec[1]?sec:"0"+sec[0]);
		}
	},

	
	getUIData : function(){
		var that = this;
		var loggedInUser = loggedinUserModel.getData();
		var hBoxItems=that.getView().byId("sthbox").getContent();
		var sampleTypeArr=[];
		for(var i=0;i<hBoxItems.length;i++)
		{
			sampleTypeArr.push({"sampleType":hBoxItems[i].getText(),"sampleStatus":hBoxItems[i].getSelected()});
		}
		var userType= userTypeModel.getData().message;
		var pocketId;
		var piId;
		if(userType=="INTERNAL"){
			pocketId=that.getView().byId('pidcb').getValue();
			piId=that.getView().byId('pidcb').getSelectedKey();
		}else if (userType=="RPT"){
			pocketId=that.getView().byId('pidrpt').getValue();
			piId=that.getView().byId('pidrpt').getSelectedKey();
		}else{
			pocketId="";
			piId="";
		}
		var serviceArea="";
		var workShop="";
		var reqComplDate="";
		var samDelMode="";
		
		var aimofstudy="",expectedData="",method="";
		var isDesignApprovedByPI=false,isDesignAttached=false,desc="";
		if(keyLab=="CWS"){
			workShop=that.getView().byId("cws_combobox").getValue();
			serviceArea=that.getView().byId("cwsSA").getValue();
			reqComplDate=that.getEstComplDate(that.getView().byId('reqDateCws').getDateValue());  
			isDesignApprovedByPI=that.getView().byId("desappbypi").getSelected(); 
			isDesignAttached=that.getView().byId("desatt").getSelected();
			desc=that.getView().byId("desFabTestMeasCalib").getValue();
		}else{
			serviceArea=that.getView().byId("servarcb").getValue();
			reqComplDate=that.getEstComplDate(that.getView().byId('reqcompdate').getDateValue()); 
			aimofstudy=that.getView().byId("studyaimtext").getValue();
			expectedData=that.getView().byId("expdatatext").getValue();
			method=that.getView().byId("methodtext").getValue();
			if(that.getView().byId("samDelMode").getValue()=="Other methods, specify"){
				samDelMode=that.getView().byId("otherMthd").getValue();
			}else{
				samDelMode=that.getView().byId("samDelMode").getValue();
			}
		}
		
		var userRoleData=that.getView().getModel("userRoleMapModel").getData();
		/*var reqNo = "";
		if (taskData.rfsNo) {
			reqNo = taskData.rfsNo;
		}*/
		var dbData={
		"requestHeaderDto":{
	        "requestType":"RFS",
	        "requesterId":loggedInUser.userId,
	        "labId":keyLab,
	        "labDesc":valueLab,
	     //   "reqNo" : reqNo,
	        "requesterPocketId":pocketId,
	        "authPerOrPiId":piId,
	        "masterAdminId":userRoleData.masterAdminId,
	        "labTeamLeadId":userRoleData.labTeamLeadId,
	        "labDirectorId":userRoleData.labDirectorId,
	        "labTeamMemberId":userRoleData.labTeamMemberId,
	        "labAdminId":userRoleData.labAdminId,
	        "cclTeamId":userRoleData.coreLabChargingId
				},
		"serviceAreaDto":{
					"aimOfStudy": aimofstudy,
					"expectedData": expectedData,
					"method": method,
					"serviceAreaDesc": serviceArea,
					"requestedCompletionDate":reqComplDate,
					"workshopDesc":workShop,
					"isDesignAttached":isDesignAttached,
					"isDesignApprovedByPI":isDesignApprovedByPI,
					"desc":desc
				},
		"sampleDto":{
					"deliveryModeDesc": samDelMode,
					"isReturnSamples": that.getView().byId("retSam").getSelected(),
					"reportDesc": that.getView().byId("repType").getValue(),
					"numberOfSamples": that.getView().byId("samNo").getValue(),
					"sampleDataSpecifications": that.getView().byId("samData").getValue(),
					"sampleNm": that.getView().byId("samNm").getValue(),
					"sampleOrigin": that.getView().byId("samOrg").getValue(),
					"sampleTypeDtos": sampleTypeArr,
					"specificInstruction": that.getView().byId("samInst").getValue()		
				}
	};
		return dbData;
	},
	
	/*validateFields:function(data){
		var that=this;
		var bValidate=false;
		var aId;
		var userType= userTypeModel.getData().message;
		if(userType=="INTERNAL"){
			if( valueLab=="Central Workshops"){
				aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","cws_combobox","reqDateCws","cwsSA","studyaimtext","expdatatext","methodtext"];
			}else{
				aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
			}
		}else if (userType=="RPT"){
			if( valueLab=="Central Workshops"){
				aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","nkAPname","nkAccno","pidrpt","cws_combobox","reqDateCws","cwsSA","studyaimtext","expdatatext","methodtext"];
			}else{
				aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","nkAPname","nkAccno","pidrpt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
			}
		}else{
			if( valueLab=="Central Workshops"){
				aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","nkAPname","nkAccno","cws_combobox","reqDateCws","cwsSA","studyaimtext","expdatatext","methodtext"];
			}else{
				aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","nkAPname","nkAccno","reqcompdate","studyaimtext","expdatatext","methodtext"];
			}
		}
		//		var aProperties=["value"]; 
		var aIdLen=aId.length;
		for(var i=0;i<aIdLen;i++){
			var oControl = that.getView().byId(aId[i]);
			if(oControl.getValue()==""||oControl.getValue()==null||oControl==undefined){
				oControl.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field can not be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				bValidate=false;
				break;
			}else{
				oControl.setValueState(sap.ui.core.ValueState.None);
				bValidate=true;
				continue;
			}
		}
		if(bValidate==true){
			var dbData=that.getUIData();
			dbData.requestHeaderDto.statusDesc="RFS Submitted";
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				data.rfsNo=rfsSaveDataModel.getData().reqNo;
			that.startRFS(data);
			}else{
				sap.ui.commons.MessageBox.show("Record not Created, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				}
			}
	},
*/	
	save : function(){
		var that =this;
	//	dialog.open();
		var bValidate=false;
		
		var today= new Date();
		today.setHours(0,0,0,0);
		if(keyLab!="CWS"){
			if(that.getView().byId('reqcompdate').getDateValue() && that.getView().byId('reqcompdate').getDateValue() < today){
			sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			return;
			}
		}else{
			if(that.getView().byId('reqDateCws').getDateValue() && that.getView().byId('reqDateCws').getDateValue() < today){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				return;
				}
		}
		var userType= userTypeModel.getData().message;
		if(userType=="INTERNAL" && that.getView().byId('pidcb').getValue()!=""){
			bValidate=true;
		}else if(userType=="RPT" && that.getView().byId('pidrpt').getValue()!=""){
			bValidate=true;
		}else if(userType=="EXTERNAL"){
			bValidate=true;
		}else{
			bValidate =false;
		}
		
		if(bValidate){
		var uiAction = -1;
		var data = that.getData(uiAction);
		//Save data in  DB /kclrfs/rest/requestheader/createWrapper
		var dbData=that.getUIData();
		dbData.requestHeaderDto.statusDesc="RFS Saved";
		if(docrfsno!="")
		{
		dbData.requestHeaderDto.reqNo=docrfsno;
		}
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			data.rfsNo=rfsSaveDataModel.getData().reqNo;
		that.startRFS(data);
		if(that.busyDialog){
			that.busyDialog.close();
		}
		}else{
			sap.ui.commons.MessageBox.show("Request not Created, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		}else{
			sap.ui.commons.MessageBox.show("Please Select Pocket ID",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}
	},
	
	submit : function(oEvent){
		var that =this;
		//** Changes by Vinuta **//*
		var tabBar = that.getView().byId("idIcon");
		var selectedTab = tabBar.getSelectedKey();
		var buttonText = oEvent.getSource().getText();
		switch(selectedTab){
		case "Tab1": tabBar.setSelectedKey("Tab2");
			that.getView().byId("btnPrev").setEnabled(true);
			if(valueLab=="Central Workshops"){
				oEvent.getSource().setText("Submit");
				}
			return;
			break;
		case "Tab2":
			if(valueLab=="Central Workshops"){
				var uiAction = 1;
				var data = that.getData(uiAction);
				//Save data in  DB 
				that.validateFields(data);
			}else{
				tabBar.setSelectedKey("Tab3");
				return;
			}
			break;
		case "Tab3":tabBar.setSelectedKey("Tab4");
			oEvent.getSource().setText("Submit");
			return;
			break;
		case "Tab4":
			var uiAction = 1;
			var data = that.getData(uiAction);
			//Save data in  DB 
			that.validateFields(data);
			return;
			break;
		}
	},
	
	/*submit : function(){
		var that =this;
		var uiAction = 1;
		var data = that.getData(uiAction);
		//Save data in  DB 
		that.validateFields(data);
	},*/
	
	
	navToPrevTab : function(oEvent){
		var that =this;
		var tabBar = that.getView().byId("idIcon");
		var selectedTab = tabBar.getSelectedKey();
		var buttonText = oEvent.getSource().getText();
		switch(selectedTab){
		case "Tab1": 
			return;
			break;
		case "Tab2":tabBar.setSelectedKey("Tab1");
			oEvent.getSource().setEnabled(false);
			if(valueLab=="Central Workshops"){
				that.getView().byId("submitrfs").setText("Next");
			}
			return;
			break;
		case "Tab3":tabBar.setSelectedKey("Tab2");
			return;
			break;
		case "Tab4":tabBar.setSelectedKey("Tab3");
			that.getView().byId("submitrfs").setText("Next");
			return;
			break;
		}
	},
	//** Changes by Vinuta **//*
	handleTabSelect: function(oEvent){
		var that=this;
		var selectedTab = oEvent.getSource().getSelectedKey();
		switch(selectedTab){
		case "Tab1": that.getView().byId("btnPrev").setEnabled(false);
			that.getView().byId("submitrfs").setText("Next");
			break;
		case "Tab2":that.getView().byId("btnPrev").setEnabled(true);
			
			if(valueLab=="Central Workshops"){
				that.getView().byId("submitrfs").setText("Submit");
			}else{
				that.getView().byId("submitrfs").setText("Next");
			}
			break;
		case "Tab3":that.getView().byId("btnPrev").setEnabled(true);
			that.getView().byId("submitrfs").setText("Next");
			break;
		case "Tab4":that.getView().byId("btnPrev").setEnabled(true);
			that.getView().byId("submitrfs").setText("Submit");
			break;
		}
	},
	
	//** Changes by Vinuta **//*
	setValueState: function(oEvent){
		oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
		if(oEvent.getSource().getMetadata().getName() === "sap.m.DatePicker"){
			var today= new Date();
			today.setHours(0,0,0,0);
			if(oEvent.getSource().getDateValue() < today){
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValueStateText("Select current or future date");
			}else{
			oEvent.getSource().setValueStateText("");
			}
			}else if(oEvent.getSource().getMetadata().getName() === "sap.m.ComboBox"){
				oEvent.getSource().setValue(oEvent.getSource().getSelectedItem().getText());
			}
	},

	validateFields:function(data){
		var that=this;
		var bValidate=false;
		var aId;
		var userType= userTypeModel.getData().message;
		//** Changed by Vinuta **//*
		if(userType=="INTERNAL"){
			if( valueLab=="Central Workshops"){
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else if (userType=="RPT"){
			if( valueLab=="Central Workshops"){
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else{
			if( valueLab=="Central Workshops"){
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}
		//		var aProperties=["value"];  for rpt and external 4 place ["nkAccno","1"], ["nkAPname","1"], afer nkNmae
		var aIdLen=aId.length;
		var tab= null;
		for(var i=0;i<aIdLen;i++){
			var oControl = that.getView().byId(aId[i][0]);
			if(oControl.getValue()==""||oControl.getValue()==null||oControl==undefined){
				oControl.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field can not be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				bValidate=false;
				if(tab && aId[i][1] === "2"){
					break;
				}
				tab= aId[i][1];
				break;
			}else{
				if(oControl.getValueState() === "Error"){
					bValidate=false;
					tab= aId[i][1];
					break;
					}else{
					oControl.setValueState(sap.ui.core.ValueState.None);
					bValidate=true;
					continue;
					}
			}
		}
		if(tab){
			that.getView().byId("idIcon").setSelectedKey("Tab"+tab);
			if(valueLab=="Central Workshops" && tab==="2"){
			that.getView().byId("submitrfs").setText("Submit");
			}else{
			that.getView().byId("submitrfs").setText("Next");
			}
			if(tab === "1"){
			that.getView().byId("btnPrev").setEnabled(false);
			}
		}
		if(bValidate==true){
			var dbData=that.getUIData();
			dbData.requestHeaderDto.statusDesc="RFS Submitted";
			if(docrfsno!="")
			{
			dbData.requestHeaderDto.reqNo=docrfsno;
			}
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			/*rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				data.rfsNo=rfsSaveDataModel.getData().reqNo;
			that.startRFS(data);
			}else{
				sap.ui.commons.MessageBox.show("Record not Created, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				}
			*/
			if(that.busyDialog){
				that.busyDialog.open();
			}
			jQuery.sap.delayedCall(200,this,function(){
				rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
				if(that.busyDialog){
					
						that.busyDialog.close();
				}
				if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
					data.rfsNo=rfsSaveDataModel.getData().reqNo;
				that.startRFS(data);
				}else{
					sap.ui.commons.MessageBox.show("Record not Created, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				}
			});
			}
	},


	
	startRFS: function(data){
		this.rfsno="";
		var that =this;
	//	var dialog = new sap.m.BusyDialog();
		var startData = {};
		startData.ProcessStartEvent = {};
			startData.ProcessStartEvent.DO_RFS = data;
			var startRFSProcessSvcURL = "/bpmodata/startprocess.svc/kaust.com/kcl~rfs~bpm/KCL_RFS_Process/"; 
			var rfsProcessStartODataModel = new sap.ui.model.odata.ODataModel(startRFSProcessSvcURL, true);
			
			if(that.busyDialog){
				that.busyDialog.open();
			}
			
			rfsProcessStartODataModel.create('/StartData', startData, null,  
				function(oData,oResponse) { 
				dialog.close();
				sap.ui.commons.MessageBox.show("Request Created with RFS No. "+data.rfsNo,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
				function(){
					
					docrfsno="";
					sampleDocModel.getData().documentManagerDtoList=[];
					sampleDocModel.getData().documentManagerDtoList=[];
					that.oRouter.navTo("labSelection");
					
				});
				that.resetAllFields();
				if(that.busyDialog){
					that.busyDialog.close();
				}
			},  
			function(oEvent){
				sap.ui.commons.MessageBox.show("Error in Creting RFS Request",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}); 
		
			//save/submit/approve
			//1. field validations
			//2. db data save 
			//2.1 'rfs no' is retuned in NEW RFS view
			//3.1 check if taskId is there===> if taskId then its a task hence 'complete task' else 'start bpm'
			//3.2 if task and clicked 'save', nothing to be done in BPM but to be saved in DB.
			//3.3 if task and not 'save' then complete BPM task
			//4. start BPM, save button than uiaction is -1, submit than 1
			//5. task buttons - save -- (-1); submit/approve ---1; reject ---2
			
			//read
			//task click
			//claim
			//read task data
			//taskdata===> rfsNo
			//rfsNo used to read from DB
			//populate data on UI
	
		//	window.location.hash="#labSelection";
		//	window.location.reload();
	},
	
	
	resetAllFields: function(){ 
		var that=this;
		that.getView().byId("pidcb").setValue("");
		//that.getView().byId("fnameipt").setValue(""); 
		//that.getView().byId("lnameipt").setValue(""); 
		//that.getView().byId("kidipt").setValue("");
		//that.getView().byId("emailipt").setValue("");
		//that.getView().byId("deptipt").setValue("");//department id created		
		//that.getView().byId("phoneipt").setValue("");//telephone id created	//
		//that.getView().byId("mobileipt").setValue("");// mobile id created	//
		
		that.getView().byId("pinameipt").setValue("");
		that.getView().byId("pikidipt").setValue("");
		that.getView().byId("piemailipt").setValue("");
		that.getView().byId("piposipt").setValue("");// PI position id created	//
		that.getView().byId("piteleipt").setValue("");// PI Telephone id created	//
		
		//that.getView().byId("nkfnameipt").setValue("");//non kaust fname id created	//
		//that.getView().byId("nklnameipt").setValue("");//non kaust lname id created	//
		//that.getView().byId("too").setValue("");//combo box
		//that.getView().byId("nkposipt").setValue("");//non kaust position id created	//
		//that.getView().byId("nkorgipt").setValue("");// non kaust organisation id created	//
		//that.getView().byId("nkdeptipt").setValue("");// non kaust departmenr id created	//
		//that.getView().byId("nkteleipt").setValue("");//nonkaust telephone id created	//
		//that.getView().byId("nkemailipt").setValue("");//nonkaustemail id created	//
		//that.getView().byId("nkAPname").setValue("");//nonkaustAPname id created	//
		that.getView().byId("nkAccno").setValue("");//nonkaustAccno id created	//
		that.getView().byId("pidrpt").setValue("");
		
		that.getView().byId("servarcb").setValue("");
		that.getView().byId("reqcompdate").setValue("");
		that.getView().byId("cws_combobox").setValue("");
		that.getView().byId("reqDateCws").setValue("");
		that.getView().byId("cwsSA").setValue("");
		that.getView().byId("studyaimtext").setValue("");
		that.getView().byId("expdatatext").setValue("");
		that.getView().byId("methodtext").setValue("");
		//that.getView().byId("saFup").setValue("");
		//that.getView().byId("saFupBtn").setValue("");
		that.getView().byId("samNo").setValue("");
		that.getView().byId("samOrg").setValue("");
		that.getView().byId("samNm").setValue("");
		that.getView().byId("samData").setValue("");
		that.getView().byId("samInst").setValue("");
		//that.getView().byId("ssFup").setValue("");
		//that.getView().byId("ssFupBtn").setValue("");
		that.getView().byId("samDelMode").setValue("");
		that.getView().byId("otherMthd").setVisible(false);
		
		that.getView().byId("retSam").setSelected(false); 
		that.getView().byId("repType").setValue("");
		var sampleTypeCb=that.getView().byId("sthbox").getContent();
		for(var j=0;j<sampleTypeCb.length;j++)
		{
			sampleTypeCb[j].setSelected(false);
		}
		that.getView().byId("fileUploader").clear();
		
		that.getView().byId("desatt").setSelected(false);
		that.getView().byId("desappbypi").setSelected(false);
		that.getView().byId("desFabTestMeasCalib").setValue("");
	},
	
	 openDialog:function(evt){
		var that=this;
		if(that.getView().getModel("oReadCustomerModel")){
			that.getView().getModel("oReadCustomerModel").setData();
		}
		this.custAccDialog.open();
	},
	
	search:function(evt){
		var that =this;
		// The input values to be passed into the service//
		var hboxItems=evt.getSource().getParent().getItems();
		var accountNo=hboxItems[0].getValue();
		var name1=hboxItems[1].getValue();
		var name2=hboxItems[2].getValue();
		
		if(accountNo=="" && name1=="" && name2==""){
			sap.ui.commons.MessageBox.show("Please fill one of the records",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}else{
		var oReadCustomerModel = new sap.ui.model.json.JSONModel();
		oReadCustomerModel.loadData(urlInc+"CustomerAccounts?$filter=CustomerAccountNo eq '"+accountNo+"' and Name1 eq '"+name1+"' and Name2 eq '"+name2+"'&$select=CustomerAccountNo,Name1,Name2&$format=json",null,false);
		oReadCustomerModel.getData();
		that.getView().setModel(oReadCustomerModel,"oReadCustomerModel");
		}
	},
	
	closeCustDialog:function(){
		this.custAccDialog.close();
	},
	
	selectCustAccount:function(evt){
		var that=this;
		var accNo=evt.getSource().getCells()[0].getText();
		var Name1=evt.getSource().getCells()[1].getText();
		var Name2=evt.getSource().getCells()[2].getText();
		that.getView().byId("nkAccno").setValue(accNo);
		evt.getSource().getParent().getHeaderToolbar().getContent()[0].getItems()[0].setValue("");
		evt.getSource().getParent().getHeaderToolbar().getContent()[0].getItems()[1].setValue("");
		evt.getSource().getParent().getHeaderToolbar().getContent()[0].getItems()[2].setValue("");
		that.custAccDialog.close();
	},
	
	selectRFSTab:function(oEvent){
		var that=this;
		var selTab=that.getView().byId("idIcon").getSelectedKey();
		if(selTab=="Tab4"){
			that.getView().byId("saverfs").setEnabled(true);
			that.getView().byId("submitrfs").setEnabled(true);
		}else{
			that.getView().byId("saverfs").setEnabled(false);
			that.getView().byId("submitrfs").setEnabled(false);
		}
	},
	
	handleUploadPress:function(evt){
		var that=this;
		if(that.busyDialog){
			that.busyDialog.open();
		}
		var fileUploadId=evt.getSource().getParent().getItems()[1].getId().split("--")[1];
			that.fileUpload(fileUploadId);
		/*else if(fileUploadId=="sampleFileUploader")
		{
			that.sampleFileUpload();
		}*/
	},
	
	removeFromTable:function(oEvent){
		var that=this;
		var myAttchmentTbl = that.getView().byId("idMyAttchmentTbl");
		var adata=myAttchmentTbl.getModel("serviceDocModel").getData().docData;
		var selItems=myAttchmentTbl.getSelectedItems();
		if(selItems.length>0)
		{
			for (var j=adata.length-1; j>=0; j--)
			{			
				if(adata[j].delFlag)
				{
					this.deleteFromRepository(adata[j]);
					adata.splice(j, 1);
				}
			}
		}
		else
		{
			sap.ui.commons.MessageBox.show("Select a row to delete", "ERROR", "Error");
		}
		that.getView().byId("idMyAttchmentTbl").removeSelections();
		serviceDocModel.refresh();
	},
	
	deleteFromRepository: function(delObj)
	{
		 var that=this;
		 var deleteParameters =   {
				 "appName":delObj.appName,
				 "fileName":delObj.fileName,
				 "filePath":delObj.filePath,
				 "fileId":delObj.App_Name,
				 "id":delObj.id,
				 "operationId":delObj.operationId
				};
		 var url = "/cc_ecm/file/delete" ;
			
			$.ajax( {
				url : url,
				type : "POST",
				async : false,
				dataType : "json",
				data : JSON.stringify(deleteParameters),
				contentType : "application/json",
				success : function(data, textStatus, jqXHR) {
					sap.ui.commons.MessageBox.show("Deleted successfully", "SUCCES", "Success");

				},
				error : function(data,jqXHR) {
					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
				}
			});
	},
	
	fileUpload : function(fileUploadId) {
		that = this;
		var pageId = this.getView().getId();
		if (document.getElementById(pageId+"--fileUploader-fu")) {
			if (document.getElementById(pageId+"--fileUploader-fu").files[0] != null) {
				var file = document.getElementById(pageId+"--fileUploader-fu").files[0];
			}
		}
		else if (document.getElementById(pageId+"--sampleFileUploader-fu")) {
			if (document.getElementById(pageId+"--sampleFileUploader-fu").files[0] != null) {
				var file = document.getElementById(pageId+"--sampleFileUploader-fu").files[0];
			}
		}
		if(file ==null){
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
					"Please browse a document first", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) { 
						// * do something 
						}
					}
			);
			return;
		}
		if (file.name.length > 255) {
			// sap.ui.getCore().byId("dialogUpload").close();
			//	jQuery.sap.require("sap.ui.commons.MessageBox");
			sap.ui.commons.MessageBox.show(
					"File name too long!!",
					sap.ui.commons.MessageBox.Icon.WARNING,
					"Important Information",
					[ sap.ui.commons.MessageBox.Action.OK ],
					fnCallbackConfirm,
					sap.ui.commons.MessageBox.Action.OK);
			function fnCallbackConfirm() {
			}
			return;
		}
		// validating file size
		if (file && (file.size / 1024 / 1024) > 5) {
			//jQuery.sap.require("sap.ui.commons.MessageBox");
			sap.ui.commons.MessageBox.show(
					"File size more than 5MB is not allowed",
					sap.ui.commons.MessageBox.Icon.WARNING,
					"Important Information",
					[ sap.ui.commons.MessageBox.Action.OK ],
					fnCallbackConfirm,
					sap.ui.commons.MessageBox.Action.OK);
			function fnCallbackConfirm() {
			}
			return;
		}
		if (file && window.File && window.FileList && window.FileReader) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);

			reader.onload = function(evt) {
				var fileName = file.name;
				var byteArray2 = new Uint8Array(
						evt.target.result);

				var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
				var UniqueFileId = new Date().getTime();

				/*if(fileUploadId=="fileUploader")
				{*/
					that.createFile("CLRFS_REQUEST", UniqueFileId,fileName, fileEncodedData,fileUploadId);
				/*}
				else if(fileUploadId=="sampleFileUploader")
				{
					that.createSampleFile("Incture", UniqueFileId,fileName, fileEncodedData,fileUploadId);
				}*/
			};
		}
	},
	
	uint8ToString : function(buf) {
		var i, length, out = '';
		for (i = 0, length = buf.length; i < length; i += 1) {
			out += String.fromCharCode(buf[i]);
		}
		return out;
	},
	
	createFile : function(applicationArea, UniqueFileId,
			fileName, file,fileUploadId) {

		var that=this;
		var fileUploadId=fileUploadId;
		var userId=loggedinUserModel.getData().userId;
		var sectionId;
			if(that.getView().byId("idIcon").getSelectedKey()=="Tab2")
			{
				sectionId="1";
			}
			else if(that.getView().byId("idIcon").getSelectedKey()=="Tab3")
			{
				sectionId="2";
			}
		
		var uploadPayload = {
			    "appName":applicationArea,
			    "folderName":docrfsno,
			    "file":file,
			    "fileName":fileName,
			    "operationId":userId,
			    "operationName":docrfsno,		//added this for rfs number
			    "businessDocType":sectionId,
			    "status":"ACTIVE"
		};

		var newFile = {};
		var uploadUrl="/cc_ecm/file/upload";
		
		$.ajax( {
			url : uploadUrl,
			type : "POST",
			async : false,
			dataType : "json",
			data : JSON.stringify(uploadPayload),
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				var newFile ={};
				var docManagerDto=jqXHR.responseJSON.docManagerDto;
				newFile.fileId=docManagerDto.fileId;
				newFile.fileName=docManagerDto.fileName;
				newFile.updatedDate=docManagerDto.updatedDate;
				newFile.createdDate=docManagerDto.createdDate;
				newFile.businessDocType=docManagerDto.businessDocType;
				newFile.appName=docManagerDto.appName;
				newFile.id=docManagerDto.id;
				newFile.operationId=docManagerDto.operationId;
				newFile.status=docManagerDto.status;
				newFile.filePath=docManagerDto.filePath;
				newFile.createdBy=docManagerDto.createdBy;
				newFile.createdDateValue= that.getFormattedDate(new Date(docManagerDto.createdDateValue));
				newFile.delFlag=false;
				
				if(newFile.status != null) {
	  				if (newFile.status == "SUCCESS") {
	  					if(fileUploadId=="fileUploader"){
	  						var oTable = that.getView().byId("idMyAttchmentTbl");
	  						itemsLen=oTable.getItems().length;
	  						newFile.slno=itemsLen+1;
	  						//var serviceDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
	  						serviceDocModel.getData().documentManagerDtoList.push(newFile);
//		  					oTable.getModel("serviceDocModel").getData().docData.push(newFile);
//		  					oTable.getModel("serviceDocModel").refresh();
		  					oTable.setModel(serviceDocModel,"serviceDocModel");
		  					serviceDocModel.refresh();
	  					}else if(fileUploadId=="sampleFileUploader"){
	  						var oTable = that.getView().byId("sampleFileTable");
	  						itemsLen=oTable.getItems().length;
	  						newFile.slno=itemsLen+1;
	  						//var sampleDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
	  						sampleDocModel.getData().documentManagerDtoList.push(newFile);
//		  					oTable.getModel("sampleDocModel").getData().docData.push(newFile);
//		  					oTable.getModel("sampleDocModel").refresh();
		  					oTable.setModel(sampleDocModel,"sampleDocModel");
		  					sampleDocModel.refresh();
	  					}
	  					/*serviceDocModel.getData().docData.push(newFile);
	  					var oTable = that.getView().byId("idMyAttchmentTbl");
	  					oTable.setModel(serviceDocModel,"serviceDocModel");
	  					serviceDocModel.refresh();*/
	  					sap.ui.commons.MessageBox.show("File Uploaded Successfully ", "SUCCESS", "Upload Success");
	  				}else{
	  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
	  				}
	  				that.getView().byId("fileUploader").setValue("");
	  				that.getView().byId("sampleFileUploader").setValue("");
	  			}else{
		  			sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Error");
		  		}
				that.busyDialog.close();
			},
			error : function(data,jqXHR) {
				sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
				that.busyDialog.close();
			}
		});
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf corelabs.RFSForm
*/
//	onBeforeRendering: function() {
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf corelabs.RFSForm
*/
	onAfterRendering: function() {
		var that=this;
		that.getView().byId("pidcb").$().find("input").attr("readonly", true);
		that.getView().byId("pidrpt").$().find("input").attr("readonly", true);
		that.getView().byId("servarcb").$().find("input").attr("readonly", true);
		that.getView().byId("samDelMode").$().find("input").attr("readonly", true);
		that.getView().byId("repType").$().find("input").attr("readonly", true);
		that.getView().byId("cws_combobox").$().find("input").attr("readonly", true);
		that.getView().byId("cwsSA").$().find("input").attr("readonly", true);
		that.getView().byId("reqDateCws").$().find("input").attr("readonly", true);
		that.getView().byId("reqcompdate").$().find("input").attr("readonly", true);
	}
	
//	onBeforeShow: function(){
//	}
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf corelabs.RFSForm
*/
//	onExit: function() {
//
//	}

});
var serviceDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
var sampleDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
var docrfsno="";


	