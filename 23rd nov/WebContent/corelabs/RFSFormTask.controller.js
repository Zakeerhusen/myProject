jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.RFSFormTask", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf corelabs.RFSForm
*/
	onInit: function() {
		var that=this;
		if (!jQuery.support.touch||jQuery.device.is.desktop){
			this.getView().addStyleClass("sapUiSizeCompact");
			}
		
		if(!this.busyDialog){
		    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
		    this.getView().addDependent(this.busyDialog);
		    this.busyDialog.addStyleClass("sapUiSizeCompact");
	    }
		
		taskId=this.getTask();
		if(taskId!=""){
		this.claim(taskId);
		
		this.custAccDialog = sap.ui.xmlfragment("corelabs.fragments.customerAccount", this);
	    this.getView().addDependent(this.custAccDialog);
	    this.custAccDialog.addStyleClass("sapUiSizeCompact");
		
		this.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.rejectTaskComm", this);
	    this.getView().addDependent(this.rejectDialog);
	    this.rejectDialog.addStyleClass("sapUiSizeCompact");
		}else{
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("RFSFormTask").attachMatched(this._loadRFS, this);
			//adding the code for route pattern matched
			/*this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "RFSFormTask") {
				var data;
			}
			});*/
		}
		rfsFormTaskModel.setData();
		dSampleDocModel.setData();
		that.readSvcAreaTableData();
		that.readSmpSecTableData();
		that.attachReadOnly();
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
	
	_loadRFS : function(oEvt){
		var that = this;
		var rfsNo=oEvt.getParameter("arguments").id;
//		var rfsNo="1001600339";
		that.disableAllBtns();
		var oDBModel = new sap.ui.model.json.JSONModel();
		oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+rfsNo,null,false);
		
		 if(oDBModel.getData().requestHeaderDto){
			  var rfsDate = oDBModel.getData().requestHeaderDto.createdDate;      //requestHeaderDto.labId
			  that.getView().byId("rfsDate").setText(rfsDate.substr(8,2)+"/"+rfsDate.substr(5,2)+"/"+rfsDate.substr(0,4)); 
			  that.getView().byId('rfsStatus').setText(oDBModel.getData().requestHeaderDto.statusDesc);
			  that.getView().byId("backBtn").setVisible(true);
			  
			  }
			  that.getView().byId('rfsNo').setText(rfsNo);
		if(oDBModel.getData().serviceScopeDto){
				that.getView().byId('rfs').setIconColor("Neutral");
			  	that.getView().byId('ssc').setEnabled(true);
				that.getView().byId('ssc').setIconColor("Neutral");
			//	that.getView().byId('ca').setEnabled(true);
			//	that.getView().byId('ca').setIconColor("Neutral");
			} 
		if(oDBModel.getData().reportDto){
			that.getView().byId('rfs').setIconColor("Neutral");
			that.getView().byId('ssc').setEnabled(true); 
			that.getView().byId('ssc').setIconColor("Neutral");
		//	that.getView().byId('ca').setEnabled(true);
		//	that.getView().byId('ca').setIconColor("Neutral");
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
					that.getView().byId('iskrpt').setSelected(true);
				}else if(requesterModel.getData().userType=="EXTERNAL"){
					that.getView().byId("kaustuser").setVisible(false);
					that.getView().byId("nonkaustuser").setVisible(true);
					that.getView().byId("rptPktId").setVisible(false);
					
				}else{
					sap.ui.commons.MessageBox.show("Error while fetching Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
					return;
				}
				
//			  	that.getView().byId("kaustuser").setVisible(true);
//				that.getView().byId("nonkaustuser").setVisible(false);
			var labKey = oDBModel.getData().requestHeaderDto.labId;
				if(labKey!="CWS"){
					var sampTypeData= oDBModel.getData().sampleDto.sampleTypeDtos;
					var sampleSize=sampTypeData.length;
					for(var i=0;i<sampleSize;i++){
						if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="true")
						{
							oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=true;
						}
						else if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="false")
						{
							oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=false;
						}
						}
					if(oDBModel.getData().serviceAreaDto.requestedCompletionDate){
						 var saDate = new Date(oDBModel.getData().serviceAreaDto.requestedCompletionDate); 
						  that.getView().byId("reqcompdate").setDateValue(saDate); 
						}
				}else{
						if(oDBModel.getData().serviceAreaDto.requestedCompletionDate){
						 var saDate = new Date(oDBModel.getData().serviceAreaDto.requestedCompletionDate);   
						 that.getView().byId("reqDateCws").setDateValue(saDate); 
						}
				}
				
				if(oDBModel.getData().sampleDto.isReturnSamples=="true"||oDBModel.getData().sampleDto.isReturnSamples==true){
					oDBModel.getData().sampleDto.isReturnSamples=true;
				}else{
					oDBModel.getData().sampleDto.isReturnSamples=false;
				}
			
				that.getView().setModel(oDBModel,"oDBModel");
				
				if(labKey=="ACL"){
		        	that.getView().byId('labName').setText("Analytical Core Lab");
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					}
				else if(labKey=="IAC"){
					that.getView().byId('labName').setText("Imaging and Characterization");
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					}
				else if(labKey=="NFTF"){
					that.getView().byId('labName').setText("Nanofabrication and Thin Film");
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					}
				else if(labKey=="BCL"){
					that.getView().byId('labName').setText("Biosciences and Bioengineering");
					that.getView().byId('bsbeSample').setVisible(true);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					}
				else if(labKey=="CWS"){
					that.getView().byId('labName').setText("Central Workshops");
					that.getView().byId("idIcon").getItems()[2].setVisible(false);
					that.getView().byId("idIcon").getItems()[3].setVisible(false);  
					that.getView().byId("cwsServ").setVisible(true);
					that.getView().byId("exCws").setVisible(false);
					that.getView().byId('bsbeSample').setVisible(false);
					}
				else{
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
				}
		    	
		    	// Getting PI details
		    	if(oDBModel.getData().requestHeaderDto.authPerOrPiId){
		    		var gwPIModel = new sap.ui.model.json.JSONModel();
		    		gwPIModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.authPerOrPiId,null,false);
		    		that.getView().setModel(gwPIModel,"gwPIModel");
		    	}
		    	that.disableAllRfsFields();
	},	
	
	numberValidate:function(oEvt){
	var that =this;
	if(that.getView().byId("samNo").getEnabled()){
	var number = oEvt.getSource().getValue();
	var regex =  /^\d{1,3}$/;

	oEvt.getSource().setValueState();
	  if (!regex.test(number)) {
	  	sap.ui.commons.MessageBox.show("Invalid! Please Enter Numeric Value",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	    //alert("Invalid! Please Enter Proper Data");
	    oEvt.getSource().setValueState(sap.ui.core.ValueState.Error);
	    oEvt.getSource().setValue("");
	  }else{
	  	oEvt.getSource().setValueState(sap.ui.core.ValueState.None);
	  }
		}
	 },
	 
	 
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
							piId = "";
						}
		var hBoxItems=that.getView().byId("sthbox").getContent();
		var sampleTypeArr=[];
		for(var i=0;i<hBoxItems.length;i++)
		{
//			var obj={"text","status"};
			sampleTypeArr.push({"sampleType":hBoxItems[i].getText(),"sampleStatus":hBoxItems[i].getSelected()});
		}
		var serviceArea="";
		var workShop="";
		var reqComplDate="";
		var samDelMode="";
		
		var aimofstudy="",expectedData="",method="";
		var isDesignApprovedByPI=false,isDesignAttached=false,desc="";
		if(dbData.requestHeaderDto.labId=="CWS"){
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
		dbData.sampleDto.reportDesc=that.getView().byId("repType").getValue();
		dbData.sampleDto.numberOfSamples=that.getView().byId("samNo").getValue();
		dbData.sampleDto.sampleDataSpecifications=that.getView().byId("samData").getValue();
		dbData.sampleDto.sampleNm=that.getView().byId("samNm").getValue();
		dbData.sampleDto.sampleOrigin=that.getView().byId("samOrg").getValue();
		dbData.sampleDto.sampleTypeDtos=sampleTypeArr;
		dbData.sampleDto.specificInstruction=that.getView().byId("samInst").getValue();
		
		/*var dbData={
			"requestHeaderDto":{
		        "requestType":"test",
		        "requesterId":that.getView().getModel("oDBModel").getData().requestHeaderDto.requesterId,
		        "labId":that.getView().getModel("oDBModel").getData().requestHeaderDto.labId,
		        "requesterPocketId":pocketId,
		        "reqNo" : reqNo,
		        "authPerOrPiId":piId
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
		};*/
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
			return;
			}
		}else{
			if(that.getView().byId('reqDateCws').getDateValue() && that.getView().byId('reqDateCws').getDateValue() < today){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				return;
				}
		}
		var dbData=that.getUIData();
		dbData.requestHeaderDto.statusDesc="RFS Saved";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();   //Save data in  DB 
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			sap.ui.commons.MessageBox.show("RFS saved successfully",sap.ui.commons.MessageBox.Icon.SUCCESS,"Success","OK",
					function(){
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
		var taskData = that.getView().getModel("taskJsonModel").getData();
		if(taskData.userTypeNo==1){
			if( that.getView().getModel("oDBModel").getData().requestHeaderDto.labId=="CWS"){
				//aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","cws_combobox","reqDateCws","cwsSA","desFabTestMeasCalib"];
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				//aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
				aId=[["fnameipt","1"],["lnameipt","1"],["kidipt","1"],["emailipt","1"],["pidcb","1"],["pikidipt","1"],["pinameipt","1"],["piemailipt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else if (taskData.userTypeNo==2){
			if( that.getView().getModel("oDBModel").getData().requestHeaderDto.labId=="CWS"){
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","pidrpt","cws_combobox","reqDateCws","cwsSA","desFabTestMeasCalib"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","pidrpt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["pidrpt","1"],["servarcb","2"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}else{
			if(that.getView().getModel("oDBModel").getData().requestHeaderDto.labId=="CWS"){
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","cws_combobox","reqDateCws","cwsSA","desFabTestMeasCalib"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["cws_combobox","2"],["reqDateCws","2"],["cwsSA","2"],["desFabTestMeasCalib","2"]];
			}else{
				//aId=["nkfnameipt","nklnameipt","too","nkorgipt","nkteleipt","nkemailipt","reqcompdate","studyaimtext","expdatatext","methodtext"];
				aId=[["nkfnameipt","1"],["nklnameipt","1"],["too","1"],["nkorgipt","1"],["nkteleipt","1"],["nkemailipt","1"],["reqcompdate","2"],["studyaimtext","2"],["expdatatext","2"],["methodtext","2"]];
			}
		}
		
		/*if( that.getView().getModel("oDBModel").getData().requestHeaderDto.labId=="CWS"){         "nkAPname","nkAccno",
			aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","cws_combobox","cwsSA","reqDateCws","studyaimtext","expdatatext","methodtext"];
		}else{
			aId=["fnameipt","lnameipt","kidipt","emailipt","pikidipt","pinameipt","pidcb","piemailipt","servarcb","reqcompdate","studyaimtext","expdatatext","methodtext"];
		}*/
		//		var aProperties=["value"]; 
		var aIdLen=aId.length;
		var tab=null;
		for(var i=0;i<aIdLen;i++)
		{
			//var oControl = that.getView().byId(aId[i]);
			var oControl = that.getView().byId(aId[i][0]);
			if(oControl.getValue()==""||oControl.getValue()==null||oControl==undefined)
			{
				oControl.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field can not be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				bValidate=false;
				if(tab && aId[i][1] === "2"){
					break;
				}
				tab= aId[i][1];
				break;
			}
			else
			{
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
		if(bValidate==true)
			{
			var dbData=that.getUIData();
			dbData.requestHeaderDto.statusDesc="RFS Submitted";
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Submitted Successfully";
				data.uiActionNo=1;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	/*submit : function(){
		var that =this;
		var data = that.getView().getModel("taskJsonModel").getData();
		that.validateFields(data);
	},*/
	
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
				if(taskNo === 1){
					that.getView().byId("submitrfs").setText("Next");
				}else if(taskNo === 2){
					that.getView().byId("maAccVerify1").setVisible(false);
					that.getView().byId("maAccVerify").setVisible(true);
				}else if(taskNo === 3){
					that.getView().byId("rtUpConf1").setVisible(false);
					that.getView().byId("rtUpConf").setVisible(true);
				}else if(taskNo === 4){
					that.getView().byId("ltRfsRev1").setVisible(false);
					that.getView().byId("ltRfsRev").setVisible(true);
				}else if(taskNo === 5){
					that.getView().byId("rtSamUpConf1").setVisible(false);
					that.getView().byId("rtSamUpConf").setVisible(true);
				}
			}
			return;
			break;
		case "Tab3":tabBar.setSelectedKey("Tab2");
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
			return;
			break; 
		case "Tab2":tabBar.setSelectedKey("Tab3");
			
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
	
	//** Changes by Vinuta **//*
	handleTabSelect: function(oEvent){
		var that=this;
		var selectedTab = oEvent.getSource().getSelectedKey();
		var valueLab = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		var taskNo= that.getView().getModel("taskJsonModel").getData().taskNo;
		switch(selectedTab){
		case "Tab1": 
			if(taskNo === 1){
				that.getView().byId("btnPrev").setEnabled(false);
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
					that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
					that.getView().byId("ltRfsRev1").setVisible(true);
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
					that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
					that.getView().byId("ltRfsRev1").setVisible(false);
					that.getView().byId("ltRfsRev").setVisible(true);
				}else if(taskNo === 5){
					that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
					that.getView().byId("rtSamUpConf1").setVisible(false);
					that.getView().byId("rtSamUpConf").setVisible(true);
				}
			}
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
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
				that.getView().byId("ltRfsRev1").setVisible(false);
				that.getView().byId("ltRfsRev").setVisible(true);
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtSamUpConf1").setVisible(false);
				that.getView().byId("rtSamUpConf").setVisible(true);
			}
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
				that.getView().byId("ltRfsRevPrevBtn").setEnabled(true);
				that.getView().byId("ltRfsRev1").setVisible(true);
				that.getView().byId("ltRfsRev").setVisible(false);
			}else if(taskNo === 5){
				that.getView().byId("rtSamUpConfPrevBtn").setEnabled(true);
				that.getView().byId("rtSamUpConf1").setVisible(true);
				that.getView().byId("rtSamUpConf").setVisible(false);
			}
			break;
		}
	},
	submit : function(oEvent){
		var that =this;
		//** Changes by Vinuta **//*
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
			return;
			break;
		case "Tab2":
			if(valueLab=="CWS"){
				var uiAction = 1;
				var data = that.getView().getModel("taskJsonModel").getData();
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
			var data = that.getView().getModel("taskJsonModel").getData();
			that.validateFields(data);
			return;
			break;
		}
	
		
		
//		var data = that.getView().getModel("taskJsonModel").getData();
//		that.validateFields(data);
	},
	
	/*getData: function(uiAction){
		var loggedInUser = loggedinUserModel.getData();
		var data1={
		rfsNo : "test1",
		requesterUid : loggedInUser.userUniqueId,
		requesterNm : loggedInUser.displayNm,
		uiActionNo :uiAction,                           // 1 for submit/approve    2 for reject  -1 for save 3 - exta action (like pending sample)
		userTypeNo: 1,                     // 1 - internal 2- rpt   3-external
		isNewRequester:true,               // service from bhaskar 
		isAccountVerificationReqd:true,    // tbd
		isSlaVerificationReqd:true,       	//tbd
		isPiAuthPerReqd:true };				// from userData for ext by checkbox, internal if PI and user are same its false
		return data1;
	},*/
	
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
			        },  
			        function(oError) {
			        });   
	},
	
	readorUpdateTaskData : function(taskId){
		var that =this;
		
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var taskJsonModel= new sap.ui.model.json.JSONModel();
		var oDBModel = new sap.ui.model.json.JSONModel();
		
		var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
		var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
			taskDataODataModel.read("/InputData('"+taskId+"')/DO_RFS",null, null,false,
		  		function(oData,oRes){
					  taskJsonModel.setData(oData);
					  that.getView().setModel(taskJsonModel,"taskJsonModel");
					  var taskData =  taskJsonModel.getData(); 
					  oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+taskData.rfsNo,null,false);
					 
					  if(oDBModel.getData().requestHeaderDto){
					  var rfsDate = oDBModel.getData().requestHeaderDto.createdDate;      //requestHeaderDto.labId
					  //Deepak
					  if(rfsDate){
						  	 that.getView().byId("rfsDate").setText(rfsDate.substr(8,2)+"/"+rfsDate.substr(5,2)+"/"+rfsDate.substr(0,4)); 
						 
						  }   
//					  that.getView().byId("rfsDate").setText(rfsDate.substr(8,2)+"/"+rfsDate.substr(5,2)+"/"+rfsDate.substr(0,4)); 
					  that.getView().byId('rfsStatus').setText(oDBModel.getData().requestHeaderDto.statusDesc);
					  }
					  that.getView().byId('rfsNo').setText(taskData.rfsNo);
					  
					 				  
					  var labKey = oDBModel.getData().requestHeaderDto.labId;
			
						var rfsPocketIdModel = new sap.ui.model.json.JSONModel();
						that.getView().setModel(rfsPocketIdModel,"rfsPocketIdModel");
						
						var serviceAreaModel = new sap.ui.model.json.JSONModel();
						that.getView().byId('servarcb').setModel(serviceAreaModel);
			
						that.disableAllBtns();
						
						if(taskData.userTypeNo==1){
							that.getView().byId("kaustuser").setVisible(true);
							that.getView().byId("nonkaustuser").setVisible(false);
						}else if(taskData.userTypeNo==2){
							that.getView().byId("kaustuser").setVisible(false);
							that.getView().byId("nonkaustuser").setVisible(true);
							that.getView().byId("rptPktId").setVisible(true);
							
							/*var orgTypeModel = new sap.ui.model.json.JSONModel(); 
							orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
							this.getView().setModel(orgTypeModel,"orgTypeModel");*/
						}else if(taskData.userTypeNo==3){
							that.getView().byId("kaustuser").setVisible(false);
							that.getView().byId("nonkaustuser").setVisible(true);
							that.getView().byId("rptPktId").setVisible(false);
							
							/*var orgTypeModel = new sap.ui.model.json.JSONModel(); 
							orgTypeModel.loadData("/kclrfs/rest/brm/organization",null,false);
							that.getView().setModel(orgTypeModel,"orgTypeModel");*/
						}else{
							sap.ui.commons.MessageBox.show("Error while fetching Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
							return;
						}
						
						if(labKey!="CWS"){
							var sampTypeData= oDBModel.getData().sampleDto.sampleTypeDtos;
							var sampleSize=sampTypeData.length;
							for(var i=0;i<sampleSize;i++){
								if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="true")
								{
									oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=true;
								}
								else if(oDBModel.getData().sampleDto.sampleTypeDtos[i].sampleStatus=="false")
								{
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
						serviceAreaModel.loadData("/kclrfs/rest/brm/serviceArea/"+labKey,null,false);
						that.getView().byId('servarcb').setModel(serviceAreaModel);
						
						var repTypeModel = new sap.ui.model.json.JSONModel(); 
						repTypeModel.loadData("/kclrfs/rest/brm/reportArea",null,false);
						that.getView().setModel(repTypeModel,"repTypeModel");
						
						var delModeModel = new sap.ui.model.json.JSONModel(); 
						delModeModel.loadData("/kclrfs/rest/brm/sampleDeliveryMode",null,false);
						that.getView().setModel(delModeModel,"delModeModel");
						
				}else if(taskData.taskNo==2){
					that.getView().byId('maAccVerify').setVisible(true);
					that.getView().byId("nkAccno").setEnabled(true);
					that.disableAllRfsFields();
				}else if(taskData.taskNo==3){
					that.getView().byId('rtUpConf').setVisible(true);
					that.disableAllRfsFields();
					that.getView().byId("fileUploader").setEnabled(true);
					that.getView().byId("saFupBtn").setEnabled(true);
					that.getView().byId("sampleFileUploader").setEnabled(true);
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
						if(labKey=="BCL"||labKey=="CWS"){
							that.getView().byId('teamLeadPend').setVisible(true);
						}else{
							that.getView().byId('teamLeadPend').setVisible(false);
						}
					}
					that.disableAllRfsFields();
				}else if(taskData.taskNo==5){
					that.getView().byId('rtSamUpConf').setVisible(true);
					that.disableAllRfsFields();
					that.getView().byId("fileUploader").setEnabled(true);
					that.getView().byId("saFupBtn").setEnabled(true);
					that.getView().byId("sampleFileUploader").setEnabled(true);
					that.getView().byId("ssFupBtn").setEnabled(true);
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
					that.getView().byId("fileUploader").setEnabled(true);
					that.getView().byId("saFupBtn").setEnabled(true);
					that.getView().byId("sampleFileUploader").setEnabled(true);
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
				}		  
				else{
					that.disableAllRfsFields();
				}
			  
		        if(labKey=="ACL"){
		        	that.getView().byId('labName').setText("Analytical Core Lab");
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="IAC"){
					that.getView().byId('labName').setText("Imaging and Characterization");
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="NFTF"){
					that.getView().byId('labName').setText("Nanofabrication and Thin Film");
					that.getView().byId('bsbeSample').setVisible(false);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="BCL"){
					that.getView().byId('labName').setText("Biosciences and Bioengineering");
					that.getView().byId('bsbeSample').setVisible(true);
					that.getView().byId("idIcon").getItems()[2].setVisible(true);
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
					that.getView().byId("cwsBd").setVisible(false);
					that.getView().byId("exCwsBd").setVisible(true);
					}
				else if(labKey=="CWS"){
					that.getView().byId('labName').setText("Central Workshops");
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
					that.getView().byId("idIcon").getItems()[3].setVisible(true); 
					that.getView().byId("cwsServ").setVisible(false);
					that.getView().byId("exCws").setVisible(true);
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
		    	//bind pkt id's to checkbox
		    	
		      //  alert('data read successfully');
		        },function(oError){
  			sap.ui.commons.MessageBox.show("Error while fetching Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		        });	
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
	
	selectPI : function(evt){
		var that = this;
		var piId= evt.getParameters().selectedItem.getKey();
		var gwPIModel = new sap.ui.model.json.JSONModel();
		gwPIModel.loadData("/utilweb/rest/user/auth/read/"+piId,null,false);
		that.getView().setModel(gwPIModel,"gwPIModel");
		evt.getSource().setValueState("None");
		evt.getSource().setValue(evt.getParameters().selectedItem.getText());
	},
	
	compl: function(){
		var that = this;
		var taskData = that.getView().getModel("taskJsonModel").getData();
		that.completeTask(taskData);
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
	maDocReqd : function(){
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
	},
	
	maVerify : function(){
		var that = this;
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Account Verified";
		dbData.requestHeaderDto.custAcNo=that.getView().byId('nkAccno').getValue();
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Verified Successfully";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=1;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	//for Requester 'Doc Upload Confirm Task'  with taskNo = 3;
	uploadConfirm : function(){
		var that = this;
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Pending Account Verification";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Upload Confirmation Submitted";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=1;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
	
	//Deepak
	pendingTask : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('taskapprComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter Comments");
		}else{
			var dbData = that.getView().getModel("oDBModel").getData();
			dbData.requestHeaderDto.labTeamLeadComment = comments;
			dbData.requestHeaderDto.statusDesc="Pending Sample/Design";   //to be changed as per btn label - Rahul
			var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
			var oHeader= {"Content-Type":"application/json;charset=utf-8"};
			rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
			that.pendingDialog.close();
			if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var msg="Submitted for pending sample";
				var data = that.getView().getModel("taskJsonModel").getData();
				data.uiActionNo=3;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
	
	closeDialog : function(){
		var that = this;
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
		that.rejectDialog.open();
	},
	
	toReject : function(){
		var that = this;
		//db save for (comments)
		var comments = sap.ui.getCore().byId('taskRejectionComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			//alert("Please Enter Comments");
		}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.labTeamLeadComment = comments;
		dbData.requestHeaderDto.statusDesc="RFS Rejected";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Rejected";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=2;
			that.completeTask(data,msg);
			sap.ui.getCore().byId('taskRejectionComm').setValue("");
			that.rejectDialog.close();
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
		
		//db save and status to be udated
		
	},
	
	//'Sample/Design Upload Confirm Task' for Requester with taskNo = 5;
	samDesUploadConf : function(){
		var that =this;
		//db save for (comments)
		var dbData = that.getView().getModel("oDBModel").getData();
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
		}
	},

	
	
	disableAllRfsFields: function(){
		var that=this;
		that.getView().byId("pidcb").setEnabled(false);
		that.getView().byId("servarcb").setEnabled(false);
		that.getView().byId("reqcompdate").setEnabled(false);
		that.getView().byId("cws_combobox").setEnabled(false);
		that.getView().byId("reqDateCws").setEnabled(false);
		
		that.getView().byId("desatt").setEnabled(false);
		that.getView().byId("desappbypi").setEnabled(false);
		that.getView().byId("desFabTestMeasCalib").setEnabled(false);
		
		that.getView().byId("cwsSA").setEnabled(false);
		that.getView().byId("studyaimtext").setEnabled(false);
		that.getView().byId("expdatatext").setEnabled(false);
		that.getView().byId("methodtext").setEnabled(false);
		that.getView().byId("fileUploader").setEnabled(false);
		that.getView().byId("saFupBtn").setEnabled(false);
		that.getView().byId("samNo").setEnabled(false);
		that.getView().byId("samOrg").setEnabled(false);
		that.getView().byId("samNm").setEnabled(false);
		that.getView().byId("samData").setEnabled(false);
		that.getView().byId("samInst").setEnabled(false);
		that.getView().byId("sampleFileUploader").setEnabled(false);
		that.getView().byId("ssFupBtn").setEnabled(false);
		that.getView().byId("samDelMode").setEnabled(false);
		that.getView().byId("retSam").setEnabled(false);
		that.getView().byId("repType").setEnabled(false);
		var sampleTypeCb=that.getView().byId("sthbox").getContent();
		for(var j=0;j<sampleTypeCb.length;j++)
		{
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
	
	cwsSA : function(oEvt){
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
	},
	
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
				console.log(oPdfSessionModel.getData().message);
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

					/*if(rfsFormTaskModel.getData().documentManagerDtoList==undefined)
					{
						rfsFormTaskModel.getData().documentManagerDtoList=[];
					}*/
					if (rfsFormTaskModel.getData() && rfsFormTaskModel.getData().documentManagerDtoList && (!(rfsFormTaskModel.getData().documentManagerDtoList instanceof Array))) {
						rfsFormTaskModel.getData().documentManagerDtoList=[rfsFormTaskModel.getData().documentManagerDtoList];
					}
					var dtoList = rfsFormTaskModel.getData().documentManagerDtoList;
					var length = dtoList.length;
					for ( var i = 0; i < length; i++) {
						if (dtoList[i].createdDateValue != "") {
							dtoList[i].createdDateValue = that.getFormattedDate(new Date(dtoList[i].createdDateValue));
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

					if(dSampleDocModel.getData().documentManagerDtoList==undefined)
					{
						dSampleDocModel.getData().documentManagerDtoList=[];
					}
					if (dSampleDocModel.getData() && dSampleDocModel.getData().documentManagerDtoList && (!(dSampleDocModel.getData().documentManagerDtoList instanceof Array))) {
						dSampleDocModel.getData().documentManagerDtoList=[dSampleDocModel.getData().documentManagerDtoList];
					}
					var oTable = that.getView().byId("sampleFileTable");
  					oTable.setModel(dSampleDocModel,"dSampleDocModel");
  					dSampleDocModel.refresh();
				}*/
				
				if (dSampleDocModel.getData()) {
					
					if (dSampleDocModel.getData() && dSampleDocModel.getData().documentManagerDtoList && (!(dSampleDocModel.getData().documentManagerDtoList instanceof Array))) {
						dSampleDocModel.getData().documentManagerDtoList=[dSampleDocModel.getData().documentManagerDtoList];
					}
						
					var dtoList = dSampleDocModel.getData().documentManagerDtoList;
					var length = dtoList.length;
					for ( var i = 0; i < length; i++) {
						if (dtoList[i].createdDateValue != "") {
							dtoList[i].createdDateValue = that.getFormattedDate(new Date(dtoList[i].createdDateValue));
						}
					}
					
					var oTable = that.getView().byId("sampleFileTable");
  					oTable.setModel(dSampleDocModel,"dSampleDocModel");
  					dSampleDocModel.refresh();
				}
	},
	
	getFormattedDate:function(date) {
		  var year = date.getFullYear();
		  var month = (1 + date.getMonth()).toString();
		  month = month.length > 1 ? month : '0' + month;
		  var day = date.getDate().toString();
		  day = day.length > 1 ? day : '0' + day;
		  return day + '/' + month + '/' + year;
		  
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
		var rfsnum=that.getView().byId("rfsNo").getText();
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
				newFile.createdDateValue=that.getFormattedDate(new Date(docManagerDto.createdDateValue));
				newFile.delFlag=false;
				
				if(newFile.status != null) {
	  				if (newFile.status == "SUCCESS") {
	  					if(fileUploadId=="fileUploader"){
	  						var oTable = that.getView().byId("idMyAttchmentTbl");
	  						itemsLen=oTable.getItems().length;
	  						newFile.slno=itemsLen+1;
	  						//var serviceDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
	  						if(oTable.getModel("rfsFormTaskModel").getData().documentManagerDtoList==undefined)
	  						{
	  							oTable.getModel("rfsFormTaskModel").getData().documentManagerDtoList=[];
	  						}
	  						oTable.getModel("rfsFormTaskModel").getData().documentManagerDtoList.push(newFile);
//		  					oTable.setModel(serviceDocModel,"serviceDocModel");
		  					oTable.getModel("rfsFormTaskModel").refresh();
	  					}else if(fileUploadId=="sampleFileUploader"){
	  						var oTable = that.getView().byId("sampleFileTable");
	  						itemsLen=oTable.getItems().length;
	  						newFile.slno=itemsLen+1;
	  						//var sampleDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
	  						if(oTable.getModel("dSampleDocModel").getData().documentManagerDtoList==undefined)
	  						{
	  							oTable.getModel("dSampleDocModel").getData().documentManagerDtoList=[];
	  						}
	  						oTable.getModel("dSampleDocModel").getData().documentManagerDtoList.push(newFile);
//		  					oTable.setModel(sampleDocModel,"sampleDocModel");
		  					oTable.getModel("dSampleDocModel").refresh();
	  					}
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
	
	openLink : function(oEvt){
		var that = this;
	},
	
	nameValidate : function(evt){
		var name = evt.getSource().getValue();
		  var nameregex =  /^[a-zA-Z ]{2,30}$/;
		
		  evt.getSource().setValueState();
		    if (!nameregex.test(name)) {
		    	sap.ui.commons.MessageBox.show("Invalid! Please Enter Proper Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		      //alert("Invalid! Please Enter Proper Data");
		      evt.getSource().setValue("");
		      evt.getSource().setValueState(sap.ui.core.ValueState.Error);
		    }else{
		    	evt.getSource().setValueState(sap.ui.core.ValueState.None);
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
	}
	
//	onBeforeShow: function(){
//		alert("show");
//	}

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