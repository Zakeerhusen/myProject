jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.RFSFormTask", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf corelabs.RFSForm
*/
	taskId:'',
	onInit: function() {
		var that=this;
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		//	taskNewId=that.getTask();
		if(taskId!=""){
			if(!this.busyDialog){
			    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
			    this.getView().addDependent(this.busyDialog);
			    this.busyDialog.addStyleClass("sapUiSizeCompact");
		    }
		this.claim(taskId);
		}else{
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("RFSFormTask").attachMatched(this._loadRFS, this);
		}
		 var device=sap.ui.Device;
			if(device.browser.name == "sf"){
				this.getView().byId("rfsNoMac").setWidth("4em");
				this.getView().byId("statusMac").setWidth("3rem");
			}
			
			setTimeout(function(){
				var oFileUploaderTask = that.byId("fileUploaderTask");
				debugger;
				oFileUploaderTask.addEventDelegate({
					_resizeDomElements : function () {
						var i = that.getId();
				        that._oBrowseDomRef = that.oBrowse.getDomRef();
				        var $ = q(that._oBrowseDomRef);
				        var _ = $.parent().outerWidth(true);
				        that._oFilePathDomRef = this.oFilePath.getDomRef();
				        var d = that._oFilePathDomRef;
				        var w = that.getWidth();
				        if (d !== null) {
					        if (w.substr(-1) == '%') {
					            while (d.id != i) {
					                d.style.width = '100%';
					                d = d.parentNode;
					            }
					            d.style.width = w;
					        } else {
					            d.style.width = w;
					            var a = q(that._oFilePathDomRef);
					            var b = a.outerWidth() - _;
					            if (b < 0) {
					                that.oFilePath.getDomRef().style.width = '0px';
					                if (!!!sap.ui.Device.browser.internet_explorer) {
					                    that.oFileUpload.style.width = $.outerWidth(true);
					                }
					            } else {
					                that.oFilePath.getDomRef().style.width = b + 'px';
					            }
					        }
				        }
					}
				});
			}, 3000);
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
		
		var oCombo = this.getView().byId("reqcompdate");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
		
		var oCombo = this.getView().byId("reqDateCws");
		oCombo.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},oCombo);
	},
	
	
	numberValidate:function(oEvt){
		getTrimUiInputVal(oEvt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var that = this;
		if(that.getView().byId("samNo").getEnabled()){
		//var number = oEvt.getSource().getValue();
		var number = that.getView().byId('samNo').getValue();
		var regex =  /^[0-9]{1,3}$/;
		if (!regex.test(number)) {
		  if(number!=""){
			that.getView().byId('samNo').setValue("");
		  	sap.ui.commons.MessageBox.show("Please enter numeric value",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		  	that.getView().byId('samNo').setValueState(sap.ui.core.ValueState.Error);
		  }
	  }else{
		  that.getView().byId('samNo').setValueState(sap.ui.core.ValueState.None);
	  		}
		}
	 },
	 
	 setValueState: function(oEvent){
		 	getTrimUiInputVal(oEvent) // Edited by Darshna on 10/07/2017 - Trim the string for whitespace at the start and end
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
		
		samDelModeSel : function(){
			var that =this;
			if(that.getView().byId("samDelMode").getValue()=="Other methods, specify"){
				that.getView().byId("otherMthd").setVisible(true);
				that.getView().byId("otherMthd").setValue("");
			}else{
				that.getView().byId("otherMthd").setVisible(false);
			}
			that.getView().byId("samDelMode").setValueState("None");
		},
	 
		getUIData : function(){
			var that = this;
			var taskData = that.getView().getModel("taskJsonModel").getData();
			var dbData = that.getView().getModel("oDBModel").getData();
			var pocketId;
			var piId;
			if (taskData.userTypeNo == 1) {
				if (that.getView().byId('pidcb').getSelectedKey()!="") {
					pocketId = that.getView().byId('pidcb').getValue();
					piId = that.getView().byId('pidcb').getSelectedKey();
				}  else {
					pocketId = dbData.requestHeaderDto.requesterPocketId;
					piId = dbData.requestHeaderDto.authPerOrPiId;
				}
			} else if (taskData.userTypeNo == 2) {
				if (that.getView().byId('pidrpt').getSelectedKey()!="") {
					pocketId = that.getView().byId('pidrpt').getValue();
					piId = that.getView().byId('pidrpt').getSelectedKey();
				}  else {
					pocketId = dbData.requestHeaderDto.requesterPocketId;
					piId = dbData.requestHeaderDto.authPerOrPiId;
				}
			} else {
				pocketId = "";
				piId = that.getView().getModel("requesterModel").getData().authPersonUserId;
			}
			
			var hBoxItems=that.getView().byId("sthbox").getContent();
			var sampleTypeArr=[];
			for(var i=0;i<hBoxItems.length;i++){
				sampleTypeArr.push({"sampleType":hBoxItems[i].getText(),"sampleStatus":hBoxItems[i].getSelected()});
			}
			
			var serviceArea="", workShop="", reqComplDate="", samDelMode="", aimofstudy="", expectedData="", method="";
			var isDesignApprovedByPI=false, isDesignAttached=false, desc="";
			
			if(dbData.requestHeaderDto.labId=="CWS"){
				serviceArea	=that.getView().byId("cws_combobox").getValue();
				workShop=that.getView().byId("cwsSA").getValue();
				reqComplDate=that.getEstComplDate(that.getView().byId('reqDateCws').getDateValue());
				isDesignApprovedByPI=that.getView().byId("desappbypi").getSelected(); 
				isDesignAttached=that.getView().byId("desatt").getSelected();
				desc=that.getView().byId("desFabTestMeasCalib").getValue().trim();
			}else{
				serviceArea=that.getView().byId("servarcb").getValue();
				reqComplDate=that.getEstComplDate(that.getView().byId('reqcompdate').getDateValue());
				aimofstudy=that.getView().byId("studyaimtext").getValue().trim();
				expectedData=that.getView().byId("expdatatext").getValue().trim();
				method=that.getView().byId("methodtext").getValue().trim();
				if(that.getView().byId("samDelMode").getValue()=="Other methods, specify"){
					samDelMode=that.getView().byId("otherMthd").getValue().trim();
				}else{
					samDelMode=that.getView().byId("samDelMode").getValue().trim();
				}
			}
			var reqNo = "";
			if (taskData.rfsNo) {
				reqNo = taskData.rfsNo;
			}
			dbData.requestHeaderDto.requestType="test";
		//	dbData.requestHeaderDto.requesterId=that.getView().getModel("oDBModel").getData().requestHeaderDto.requesterId;
		//	dbData.requestHeaderDto.labId=;
			dbData.requestHeaderDto.requesterPocketId=pocketId;
			dbData.requestHeaderDto.reqNo=reqNo;
			dbData.requestHeaderDto.authPerOrPiId=piId;
			dbData.requestHeaderDto.submitted = true;
			
			dbData.serviceAreaDto.aimOfStudy=aimofstudy;
			dbData.serviceAreaDto.expectedData=expectedData;
			dbData.serviceAreaDto.method=method;
			dbData.serviceAreaDto.serviceAreaDesc=serviceArea;
			dbData.serviceAreaDto.requestedCompletionDate=reqComplDate;
			dbData.serviceAreaDto.workshopDesc=workShop;
			dbData.serviceAreaDto.isDesignAttached=isDesignAttached;
			dbData.serviceAreaDto.isDesignApprovedByPI=isDesignApprovedByPI;
			dbData.serviceAreaDto.desc=desc;
			
			dbData.sampleDto.deliveryModeDesc=samDelMode;
			dbData.sampleDto.isReturnSamples=that.getView().byId("retSam").getSelected();
			dbData.sampleDto.reportDesc=that.getView().byId("repType").getValue().trim();
			dbData.sampleDto.numberOfSamples=that.getView().byId("samNo").getValue().trim();
			dbData.sampleDto.sampleDataSpecifications=that.getView().byId("samData").getValue().trim();
			dbData.sampleDto.sampleNm=that.getView().byId("samNm").getValue().trim();
			dbData.sampleDto.sampleOrigin=that.getView().byId("samOrg").getValue().trim();
			dbData.sampleDto.sampleTypeDtos=sampleTypeArr;
			dbData.sampleDto.specificInstruction=that.getView().byId("samInst").getValue().trim();
			
			return dbData;
	},
	
	save : function(){
		var that =this;
		var today= new Date();
		today.setHours(0,0,0,0);
		var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		if(labKey!="CWS"){
			if(that.getView().byId('reqcompdate').getDateValue() && that.getView().byId('reqcompdate').getDateValue() < today){
			sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			that.getView().byId('idIcon').setSelectedKey("Tab2");
			that.getView().getContent()[0].scrollTo(1000);
			return;
			}
		}else{
			if(that.getView().byId('reqDateCws').getDateValue() && that.getView().byId('reqDateCws').getDateValue() < today){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				that.getView().byId('idIcon').setSelectedKey("Tab2");
				that.getView().getContent()[0].scrollTo(1000);
				return;
			}
		}
		var dbData=that.getUIData();
		dbData.requestHeaderDto.statusDesc="RFS Saved";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();   //Save data in  DB 
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			sap.ui.commons.MessageBox.show("RFS saved successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",function(){
				callCloseDialog();
			});
		}else{
			sap.ui.commons.MessageBox.show("RFS not saved, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	validateFields:function(data){
		var that=this;
		var bValidate=false;
		var aId;
		//var taskData = that.getView().getModel("taskJsonModel").getData();
		var today= new Date();
		today.setHours(0,0,0,0);
		
		//isAccountVerified start - getting data from User DB in Save Task 5
		var isAccountVerified = true;
		
		if(data.userTypeNo!=1){
			var readUserProfileModel = new sap.ui.model.json.JSONModel();
			var emailId=that.getView().getModel("oDBModel").getData().requestHeaderDto.requesterId;
			readUserProfileModel.loadData("/utilweb/rest/user/auth/read/"+emailId,null,false);
			
			if(readUserProfileModel.getData()){
				if( readUserProfileModel.getData().isAccountVerified==undefined){
					isAccountVerified = false;
				}else if(readUserProfileModel.getData().isAccountVerified=="false"){
					sap.ui.commons.MessageBox.show("Cannot submit RFS as account verification is pending",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					return;
				}else if(readUserProfileModel.getData().isAccountVerified=="true"){
					isAccountVerified = true;
				}
			}else{
				sap.ui.commons.MessageBox.show("Error in fetching user data, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				return;
			}
		}else{                            // for Internal user
			isAccountVerified = false;
		}
		//isAccountVerified end - getting data from User DB in Save Task 5
		
		var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		
		if(labKey!="CWS"){
			var isRetSam = that.getView().byId("retSam").getSelected();
		
			if(that.getView().byId('reqcompdate').getDateValue() && that.getView().byId('reqcompdate').getDateValue() < today){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				that.getView().byId('idIcon').setSelectedKey("Tab2");
				that.getView().getContent()[0].scrollTo(1000);
				return;
			}
			
			if(isRetSam){
				if(that.getView().byId("samDelMode").getValue()==""){
					sap.ui.commons.MessageBox.show("Please select delivery mode",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					that.getView().byId('idIcon').setSelectedKey("Tab4");
					return;
				}else if(that.getView().byId("samDelMode").getValue()=="Other methods, specify" && that.getView().byId("otherMthd").getValue()==""){
					sap.ui.commons.MessageBox.show("Please specify other methods for delivery mode",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					that.getView().byId('idIcon').setSelectedKey("Tab4");
					return;
				}
			}
		}else{
			if(that.getView().byId('reqDateCws').getDateValue() && that.getView().byId('reqDateCws').getDateValue() < today){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				that.getView().byId('idIcon').setSelectedKey("Tab2");
				that.getView().getContent()[0].scrollTo(1000);
				return;
			}
		}
		
		if(data.userTypeNo==1){
			if( labKey=="CWS"){
				//aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","cws_combobox","reqDateCws","cwsSA","desFabTestMeasCalib"];
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				//aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else if (data.userTypeNo==2){
			if( labKey=="CWS"){
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","pidrpt","cws_combobox","reqDateCws","cwsSA","desFabTestMeasCalib"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","pidrpt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else{
			if(labKey=="CWS"){
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","cws_combobox","reqDateCws","cwsSA","desFabTestMeasCalib"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","reqcompdate","studyaimtext","expdatatext","methodtext"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}
		
		var aIdLen=aId.length;
		var tab=null;
		for(var i=0;i<aIdLen;i++){
			//var oControl = that.getView().byId(aId[i]);
			var oControl = that.getView().byId(aId[i][0]);
		
			if(oControl.getValue()==""||oControl.getValue()==null||oControl==undefined){
				oControl.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field cannot be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				bValidate=false;
			
				if(tab && aId[i][1] === "2"){
					break;
					}
				tab= aId[i][1];
				break;
			}else{
				if(oControl.getValueState() === "Error"  && oControl.getMetadata().getName()==="sap.m.DatePicker"){
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
			var valueLab= that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
			if(valueLab=="CWS" && tab==="2"){
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
			
			//for IsNewRequester  taskData.userTypeNo==1
			/* var newRequester=true, isAccountVerificationReqd=false, isSlaVerificationReqd=false;
			 var loggedUserMdl = new sap.ui.model.json.JSONModel();
				var loginPayload ={
						   "loggedInUser" : "true"
						};
				loggedUserMdl.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
				
			 var isNewRequesterModel =new sap.ui.model.json.JSONModel();
			 isNewRequesterModel.loadData("/kclrfs/rest/requestheader/isRequesterRaisedRFS/"+dbData.requestHeaderDto.requesterId,null,false);
			 	if(isNewRequesterModel.getData().success=="false"){
			 		newRequester = true;
			 		}else{
			 			newRequester = false;
			 		}		*/
			/*if(data.userTypeNo==1 ||newRequester == true){
				isAccountVerificationReqd=false;
			}else{
				isAccountVerificationReqd=true;
			}*/
			
			/*if(data.userTypeNo==1){
			//	isAccountVerificationReqd = false;
			}else{
			//	isAccountVerificationReqd = newRequester;//account verification required only for New NON-KAUST user
				if(!(isAccountVerified)){
				dbData.requestHeaderDto.isAccountVerified = isAccountVerified; // added for acc verification 17th Jan
				dbData.requestHeaderDto.isAccountVerifiedFlag = true;
				}
			}*/
			/*if(data.userTypeNo!=1){
				if((data.userTypeNo==3)||(data.userTypeNo==2 && newRequester == true)){
					isSlaVerificationReqd=true;
				}
				else{
					isSlaVerificationReqd=false;
				}
			}else{
				isSlaVerificationReqd=false;
			}*/
			
			//isAccountVerified start - setting data to User DB & BPM in Save Task 6
			if(data.userTypeNo!=1){
				if(!(isAccountVerified)){
					dbData.isAccountVerified = isAccountVerified; // added for acc verification 17th Jan
					dbData.isAccountVerifiedFlag = true;
					data.isNewRequester =  true;     
					data.isAccountVerificationReqd = true;
				}
			}
			//isAccountVerified end - setting data to User DB & BPM in Save Task 6
			
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			
			if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Submitted successfully";
				data.uiActionNo=1;
				
				/*data.isNewRequester = newRequester;     
				data.isAccountVerificationReqd = isAccountVerificationReqd;   
				data.isSlaVerificationReqd = isSlaVerificationReqd; */
				
				//isAccountVerified start - setting data to BPM in Save Task 7	
				/*if(!isAccountVerified){
					data.isNewRequester =  true;     
					data.isAccountVerificationReqd = true;
				}*/
				//isAccountVerified end - setting data to BPM in Save Task 7
				
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	navToPrevTab : function(oEvent){
		var that =this;
		var tabBar = that.getView().byId("idIcon");
		var selectedTab = tabBar.getSelectedKey();
		var buttonText = oEvent.getSource().getText();
		var valueLab= that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
				var taskNo= that.getView().getModel("taskJsonModel").getData().taskNo;
		switch(selectedTab){
		case "Tab1": 
			return;
			break;
		case "Tab2":tabBar.setSelectedKey("Tab1");
			oEvent.getSource().setEnabled(false);
			if(valueLab=="CWS"){
				oEvent.getSource().setEnabled(true);
				if(taskNo === 1){
					that.getView().byId("submitrfs").setText("Next");
				}else if(taskNo === 2){
					that.getView().byId("maAccVerifyPrevBtn").setEnabled(false);
					that.getView().byId("maAccVerify1").setVisible(false);
					that.getView().byId("maAccVerify").setVisible(true);
				}else if(taskNo === 3){
					that.getView().byId("rtUpConfPrevBtn").setEnabled(false);
					that.getView().byId("rtUpConf1").setVisible(false);
					that.getView().byId("rtUpConf").setVisible(true);
				}else if(taskNo === 4){
					that.getView().byId("ltRfsRevPrevBtn").setEnabled(false);
					that.getView().byId("ltRfsRev1").setVisible(false);
					that.getView().byId("ltRfsRev").setVisible(true);
				}else if(taskNo === 5){
					that.getView().byId("rtSamUpConfPrevBtn").setEnabled(false);
					that.getView().byId("rtSamUpConf1").setVisible(false);
					that.getView().byId("rtSamUpConf").setVisible(true);
				}
			}
			return;
			break;
		case "Tab3":tabBar.setSelectedKey("Tab2");
		that.getView().getContent()[0].scrollTo(1000);
			return;
			break;
		case "Tab4":tabBar.setSelectedKey("Tab3");
			if(taskNo === 1){
				that.getView().byId("submitrfs").setText("Next");
			}else if(taskNo === 2){
				that.getView().byId("maAccVerifyPrevBtn").setEnabled(true);
				that.getView().byId("maAccVerify1").setVisible(false);
				that.getView().byId("maAccVerify").setVisible(true);
			}else if(taskNo === 3){
				that.getView().byId("rtUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtUpConf1").setVisible(false);
				that.getView().byId("rtUpConf").setVisible(true);
			}else if(taskNo === 4){
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
				that.getView().byId("ltRfsRev1").setVisible(false);
				that.getView().byId("ltRfsRev").setVisible(true);
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtSamUpConf1").setVisible(false);
				that.getView().byId("rtSamUpConf").setVisible(true);
			}
			that.getView().getContent()[0].scrollTo(1000);
			return;
			break;
		}
	},
	
	navToNextTab: function(oEvent){
		var that =this;
		var tabBar = that.getView().byId("idIcon");
		var selectedTab = tabBar.getSelectedKey();
		var buttonText = oEvent.getSource().getText();
		var valueLab= that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		var taskNo= that.getView().getModel("taskJsonModel").getData().taskNo;
		switch(selectedTab){
		case "Tab1":tabBar.setSelectedKey("Tab2");
			if(taskNo ===2){
				that.getView().byId("maAccVerifyPrevBtn").setEnabled(true);
			}else if(taskNo===3){
				that.getView().byId("rtUpConfPrevBtn").setEnabled(true);
			}else if(taskNo === 4){
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
			}else if(taskNo=== 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
			}
			
			if(valueLab=="CWS"){
				if(taskNo === 2){
					that.getView().byId("maAccVerify1").setVisible(true);
					that.getView().byId("maAccVerify").setVisible(false);
				}else if(taskNo === 3){
					that.getView().byId("rtUpConf1").setVisible(true);
					that.getView().byId("rtUpConf").setVisible(false);
				}else if(taskNo === 4){
					that.getView().byId("ltRfsRev1").setVisible(true);
					that.getView().byId("ltRfsRev").setVisible(false);
				}else if(taskNo === 5){
					that.getView().byId("rtSamUpConf1").setVisible(true);
					that.getView().byId("rtSamUpConf").setVisible(false);
				}
			}
			that.getView().getContent()[0].scrollTo(1000);
			return;
			break; 
		case "Tab2":tabBar.setSelectedKey("Tab3");
		that.getView().getContent()[0].scrollTo(1000);
			return;
			break;
		case "Tab3":tabBar.setSelectedKey("Tab4");
			if(taskNo === 2){
				that.getView().byId("maAccVerify1").setVisible(true);
				that.getView().byId("maAccVerify").setVisible(false);
			}else if(taskNo === 3){
				that.getView().byId("rtUpConf1").setVisible(true);
				that.getView().byId("rtUpConf").setVisible(false);
			}else if(taskNo === 4){
				that.getView().byId("ltRfsRev1").setVisible(true);
				that.getView().byId("ltRfsRev").setVisible(false);
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConf1").setVisible(true);
				that.getView().byId("rtSamUpConf").setVisible(false);
			}
			return;
			break;
		}
	},
	
	handleTabSelect: function(oEvent){
		var that=this;
		var selectedTab = oEvent.getSource().getSelectedKey();
		var valueLab = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		if(taskId!=""){
		var taskNo= that.getView().getModel("taskJsonModel").getData().taskNo;
		switch(selectedTab){
		case "Tab1": that.getView().byId("btnPrev").setEnabled(false);
			if(taskNo === 1){
				that.getView().byId("submitrfs").setText("Next");
			}else if(taskNo === 2){
				that.getView().byId("maAccVerifyPrevBtn").setEnabled(false);
				that.getView().byId("maAccVerify1").setVisible(false);
				that.getView().byId("maAccVerify").setVisible(true);
			}else if(taskNo === 3){
				that.getView().byId("rtUpConfPrevBtn").setEnabled(false);
				that.getView().byId("rtUpConf1").setVisible(false);
				that.getView().byId("rtUpConf").setVisible(true);
			}else if(taskNo === 4){
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(false);
				that.getView().byId("ltRfsRev1").setVisible(false);
				if(that.getView().getModel("oDBModel").getData().requestHeaderDto.statusDesc!="Scope and Charges Review"){
				that.getView().byId("ltRfsRev").setVisible(true);
				}
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(false);
				that.getView().byId("rtSamUpConf1").setVisible(false);
				that.getView().byId("rtSamUpConf").setVisible(true);
			}
			break;
		case "Tab2":that.getView().byId("btnPrev").setEnabled(true);
			if(valueLab=="CWS"){
				if(taskNo === 1){
					that.getView().byId("btnPrev").setEnabled(true);
					that.getView().byId("submitrfs").setText("Submit");
				}else if(taskNo === 2){
					that.getView().byId("maAccVerifyPrevBtn").setEnabled(true);
					that.getView().byId("maAccVerify1").setVisible(true);
					that.getView().byId("maAccVerify").setVisible(false);
				}else if(taskNo === 3){
					that.getView().byId("rtUpConfPrevBtn").setEnabled(true);
					that.getView().byId("rtUpConf1").setVisible(true);
					that.getView().byId("rtUpConf").setVisible(false);
				}else if(taskNo === 4){
					if(that.getView().getModel("oDBModel").getData().requestHeaderDto.statusDesc!="Scope and Charges Review"){
					that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
					that.getView().byId("ltRfsRev1").setVisible(true);}
					that.getView().byId("ltRfsRev").setVisible(false);
				}else if(taskNo === 5){
					that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
					that.getView().byId("rtSamUpConf1").setVisible(true);
					that.getView().byId("rtSamUpConf").setVisible(false);
				}
			}else{
				if(taskNo === 1){
					that.getView().byId("btnPrev").setEnabled(true);
					that.getView().byId("submitrfs").setText("Next");
				}else if(taskNo === 2){
					that.getView().byId("maAccVerifyPrevBtn").setEnabled(true);
					that.getView().byId("maAccVerify1").setVisible(false);
					that.getView().byId("maAccVerify").setVisible(true);
				}else if(taskNo === 3){
					that.getView().byId("rtUpConfPrevBtn").setEnabled(true);
					that.getView().byId("rtUpConf1").setVisible(false);
					that.getView().byId("rtUpConf").setVisible(true);
				}else if(taskNo === 4){
					if(that.getView().getModel("oDBModel").getData().requestHeaderDto.statusDesc!="Scope and Charges Review"){
					that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
					that.getView().byId("ltRfsRev").setVisible(true);
					}
					that.getView().byId("ltRfsRev1").setVisible(false);
				}else if(taskNo === 5){
					that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
					that.getView().byId("rtSamUpConf1").setVisible(false);
					that.getView().byId("rtSamUpConf").setVisible(true);
				}
			}
			that.getView().getContent()[0].scrollTo(1000);
			break;
		case "Tab3":
			if(taskNo === 1){
				that.getView().byId("btnPrev").setEnabled(true);
				that.getView().byId("submitrfs").setText("Next");
			}else if(taskNo === 2){
				that.getView().byId("maAccVerifyPrevBtn").setEnabled(true);
				that.getView().byId("maAccVerify1").setVisible(false);
				that.getView().byId("maAccVerify").setVisible(true);
			}else if(taskNo === 3){
				that.getView().byId("rtUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtUpConf1").setVisible(false);
				that.getView().byId("rtUpConf").setVisible(true);
			}else if(taskNo === 4){
				if(that.getView().getModel("oDBModel").getData().requestHeaderDto.statusDesc!="Scope and Charges Review"){
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
				that.getView().byId("ltRfsRev").setVisible(true);
				}
				that.getView().byId("ltRfsRev1").setVisible(false);
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtSamUpConf1").setVisible(false);
				that.getView().byId("rtSamUpConf").setVisible(true);
			}
			that.getView().getContent()[0].scrollTo(1000);
			break;
		case "Tab4":
			if(taskNo === 1){
				that.getView().byId("btnPrev").setEnabled(true);
				that.getView().byId("submitrfs").setText("Submit");
			}else if(taskNo === 2){
				that.getView().byId("maAccVerifyPrevBtn").setEnabled(true);
				that.getView().byId("maAccVerify1").setVisible(true);
				that.getView().byId("maAccVerify").setVisible(false);
			}else if(taskNo === 3){
				that.getView().byId("rtUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtUpConf1").setVisible(true);
				that.getView().byId("rtUpConf").setVisible(false);
			}else if(taskNo === 4){
				if(that.getView().getModel("oDBModel").getData().requestHeaderDto.statusDesc!="Scope and Charges Review"){
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
				that.getView().byId("ltRfsRev1").setVisible(true);
				}
				that.getView().byId("ltRfsRev").setVisible(false);
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtSamUpConf1").setVisible(true);
				that.getView().byId("rtSamUpConf").setVisible(false);
			}
			break;
			}
		}
	},
	
	submit : function(oEvent){
		var that =this;
		var tabBar = that.getView().byId("idIcon");
		var selectedTab = tabBar.getSelectedKey();
		var buttonText = oEvent.getSource().getText();
		var valueLab= that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		switch(selectedTab){
		case "Tab1": tabBar.setSelectedKey("Tab2");
			that.getView().byId("btnPrev").setEnabled(true);
			if(valueLab=="CWS"){
				oEvent.getSource().setText("Submit");
				}
			that.getView().getContent()[0].scrollTo(1000);
			return;
			break;
		case "Tab2":
			if(valueLab=="CWS"){
				var uiAction = 1;
				var data = that.getView().getModel("taskJsonModel").getData();
				that.validateFields(data);
			}else{
				tabBar.setSelectedKey("Tab3");
				that.getView().getContent()[0].scrollTo(1000);
				return;
			}
			break;
		case "Tab3":tabBar.setSelectedKey("Tab4");
			oEvent.getSource().setText("Submit");
			return;
			break;
		case "Tab4":
			var uiAction = 1;
			var data = that.getView().getModel("taskJsonModel").getData();
			that.validateFields(data);
			return;
			break;
		}
	},
	
	getTask : function(){
		var that= this;
		var tId = getValFromQueryString('taskId');
		return tId;
	},
	
	claim : function(taskId){
		var that=this;
		 var taskSvcURL = "/bpmodata/tasks.svc";  
			var taskODataModel = new sap.ui.model.odata.ODataModel(taskSvcURL);
			 taskODataModel.create("/Claim?InstanceID='"+taskId+"'", null, null,
			     function(oData,oResponse) {  
				 	that.readorUpdateTaskData(taskId);
				 	rfsFormTaskModel.setData();
					dSampleDocModel.setData();
					that.readSvcAreaTableData();
					that.readSmpSecTableData();
					that.attachReadOnly();
			        },  
			      function(oError) {
			        });   
	},
	
	readorUpdateTaskData : function(taskId){
		var that =this;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		/*var taskJsonModel= new sap.ui.model.json.JSONModel();
		var oDBModel = new sap.ui.model.json.JSONModel();
		
		var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
			taskDataODataModel.read("/InputData('"+taskId+"')/DO_RFS",null, null,false,
		  		function(oData,oRes){*/
					//  taskJsonModel.setData(oData);
					  that.getView().setModel(taskJsonModel,"taskJsonModel");
					  var taskData =  taskJsonModel.getData(); 
					//  oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+taskData.rfsNo,null,false);
					  if(oDBModel.getData().requestHeaderDto){
					  var rfsDate = oDBModel.getData().requestHeaderDto.createdDate;      //requestHeaderDto.labId
					  if(rfsDate){
						  	 that.getView().byId("rfsDate").setText(rfsDate.substr(8,2)+"/"+rfsDate.substr(5,2)+"/"+rfsDate.substr(0,4)); 
						  }   
					  that.getView().byId('rfsStatus').setText(oDBModel.getData().requestHeaderDto.statusDesc);
					  }
					  that.getView().byId('rfsNo').setText(taskData.rfsNo);
					  
					  if(oDBModel.getData().commentList!=undefined){	
						  if(!(oDBModel.getData().commentList instanceof Array)){
							  oDBModel.getData().commentList = [oDBModel.getData().commentList];
							}
							var dtoList=oDBModel.getData().commentList;
							var length=dtoList.length;
							for(var i=0;i<length;i++){
								if(dtoList[i].createdDate!=""){
								dtoList[i].createdDate = getFormattedDate(new Date(dtoList[i].createdDate));
									}
								}
							}
					  var labKey = oDBModel.getData().requestHeaderDto.labId;
					  var labName = oDBModel.getData().requestHeaderDto.labDesc;
						
					  var rfsPocketIdModel = new sap.ui.model.json.JSONModel();
					  that.getView().setModel(rfsPocketIdModel,"rfsPocketIdModel");
					  var serviceAreaModel = new sap.ui.model.json.JSONModel();
						//that.getView().byId('servarcb').setModel(serviceAreaModel);
					  that.disableAllBtns();
						
						if(taskData.userTypeNo==1){
							that.getView().byId("kaustuser").setVisible(true);
							that.getView().byId("nonkaustuser").setVisible(false);
						}else if(taskData.userTypeNo==2){
							that.getView().byId("kaustuser").setVisible(false);
							that.getView().byId("nonkaustuser").setVisible(true);
							that.getView().byId("rptPktId").setVisible(true);
							that.getView().byId("pidrpt").setVisible(true);
							/*var orgTypeModel = new sap.ui.model.json.JSONModel(); 
							orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
							this.getView().setModel(orgTypeModel,"orgTypeModel");*/
						}else if(taskData.userTypeNo==3){
							that.getView().byId("kaustuser").setVisible(false);
							that.getView().byId("nonkaustuser").setVisible(true);
							that.getView().byId("rptPktId").setVisible(false);
							that.getView().byId("pidrpt").setVisible(false);
							/*var orgTypeModel = new sap.ui.model.json.JSONModel(); 
							orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
							that.getView().setModel(orgTypeModel,"orgTypeModel");*/
						}else{
							sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
							return;
						}
						if(labKey!="CWS"){
							var sampTypeData= oDBModel.getData().sampleDto.sampleTypeDtos;
							var sampleSize=sampTypeData.length;
							for(var i=0;i<sampleSize;i++){
								if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="true"){
									oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=true;
								}
								else if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="false"){
									oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=false;
									}
								}
							if(oDBModel.getData().serviceAreaDto.requestedCompletionDate){
								 var saDate = new Date(oDBModel.getData().serviceAreaDto.requestedCompletionDate); 
								  that.getView().byId("reqcompdate").setDateValue(saDate); 
								}
							if(oDBModel.getData().sampleDto.isReturnSamples=="true"||oDBModel.getData().sampleDto.isReturnSamples==true){
								oDBModel.getData().sampleDto.isReturnSamples=true;
							}else{
								oDBModel.getData().sampleDto.isReturnSamples=false;
							}
							if(oDBModel.getData().serviceAreaDto.aimOfStudy){
								that.getView().byId("studyaimtext").setValue(oDBModel.getData().serviceAreaDto.aimOfStudy);
								that.getView().byId("studyaimtext").setTooltip(oDBModel.getData().serviceAreaDto.aimOfStudy);
							}
							if(oDBModel.getData().serviceAreaDto.expectedData){
								that.getView().byId("expdatatext").setValue(oDBModel.getData().serviceAreaDto.expectedData);
								that.getView().byId("expdatatext").setTooltip(oDBModel.getData().serviceAreaDto.expectedData);
							}
							if(oDBModel.getData().serviceAreaDto.method){
								that.getView().byId("methodtext").setValue(oDBModel.getData().serviceAreaDto.method);
								that.getView().byId("methodtext").setTooltip(oDBModel.getData().serviceAreaDto.method);
							}
							if(oDBModel.getData().sampleDto.sampleDataSpecifications){
								that.getView().byId("samData").setValue(oDBModel.getData().sampleDto.sampleDataSpecifications);
								that.getView().byId("samData").setTooltip(oDBModel.getData().sampleDto.sampleDataSpecifications);
							}
							if(oDBModel.getData().sampleDto.specificInstruction){
								that.getView().byId("samInst").setValue(oDBModel.getData().sampleDto.specificInstruction);
								that.getView().byId("samInst").setTooltip(oDBModel.getData().sampleDto.specificInstruction);
							}
							if(oDBModel.getData().sampleDto.isReturnSamples){
								that.getView().byId("samDelMode").setEnabled(true);
							}else{
								that.getView().byId("samDelMode").setEnabled(false);
							}
						}else{
								if(oDBModel.getData().serviceAreaDto.requestedCompletionDate){
									 var saDate = new Date(oDBModel.getData().serviceAreaDto.requestedCompletionDate);   
									 that.getView().byId("reqDateCws").setDateValue(saDate); 
								}
								if(oDBModel.getData().serviceAreaDto.isDesignAttached=="true"||oDBModel.getData().serviceAreaDto.isDesignAttached==true){
									oDBModel.getData().serviceAreaDto.isDesignAttached=true;
								}else{
									oDBModel.getData().serviceAreaDto.isDesignAttached=false;
								}
								if(oDBModel.getData().serviceAreaDto.isDesignApprovedByPI=="true"||oDBModel.getData().serviceAreaDto.isDesignApprovedByPI==true){
									oDBModel.getData().serviceAreaDto.isDesignApprovedByPI=true;
								}else{
									oDBModel.getData().serviceAreaDto.isDesignApprovedByPI=false;
								}
								if(oDBModel.getData().serviceAreaDto.desc){
									that.getView().byId("desFabTestMeasCalib").setValue(oDBModel.getData().serviceAreaDto.desc);
									that.getView().byId("desFabTestMeasCalib").setTooltip(oDBModel.getData().serviceAreaDto.desc);
								}
						}
						
					that.getView().setModel(oDBModel,"oDBModel");
					if(taskData.taskNo==1){
						that.getView().byId('requsterDraft').setVisible(true);
						if(taskData.userTypeNo!=3){
						var Payload={
							   "userId":oDBModel.getData().requestHeaderDto.requesterId,
							   "status":"APR"
							};
						rfsPocketIdModel.loadData("/utilweb/rest/piapprovalreq/searchUserPiApproval",JSON.stringify(Payload),false,"POST",false,false,oHeader);
							if(!(rfsPocketIdModel.getData().piApprovalDto instanceof Array)){
								rfsPocketIdModel.getData().piApprovalDto=[rfsPocketIdModel.getData().piApprovalDto];
							}
						that.getView().setModel(rfsPocketIdModel,"rfsPocketIdModel");
					}
						if(labKey=="CWS"){
							var workShop = that.getView().byId("cws_combobox").getValue();
							serviceAreaModel.loadData("/kclrfs/rest/brm/jobType/CWS/"+workShop,null,false);
							that.getView().byId('cwsSA').setModel(serviceAreaModel);
						}
						var repTypeModel = new sap.ui.model.json.JSONModel(); 
						repTypeModel.loadData("/kclrfs/rest/brm/reportArea",null,false);
						that.getView().setModel(repTypeModel,"repTypeModel");
						
						var delModeModel = new sap.ui.model.json.JSONModel(); 
						delModeModel.loadData("/kclrfs/rest/brm/sampleDeliveryMode",null,false);
						that.getView().setModel(delModeModel,"delModeModel");
						that.getView().byId('commTable').setVisible(false);
						that.getView().byId('commHisLbl').setVisible(false);
				}else if(taskData.taskNo==2){
					that.getView().byId('maAccVerify').setVisible(true);
					that.getView().byId("nkAccno").setEnabled(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==3){
					that.getView().byId('rtUpConf').setVisible(true);
					that.disableAllRfsFields();
					that.getView().byId("fileUploaderTask").setEnabled(true);
					that.getView().byId("saFupBtn").setEnabled(true);
					that.getView().byId("sampleFileUploaderTask").setEnabled(true);
					that.getView().byId("ssFupBtn").setEnabled(true);
				}else if(taskData.taskNo==4){
					if(oDBModel.getData().requestHeaderDto.statusDesc=="Scope and Charges Review"){
						that.getView().byId('ssc').setEnabled(true);
						that.getView().byId('ssc').setIconColor("Positive");
						that.getView().byId('headerTab').setSelectedKey("SSC");
						that.getView().byId('rfs').setIconColor("Neutral");
						that.getView().byId('ltRfsRev').setVisible(false);
					}else{
						that.getView().byId('ltRfsRev').setVisible(true);
						/*if(labKey=="BCL"||labKey=="CWS"){
							that.getView().byId('teamLeadPend').setVisible(true);
						}else{
							that.getView().byId('teamLeadPend').setVisible(false);
						}*/
					}
					that.disableAllRfsFields();
				}else if(taskData.taskNo==5){
					that.getView().byId('rtSamUpConf').setVisible(true);
					//that.disableAllRfsFields();
					
					if(taskData.userTypeNo!=3){
						var Payload={
							   "userId":oDBModel.getData().requestHeaderDto.requesterId,
							   "status":"APR"
							};
						rfsPocketIdModel.loadData("/utilweb/rest/piapprovalreq/searchUserPiApproval",JSON.stringify(Payload),false,"POST",false,false,oHeader);
							if(!(rfsPocketIdModel.getData().piApprovalDto instanceof Array)){
								rfsPocketIdModel.getData().piApprovalDto=[rfsPocketIdModel.getData().piApprovalDto];
							}
						that.getView().setModel(rfsPocketIdModel,"rfsPocketIdModel");
					}
						if(labKey=="CWS"){
							var workShop = that.getView().byId("cws_combobox").getValue();
							serviceAreaModel.loadData("/kclrfs/rest/brm/jobType/CWS/"+workShop,null,false);
							that.getView().byId('cwsSA').setModel(serviceAreaModel);
						}
						var repTypeModel = new sap.ui.model.json.JSONModel(); 
						repTypeModel.loadData("/kclrfs/rest/brm/reportArea",null,false);
						that.getView().setModel(repTypeModel,"repTypeModel");
						
						var delModeModel = new sap.ui.model.json.JSONModel(); 
						delModeModel.loadData("/kclrfs/rest/brm/sampleDeliveryMode",null,false);
						that.getView().setModel(delModeModel,"delModeModel");
					
//					that.getView().byId("fileUploaderTask").setEnabled(true);
//					that.getView().byId("saFupBtn").setEnabled(true);
//					that.getView().byId("sampleFileUploaderTask").setEnabled(true);
//					that.getView().byId("ssFupBtn").setEnabled(true);
					
					
				}else if(taskData.taskNo==6){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
					//that.getView().byId('dirRev').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==7){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
					//that.getView().byId('ltSscRev').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==8){
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Positive");
					//that.getView().byId('ca').setEnabled(true);
					//that.getView().byId('ca').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					//that.getView().byId('rtSscAcceptance').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==9){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
					//that.getView().byId('ltSscRej').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==10){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
					//that.getView().byId('piAuthPer').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==11){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
					//that.getView().byId('ltLmSel').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==12){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
					//that.getView().byId('maSlaPayVer').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==13){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
				//	that.getView().byId('ltPayDocUpConf').setVisible(true);
					that.disableAllRfsFields();
				}
				/*else if(taskData.taskNo==14 && oDBModel.getData().requestHeaderDto.statusDesc=="Report Accepted"){
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Neutral");
					//that.getView().byId('ca').setEnabled(true);
					//that.getView().byId('ca').setIconColor("Neutral");
					that.getView().byId('rep').setEnabled(true);
					//that.getView().byId('rep').setIconColor("Positive");
					//that.getView().byId('headerTab').setSelectedKey("REP");
					that.getView().byId('rep').setIconColor("Neutral");
					that.getView().byId('feedbc').setEnabled(true);
					that.getView().byId('feedbc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("FEED");
				//	that.getView().byId('lmFrfs').setVisible(true);
					that.disableAllRfsFields();
				}
*/				
				else if(taskData.taskNo==14){
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Neutral");
					//that.getView().byId('ca').setEnabled(true);
					//that.getView().byId('ca').setIconColor("Neutral");
					that.getView().byId('rep').setEnabled(true);
					that.getView().byId('rep').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("REP");
				//	that.getView().byId('lmFrfs').setVisible(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==15){
					that.getView().byId('ssc').setEnabled(true);
					that.getView().byId('ssc').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("SSC");
					that.getView().byId('rfs').setIconColor("Neutral");
				//	that.getView().byId('rtSamResub').setVisible(true);
					that.disableAllRfsFields();
					that.getView().byId("fileUploaderTask").setEnabled(true);
					that.getView().byId("saFupBtn").setEnabled(true);
					that.getView().byId("sampleFileUploaderTask").setEnabled(true);
					that.getView().byId("ssFupBtn").setEnabled(true);
				}else if(taskData.taskNo==16 ){
					if(oDBModel.getData().requestHeaderDto.statusDesc=="Feedback Submitted"){
						that.getView().byId('rfs').setIconColor("Neutral");
						that.getView().byId('ssc').setEnabled(true); 
						that.getView().byId('ssc').setIconColor("Neutral");
						//that.getView().byId('ca').setEnabled(true);
						//that.getView().byId('ca').setIconColor("Neutral");
						that.getView().byId('rep').setEnabled(true);
						that.getView().byId('rep').setIconColor("Positive");
							//that.getView().byId('feedbc').setEnabled(true);
						//	that.getView().byId('feedbc').setIconColor("Positive");
						that.getView().byId('headerTab').setSelectedKey("REP");
						}else{
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Neutral");
				//	that.getView().byId('ca').setEnabled(true);
				//	that.getView().byId('ca').setIconColor("Neutral");
					that.getView().byId('rep').setEnabled(true);
					that.getView().byId('rep').setIconColor("Positive");
					that.getView().byId('headerTab').setSelectedKey("REP");
						}
					that.disableAllRfsFields();
				}else if(taskData.taskNo==17){
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Neutral");
				//	that.getView().byId('ca').setEnabled(true);
				//	that.getView().byId('ca').setIconColor("Neutral");
					that.getView().byId('rep').setEnabled(true);
					that.getView().byId('rep').setIconColor("Positive");
				//	that.getView().byId('feedbc').setEnabled(true);
				//	that.getView().byId('feedbc').setIconColor("Neutral");
					that.getView().byId('headerTab').setSelectedKey("REP");
					that.disableAllRfsFields();
				}else if(taskData.taskNo==18){
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Neutral");
				//	that.getView().byId('ca').setEnabled(true);
				//	that.getView().byId('ca').setIconColor("Neutral");
					that.getView().byId('rep').setEnabled(true);
					that.getView().byId('rep').setIconColor("Positive");
				//	that.getView().byId('feedbc').setEnabled(true);
				//	that.getView().byId('feedbc').setIconColor("Neutral");
					that.getView().byId('headerTab').setSelectedKey("REP");
					that.disableAllRfsFields();
				}else if(taskData.taskNo==19){
					that.getView().byId('rfs').setIconColor("Neutral");
					that.getView().byId('ssc').setEnabled(true); 
					that.getView().byId('ssc').setIconColor("Neutral");
					//that.getView().byId('ca').setEnabled(true);
				//	that.getView().byId('ca').setIconColor("Neutral");
					that.getView().byId('rep').setEnabled(true);
					that.getView().byId('rep').setIconColor("Positive");
				//	that.getView().byId('feedbc').setEnabled(true);
				//	that.getView().byId('feedbc').setIconColor("Neutral");
					that.getView().byId('headerTab').setSelectedKey("REP");
					that.disableAllRfsFields();
				}else if(taskData.taskNo > 100){
					that.getView().byId("supportSec").setVisible(true);
					that.disableAllRfsFields();
					if(oDBModel.getData().serviceScopeDto){
						that.getView().byId('ssc').setEnabled(true);
						that.getView().byId('ssc').setIconColor("Positive");
						that.getView().byId('headerTab').setSelectedKey("SSC");
						that.getView().byId('rfs').setIconColor("Neutral");
					}
					if(oDBModel.getData().reportDto){
						that.getView().byId('rfs').setIconColor("Neutral");
						that.getView().byId('ssc').setEnabled(true); 
						that.getView().byId('ssc').setIconColor("Neutral");
						that.getView().byId('rep').setEnabled(true);
						that.getView().byId('rep').setIconColor("Positive");
						that.getView().byId('headerTab').setSelectedKey("REP");
					}
					//sap.ui.commons.MessageBox.show(taskData.message,sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					//sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					//jQuery.sap.require("sap.m.MessageBox");
					alert(taskData.message);
				}else{
					that.disableAllRfsFields();
				}
			  
				that.getView().byId('labName').setText("REQUEST FOR SERVICE Core Labs and Major Facilities :" + " " +labName);	
		        if(labKey=="ACL"){
		        	//that.getView().byId('labName').setText(labName);
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="IAC"){
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="NFTF"){
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="BCL"){
					that.getView().byId('bsbeSample1').setVisible(true);
					that.getView().byId('bsbeSample2').setVisible(true);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="CWS"){
					that.getView().byId("idIcon").getItems()[2].setVisible(false);
					that.getView().byId("idIcon").getItems()[3].setVisible(false);  
					that.getView().byId("cwsServ1").setVisible(true);
					that.getView().byId("cwsServ2").setVisible(true);
					that.getView().byId("cwsServ3").setVisible(true);
					that.getView().byId("exCws1").setVisible(false);
					that.getView().byId("exCws2").setVisible(false);
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("cwsBd").setVisible(true);
					that.getView().byId("exCwsBd").setVisible(false);
					}
				else{
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
				}
		        var requesterModel =new sap.ui.model.json.JSONModel();
		        requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
		    	that.getView().setModel(requesterModel,"requesterModel");
		    	
		    	if(requesterModel.getData().userType=="RPT"){
					that.getView().byId('iskrpt').setSelected(true);
				}
		    	// Getting PI details
		    	if(oDBModel.getData().requestHeaderDto.authPerOrPiId){
		    		var gwPIModel = new sap.ui.model.json.JSONModel();
		    		gwPIModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.authPerOrPiId,null,false);
		    		that.getView().setModel(gwPIModel,"gwPIModel");
		    	}
		},
	
	
	_loadRFS : function(oEvt){
		var that = this;
		var rfsNo=oEvt.getParameter("arguments").id;
		if(rfsNo!=undefined){
		that.disableAllBtns();
		var oDBModel = new sap.ui.model.json.JSONModel();
		oDBModel.setData();
		oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+rfsNo,null,false);
		
		if(oDBModel.getData().requestHeaderDto){
			that.getView().byId("backBtn").setVisible(true);
			  var rfsDate = oDBModel.getData().requestHeaderDto.createdDate;      //requestHeaderDto.labId
			  if(rfsDate){
				  	 that.getView().byId("rfsDate").setText(rfsDate.substr(8,2)+"/"+rfsDate.substr(5,2)+"/"+rfsDate.substr(0,4)); 
				  }   
			  that.getView().byId('rfsStatus').setText(oDBModel.getData().requestHeaderDto.statusDesc);
			  that.getView().byId('rfsNo').setText(oDBModel.getData().requestHeaderDto.reqNo);
			  
			  if(oDBModel.getData().commentList!=undefined){	
				  if(!(oDBModel.getData().commentList instanceof Array)){
					  oDBModel.getData().commentList = [oDBModel.getData().commentList];
					}
				var dtoList=oDBModel.getData().commentList;
				var length=dtoList.length;
				for(var i=0;i<length;i++){
					if(dtoList[i].createdDate!=""){
					dtoList[i].createdDate = getFormattedDate(new Date(dtoList[i].createdDate));
						}
					}
				}
			  	rfsFormTaskModel.setData();
				dSampleDocModel.setData();
				that.readSvcAreaTableData();
				that.readSmpSecTableData();
				that.attachReadOnly();
				that.getView().byId('headerTab').setSelectedKey("RFS");
				that.getView().byId('idIcon').setSelectedKey("Tab1");
				that.getView().byId('ssc').setEnabled(false);
				that.getView().byId('rep').setEnabled(false);
			  }
		else{
			sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			return;
		}
		if(oDBModel.getData().serviceScopeDto){
				that.getView().byId('rfs').setIconColor("Neutral");
			  	that.getView().byId('ssc').setEnabled(true);
				that.getView().byId('ssc').setIconColor("Neutral");
			} 
		// (oDBModel.getData().reportDto==undefined && ( oDBModel.getData().requestHeaderDto.statusDesc=="RFS Rejected" || oDBModel.getData().requestHeaderDto.statusDesc=="Completed" || oDBModel.getData().requestHeaderDto.statusDesc=="Sample Returned")) || 		
		if(oDBModel.getData().requestHeaderDto.statusDesc=="RFS Rejected" || oDBModel.getData().reportDto){
			that.getView().byId('rfs').setIconColor("Neutral");
			that.getView().byId('ssc').setEnabled(true); 
			that.getView().byId('ssc').setIconColor("Neutral");
			that.getView().byId('rep').setEnabled(true);
			that.getView().byId('rep').setIconColor("Neutral");
		}
		
		var requesterModel =new sap.ui.model.json.JSONModel();
        requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
    	that.getView().setModel(requesterModel,"requesterModel");
			  if(requesterModel.getData().userType=="INTERNAL"){
				  that.getView().byId("kaustuser").setVisible(true);
					that.getView().byId("nonkaustuser").setVisible(false);
				}else if(requesterModel.getData().userType=="RPT"){
					that.getView().byId("kaustuser").setVisible(false);
					that.getView().byId("nonkaustuser").setVisible(true);
					that.getView().byId("rptPktId").setVisible(true);
					that.getView().byId("pidrpt").setVisible(true);
					that.getView().byId("krptsec").setVisible(true);
					that.getView().byId("iskrpt").setVisible(true);
					that.getView().byId('iskrpt').setSelected(true);
				}else if(requesterModel.getData().userType=="EXTERNAL"){
					that.getView().byId("kaustuser").setVisible(false);
					that.getView().byId("nonkaustuser").setVisible(true);
					that.getView().byId("rptPktId").setVisible(false);
					that.getView().byId("pidrpt").setVisible(false);
					that.getView().byId("krptsec").setVisible(false);
					that.getView().byId("iskrpt").setVisible(false);
				}else{
					sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					return;
				}
				
//			  	that.getView().byId("kaustuser").setVisible(true);
//				that.getView().byId("nonkaustuser").setVisible(false);
			var labKey = oDBModel.getData().requestHeaderDto.labId;
			var labName = oDBModel.getData().requestHeaderDto.labDesc;
				if(labKey!="CWS"){
					var sampTypeData= oDBModel.getData().sampleDto.sampleTypeDtos;
					var sampleSize=sampTypeData.length;
					for(var i=0;i<sampleSize;i++){
						if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="true"){
							oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=true;
						}
						else if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="false"){
							oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=false;
							}
						}
					if(oDBModel.getData().serviceAreaDto.requestedCompletionDate){
						 var saDate = new Date(oDBModel.getData().serviceAreaDto.requestedCompletionDate); 
						  that.getView().byId("reqcompdate").setDateValue(saDate); 
						}
					if(oDBModel.getData().sampleDto.isReturnSamples=="true"||oDBModel.getData().sampleDto.isReturnSamples==true){
						oDBModel.getData().sampleDto.isReturnSamples=true;
					}else{
						oDBModel.getData().sampleDto.isReturnSamples=false;
					}
					if(oDBModel.getData().serviceAreaDto.aimOfStudy){
						that.getView().byId("studyaimtext").setValue(oDBModel.getData().serviceAreaDto.aimOfStudy);
						that.getView().byId("studyaimtext").setTooltip(oDBModel.getData().serviceAreaDto.aimOfStudy);
					}
					if(oDBModel.getData().serviceAreaDto.expectedData){
						that.getView().byId("expdatatext").setValue(oDBModel.getData().serviceAreaDto.expectedData);
						that.getView().byId("expdatatext").setTooltip(oDBModel.getData().serviceAreaDto.expectedData);
					}
					if(oDBModel.getData().serviceAreaDto.method){
						that.getView().byId("methodtext").setValue(oDBModel.getData().serviceAreaDto.method);
						that.getView().byId("methodtext").setTooltip(oDBModel.getData().serviceAreaDto.method);
					}
					if(oDBModel.getData().sampleDto.sampleDataSpecifications){
						that.getView().byId("samData").setValue(oDBModel.getData().sampleDto.sampleDataSpecifications);
						that.getView().byId("samData").setTooltip(oDBModel.getData().sampleDto.sampleDataSpecifications);
					}
					if(oDBModel.getData().sampleDto.specificInstruction){
						that.getView().byId("samInst").setValue(oDBModel.getData().sampleDto.specificInstruction);
						that.getView().byId("samInst").setTooltip(oDBModel.getData().sampleDto.specificInstruction);
					}
				}else{
						that.getView().byId("idIcon").getItems()[2].setVisible(false);
						that.getView().byId("idIcon").getItems()[3].setVisible(false);
						if(oDBModel.getData().serviceAreaDto.requestedCompletionDate){
							 var saDate = new Date(oDBModel.getData().serviceAreaDto.requestedCompletionDate);   
							 that.getView().byId("reqDateCws").setDateValue(saDate); 
						}
						if(oDBModel.getData().serviceAreaDto.isDesignAttached=="true"||oDBModel.getData().serviceAreaDto.isDesignAttached==true){
							oDBModel.getData().serviceAreaDto.isDesignAttached=true;
						}else{
							oDBModel.getData().serviceAreaDto.isDesignAttached=false;
						}
						if(oDBModel.getData().serviceAreaDto.isDesignApprovedByPI=="true"||oDBModel.getData().serviceAreaDto.isDesignApprovedByPI==true){
							oDBModel.getData().serviceAreaDto.isDesignApprovedByPI=true;
						}else{
							oDBModel.getData().serviceAreaDto.isDesignApprovedByPI=false;
						}
						if(oDBModel.getData().serviceAreaDto.desc){
							that.getView().byId("desFabTestMeasCalib").setValue(oDBModel.getData().serviceAreaDto.desc);
							that.getView().byId("desFabTestMeasCalib").setTooltip(oDBModel.getData().serviceAreaDto.desc);
						}
				}
			
				that.getView().setModel(oDBModel,"oDBModel");
				that.getView().byId('labName').setText("REQUEST FOR SERVICE Core Labs and Major Facilities :" + " " +labName);
				if(labKey=="ACL"){
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="IAC"){
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="NFTF"){
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="BCL"){
					that.getView().byId('bsbeSample1').setVisible(true);
					that.getView().byId('bsbeSample2').setVisible(true);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="CWS"){
					that.getView().byId("idIcon").getItems()[2].setVisible(false);
					that.getView().byId("idIcon").getItems()[3].setVisible(false);  
					that.getView().byId("cwsServ1").setVisible(true);
					that.getView().byId("cwsServ2").setVisible(true);
					that.getView().byId("cwsServ3").setVisible(true);
					that.getView().byId("exCws1").setVisible(false);
					that.getView().byId("exCws2").setVisible(false);
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("cwsBd").setVisible(true);
					that.getView().byId("exCwsBd").setVisible(false);
					}
				else{
					that.getView().byId('bsbeSample1').setVisible(false);
					that.getView().byId('bsbeSample2').setVisible(false);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ1").setVisible(false);
					that.getView().byId("cwsServ2").setVisible(false);
					that.getView().byId("cwsServ3").setVisible(false);
					that.getView().byId("exCws1").setVisible(true);
					that.getView().byId("exCws2").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
				}
		    	
		    	// Getting PI details
		    	if(oDBModel.getData().requestHeaderDto.authPerOrPiId){
		    		var gwPIModel = new sap.ui.model.json.JSONModel();
		    		gwPIModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.authPerOrPiId,null,false);
		    		that.getView().setModel(gwPIModel,"gwPIModel");
		    	}
		    	that.disableAllRfsFields();
		    	rfsFormTaskModel.setData();
				dSampleDocModel.setData();
				that.readSvcAreaTableData();
				that.readSmpSecTableData();
				that.attachReadOnly();
		}
	},	
	
	
	 openDialog:function(evt){
		var that=this;
		if(that.getView().getModel("oReadCustomerModel")){
			that.getView().getModel("oReadCustomerModel").setData();
		}
		if (!that.custAccDialog) {
			that.custAccDialog = sap.ui.xmlfragment("corelabs.fragments.customerAccount", this);
			that.getView().addDependent(this.custAccDialog);
			that.custAccDialog.addStyleClass("sapUiSizeCompact");
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
	
	closeCustDialog:function(evt){
		evt.getSource().getParent().getParent().getContent()[0].getHeaderToolbar().getContent()[0].getItems()[0].setValue("");
		evt.getSource().getParent().getParent().getContent()[0].getHeaderToolbar().getContent()[0].getItems()[1].setValue("");
		evt.getSource().getParent().getParent().getContent()[0].getHeaderToolbar().getContent()[0].getItems()[2].setValue("");
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
	
	selectPI : function(evt){
		var that = this;
		var piId= evt.getParameters().selectedItem.getKey();
		var gwPIModel = new sap.ui.model.json.JSONModel();
		gwPIModel.loadData("/utilweb/rest/user/auth/read/"+piId,null,false);
		that.getView().setModel(gwPIModel,"gwPIModel");
		evt.getSource().setValueState("None");
		evt.getSource().setValue(evt.getParameters().selectedItem.getText());
	},
	
	
	completeSuppTask: function(){
		var that = this;
		var taskData = that.getView().getModel("taskJsonModel").getData();
		var msg ="Task successfully submitted";
		that.completeTask(taskData,msg);
	},
	
	completeTask : function(taskData,msg){
		var that=this;
		 var outputData={};
		  outputData.DO_RFS=taskData;
		  var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true);
		  if(that.busyDialog){
				that.busyDialog.open();
		  }
		  taskDataODataModel.create("/OutputData",outputData,null,
				  function(oData){
			  sap.ui.commons.MessageBox.show(msg,sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
						function(){
				  callCloseDialog();
				});
			 
		  },function(oError){
			  sap.ui.commons.MessageBox.show("Task already submitted",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		  });
	},
	
	// for Master Admin 'Acc Verify task' with taskNo = 2
	/*maDocReqd : function(){
		var that = this;
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Pending Account Verification";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Submitted Successfully";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=3;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},*/
	
	commentTask1 : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('comm1').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}else{
			var dbData = that.getView().getModel("oDBModel").getData();
			var data = that.getView().getModel("taskJsonModel").getData();
			dbData.requestHeaderDto.masterAdminComment=comments;
			dbData.requestHeaderDto.statusDesc="Pending Account Verification";
			
			var loggedUserMdl = new sap.ui.model.json.JSONModel();
			var loginPayload ={
					   "loggedInUser" : "true"
					};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			loggedUserMdl.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
			
			if(dbData.commentList == undefined){
				var commentList = [];
				commentList.push({
				     "commentedByUserId": loggedUserMdl.getData().userId,
				     "commentedByUserNm": loggedUserMdl.getData().displayNm,
				     "desc": comments,
				     "taskNo": data.taskNo
				   });
				dbData.commentList = commentList;
			}else{
				if(!(dbData.commentList instanceof Array)){
					dbData.commentList = [dbData.commentList];
				}
				dbData.commentList.push({
				     "commentedByUserId": loggedUserMdl.getData().userId,
				     "commentedByUserNm": loggedUserMdl.getData().displayNm,
				     "desc": comments,
				     "taskNo": data.taskNo
				   });
			}
			
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Document request submitted";
				data.uiActionNo=3;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	maDocReqd: function(){
		var that = this;
		if (!that.commDialog1) {
			that.commDialog1 = sap.ui.xmlfragment("corelabs.fragments.commentBox1", this);
			that.getView().addDependent(this.commDialog1);
			that.commDialog1.addStyleClass("sapUiSizeCompact");
		}
		that.commDialog1.open();
	},
	
	closeCommDialog1 : function(oEvent){
		var that = this;
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.commDialog1.close();
	},
	
	maVerify : function(){
		var that = this;
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Account Verified";
		dbData.requestHeaderDto.custAcNo=that.getView().byId('nkAccno').getValue();
		dbData.isCustAcNoFlag = true;
		
		//isAccountVerified start - setting data in User DB 7
		if(!(that.getView().getModel("requesterModel").getData() && that.getView().getModel("requesterModel").getData().isAccountVerified == "true")){
			dbData.isAccountVerified = true;    // added for acc verification 17th jan
			dbData.isAccountVerifiedFlag = true;
		}
		//isAccountVerified start - setting data in User DB 7
		
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Verified successfully";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=1;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	//for Requester 'Doc Upload Confirm Task'  with taskNo = 3;
	uploadConfirm : function(){
		var that = this;
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Pending Account Verification";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Document upload confirmation submitted";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=1;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	pendingTask : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('taskapprComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}else{
			var dbData = that.getView().getModel("oDBModel").getData();
			var data = that.getView().getModel("taskJsonModel").getData();
			dbData.requestHeaderDto.labTeamLeadComment = comments;
			dbData.requestHeaderDto.statusDesc="Pending Sample/Design";   
			
			var loggedUserMdl = new sap.ui.model.json.JSONModel();
			var loginPayload ={
					   "loggedInUser" : "true"
					};
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			loggedUserMdl.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
			
			if(dbData.commentList == undefined){
				var commentList = [];
				commentList.push({
				     "commentedByUserId": loggedUserMdl.getData().userId,
				     "commentedByUserNm": loggedUserMdl.getData().displayNm,
				     "desc": comments,
				     "taskNo": data.taskNo
				   });
				dbData.commentList = commentList;
			}else{
				if(!(dbData.commentList instanceof Array)){
					dbData.commentList = [dbData.commentList];
				}
				dbData.commentList.push({
				     "commentedByUserId": loggedUserMdl.getData().userId,
				     "commentedByUserNm": loggedUserMdl.getData().displayNm,
				     "desc": comments,
				     "taskNo": data.taskNo
				   });
			}
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			that.pendingDialog.close();
			if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Inquiry submitted";
				data.uiActionNo=3;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	
	// for Lab Team Lead 'RFS Review Task'  with taskNo = 4;
	ltPendSam : function(oEvent){
		var that = this;
		if (!that.pendingDialog) {
			that.pendingDialog = sap.ui.xmlfragment("corelabs.fragments.apprCommentBox", this);
			that.getView().addDependent(this.pendingDialog);
			that.pendingDialog.addStyleClass("sapUiSizeCompact");
		}
		 this.pendingDialog.open();
		//db save for (comments)
//		that.pendingTask(oEvent, that);
		/*var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Sample Pending";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=3;
			that.completeTask(data);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}*/
	},
	
	closeDialog : function(oEvent){
		var that = this;
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.pendingDialog.close();
	},
	
	close: function(oEvent){
		var that= this;
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.rejectDialog.close();
		},
	
	ltReject : function(oEvt){
		//oEvt.getSource().getId().split("--")[1]
		var that = this;
		if(!that.rejectDialog){
			that.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.rejectTaskComm", this);
			that.getView().addDependent(this.rejectDialog);
			that.rejectDialog.addStyleClass("sapUiSizeCompact");
		}
		that.rejectDialog.open();
	},
	
	toReject : function(){
		var that = this;
		var comments = sap.ui.getCore().byId('taskRejectionComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		var data = that.getView().getModel("taskJsonModel").getData();
		dbData.requestHeaderDto.labTeamLeadComment = comments;
		dbData.requestHeaderDto.statusDesc="RFS Rejected";
		
		var loggedUserMdl = new sap.ui.model.json.JSONModel();
		var loginPayload ={
				   "loggedInUser" : "true"
				};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		loggedUserMdl.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
		
		if(dbData.commentList == undefined){
			var commentList = [];
			commentList.push({
			     "commentedByUserId": loggedUserMdl.getData().userId,
			     "commentedByUserNm": loggedUserMdl.getData().displayNm,
			     "desc": comments,
			     "taskNo": data.taskNo
			   });
			dbData.commentList = commentList;
		}else{
			if(!(dbData.commentList instanceof Array)){
				dbData.commentList = [dbData.commentList];
			}
			dbData.commentList.push({
			     "commentedByUserId": loggedUserMdl.getData().userId,
			     "commentedByUserNm": loggedUserMdl.getData().displayNm,
			     "desc": comments,
			     "taskNo": data.taskNo
			   });
		}
		
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Rejected";
			data.uiActionNo=2;
			that.completeTask(data,msg);
			sap.ui.getCore().byId('taskRejectionComm').setValue("");
			that.rejectDialog.close();
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	ltApprove : function(){
		var that=this;
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Scope and Charges Review";     //"Approved";  //Scope and Charges Review
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			that.getView().byId('ssc').setEnabled(true);
			that.getView().byId('ssc').setIconColor("Positive");
			that.getView().byId('headerTab').setSelectedKey("SSC");
			that.getView().byId('rfs').setIconColor("Neutral");
			that.getView().byId('ltRfsRev').setVisible(false);
			that.getView().byId('ltRfsRev1').setVisible(false);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	//'Sample/Design Upload Confirm Task' for Requester with taskNo = 5;
	samDesUploadConf : function(oEvent){
		var that =this;
		var tabBar = that.getView().byId("idIcon");
		var selectedTab = tabBar.getSelectedKey();
		var buttonText = oEvent.getSource().getText();
		var valueLab= that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		switch(selectedTab){
		case "Tab1": tabBar.setSelectedKey("Tab2");
			that.getView().byId("samUpPrev").setEnabled(true);
			if(valueLab=="CWS"){
				oEvent.getSource().setText("Sample/Design Upload Confirm");
				}
			that.getView().getContent()[0].scrollTo(1000);
			return;
			break;
		case "Tab2":
			if(valueLab=="CWS"){
				var uiAction = 1;
				var data = that.getView().getModel("taskJsonModel").getData();
				that.validateFieldsForSamUP(data);
			}else{
				tabBar.setSelectedKey("Tab3");
				that.getView().getContent()[0].scrollTo(1000);
				return;
			}
			break;
		case "Tab3":tabBar.setSelectedKey("Tab4");
			oEvent.getSource().setText("Sample/Design Upload Confirm");
			return;
			break;
		case "Tab4":
			var uiAction = 1;
			var data = that.getView().getModel("taskJsonModel").getData();
			that.validateFieldsForSamUP(data);
			return;
			break;
		}
		
		
		
		/*var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Sample/Design Upload Confirmed";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Sample/Design upload confirmation submitted";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=1;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}*/
	},

	validateFieldsForSamUP : function(data){
		var that=this;
		var bValidate=false;
		var aId;
		//var taskData = that.getView().getModel("taskJsonModel").getData();
		var today= new Date();
		today.setHours(0,0,0,0);
		var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		if(labKey!="CWS"){
			if(that.getView().byId('reqcompdate').getDateValue() && that.getView().byId('reqcompdate').getDateValue() < today){
			sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			that.getView().byId('idIcon').setSelectedKey("Tab2");
			that.getView().getContent()[0].scrollTo(1000);
			return;
			}
		}else{
			if(that.getView().byId('reqDateCws').getDateValue() && that.getView().byId('reqDateCws').getDateValue() < today){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				that.getView().byId('idIcon').setSelectedKey("Tab2");
				that.getView().getContent()[0].scrollTo(1000);
				return;
			}
		}
		if(data.userTypeNo==1){
			if( labKey=="CWS"){
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else if (data.userTypeNo==2){
			if( labKey=="CWS"){
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else{
			if(labKey=="CWS"){
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}
		var aIdLen=aId.length;
		var tab=null;
		for(var i=0;i<aIdLen;i++){
			var oControl = that.getView().byId(aId[i][0]);
			if(oControl.getValue()==""||oControl.getValue()==null||oControl==undefined){
				oControl.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field cannot be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				bValidate=false;
				if(tab && aId[i][1] === "2"){
					break;
					}
				tab= aId[i][1];
				break;
			}else{
				if(oControl.getValueState() === "Error"  && oControl.getMetadata().getName()==="sap.m.DatePicker"){
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
			var valueLab= that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
			if(valueLab=="CWS" && tab==="2"){
				that.getView().byId("samUpNext").setText("Sample/Design Upload Confirm");
			}else{
				that.getView().byId("samUpNext").setText("Next");
				that.getView().byId("samUpNext").setWidth("120px");
			}
			if(tab === "1"){
				that.getView().byId("samUpPrev").setEnabled(false);
			}
		}
		if(bValidate==true){
			var dbData=that.getUIData();
			dbData.requestHeaderDto.statusDesc="Sample/Design Upload Confirmed";
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Sample/Design upload confirmation submitted";
				data.uiActionNo=1;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	
	disableAllRfsFields: function(){
		var that=this;
		that.getView().byId("pidcb").setEnabled(false);
		that.getView().byId("pidrpt").setEnabled(false);
		that.getView().byId("servarcb").setEnabled(false);
		that.getView().byId("reqcompdate").setEnabled(false);
		that.getView().byId("cws_combobox").setEnabled(false);
		that.getView().byId("reqDateCws").setEnabled(false);
		
		that.getView().byId("desatt").setEnabled(false);
		that.getView().byId("desappbypi").setEnabled(false);
		that.getView().byId("desFabTestMeasCalib").setEditable(false);
		
		that.getView().byId("cwsSA").setEnabled(false);
		that.getView().byId("studyaimtext").setEditable(false);
		that.getView().byId("expdatatext").setEditable(false);
		that.getView().byId("methodtext").setEditable(false);
		that.getView().byId("fileUploaderTask").setEnabled(false);
		that.getView().byId("saFupBtn").setEnabled(false);
		that.getView().byId("samNo").setEnabled(false);
		that.getView().byId("samOrg").setEditable(false);
		that.getView().byId("samNm").setEditable(false);
		that.getView().byId("samData").setEditable(false);
		that.getView().byId("samData").setPlaceholder("");
		that.getView().byId("samInst").setEditable(false);
		that.getView().byId("samInst").setPlaceholder("");
		that.getView().byId("sampleFileUploaderTask").setEnabled(false);
		that.getView().byId("ssFupBtn").setEnabled(false);
		that.getView().byId("samDelMode").setEnabled(false);
		that.getView().byId("samDelMode").setPlaceholder("");
		that.getView().byId("otherMthd").setPlaceholder("");
		that.getView().byId("retSam").setEnabled(false);
		that.getView().byId("repType").setEnabled(false);
		that.getView().byId("repType").setPlaceholder("");
		var sampleTypeCb=that.getView().byId("sthbox").getContent();
		for(var j=0;j<sampleTypeCb.length;j++){
			sampleTypeCb[j].setEnabled(false);
		}
	},
	
	disableAllBtns : function(){
		var that=this;
		that.getView().byId('requsterDraft').setVisible(false);
		that.getView().byId('maAccVerify').setVisible(false);
		that.getView().byId('rtUpConf').setVisible(false);
		that.getView().byId('ltRfsRev').setVisible(false);
		that.getView().byId('rtSamUpConf').setVisible(false);
		
		/*that.getView().byId('dirRev').setVisible(false);
		that.getView().byId('ltSscRev').setVisible(false);
		that.getView().byId('rtSscAcceptance').setVisible(false);   8th task
		that.getView().byId('ltSscRej').setVisible(false);       	 9
		that.getView().byId('piAuthPer').setVisible(false);
		that.getView().byId('ltLmSel').setVisible(false);
		that.getView().byId('maSlaPayVer').setVisible(false);
		that.getView().byId('ltPayDocUpConf').setVisible(false);
		that.getView().byId('lmFrfs').setVisible(false);			14
		that.getView().byId('rtSamResub').setVisible(false);
		that.getView().byId('rtRepAcceptance').setVisible(false);
		that.getView().byId('lmRfsClosure').setVisible(false);
		that.getView().byId('lmSamReturn').setVisible(false);
		that.getView().byId('clcInvoice').setVisible(false);*/
	},
	
	/*cwsSA : function(oEvt){
		var that = this;
		that.getView().byId('cwsSA').setValue("");
		that.getView().byId('cwsSA').clearSelection();
		var workShop = oEvt.getSource().getValue();
		var saCwsModel = new sap.ui.model.json.JSONModel();
		if(oEvt!=""){
			//that.getView().byId('cwsSA').setEnabled(true);
		saCwsModel.loadData("/kclrfs/rest/brm/serviceArea/CWS/"+workShop,null,false);
		that.getView().byId('cwsSA').setModel(saCwsModel);
		}
		else{
			//that.getView().byId('cwsSA').setEnabled(false);
		}
		that.getView().byId('cwsSA').setValueState("None");
	},*/
	
	check : function (){
		/*var that =sap.ui.getCore();
		var viewId="";
		that.byId('rep').setIconColor("Neutral");
		that.byId('feedbc').setEnabled(true);
		that.byId('feedbc').setIconColor("Positive");
		that.byId('headerTab').setSelectedKey("FEED");
		sap.ui.getCore().byId("idRFS--rep")
		var that=this;*/
		var that =sap.ui.getCore();
		that.byId("idRFS--rep").setIconColor("Neutral");
		that.byId("idRFS--feedbc").setEnabled(true);
		that.byId("idRFS--feedbc").setIconColor("Positive");
		that.byId("idRFS--headerTab").setSelectedKey("FEED");
	},
	
	backToReport : function(){
		var that = this;
		that.oRouter.navTo("Report");
	},
	
	downloadPDF: function(oEvent){
		var that = this;
		var rfsno = that.getView().byId("rfsNo").getText();
		var getSessionUrl = "/kclrfs/rest/rfs/pdfSession/" + rfsno;
		var oPdfSessionModel = new sap.ui.model.json.JSONModel();
		oPdfSessionModel.loadData(getSessionUrl, null, false);
		if (oPdfSessionModel.getData()) {
			if(oPdfSessionModel.getData().status ==="SUCCESS"){
				var url = "/kclrfs/generateRFSPdf";
				window.open(url);
			}else{
				//console.log(oPdfSessionModel.getData().message);
				sap.ui.commons.MessageBox.show(oPdfSessionModel.getData().message,sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	/*readTableData:function(evt){
		var that=this;
		var rfsno=that.getView().byId("rfsNo").getText();
		var userId=loggedinUserModel.getData().userId;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var readDocPayload={
				"businessDocType":"1",
				"operationId":userId,
				"operationName":rfsno
				};
				var rfsFormTaskModel=new sap.ui.model.json.JSONModel();
				rfsFormTaskModel.loadData("/cc_ecm/file/readDocuments",JSON.stringify(readDocPayload),false,"POST",false,false,oHeader);
				if(rfsFormTaskModel.getData()){

					if(rfsFormTaskModel.getData().documentManagerDtoList==undefined)
					{
						rfsFormTaskModel.getData().documentManagerDtoList=[];
					}
					var oTable = that.getView().byId("idMyAttchmentTbl");
  					oTable.setModel(rfsFormTaskModel,"rfsFormTaskModel");
  					rfsFormTaskModel.refresh();
				}
	},*/
	
	readSvcAreaTableData:function(evt){
		var that=this;
		var rfsno=that.getView().byId("rfsNo").getText();
		var userId=loggedinUserModel.getData().userId;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var readDocPayload={
				"businessDocType":"1",
//				"operationId":userId,
				"operationName":rfsno
				};
//				var rfsFormTaskModel=new sap.ui.model.json.JSONModel();
				rfsFormTaskModel.loadData("/cc_ecm/file/readDocuments",JSON.stringify(readDocPayload),false,"POST",false,false,oHeader);
				if(rfsFormTaskModel.getData()){
					if(rfsFormTaskModel.getData().documentManagerDtoList==undefined){
						rfsFormTaskModel.getData().documentManagerDtoList=[];
					}
					else if (rfsFormTaskModel.getData() && rfsFormTaskModel.getData().documentManagerDtoList && (!(rfsFormTaskModel.getData().documentManagerDtoList instanceof Array))) {
						rfsFormTaskModel.getData().documentManagerDtoList=[rfsFormTaskModel.getData().documentManagerDtoList];
					}
					if(rfsFormTaskModel.getData().documentManagerDtoList!=undefined){
					var dtoList = rfsFormTaskModel.getData().documentManagerDtoList;
					var length = dtoList.length;
					for ( var i = 0; i < length; i++) {
						if (dtoList[i].createdDateValue != "") {
							dtoList[i].createdDateValue = getFormattedDate(new Date(dtoList[i].createdDateValue));
						}
					}
				}
				var oTable = that.getView().byId("idMyAttchmentTbl");
				oTable.setModel(rfsFormTaskModel,"rfsFormTaskModel");
				rfsFormTaskModel.refresh();
			}
	},
	
	readSmpSecTableData:function(evt){
		var that=this;
		var rfsno=that.getView().byId("rfsNo").getText();
		var userId=loggedinUserModel.getData().userId;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var readDocPayload={
				"businessDocType":"2",
//				"operationId":userId,
				"operationName":rfsno
				};
//				var dSampleDocModel=new sap.ui.model.json.JSONModel();
				dSampleDocModel.loadData("/cc_ecm/file/readDocuments",JSON.stringify(readDocPayload),false,"POST",false,false,oHeader);
				/*if(dSampleDocModel.getData()){
					if(dSampleDocModel.getData().documentManagerDtoList==undefined){
						dSampleDocModel.getData().documentManagerDtoList=[];
					}
					if (dSampleDocModel.getData() && dSampleDocModel.getData().documentManagerDtoList && (!(dSampleDocModel.getData().documentManagerDtoList instanceof Array))) {
						dSampleDocModel.getData().documentManagerDtoList=[dSampleDocModel.getData().documentManagerDtoList];
					}
					var oTable = that.getView().byId("sampleFileTable");
  					oTable.setModel(dSampleDocModel,"dSampleDocModel");
  					dSampleDocModel.refresh();
				}*/
				
				if(dSampleDocModel.getData().documentManagerDtoList==undefined){
					dSampleDocModel.getData().documentManagerDtoList=[];
				}
				else if (dSampleDocModel.getData()) {
					if (dSampleDocModel.getData() && dSampleDocModel.getData().documentManagerDtoList && (!(dSampleDocModel.getData().documentManagerDtoList instanceof Array))) {
						dSampleDocModel.getData().documentManagerDtoList=[dSampleDocModel.getData().documentManagerDtoList];
					}
					if(dSampleDocModel.getData().documentManagerDtoList!=undefined){	
					var dtoList = dSampleDocModel.getData().documentManagerDtoList;
					var length = dtoList.length;
					for ( var i = 0; i < length; i++) {
						if (dtoList[i].createdDateValue != "") {
							dtoList[i].createdDateValue = getFormattedDate(new Date(dtoList[i].createdDateValue));
						}
					}
				}
				var oTable = that.getView().byId("sampleFileTable");
				oTable.setModel(dSampleDocModel,"dSampleDocModel");
				dSampleDocModel.refresh();
			}
	},
	
	
	handleUploadPress:function(evt){
		var that=this;
		if(that.busyDialog){
			that.busyDialog.open();
		}
		//var fileUploadId=evt.getSource().getParent().getItems()[1].getId().split("--")[1];
		var fileUploadId = evt.getSource().getParent().getContent()[0].getId().split("--")[1];
			that.fileUpload(fileUploadId);
		/*else if(fileUploadId=="sampleFileUploaderTask")
		{
			that.sampleFileUpload();
		}*/
	},
	
	fileUpload : function(fileUploadId) {
		that = this;
		var pageId = this.getView().getId();
		if (document.getElementById(pageId+"--fileUploaderTask-fu")) {
			if (document.getElementById(pageId+"--fileUploaderTask-fu").files[0] != null) {
				var file = document.getElementById(pageId+"--fileUploaderTask-fu").files[0];
			}
		}
		else if (document.getElementById(pageId+"--sampleFileUploaderTask-fu")) {
			if (document.getElementById(pageId+"--sampleFileUploaderTask-fu").files[0] != null) {
				var file = document.getElementById(pageId+"--sampleFileUploaderTask-fu").files[0];
			}
		}
		if(file ==null){
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
					"Please select a document", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) { 
						// * do something 
						that.busyDialog.close();
						}
					}
			);
			return;
		}
		if (file.name.length > 75) {
			// sap.ui.getCore().byId("dialogUpload").close();
			sap.ui.commons.MessageBox.show(
					"File name too long",
					sap.ui.commons.MessageBox.Icon.WARNING,
					"Important Information",
					[ sap.ui.commons.MessageBox.Action.OK ],
					fnCallbackConfirm,
					sap.ui.commons.MessageBox.Action.OK);
			function fnCallbackConfirm() {
			}
			that.busyDialog.close();
			return;
		}
		// validating file size
		if (file && (file.size / 1024 / 1024) > 50) {
			sap.ui.commons.MessageBox.show(
					"Maximum file size is 50MB",
					sap.ui.commons.MessageBox.Icon.WARNING,
					"Important Information",
					[ sap.ui.commons.MessageBox.Action.OK ],
					fnCallbackConfirm,
					sap.ui.commons.MessageBox.Action.OK);
			function fnCallbackConfirm() {
			}
			that.busyDialog.close();
			return;
		}
		if (file && window.File && window.FileList && window.FileReader) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = function(evt) {
				var fileName = file.name;
				var byteArray2 = new Uint8Array(evt.target.result);
				var fileEncodedData = window.btoa(that.uint8ToString(byteArray2));
				var UniqueFileId = new Date().getTime();
				/*if(fileUploadId=="fileUploaderTask")
				{*/
					that.createFile("CLRFS_REQUEST", UniqueFileId,fileName, fileEncodedData,fileUploadId);
				/*}
				else if(fileUploadId=="sampleFileUploaderTask")
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
	
	createFile : function(applicationArea, UniqueFileId,fileName, file,fileUploadId) {
		var that=this;
		var fileUploadId=fileUploadId;
		var userId=loggedinUserModel.getData().userId;
		var rfsnum=that.getView().byId("rfsNo").getText();
		var sectionId;
			if(that.getView().byId("idIcon").getSelectedKey()=="Tab2"){
				sectionId="1";
			}else if(that.getView().byId("idIcon").getSelectedKey()=="Tab3"){
				sectionId="2";
			}
		
		var uploadPayload = {
			    "appName":applicationArea,
			    "folderName":rfsnum,
			    "file":file,
			    "fileName":fileName,
			    "operationId":userId,
			    "operationName":rfsnum,		//added this for rfs number
			    "businessDocType":sectionId,
			    "status":"ACTIVE"
		};

		var newFile = {};
		var uploadUrl="/cc_ecm/file/upload";
		$.ajax( {
			url : uploadUrl,
			type : "POST",
			async : true,
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
				newFile.createdDateValue=getFormattedDate(new Date(docManagerDto.createdDateValue));
				newFile.delFlag=false;
				
				if(newFile.status != null) {
	  				if (newFile.status == "SUCCESS") {
	  					if(fileUploadId=="fileUploaderTask"){
	  						var oTable = that.getView().byId("idMyAttchmentTbl");
	  						itemsLen=oTable.getItems().length;
	  						newFile.slno=itemsLen+1;
	  						//var serviceDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
	  						if(oTable.getModel("rfsFormTaskModel")==undefined){
	  							oTable.setModel(rfsFormTaskModel,"rfsFormTaskModel");
	  						if(oTable.getModel("rfsFormTaskModel").getData().documentManagerDtoList==undefined){
	  							oTable.getModel("rfsFormTaskModel").getData().documentManagerDtoList=[];
	  							}
	  						}
	  						oTable.getModel("rfsFormTaskModel").getData().documentManagerDtoList.push(newFile);
//		  					oTable.setModel(serviceDocModel,"serviceDocModel");
		  					oTable.getModel("rfsFormTaskModel").refresh();
	  					}else if(fileUploadId=="sampleFileUploaderTask"){
	  						var oTable = that.getView().byId("sampleFileTable");
	  						itemsLen=oTable.getItems().length;
	  						newFile.slno=itemsLen+1;
	  						//var sampleDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
	  						if(oTable.getModel("dSampleDocModel")==undefined){
	  							oTable.setModel(dSampleDocModel,"dSampleDocModel");
	  						if(oTable.getModel("dSampleDocModel").getData().documentManagerDtoList==undefined){
	  							oTable.getModel("dSampleDocModel").getData().documentManagerDtoList=[];
	  							}
	  						}
	  						oTable.getModel("dSampleDocModel").getData().documentManagerDtoList.push(newFile);
//		  					oTable.setModel(sampleDocModel,"sampleDocModel");
		  					oTable.getModel("dSampleDocModel").refresh();
	  					}
	  					sap.ui.commons.MessageBox.show("File uploaded successfully ", "SUCCESS", "Upload Success");
	  				}else{
	  					if(jqXHR.responseJSON && jqXHR.responseJSON.dbStatus){
		  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
		  					}else{
		  						sap.ui.commons.MessageBox.show("Error while uploading file", "ERROR", "Upload Error");
		  					}
	  				}
	  				that.getView().byId("fileUploaderTask").setValue("");
	  				that.getView().byId("sampleFileUploaderTask").setValue("");
	  			}else{
	  				if(jqXHR.responseJSON && jqXHR.responseJSON.dbStatus){
	  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
	  					}else{
	  						sap.ui.commons.MessageBox.show("Error while uploading file", "ERROR", "Upload Error");
	  					}
		  		}
				that.busyDialog.close();
			},
			error : function(data,jqXHR) {
				if(jqXHR.responseJSON && jqXHR.responseJSON.dbStatus){
  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
  					}else{
  						sap.ui.commons.MessageBox.show("Error while uploading file", "ERROR", "Upload Error");
  					}
				that.busyDialog.close();
			}
		});
	},
	
	openLink : function(oEvt){
		var that = this;
	},
	
	nameValidate : function(evt){
	    getTrimUiInputVal(evt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var name = evt.getSource().getValue();
		  var nameregex =  /^[a-zA-Z ]{2,30}$/;
		  evt.getSource().setValueState();
		    if (!nameregex.test(name)) {
		    	sap.ui.commons.MessageBox.show("Please enter proper data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		      evt.getSource().setValue("");
		      evt.getSource().setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	evt.getSource().setValueState(sap.ui.core.ValueState.None);
		    }
	},
	retSamDelMode : function(){
		var that = this;
		that.getView().byId("samDelMode").setValue("");
		that.getView().byId("samDelMode").clearSelection();
		that.getView().byId("samDelMode").setPlaceholder("Delivery Mode");
		that.getView().byId("otherMthd").setVisible(false);
		
		var isRetSam = that.getView().byId("retSam").getSelected();
		if(isRetSam){
			that.getView().byId("samDelMode").setEnabled(true);
		}else{
			that.getView().byId("samDelMode").setEnabled(false);
		}
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf corelabs.RFSForm
*/
	onBeforeRendering: function() {
		var that=this;
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf corelabs.RFSForm
*/
	onAfterRendering: function() {
		var that=this;
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
		if (!jQuery.support.touch||jQuery.device.is.desktop){
		(function($){
			$('input[type=file]').on('mousedown',function(event) {
			$(this).trigger('click');
			});
		})(window.jQuery);
		}
	}
	
/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf corelabs.RFSForm
*/
//	onExit: function() {
//
//	}
});
var rfsFormTaskModel=new sap.ui.model.json.JSONModel();
var dSampleDocModel=new sap.ui.model.json.JSONModel();


