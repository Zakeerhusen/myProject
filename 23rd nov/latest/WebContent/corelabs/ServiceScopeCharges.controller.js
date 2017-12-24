jQuery.sap.require("sap.ui.commons.MessageBox");
sap.ui.controller("corelabs.ServiceScopeCharges", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf kaust_corelabs.ServiceScopeCharges
*/
	
onInit: function () {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	var that =this;
    that.disableAllBtns();
	taskId=that.getTask();
	if(taskId!=""){
		this.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.sscRejTask", this);
	    this.getView().addDependent(this.rejectDialog);
	    this.rejectDialog.addStyleClass("sapUiSizeCompact");
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
	var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
		taskDataODataModel.read("/InputData('"+taskId+"')/DO_RFS?$expand=labTeamMemberUid",null, null,false,
	  		function(oData,oRes){
				  taskJsonModel.setData(oData);
				  that.getView().setModel(taskJsonModel,"taskJsonModel");
				  var taskData =  taskJsonModel.getData(); 
				  oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+taskData.rfsNo,null,false);
				  that.getView().setModel(oDBModel,"oDBModel");
				//to get the requester model for data binding
				  if(taskData.taskNo > 3){
				  var labKey = oDBModel.getData().requestHeaderDto.labId;
				  	if(labKey=="CWS"){
					  that.getView().byId('cws').setVisible(true);
					  that.getView().byId('noncws').setVisible(false);
					  var sscData =oDBModel.getData().serviceScopeDto;
					  if(sscData){
							that.getView().byId('cwsSerScope').setValue(sscData.finalScopeCharge);
							that.getView().byId('cwsSerScope').setTooltip(sscData.finalScopeCharge);
							var expDate = new Date(sscData.estCompletionDate); 
							that.getView().byId('dateP').setDateValue(expDate); 
							
							 /*if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMT instanceof Array)){
								 that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMT=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMT];
								}
							  var mtData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMT;
							  if(mtData && mtData.length>=1){
								 
								  that.getView().byId('mattable').bindItems("oDBModel>/estimatedServiceChargeDtoListMT",new sap.m.ColumnListItem({
										cells:[
											      new sap.m.Input({value : '{oDBModel>desc}'}),
											      new sap.m.Input({value : '{oDBModel>price}',type:'Number',maxLength:10,change:function(evt){that.numDecValidation(evt);},liveChange : function(oEvent){
											   		  that.CalculateTotal(oEvent);
											   	  }})
											      ]})  );
								  that.getView().byId('totmatchargeipt').setValue(oDBModel.getData().estimatedServiceChargeSubTotalMT);
							  }
							  
							  var mpData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListCWS_MP;
							  if(mpData && mpData.length>1){
								  var size=mpData.length;
								  that.getView().byId('mantable').bindItems("oDBModel>/estimatedServiceChargeDtoListCWS_MP",new sap.m.ColumnListItem({
										cells:[
											      new sap.m.Text({
											      			text :'{oDBModel>desc}'
											      			}),
											      new sap.m.Input({value : '{oDBModel>quantity}',type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
											   		  that.calculateSubTotal(oEvent);
											   	  }}),
											   	  new sap.m.Input({value : '{oDBModel>price}', type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);}, liveChange:function(oEvent){
											   		  that.calculateSubTotal(oEvent);
											   	  }}),
											   	  new sap.m.Input({value : '{oDBModel>uom}',enabled:false}),
											   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
											   		  that.CalculateTotal(oEvent);
											   	  },enabled:false})
											      ]}));  
								  that.getView().byId('totmanchargeipt').setValue(oDBModel.getData().estimatedServiceChargeSubTotalCWS_MP);
							  }
							  that.getView().byId('cwsTotalEstCharge').setValue(sscData.totalEstServiceCharge);*/
					  }
				  }else{
					  that.getView().byId('cws').setVisible(false);
					  that.getView().byId('noncws').setVisible(true);
					  var sscData =oDBModel.getData().serviceScopeDto;
					  if(labKey=="BCL"){
						  that.getView().byId('bclLab').setVisible(true);
					  	}
					  if(sscData){
						  if(sscData.isRoutineStandard=="true"){that.getView().byId('routine').setSelected(true);}
						  else{that.getView().byId('routine').setSelected(false);}
						  if(sscData.isAdvanceCustom=="true"){that.getView().byId('advCustom').setSelected(true);}
						  else{that.getView().byId('advCustom').setSelected(false);}
							that.getView().byId('sampleclfText').setValue(sscData.sampleClarification);
							that.getView().byId('methodappText').setValue(sscData.methodApplied);
							that.getView().byId('delivText').setValue(sscData.deliverable);
							that.getView().byId('samplelocText').setValue(sscData.storageLocation);
							
							that.getView().byId('sampleclfText').setTooltip(sscData.sampleClarification);
							that.getView().byId('methodappText').setTooltip(sscData.methodApplied);
							that.getView().byId('delivText').setTooltip(sscData.deliverable);
							that.getView().byId('samplelocText').setTooltip(sscData.storageLocation);
							
							 if(sscData.isIBECApprovalReqd=="true"){that.getView().byId('ibec').setSelected(true);}
							 else{that.getView().byId('ibec').setSelected(false);}
							 if(sscData.isMatTranAgreemntReqd=="true"){that.getView().byId('matTransport').setSelected(true);}
							 else{that.getView().byId('matTransport').setSelected(false);}
							 that.getView().byId('ncwstotalEstimatedCharge').setValue(sscData.totalEstServiceCharge);
							 var expDate = new Date(sscData.estCompletionDate);      
							 that.getView().byId('dateP').setDateValue(expDate); 
					  	}
					 }
				  	
				  	var requesterModel =new sap.ui.model.json.JSONModel();
					requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
					that.getView().setModel(requesterModel,"sscRequesterModel");
				  	
				  	if(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ){
				  		if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ instanceof Array)){
						that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ];
					}
				  	var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ;
				  		if(eqOrSamData && eqOrSamData.length>=1){
						  that.getView().byId('euipTable').bindItems("oDBModel>/estimatedServiceChargeDtoListEQ",new sap.m.ColumnListItem({
								cells:[
									      new sap.m.ComboBox({
									    	  width:"100%",
									    	  items:{
									    	  path:'oEqSamModel>/priceListItemDtoList',
									    	  template: new sap.ui.core.Item({
							 	                   	text:'{oEqSamModel>item}'
							 	                	   })
									      			},
									      			value : '{oDBModel>desc}',	
									      	selectionChange:function(oEvt){
												   		  that.getEqOrSmPrice(oEvt);
												   	  },tooltip:'{oDBModel>desc}'}).addStyleClass("tooltip"),
									      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
									   		  that.calculateSubTotal(oEvent);
									   	  }}),
									   	  new sap.m.Input({value : '{oDBModel>price}',liveChange:function(oEvent){
									   		  that.calculateSubTotal(oEvent);
									   	  },enabled:false}),
									   	  new sap.m.Input({value : '{oDBModel>uom}',editable:false,tooltip:'{oDBModel>uom}'}).addStyleClass("tooltip tooltipFontColor"),
									   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
									   		  that.CalculateTotal(oEvent);
									   	  },enabled:false})
									      ]
							})); 
						  
				//  that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM);
				 /* var eqItems = that.getView().byId('euipTable').getItems();
				  var tablesize= eqItems.length;
				  var datasize=eqOrSamData.length;
				  if(datasize==tablesize){
				  for(var i=0;i<datasize;i++){
					  if(eqOrSamData[i].type=="EQ"){
						  eqItems[i].getCells()[0].setValue("Equipment");
						  //that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM[i].type="";
					  }else if(eqOrSamData[i].type=="SM"){
						  //that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM[i].type="Sample/Consumables";
						  eqItems[i].getCells()[0].setValue("Sample/Consumables");
					  }
				  }
				  } */
				  		} 
				  	that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ);
				  }
				  	
				  if(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM){
					  	if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM instanceof Array)){
							that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM];
						}
					  var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM;
					  if(eqOrSamData && eqOrSamData.length>=1){
					  that.getView().byId('smTable').bindItems("oDBModel>/estimatedServiceChargeDtoListSM",new sap.m.ColumnListItem({
							cells:[
								      new sap.m.ComboBox({
								    	  width:"100%",
								    	  items:{
								    	  path:'oSamModel>/priceListItemDtoList',
								    	  template: new sap.ui.core.Item({
						 	                   	text:'{oSamModel>item}'
						 	                	   })
								      			},
								      			value : '{oDBModel>desc}',	
								      	selectionChange:function(oEvt){
											   		  that.getEqOrSmPrice(oEvt);
											   	  },tooltip:'{oDBModel>desc}'}).addStyleClass("tooltip"),
								      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
								   		  that.calculateSubTotal(oEvent);
								   	  }}),
								   	  new sap.m.Input({value : '{oDBModel>price}',liveChange:function(oEvent){
								   		  that.calculateSubTotal(oEvent);
								   	  },enabled:false}),
								   	  new sap.m.Input({value : '{oDBModel>uom}',editable:false,tooltip:'{oDBModel>uom}'}).addStyleClass("tooltip tooltipFontColor"),
								   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
								   		  that.CalculateTotal(oEvent);
								   	  },enabled:false})
								      ]})); 
					  		} 
					  that.getView().byId('ncwstotsmcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalSM);
					  	}
				  	/*if(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM){
				  		that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM);
				  	}*/
				  if(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMP){
					  var mpData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMP;
					  if(mpData && mpData.length>1){
						  var size=mpData.length;
						  that.getView().byId('mpTbl').bindItems("oDBModel>/estimatedServiceChargeDtoListMP",new sap.m.ColumnListItem({
							  cells:[
							      new sap.m.Text({
							      			text :'{oDBModel>desc}'
							      			}),
							      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
							   		  that.calculateSubTotal(oEvent);
							   	  }}),
							   	  new sap.m.Input({value : '{oDBModel>price}',enabled:false}),
							   	  new sap.m.Input({value : '{oDBModel>uom}',enabled:false}),
							   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
							   		  that.CalculateTotal(oEvent);
							   	  },enabled:false})
							      ]}));  
				  that.getView().byId('ncwsmptotalcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalMP);
			  	}
			  that.getView().byId('ncwstotalEstimatedCharge').setValue(sscData.totalEstServiceCharge);
			 }	 
				  
				 if(oDBModel.getData().serviceScopeDto && oDBModel.getData().serviceScopeDto.serviceScopeScientistList){
						 if(!(oDBModel.getData().serviceScopeDto.serviceScopeScientistList instanceof Array)){
							 oDBModel.getData().serviceScopeDto.serviceScopeScientistList=[oDBModel.getData().serviceScopeDto.serviceScopeScientistList];
						 }
						 var sciList="", scilistSize=oDBModel.getData().serviceScopeDto.serviceScopeScientistList.length; 
						 if(scilistSize>0){
						 for(var i=0;i<scilistSize;i++){
							  if(sciList==""){
								  sciList = oDBModel.getData().serviceScopeDto.serviceScopeScientistList[i].assignScientistNm;
							  }else{
								  sciList = sciList+", "+oDBModel.getData().serviceScopeDto.serviceScopeScientistList[i].assignScientistNm;
							  }
						  }
						  if(sciList!="null"){
							  that.getView().byId('mInp').setValue(sciList); 
						  }
						 }
					  }else{
					  that.readScientist();
				  }
				  	
				  if(oDBModel.getData().requestHeaderDto.labDirectorId && !(oDBModel.getData().requestHeaderDto.labDirectorId.indexOf("_")>-1)){
					  var dirNameModel =new sap.ui.model.json.JSONModel();
					  var oHeader= {"Content-Type":"application/json;charset=utf-8"};
						var dirPayload = {
								"userId":oDBModel.getData().requestHeaderDto.labDirectorId
						};
						dirNameModel.loadData("/utilweb/rest/ume/auth/userdetail", JSON.stringify(dirPayload), false, "POST", false, false, oHeader);
					  if(dirNameModel.getData()!=undefined){
					  that.getView().byId("labDir").setValue(dirNameModel.getData().displayNm); }
				  }
				  	
				  if(taskData.taskNo==6){
						that.getView().byId('dirRev').setVisible(true);
						that.getView().byId('dirSec').setVisible(false);
						that.disableFields();
					}else if(taskData.taskNo==4||taskData.taskNo==7){
						that.getView().byId('ltSscRev').setVisible(true);
						//that.disableFields();
						//if(labKey!="CWS"){
						that.getEqSmData("EQ");
						that.getSmData("SM");
						that.getnonCwsMPData("MP");
						//}
						that.getView().byId('dirSec').setVisible(false);
						var eqSmData=that.getView().byId("euipTable").getItems();
						that.attachReadOnly(eqSmData[0].getCells()[0]);
						var smData=that.getView().byId("smTable").getItems();
						that.attachReadOnly(smData[0].getCells()[0]);
						//var eqSmDataLen=eqSmData.length;
						/*for(var i=0;i<eqSmDataLen-1;i++){
							eqSmData[i].getCells()[0].setEnabled(false);
							eqSmData[i].getCells()[1].setEditable(false);
							eqSmData[i].getCells()[2].setEnabled(false);
						}*/
					}else if(taskData.taskNo==8){
						that.disableFields();
						if(taskData.userTypeNo==3){
							var oTermsSrvModel = new sap.ui.model.json.JSONModel();
							oTermsSrvModel.loadData("/kclrfs/rest/brm/rfsTermsConditions", null, false);
							if(oTermsSrvModel.getData()&& oTermsSrvModel.getData().termsConditionsList){
							that.getView().byId("reqtAccept").setContent(oTermsSrvModel.getData().termsConditionsList[0]);
							that.getView().byId("termsNcondition").setContent(oTermsSrvModel.getData().termsConditionsList[1]);
							}
							that.getView().byId('extRepAccView').setVisible(true);
							that.getView().byId('nonExtRep').setVisible(false);
						}else{
							that.getView().byId('extRepAccView').setVisible(false);
							that.getView().byId('nonExtRep').setVisible(true);
						}
						that.getView().byId('rtSscAcceptance').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
					}
					else if(taskData.taskNo==9){
						that.getView().byId('ltSscRej').setVisible(true);
						that.getView().byId('mInp').setEnabled(true);
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(false);
						that.disableFields();
					}else if(taskData.taskNo==10){
						that.getView().byId('piAuthPer').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						if(taskData.userTypeNo==3 && oDBModel.getData().termsConditionsDto){
						that.getView().byId('extRepAccView').setVisible(true);
						that.getView().byId("reqtAccept").setContent(oDBModel.getData().termsConditionsDto.title);
						that.getView().byId("termsNcondition").setContent(oDBModel.getData().termsConditionsDto.description); 
						}
						that.disableFields();
					}else if(taskData.taskNo==11){
						that.getView().byId('ltLmSel').setVisible(true);
						that.getView().byId('mInp').setEnabled(true);
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==12){
						that.getView().byId('maSlaPayVer').setVisible(true);
						if(oDBModel.getData().requestHeaderDto.statusDesc=="Pending Payment"){
							that.getView().byId('maSlaPayment').setText("Pending Payment");}
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==13){
						that.getView().byId('ltPayDocUpConf').setVisible(true);
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==14){
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==15){
						that.getView().byId('rtSamResub').setVisible(true);
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==16){
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==17){
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==18){
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else if(taskData.taskNo==19){
						that.getView().byId('sciSec').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
						that.disableFields();
					}else{
						that.disableFields();
					}
			}
		 },function(oError){
	  			sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			 });	
	}
	else{
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.getRoute("RFSFormTask").attachMatched(this._loadRFS, this);
		}
	},
	

_loadRFS : function(oEvt){
	var that = this;
	var rfsNo=oEvt.getParameter("arguments").id;
	if(rfsNo!=undefined){
	var oDBModel = new sap.ui.model.json.JSONModel();
	oDBModel.setData();
	oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+rfsNo,null,false);
	that.getView().setModel(oDBModel,"oDBModel");
	if(oDBModel.getData().requestHeaderDto.labId){
	var labKey = oDBModel.getData().requestHeaderDto.labId;
  	if(labKey=="CWS"){
	  that.getView().byId('cws').setVisible(true);
	  that.getView().byId('noncws').setVisible(false);
	  var sscData =oDBModel.getData().serviceScopeDto;
	  if(sscData){
			that.getView().byId('cwsSerScope').setValue(sscData.finalScopeCharge);
			that.getView().byId('cwsSerScope').setTooltip(sscData.finalScopeCharge);
			var expDate = new Date(sscData.estCompletionDate); 
			that.getView().byId('dateP').setDateValue(expDate); 
	  }
  	}else{
	  that.getView().byId('cws').setVisible(false);
	  that.getView().byId('noncws').setVisible(true);
	  var sscData =oDBModel.getData().serviceScopeDto;
	  if(labKey=="BCL"){
		  that.getView().byId('bclLab').setVisible(true);
	  }
	  if(sscData){
		  if(sscData.isRoutineStandard=="true"){that.getView().byId('routine').setSelected(true);}
		  else{that.getView().byId('routine').setSelected(false);}
		  if(sscData.isAdvanceCustom=="true"){that.getView().byId('advCustom').setSelected(true);}
		  else{that.getView().byId('advCustom').setSelected(false);}
			that.getView().byId('sampleclfText').setValue(sscData.sampleClarification);
			that.getView().byId('methodappText').setValue(sscData.methodApplied);
			that.getView().byId('delivText').setValue(sscData.deliverable);
			that.getView().byId('samplelocText').setValue(sscData.storageLocation);
			
			that.getView().byId('sampleclfText').setTooltip(sscData.sampleClarification);
			that.getView().byId('methodappText').setTooltip(sscData.methodApplied);
			that.getView().byId('delivText').setTooltip(sscData.deliverable);
			that.getView().byId('samplelocText').setTooltip(sscData.storageLocation);
			
			 if(sscData.isIBECApprovalReqd=="true"){that.getView().byId('ibec').setSelected(true);}
			  else{that.getView().byId('ibec').setSelected(false);}
			 if(sscData.isMatTranAgreemntReqd=="true"){that.getView().byId('matTransport').setSelected(true);}
			  else{that.getView().byId('matTransport').setSelected(false);}
			that.getView().byId('ncwstotalEstimatedCharge').setValue(sscData.totalEstServiceCharge);
			var expDate = new Date(sscData.estCompletionDate);      
			that.getView().byId('dateP').setDateValue(expDate); 
	  }
  }
  	
  	var requesterModel =new sap.ui.model.json.JSONModel();
	  requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
	  that.getView().setModel(requesterModel,"sscRequesterModel");
	  
	  if(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ){
		  	if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ instanceof Array)){
				that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ];
			}
		  var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ;
		  if(eqOrSamData && eqOrSamData.length>=1){
			  that.getView().byId('euipTable').bindItems("oDBModel>/estimatedServiceChargeDtoListEQ",new sap.m.ColumnListItem({
				  cells:[
					      new sap.m.ComboBox({
					    	  width:"100%",
					    	  items:{
					    	  path:'oEqSamModel>/priceListItemDtoList',
					    	  template: new sap.ui.core.Item({
			 	                   	text:'{oEqSamModel>item}'
			 	                	   })
					      			},
					      			value : '{oDBModel>desc}',	
					      	selectionChange:function(oEvt){
								   		  that.getEqOrSmPrice(oEvt);
								   	  },editable:false,tooltip:'{oDBModel>desc}'}).addStyleClass("tooltip tooltipFontColor"),
					      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
					   		  that.calculateSubTotal(oEvent);
					   	  }}),
					   	  new sap.m.Input({value : '{oDBModel>price}',liveChange:function(oEvent){
					   		  that.calculateSubTotal(oEvent);
					   	  },enabled:false}),
					   	  new sap.m.Input({value : '{oDBModel>uom}',editable:false,tooltip:'{oDBModel>uom}'}).addStyleClass("tooltip tooltipFontColor"),
					   	  new sap.m.Input({value : '{oDBModel>subTotal}',
					   		  liveChange : function(oEvent){
					   		  that.CalculateTotal(oEvent);
					   	  },
					   		  enabled:false})
					      ]})); 
		//  that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM);
		  
		 /* var eqItems = that.getView().byId('euipTable').getItems();
		  var tablesize= eqItems.length;
		  var datasize=eqOrSamData.length;
		  if(datasize==tablesize){
		  for(var i=0;i<datasize;i++){
			  if(eqOrSamData[i].type=="EQ"){
				  eqItems[i].getCells()[0].setValue("Equipment");
				  //that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM[i].type="";
			  }else if(eqOrSamData[i].type=="SM"){
				  //that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM[i].type="Sample/Consumables";
				  eqItems[i].getCells()[0].setValue("Sample/Consumables");
			  }
		  	}
		  } */
	  } 
		  that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ);
	}
	  
	  if(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM){
		  	if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM instanceof Array)){
				that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM];
			}
		  var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListSM;
		  
		  if(eqOrSamData && eqOrSamData.length>=1){
		  
		  that.getView().byId('smTable').bindItems("oDBModel>/estimatedServiceChargeDtoListSM",new sap.m.ColumnListItem({
				cells:[
					      new sap.m.ComboBox({
					    	  width:"100%",
					    	  items:{
					    	  path:'oSamModel>/priceListItemDtoList',
					    	  template: new sap.ui.core.Item({
			 	                   	text:'{oSamModel>item}'
			 	                	   })
					      			},
					      			value : '{oDBModel>desc}',	
					      	selectionChange:function(oEvt){
								   		  that.getEqOrSmPrice(oEvt);
								   	  },editable:false,tooltip:'{oDBModel>desc}'}).addStyleClass("tooltip tooltipFontColor"),
					      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
					   		  that.calculateSubTotal(oEvent);
					   	  }}),
					   	  new sap.m.Input({value : '{oDBModel>price}',liveChange:function(oEvent){
					   		  that.calculateSubTotal(oEvent);
					   	  },enabled:false}),
					   	  new sap.m.Input({value : '{oDBModel>uom}',editable:false,tooltip:'{oDBModel>uom}'}).addStyleClass("tooltip tooltipFontColor"),
					   	  new sap.m.Input({value : '{oDBModel>subTotal}',
					   		  liveChange : function(oEvent){
					   		  that.CalculateTotal(oEvent);
					   	  },
					   		  enabled:false})
					      ]})); 
		  			} 
		  that.getView().byId('ncwstotsmcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalSM);
	  			}
	//	  if(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM){
	//		  that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM);
	//	  }
		  if(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMP){
			  var mpData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMP;
			  if(mpData && mpData.length>1){
				  var size=mpData.length;
				  that.getView().byId('mpTbl').bindItems("oDBModel>/estimatedServiceChargeDtoListMP",new sap.m.ColumnListItem({
						cells:[
							      new sap.m.Text({
							      			text :'{oDBModel>desc}'
							      			}),
							      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
							   		  that.calculateSubTotal(oEvent);
							   	  }}),
							   	  new sap.m.Input({value : '{oDBModel>price}',enabled:false}),
							   	  new sap.m.Input({value : '{oDBModel>uom}',enabled:false}),
							   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
							   		  that.CalculateTotal(oEvent);
							   	  },enabled:false})
							      ]}));  
				  that.getView().byId('ncwsmptotalcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalMP);
			  	}
			  that.getView().byId('ncwstotalEstimatedCharge').setValue(sscData.totalEstServiceCharge);
			 }	  
		  if(oDBModel.getData().serviceScopeDto && oDBModel.getData().serviceScopeDto.serviceScopeScientistList){
				 if(!(oDBModel.getData().serviceScopeDto.serviceScopeScientistList instanceof Array)){
					 oDBModel.getData().serviceScopeDto.serviceScopeScientistList=[oDBModel.getData().serviceScopeDto.serviceScopeScientistList];
				 }
				 var sciList="", scilistSize=oDBModel.getData().serviceScopeDto.serviceScopeScientistList.length; 
				 if(scilistSize>0){
				  for(var i=0;i<scilistSize;i++){
					  if(sciList==""){
					  sciList = oDBModel.getData().serviceScopeDto.serviceScopeScientistList[i].assignScientistNm;
					  }else{
						  sciList = sciList+", "+oDBModel.getData().serviceScopeDto.serviceScopeScientistList[i].assignScientistNm;
					  }
				  }
				  if(sciList!="null"){
					  that.getView().byId('sciSec').setVisible(true);
					  that.getView().byId('mInp').setValue(sciList); 
				  	}
				 }
			  }
		  if(oDBModel.getData().requestHeaderDto.labDirectorId && !(oDBModel.getData().requestHeaderDto.labDirectorId.indexOf("_")>-1)){
			  that.getView().byId('dirSec').setVisible(true);
			  var dirNameModel =new sap.ui.model.json.JSONModel();
				var oHeader= {"Content-Type":"application/json;charset=utf-8"};
				var dirPayload = {
						"userId":oDBModel.getData().requestHeaderDto.labDirectorId
				};
				dirNameModel.loadData("/utilweb/rest/ume/auth/userdetail", JSON.stringify(dirPayload), false, "POST", false, false, oHeader);
				that.getView().byId("labDir").setValue(dirNameModel.getData().displayNm); 
		  	} 
		}
		that.disableFields();
		var aId=["routine","advCustom","ibec","matTransport","dateP"];
		for(var i=0;i<aId.length;i++){
			var oControl = that.getView().byId(aId[i]);
			oControl.setEnabled(false);
			}
		that.getView().byId("sampleclfText").setEditable(false);
		that.getView().byId("methodappText").setEditable(false);
		that.getView().byId("delivText").setEditable(false);
		that.getView().byId("samplelocText").setEditable(false);
		that.getView().byId("cwsSerScope").setEditable(false);
	}
},

getTask : function(){
	var that= this;
	var tId = getValFromQueryString('taskId');
	return tId;
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

/*validateltSubmit:function(){
	var that=this;
//	var bValidate=false;
	var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
	var aId;
	
	if(labKey=="CWS"){
		aId=["cwsSerScope","dateP"];  //"labDir"
	  }else{
		aId=["dateP","ncwstotalEstimatedCharge"];  //"labDir",
	}
	//		var aProperties=["value"]; "mInp","totalamt1","totalamt2",
	var aIdLen=aId.length;
	
	for(var i=0;i<aIdLen;i++){
		var oControl = that.getView().byId(aId[i]);
		
		if(oControl.getValueState() === "Error"){
			if(oControl.getMetadata().getName() === "sap.m.DatePicker"){
				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//				bValidate=false;
//				break;
				return;
			}
		}
		
		if(oControl.getValue()==""||oControl.getValue()=="0.00"||oControl.getValue()==null||oControl==undefined){
			oControl.setValueState(sap.ui.core.ValueState.Error);
			sap.ui.commons.MessageBox.show("Field can not be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//			bValidate=false;
//			break;
			return;
		}
		
		oControl.setValueState(sap.ui.core.ValueState.None);
//		bValidate=true;
//		continue;
	}
	
	//retunr is missing
	
	    //Equipment table check
		var tableItems=that.getView().byId("euipTable").getItems();
		var tableLen = tableItems.length;
		
		for(var i=0;i<tableLen;i++){
			if( (i == 0) && (i == tableLen-1) && (tableItems[i].getCells()[1].getValue()=="") && (tableItems[i].getCells()[0].getValue()=="")){
				//do nothing because first row can be full empty
			}else if(tableItems[i].getCells()[1].getValue()=="" || tableItems[i].getCells()[0].getValue()==""){
				sap.ui.commons.MessageBox.show("Please fill all rows in Equipment Table",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//		                   bValidate=false;
		                   return;
		    }
		}
		
		//Sample table check
		var sampleItems=that.getView().byId("smTable").getItems();
		var sampleLen = sampleItems.length;
		
		for(var j=0;j<sampleLen;j++){
			if( (j == 0) && (j == sampleLen-1) && (sampleItems[j].getCells()[1].getValue()=="") && (sampleItems[j].getCells()[0].getValue()=="")){
				//do nothing because first row can be full empty
			}else if(sampleItems[j].getCells()[1].getValue()=="" || sampleItems[j].getCells()[0].getValue()==""){
		       sap.ui.commons.MessageBox.show("Samples or Consumables Table cannot be empty, please remove unused rows",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//		              bValidate=false;
		               return;
		       }
		}
//	for(var i=0;i<aIdLen;i++){
//		var oControl = that.getView().byId(aId[i]);
//		if(oControl.getValueState() === "Error"){
//			if(oControl.getMetadata().getName() === "sap.m.DatePicker"){
//				sap.ui.commons.MessageBox.show("Select current or future date",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//				bValidate=false;
//				break;
//			}
//		}
//		if(oControl.getValue()==""||oControl.getValue()=="0.00"||oControl.getValue()==null||oControl==undefined){
//			oControl.setValueState(sap.ui.core.ValueState.Error);
//			sap.ui.commons.MessageBox.show("Field can not be empty",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//			bValidate=false;
//			break;
//		}else{
//				var tableItems=that.getView().byId("euipTable").getItems();
//				var tableLen = tableItems.length;
//				for(var i=0;i<tableLen;i++){
//					if( (i == 0) && (i == tableLen-1) && (tableItems[i].getCells()[1].getValue()=="") && (tableItems[i].getCells()[0].getValue()=="")){
//						//do nothing because first row can be full empty
//					}else
//				if(tableItems[i].getCells()[1].getValue()=="" || tableItems[i].getCells()[0].getValue()==""){
//				sap.ui.commons.MessageBox.show("Please fill all rows in Equipment Table",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//				                   bValidate=false;
//				                   return;
//				               }
//				}
//				var sampleItems=that.getView().byId("smTable").getItems();
//				var sampleLen = sampleItems.length;
//				for(var j=0;j<sampleLen;j++){
//					if( (j == 0) && (j == sampleLen-1) && (sampleItems[j].getCells()[1].getValue()=="") && (sampleItems[j].getCells()[0].getValue()=="")){
//						//do nothing because first row can be full empty
//					}else
//				if(sampleItems[j].getCells()[1].getValue()=="" || sampleItems[j].getCells()[0].getValue()==""){
//				sap.ui.commons.MessageBox.show("Please fill all rows in Samples or Consumables Table",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//				 bValidate=false;
//				                   return;
//				               }
//				}
//				oControl.setValueState(sap.ui.core.ValueState.None);
//				bValidate=true;
//				continue;
//				}
//		}
//	if(bValidate==true){
		that.ltSubmit();
//	}
},*/

	validateltSubmit:function(){
			var that = this;
			var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
			var ssc_date = "dateP";
			if (labKey == "CWS") {
				var ssc_total = "cwsSerScope";// "labDir"
			} else {
				var ssc_total = "ncwstotalEstimatedCharge"; // "labDir",
			}

			var oControl_total = that.getView().byId(ssc_total);
			if (oControl_total.getValue() == "" || oControl_total.getValue() == "0.00" || oControl_total.getValue() == null
					|| oControl_total == undefined) {
				oControl_total.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field cannot be empty", sap.ui.commons.MessageBox.Icon.ERROR, "Error");
				return;
			} else { // Equipment table check
				var tableItems = that.getView().byId("euipTable").getItems();
				var tableLen = tableItems.length;
				for ( var i = 0; i < tableLen; i++) {
					if ((i == 0) && (i == tableLen - 1) && (tableItems[i].getCells()[1].getValue() == "")
							&& (tableItems[i].getCells()[0].getValue() == "")) {
						// do nothing because first row can be full empty
					} else if (tableItems[i].getCells()[1].getValue() == "" || tableItems[i].getCells()[0].getValue() == "") {
						sap.ui.commons.MessageBox.show("Equipment Table cannot be empty, please remove unused rows", sap.ui.commons.MessageBox.Icon.ERROR, "Error");
						return;
					}
				}
				// Sample table check
				var sampleItems = that.getView().byId("smTable").getItems();
				var sampleLen = sampleItems.length;
				for ( var j = 0; j < sampleLen; j++) {
					if ((j == 0) && (j == sampleLen - 1) && (sampleItems[j].getCells()[1].getValue() == "")
							&& (sampleItems[j].getCells()[0].getValue() == "")) {
						// do nothing because first row can be full empty
					} else if (sampleItems[j].getCells()[1].getValue() == "" || sampleItems[j].getCells()[0].getValue() == "") {
						sap.ui.commons.MessageBox.show("Samples or Consumables Table cannot be empty, please remove unused rows",
								sap.ui.commons.MessageBox.Icon.ERROR, "Error");
						return;
					}
				}
			}

			var oControl_date = that.getView().byId(ssc_date);
			if (oControl_date.getValueState() === "Error") {
				sap.ui.commons.MessageBox.show("Select current or future date", sap.ui.commons.MessageBox.Icon.ERROR, "Error");
				return;
			}
			else if (oControl_date.getValue() == "" || oControl_date.getValue() == "0.00" || oControl_date.getValue() == null
					|| oControl_date == undefined) {
				oControl_date.setValueState(sap.ui.core.ValueState.Error);
				sap.ui.commons.MessageBox.show("Field cannot be empty", sap.ui.commons.MessageBox.Icon.ERROR, "Error");
				return;
			}
			oControl_date.setValueState(sap.ui.core.ValueState.None);
			//retunr is missing
			that.ltSubmit();
},

getNonCwsData : function(){
	var that=this;
	var taskData = that.getView().getModel("taskJsonModel").getData();
	var serviceScopeDto={
		 "isRoutineStandard": that.getView().byId('routine').getSelected(),
		 "isAdvanceCustom": that.getView().byId('advCustom').getSelected(),
		 "sampleClarification": that.getView().byId('sampleclfText').getValue().trim(),
		 "methodApplied": that.getView().byId('methodappText').getValue().trim(),
		 "deliverable": that.getView().byId('delivText').getValue().trim(),
		 "storageLocation":that.getView().byId('samplelocText').getValue().trim(),
		 "isIBECApprovalReqd":that.getView().byId('ibec').getSelected(),
		 "isMatTranAgreemntReqd":that.getView().byId('matTransport').getSelected(),
		 "totalEstServiceCharge":  that.getView().byId('ncwstotalEstimatedCharge').getValue(),
		 "estCompletionDate":that.getEstComplDate(that.getView().byId('dateP').getDateValue()),
		 
		 //"createdBy": "tru",
		 // "createdDate": "2016-07-30T13:24:47.901+03:00",
		 // "finalScopeCharge": "er",
		 "isPiAccept": "",
		 "isRequesterAccept": "",
   	     "labDirectorComment": "",
		 "labTeamLeadComment": "",
		 "labTeamMemberComment": "",
		 "masterAdminComment": "",
		 "modifiedBy": "",
		 "piComment": "",
		 "requsterComment": "",
		 // "serviceScopeScientistList": serviceScopeScientistList,
		 "sscReqNo": taskData.rfsNo
		 };
	return serviceScopeDto;
},

getCwsData : function(){
	var that=this;
	var taskData = that.getView().getModel("taskJsonModel").getData();
	var serviceScopeDto={
		"finalScopeCharge":that.getView().byId('cwsSerScope').getValue().trim(),
		// "totalEstServiceCharge":  that.getView().byId('cwsTotalEstCharge').getValue(),
		 "totalEstServiceCharge":  that.getView().byId('ncwstotalEstimatedCharge').getValue(),
		 "estCompletionDate":that.getEstComplDate(that.getView().byId('dateP').getDateValue()),
		 //"createdBy": "tru",
		 // "createdDate": "2016-07-30T13:24:47.901+03:00",
		 // "finalScopeCharge": "er",
		 "isPiAccept": "",
		 "isRequesterAccept": "",
    	 "labDirectorComment": "",
		 "labTeamLeadComment": "",
		 "labTeamMemberComment": "",
		 "masterAdminComment": "",
		 "modifiedBy": "",
		 "piComment": "",
		 "requsterComment": "",
		 "sscReqNo": taskData.rfsNo
		};
	return serviceScopeDto;
},

ltSubmit : function(){
	var that =this;
	 var taskData = that.getView().getModel("taskJsonModel").getData();
	 var dbData= that.getView().getModel("oDBModel").getData();
	 var serviceScopeDto;
	 var eqOrMtArr=[];
	 var smArr=[];
	 var mpArr=[];
	 var labKey = dbData.requestHeaderDto.labId;
		if(labKey=="CWS"){
			serviceScopeDto = that.getCwsData();
			/*var mtItems = that.getView().byId('mattable').getItems();
			var mtItemsLen = mtItems.length;
			for(var i=0;i<mtItemsLen;i++){
				eqOrMtArr.push({"sNo":i,"type":"MT","desc":mtItems[i].getCells()[0].getValue(),"quantity":"1","price":mtItems[i].getCells()[1].getValue()});
			}
			dbData.estimatedServiceChargeDtoListMT= eqOrMtArr;
			var mpItems = that.getView().byId('mantable').getItems();
			var mpItemsLen = mpItems.length;
			for(var i=0;i<mpItemsLen;i++){
				mpArr.push({"sNo":i,"type":"CWS_MP","desc":mpItems[i].getCells()[0].getText(),"quantity":mpItems[i].getCells()[1].getValue(),"price":mpItems[i].getCells()[2].getValue(),"uom":mpItems[i].getCells()[3].getValue()});
			}
			dbData.estimatedServiceChargeDtoListCWS_MP= mpArr;*/
		  }else{
			  serviceScopeDto = that.getNonCwsData();
		  }
		
		var eqItems = that.getView().byId('euipTable').getItems();
		var eqItemsLen = eqItems.length;
		for(var i=0;i<eqItemsLen;i++){
			eqOrMtArr.push({"sNo":i,"type":"EQ","desc":eqItems[i].getCells()[0].getValue(),"quantity":eqItems[i].getCells()[1].getValue(),"price":eqItems[i].getCells()[2].getValue(),"uom":eqItems[i].getCells()[3].getValue()});
		}
		dbData.estimatedServiceChargeDtoListEQ= eqOrMtArr;
		
		var smItems = that.getView().byId('smTable').getItems();
		var smItemsLen = smItems.length;
		for(var i=0;i<smItemsLen;i++){
			smArr.push({"sNo":i,"type":"SM","desc":smItems[i].getCells()[0].getValue(),"quantity":smItems[i].getCells()[1].getValue(),"price":smItems[i].getCells()[2].getValue(),"uom":smItems[i].getCells()[3].getValue()});
		}
		dbData.estimatedServiceChargeDtoListSM= smArr;
		
		var mpItems = that.getView().byId('mpTbl').getItems();
		var mpItemsLen = mpItems.length;
		for(var i=0;i<mpItemsLen;i++){
			mpArr.push({"sNo":i,"type":"MP","desc":mpItems[i].getCells()[0].getText(),"quantity":mpItems[i].getCells()[1].getValue(),"price":mpItems[i].getCells()[2].getValue(),"uom":mpItems[i].getCells()[3].getValue()});
		}
		dbData.estimatedServiceChargeDtoListMP= mpArr;    
		
		 dbData.serviceScopeDto=serviceScopeDto;
		 dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
		 var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		 var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		 rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		 if(rfsSaveDataModel.getData().responseDto && rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Submitted successfully";
			taskData.uiActionNo=1;
			that.completeTask(taskData,msg);
			//that.getView().byId('sscSub').setVisible(false);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
},

completeTask : function(taskData,msg){
	var that=this;
	 var outputData={};
	  outputData.DO_RFS=taskData;
	  var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
	  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true);
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

close: function(oEvent){
	var that= this;
	oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
	that.rejectDialog.close();
},

//'Director Review Task' for Lab Director with taskNo = 6;
dirReviewRej : function(oEvt){
	//oEvt.getSource().getId().split("--")[1]
	var that = this;
	that.rejectDialog.open();
},

toReject : function(){
	var that =this;
	var comments = sap.ui.getCore().byId('sscTaskRejectionComm').getValue().trim();
	if(comments==""||comments==null){
		sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
	}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		var data = that.getView().getModel("taskJsonModel").getData();
		dbData.serviceScopeDto.labDirectorComment=comments;
		dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
		
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
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	}
},

dirReviewAppr : function(){
	var that =this;
	var dbData = that.getView().getModel("oDBModel").getData();
	/*if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM instanceof Array)){
		that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM];
	}
	  var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM;
	  if(eqOrSamData && eqOrSamData.length>=1){
	  var size=eqOrSamData.length;
	  for(var i=0;i<size;i++){
		  if(eqOrSamData[i].type=="Equipment"){
			  that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM[i].type="EQ";
		  }else if(eqOrSamData[i].type=="Sample/Consumables"){
			  that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM[i].type="SM";
		  }
	  	}
	  }*/
	
	dbData.requestHeaderDto.statusDesc="Pending Scope and Charges Approval";   //Pending Scope and Charges Approval
	var dirNameModel = new sap.ui.model.json.JSONModel();
	var loginPayload ={
			   "loggedInUser" : "true"
			};
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	dirNameModel.loadData("/utilweb/rest/ume/auth/userdetail",JSON.stringify(loginPayload),false,"POST",false,false,oHeader);
	dbData.requestHeaderDto.labDirectorId=dirNameModel.getData().userId;
	
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Approved";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

/*//'SSC Re-Review Task' for Lab Team Lead with taskNo = 7;
sscReviewSub : function(){
	var that =this;
	var data = that.getView().getModel("taskJsonModel").getData();
	data.uiActionNo=1;
	that.completeTask(data);
},*/

//'SSC Reject Task' for Lab Team Lead with taskNo = 9;
sscRejSub : function(){
	var that =this;
	var dbData = that.getView().getModel("oDBModel").getData();
	if(serviceScopeScientistList.length > 0){
		dbData.serviceScopeDto.serviceScopeScientistList=serviceScopeScientistList;
		}
	dbData.requestHeaderDto.statusDesc="RFS Rejected";
	
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Rejected";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		if(scientistUidList.length>0){
			data.labTeamMemberUid=scientistUidList;
		}
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

//'PI authorised Person Task' for PI/Authorised Per with taskNo =10
piAuthPerRej : function(oEvt){
	var that = this;
	var Id= oEvt.getSource().getId().split("--")[1];
	if(Id=="piAuthPerRej"){
		sap.ui.getCore().byId('orgnl').setVisible(false);
		sap.ui.getCore().byId('one').setVisible(true);
		that.rejectDialog.open();
	}else{
		sap.ui.commons.MessageBox.show("Error, please try again",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
	}
}, 

toReject1 : function(){
	var that =this;
	var comments = sap.ui.getCore().byId('sscTaskRejectionComm').getValue().trim();
	if(comments==""||comments==null){
		sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
	}else{
	var dbData = that.getView().getModel("oDBModel").getData();
	var data = that.getView().getModel("taskJsonModel").getData();
	dbData.serviceScopeDto.piComment=comments;
	dbData.requestHeaderDto.statusDesc="Scope and Charges Rejected";
	dbData.serviceScopeDto.isPiAccept=false;
	
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
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	}
},
/*piAuthPerReqCh : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=3;
		that.completeTask(data);
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
		dbData.serviceScopeDto.piComment=comments;
		dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
		
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
			var msg="Request for change submitted";
			data.uiActionNo=3;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	}
},

piAuthPerReqCh: function(){
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


piAuthPerAppr : function(){
	var that =this;
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Scope and Charges Approved";
	dbData.serviceScopeDto.isPiAccept=true;
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Approved";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

//'Lab Member selection Task' for Lab Team Lead with taskNo =11
lmSub : function(){
	var that =this;
	
	//isSLAVerified start - getting and setting data in User DB 2
	var isSLAVerified = true;
	var dbData = that.getView().getModel("oDBModel").getData();
	
	if(serviceScopeScientistList.length > 0){
		dbData.serviceScopeDto.serviceScopeScientistList=serviceScopeScientistList;
	}
	var data = that.getView().getModel("taskJsonModel").getData();
	
	if(data.userTypeNo==2){      // only for RPT
		var readUserProfileModel = new sap.ui.model.json.JSONModel();
		var emailId=dbData.requestHeaderDto.requesterId;;
		readUserProfileModel.loadData("/utilweb/rest/user/auth/read/"+emailId,null,false);
		
		if(readUserProfileModel.getData()){
			if( readUserProfileModel.getData().isSLAVerified==undefined ){
				isSLAVerified = false;
			}else if(readUserProfileModel.getData().isSLAVerified=="false"){
				sap.ui.commons.MessageBox.show("Cannot submit RFS as SLA verification is pending",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
				return;
			}else if(readUserProfileModel.getData().isSLAVerified=="true"){
				isSLAVerified = true;
			}
		}else{
			sap.ui.commons.MessageBox.show("Error in fetching user data, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			return;
		}
	
		if(!(isSLAVerified)){
			dbData.isSLAVerified = isSLAVerified; // added for acc verification 18th Jan
			dbData.isSLAVerifiedFlag = true;
		}
	}else if(data.userTypeNo==1){    // for Internal
		isSLAVerified = false;
	}else if(data.userTypeNo==3){   // for External
		isSLAVerified = true;
	}
	
	if(((data.userTypeNo!=2) && isSLAVerified) || ((data.userTypeNo==2) && !(isSLAVerified))){
		dbData.requestHeaderDto.statusDesc="Pending SLA Verification";
	}else{
		dbData.requestHeaderDto.statusDesc="RFS Assigned";
	}
	//isSLAVerified end - getting and setting data in User DB 2
	
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		data.uiActionNo=1;
		
		if(data.userTypeNo==2){
			//isSLAVerified start - setting data in BPM 3
			data.isSlaVerificationReqd = !isSLAVerified;//reverse of the above flag
			//isSLAVerified end - setting data in BPM 3
		} else if(data.userTypeNo==3){
		    //isSLAVerified start - setting data in BPM 3
			data.isSlaVerificationReqd = true;//always true
			//isSLAVerified end - setting data in BPM 3
		}  else if(data.userTypeNo==1){
		    //isSLAVerified start - setting data in BPM 3
			data.isSlaVerificationReqd = false;//always false
			//isSLAVerified end - setting data in BPM 3
		}
		
		
		if(scientistUidList.length>0){
			data.labTeamMemberUid=scientistUidList;
		}
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

// 'SLA/paymnet verify Task' for master admin with taskNo =12 
maSlaVerify : function(){
	var that =this;
	var dbData = that.getView().getModel("oDBModel").getData();
//	dbData.requestHeaderDto.statusDesc="SLA Verified";
	dbData.requestHeaderDto.statusDesc="RFS Assigned";
	if(!(that.getView().getModel("sscRequesterModel").getData() && that.getView().getModel("sscRequesterModel").getData().isSLAVerified == "true")){
		dbData.isSLAVerified = true;    // added for sla verification 18th jan
		dbData.isSLAVerifiedFlag = true;
		}
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

/*maSlaVerifyReqd : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Pending SLA Verification";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=3;
		that.completeTask(data);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},*/

commentTask2 : function(oEvent){
	var that = this;
	var comments = sap.ui.getCore().byId('comm2').getValue().trim();
	if(comments==""||comments==null){
		sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
	}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		var data = that.getView().getModel("taskJsonModel").getData();
		dbData.serviceScopeDto.masterAdminComment=comments;
//		dbData.requestHeaderDto.statusDesc="Pending SLA Verification";
		dbData.requestHeaderDto.statusDesc="Pending Payment";
		
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
			var msg="SLA Verification submitted";
			data.uiActionNo=3;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	}
},

maSlaVerifyReqd: function(){
	var that = this;
	if (!that.commDialog2) {
		that.commDialog2 = sap.ui.xmlfragment("corelabs.fragments.commentBox2", this);
		that.getView().addDependent(this.commDialog2);
		that.commDialog2.addStyleClass("sapUiSizeCompact");
	}
	that.commDialog2.open();
},


closeCommDialog2 : function(oEvent){
	var that = this;
	oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
	that.commDialog2.close();
},


//'Payment doc upload confirm Task' for Requester with taskNo = 13;
ltPayDocUpSub : function(){
	var that =this;
	var dbData = that.getView().getModel("oDBModel").getData();
//	dbData.requestHeaderDto.statusDesc="Pending Payment";
	dbData.requestHeaderDto.statusDesc="Payment Received";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Payment document uploaded successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},
	
//'Design/Sample Resubmission Confirm task' for Requester with taskNo =15
rqSamResub : function(){
	var that =this;
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Sample Resubmitted";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Sample/Design resubmitted";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},


handleSuggest : function(oEvent,taskId){
	var that =this;
	 var oReadScientistModel = new sap.ui.model.json.JSONModel();
	 var taskDataSvcURL = "/bpmodata/taskdata.svc/"+taskId;  
	  var taskDataODataModel = new sap.ui.model.odata.ODataModel(taskDataSvcURL, true); 
	  taskDataODataModel.read("/InputData('"+taskId+"')/DO_RFS",null, null,false,
	  		function(oData,oRes){
			  var rfsNo =  oData.rfsNo; 
				if (autoUser.length > 3) {
					oReadScientistModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+rfsNo,null,false);
					if(oReadScientistModel.getData()==undefined){
					}else{
						if(!(oReadScientistModel.getData().userDtos instanceof Array)){
							oReadScientistModel.getData().userDtos=[oReadScientistModel.getData().userDtos];
						}
						that.getView().setModel(oReadScientistModel,"oReadScientistModel");
					}
				}
	        },function(oError){
	        	sap.ui.commons.MessageBox.show("Error occurred, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	        });	
},

itemSelected : function(oEvt){
	var userId=oEvt.getParameter("selectedItem").getAdditionalText();
	oEvt.getSource().setValue(userId);
},


disableAllBtns : function(){
	var that =this;
	that.getView().byId('dirRev').setVisible(false);
	that.getView().byId('ltSscRev').setVisible(false);
	that.getView().byId('rtSscAcceptance').setVisible(false);
	that.getView().byId('ltSscRej').setVisible(false);       	
	that.getView().byId('piAuthPer').setVisible(false);
	that.getView().byId('ltLmSel').setVisible(false);
	that.getView().byId('maSlaPayVer').setVisible(false);
	that.getView().byId('ltPayDocUpConf').setVisible(false);
	//that.getView().byId('lmFrfs').setVisible(false);
	that.getView().byId('rtSamResub').setVisible(false);
},

handleSuggest : function(oEvent){
	var that= this;
	var autoUser = oEvent.getParameter("suggestValue");
	oSearchSciModel = new sap.ui.model.json.JSONModel();
	if (autoUser.length > 3) {
		var searchPayload ={
				   "userNm" : autoUser
				};
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		oSearchSciModel.loadData("/utilweb/rest/ume/auth/searchuser",JSON.stringify(searchPayload),false,"POST",false,false,oHeader);
			if(!(oSearchSciModel.getData().userDtos instanceof Array)){
				oSearchSciModel.getData().userDtos=[oSearchSciModel.getData().userDtos];
			}
		that.getView().setModel(oSearchSciModel,"oSearchSciModel");
	}
},

selectedScientis : function(oEvt){
	var that =this;
	var userId=oEvt.getParameter("selectedItem").getKey();
	var userName=oEvt.getParameter("selectedItem").getText();
	serviceScopeScientistList.push({"assignScientistNm":userName,"assignScientistId":userId});
},

tokenChange:function(evt){
	var that=this;
	if(evt.getParameter("type")=="removed"){
		var selText=evt.getParameter("token").getText();
		that.findAndRemove(serviceScopeScientistList,"assignScientistNm",selText);
	}
},

findAndRemove :function (array, property, value) {
	  array.forEach(function(result, index) {
	    if(result[property] === value) {
	      array.splice(index, 1);             //Remove from array
	    }    
	  });
	},
	
disableFields:function(evt){
		var that=this;
		that.getView().byId("euipTable").setMode("None");
		that.getView().byId("smTable").setMode("None");
		 var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
			var aId;
			/*if(labKey=="CWS"){
				aId=["dateP"];  //,"labDir"
				var mtData=that.getView().byId("mattable").getItems();
				var mtDataLen=mtData.length;
				for(var i=0;i<mtDataLen;i++){
					mtData[i].getCells()[0].setEnabled(false);
					mtData[i].getCells()[1].setEnabled(false);
				}
				var mpData=that.getView().byId("mantable").getItems();
				var mpDataLen=mpData.length;
				for(var j=0;j<mpDataLen;j++){
					mpData[j].getCells()[1].setEnabled(false);
					mpData[j].getCells()[2].setEnabled(false);
					mpData[j].getCells()[3].setEnabled(false);
					mpData[j].getCells()[4].setEnabled(false);
				}
				//that.getView().byId('mtAddRem').setVisible(false);
				that.getView().byId('mtAdd').setEnabled(false);
				that.getView().byId('mtRemove').setEnabled(false);
			  }else{
				aId=["routine","advCustom","ibec","matTransport","dateP"];  //,"labDir"
			  }*/
			
			var eqSmData=that.getView().byId("euipTable").getItems();
			var eqSmDataLen=eqSmData.length;
			for(var i=0;i<eqSmDataLen;i++){
			//	eqSmData[i].getCells()[0].setEnabled(false);
				eqSmData[i].getCells()[0].setEditable(false);
				eqSmData[i].getCells()[1].setEnabled(false);
				eqSmData[i].getCells()[2].setEnabled(false);
				eqSmData[i].getCells()[3].setEditable(false);
				eqSmData[i].getCells()[4].setEnabled(false);
			}
			
			var smData=that.getView().byId("smTable").getItems();
			var smDataLen=smData.length;
			for(var i=0;i<smDataLen;i++){
			//	eqSmData[i].getCells()[0].setEnabled(false);
				smData[i].getCells()[0].setEditable(false);
				smData[i].getCells()[1].setEnabled(false);
				smData[i].getCells()[2].setEnabled(false);
				smData[i].getCells()[3].setEditable(false);
				smData[i].getCells()[4].setEnabled(false);
			}
			
			var mpData=that.getView().byId("mpTbl").getItems();
			var mpDataLen=mpData.length;
			for(var j=0;j<mpDataLen;j++){
				mpData[j].getCells()[1].setEnabled(false);
				mpData[j].getCells()[2].setEnabled(false);
				mpData[j].getCells()[3].setEnabled(false);
				mpData[j].getCells()[4].setEnabled(false);
			}
			that.getView().byId('eqAdd').setEnabled(false);
			that.getView().byId('eqRemove').setEnabled(false);
			that.getView().byId('smAdd').setEnabled(false);
			that.getView().byId('smRemove').setEnabled(false);
	//	var aId=["sampleclfText","methodappText","delivText","samplelocText","estchargeText","totalamt1","totalamt2","totalEstimatedCharge","dateP","mInp","labDir"];
	//	   ,"asgnScientist","estcomplDP","totalchargeText","totalmanpowerCharge","fdTable","totalamt1","euipTable","bclhbox","scopeandchargesform"		var aProperties=["value"];
		
			aId=["routine","advCustom","ibec","matTransport","dateP"];  //,"labDir"
			for(var i=0;i<aId.length;i++){
			var oControl = that.getView().byId(aId[i]);
			if((oControl.getEnabled()) || oControl.getId()=="mpTbl" || oControl.getId()=="euipTable" || oControl.getId()=="smTable"){
				oControl.setEnabled(false);
			}else if(oControl.getId()=="mpTbl" || oControl.getId()=="euipTable" || oControl.getId()=="smTable"){
				var items=oControl.getItems();
				for(var i=1;i<items.length;i++){
					var tItemControl=items[1];
					if(tItemControl.getEnabled()){
						tItemControl.setEnabled(false);
					}
				}
			}
		}
		that.getView().byId("sampleclfText").setEditable(false);
		that.getView().byId("methodappText").setEditable(false);
		that.getView().byId("delivText").setEditable(false);
		that.getView().byId("samplelocText").setEditable(false);
		that.getView().byId("cwsSerScope").setEditable(false);
	},
	
	// for CWS --------------------
	CalculateTotal : function(evt){
		var that = this;
		var totalVal=0;
		var tableId=evt.getSource().getParent().getParent().getId().split("--")[1];
		var input=evt.getSource();
		var matTable=evt.getSource().getParent().getParent();
		var matTabItems=matTable.getItems();
//		var regex = /^[0-9]{1,3}(\.[0-9]{1,2})?$/ ;
//		var selectedVal = evt.getParameter("newValue");
//		if (((tableId=="mattable") || (tableId == "euipTable")) && (!regex.test(selectedVal))) {
//				sap.ui.commons.MessageBox.show("Invalid! Please Enter Numeric Value with two decimal digit",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
//				evt.getSource().setValueState(sap.ui.core.ValueState.Error);
//				evt.getSource().setValue("");
//		}else{
//			evt.getSource().setValueState(sap.ui.core.ValueState.None);
			for(var count=0;count<(matTabItems.length);count++){
					if(tableId=="mattable"){ 
						var iptVal=matTable.getItems()[count].getCells()[1].getValue();
					}
					else if(tableId=="mantable"){
						var iptVal=matTable.getItems()[count].getCells()[4].getValue();
					}
					else if(tableId=="euipTable"){
						var iptVal=matTable.getItems()[count].getCells()[4].getValue();
					}
					else if(tableId=="smTable"){
						var iptVal=matTable.getItems()[count].getCells()[4].getValue();
					}
					else if(tableId=="mpTbl"){
						var iptVal=matTable.getItems()[count].getCells()[4].getValue();
					}
					totalVal=totalVal+(parseFloat(iptVal)||0);
				//	totalVal=parseFloat(totalVal).toFixed(2);
				//	that.totalVal1=that.totalVal1 + (parseFloat(iptVal1)||0);
				}
//		}
		if(tableId=="mattable"){
			that.getView().byId("totmatchargeipt").setValue(totalVal);
			that.getView().byId("totmatchargeipt").fireLiveChange(evt);
		}
		else if(tableId=="mantable"){
			that.getView().byId("totmanchargeipt").setValue(totalVal);
			that.getView().byId("totmanchargeipt").fireLiveChange(evt);
		}
		else if(tableId=="euipTable"){
			that.getView().byId("ncwstotequipcharge").setValue(totalVal.toFixed(2));
			that.getView().byId("ncwstotequipcharge").fireLiveChange(evt);
		}
		else if(tableId=="smTable"){
			that.getView().byId("ncwstotsmcharge").setValue(totalVal.toFixed(2));
			that.getView().byId("ncwstotsmcharge").fireLiveChange(evt);
		}
		else if(tableId=="mpTbl"){
			that.getView().byId("ncwsmptotalcharge").setValue(totalVal.toFixed(2));
			that.getView().byId("ncwsmptotalcharge").fireLiveChange(evt);
		}
//		that.getView().byId("totmatchargeipt").setValue(totalVal);
	},
	
	addColumn:function(evt){
		var that = this;
		var matTable=evt.getSource().getParent().getParent();
		//matTable.setMode("None");
		var tableId=matTable.getId().split("--")[1];
		
		if(tableId=="mattable"){
		var clItem= new sap.m.ColumnListItem({
			cells:[
			      new sap.m.Input(),
			      new sap.m.Input({liveChange : function(oEvent){
			   		  that.CalculateTotal(oEvent);
			   	  },maxLength:10,change:function(evt){that.numDecValidation(evt);}})
			      ]});
		}
		
		else if(tableId=="euipTable"){
			var tableItems=that.getView().byId("euipTable").getItems();
			var tableLen = tableItems.length;
			for(var i=0;i<tableLen;i++){
				if(tableItems[i].getCells()[1].getValue()==""){
					sap.ui.commons.MessageBox.show("Field cannot be empty",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
					return;
				}else{
			//  tableItems[i].getCells()[0].setEnabled(false);
			//	tableItems[i].getCells()[0].setEditable(false);
				tableItems[i].getCells()[0].addStyleClass("tooltip tooltipFontColor");
				tableItems[i].getCells()[0].setTooltip(tableItems[i].getCells()[0].getValue());
			//	tableItems[i].getCells()[1].setEnabled(false);
				}
			}
		//	that.getEqSmData("EQ");
			var clItem= new sap.m.ColumnListItem({
				cells:[
				      new sap.m.ComboBox({
				    	  width:"100%",
				    	  items:{
				    	  path:'oEqSamModel>/priceListItemDtoList',
				    	  template: new sap.ui.core.Item({
		 	                   	text:'{oEqSamModel>item}'
		 	                	   })
				      			},
				      	selectionChange:function(oEvt){
							   		  that.getEqOrSmPrice(oEvt);
							   	  }}).addStyleClass("dropDownClass"),
				      new sap.m.Input({maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
				   		  that.calculateSubTotal(oEvent);
				   	  }}),
				   	  new sap.m.Input({liveChange:function(oEvent){
				   		  that.calculateSubTotal(oEvent);
				   	  },enabled:false}),
				   	  new sap.m.Input({editable:false}).addStyleClass("tooltip tooltipFontColor"),
				   	  new sap.m.Input({liveChange : function(oEvent){
				   		  that.CalculateTotal(oEvent);
				   	  },enabled:false})
				      ]});
		}
		
		else if(tableId=="smTable"){
			var tableItems=that.getView().byId("smTable").getItems();
			var tableLen = tableItems.length;
			for(var i=0;i<tableLen;i++){
				if(tableItems[i].getCells()[1].getValue()==""){
					sap.ui.commons.MessageBox.show("Field cannot be empty",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
					return;
				}else{
					tableItems[i].getCells()[0].addStyleClass("tooltip tooltipFontColor");
					tableItems[i].getCells()[0].setTooltip(tableItems[i].getCells()[0].getValue());
				}
			}
			var clItem= new sap.m.ColumnListItem({
				cells:[
				      new sap.m.ComboBox({
				    	  width:"100%",
				    	  items:{
				    	  path:'oSamModel>/priceListItemDtoList',
				    	  template: new sap.ui.core.Item({
		 	                   	text:'{oSamModel>item}'
		 	                	   })
				      			},
				      	  selectionChange:function(oEvt){
							   		  that.getSmPrice(oEvt);
							   	  }}).addStyleClass("dropDownClass"),
				      new sap.m.Input({maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
				   		  that.calculateSubTotal(oEvent);
				   	  }}),
				   	  new sap.m.Input({liveChange:function(oEvent){
				   		  that.calculateSubTotal(oEvent);
				   	  },enabled:false}),
				   	  new sap.m.Input({editable:false}).addStyleClass("tooltip tooltipFontColor"),
				   	  new sap.m.Input({liveChange : function(oEvent){
				   		  that.CalculateTotal(oEvent);
				   	  },enabled:false})
			]});
		}
		var matTabItems=matTable.getItems();
		if(matTabItems.length>11){
				sap.ui.commons.MessageBox.show("No more rows can be added",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}else{
				var index=(matTabItems.length);
				matTable.insertItem(clItem,index);
				that.attachReadOnly(clItem.getCells()[0]);
			}
	},
	
	attachReadOnly: function(cell1){
		cell1.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},cell1);

		/*cell2.addEventDelegate({
			onAfterRendering: function(){
			var oDateInner = this.$().find('.sapMInputBaseInner');
			var oID = oDateInner[0].id;
			$('#'+oID).attr("readOnly", true); 
			this.$().find("input").attr("readonly", true);
		}},cell2);*/
	},
		
		
	delColumn:function(evt){
		var that = this;
		var matTable=evt.getSource().getParent().getParent();
		var tableId=matTable.getId().split("--")[1];
	//	matTable.setMode("MultiSelect");
		var tableItems=matTable.getItems();
		var selItems=matTable.getSelectedItems();
		var selItemsLen=selItems.length;
		if(selItemsLen>0){
				for(var i=0;i<selItemsLen;i++){
					if(tableId=="mattable"){
						selItems[i].getCells()[1].setValue("");
						selItems[i].getCells()[1].fireLiveChange(evt);
						matTable.removeItem(selItems[i]);
					}
					else if(tableId=="euipTable" || tableId=="smTable"){
						selItems[i].getCells()[4].setValue("");
						selItems[i].getCells()[4].fireLiveChange(evt);
						matTable.removeItem(selItems[i]);
					}
				}
			}else{
				sap.ui.commons.MessageBox.show("Select an item to remove",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
	},
	
	calculateSubTotal:function(evt){
		var listItem=evt.getSource().getParent();
		var tableId=listItem.getParent().getId().split("--")[1];
		if(tableId=="mantable"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
					var input1 = (parseFloat(listItem.getCells()[1].getValue()))||0;
					var input2 = (parseFloat(listItem.getCells()[2].getValue()))||0;
					var input3 = (input1*input2).toFixed(2);
					evt.getSource().setValueState(sap.ui.core.ValueState.None);
					listItem.getCells()[4].setValue(input3);
					listItem.getCells()[4].fireLiveChange(evt);
		}
		else if(tableId=="euipTable" || tableId=="smTable"){
			var input1=(parseFloat(listItem.getCells()[1].getValue()))||0;
			var input2=(parseFloat(listItem.getCells()[2].getValue()))||0;
			var input3=(input1*input2).toFixed(2);
			listItem.getCells()[4].setValue(input3);
			listItem.getCells()[4].fireLiveChange(evt);
		}
		
		else if(tableId=="mpTbl"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			var input1=(parseFloat(listItem.getCells()[1].getValue()))||0;
			var input2=(parseFloat(listItem.getCells()[2].getValue()))||0;
			var input3=(input1*input2).toFixed(2);
			evt.getSource().setValueState(sap.ui.core.ValueState.None);
			listItem.getCells()[4].setValue(input3);
			listItem.getCells()[4].fireLiveChange(evt);
		}
	},
	
	numDecValidation: function(evt){
		getTrimUiInputVal(evt); // Edited by Darshna on 07/07/2017 - Trim the string for whitespace at the start and end
		var listItem=evt.getSource().getParent();
		var tableId=listItem.getParent().getId().split("--")[1];
		var regex = /^\d{1,4}(\.\d{1,2})?$/;
		if(tableId=="euipTable" || tableId=="smTable"){
			if (!regex.test(listItem.getCells()[1].getValue())) {
				sap.m.MessageToast.show("Please enter numeric value in XXXX or XXXX.XX format");
				listItem.getCells()[1].setValue("");
				listItem.getCells()[4].setValue(0);
				listItem.getCells()[4].fireLiveChange(evt);
			}
		}
		else if(tableId=="mpTbl"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			if (!regex.test(selectedVal)) {
				sap.m.MessageToast.show("Please enter numeric value in XXXX or XXXX.XX format");
				evt.getSource().setValue("");
				listItem.getCells()[4].setValue(0);
				listItem.getCells()[4].fireLiveChange(evt);
			}
		}
		else if(tableId=="mattable"){
			var regex = /^\d{1,7}(\.\d{1,2})?$/;
			if (!regex.test(listItem.getCells()[1].getValue())) {
				sap.m.MessageToast.show("Please enter numeric value in XXXXXXX or XXXXXXX.XX format");
				listItem.getCells()[1].setValue("");
				listItem.getCells()[1].fireLiveChange(evt);
			}
		}
		else if(tableId=="mantable"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			if (!regex.test(selectedVal)) {
				sap.m.MessageToast.show("Please enter numeric value in XXXX or XXXX.XX format");
			//	evt.getSource().setValueState(sap.ui.core.ValueState.Error);
				evt.getSource().setValue("");
				listItem.getCells()[4].setValue(0);
				listItem.getCells()[4].fireLiveChange(evt);
			}
		}
	},
	
	decimalValChk : function(oEvent){
		/*var regex = /^[0-9]{1,3}(\.[0-9]{1,2})?$/ ;
		var selectedVal = oEvent.getParameter("newValue");
		if (!regex.test(selectedVal)) {
			sap.ui.commons.MessageBox.show("Please enter numeric value with two decimal digit",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			oEvent.getSource().setValue("");
		}else{
			oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
		}
*/	},

	cwsTotalValue : function(){
		var that= this;
		var matCharge= parseFloat(that.getView().byId('totmatchargeipt').getValue())||0;
		var manPowerCharge =parseFloat(that.getView().byId('totmanchargeipt').getValue())||0;
		var total = parseFloat(matCharge)+parseFloat(manPowerCharge);
		that.getView().byId('cwsTotalEstCharge').setValue(total.toFixed(2));
		that.getView().byId('cwsTotalEstCharge').setValueState("None");
	},
	
	ncwsTotalValue : function(){
		var that= this;
		var equipCharge= parseFloat(that.getView().byId('ncwstotequipcharge').getValue())||0;
		var smCharge= parseFloat(that.getView().byId('ncwstotsmcharge').getValue())||0;
		var mpCharge =parseFloat(that.getView().byId('ncwsmptotalcharge').getValue())||0;
		var total = parseFloat(equipCharge)+parseFloat(mpCharge)+parseFloat(smCharge);
		that.getView().byId('ncwstotalEstimatedCharge').setValue(total.toFixed(2));
		that.getView().byId('ncwstotalEstimatedCharge').setValueState("None");
	},
	
	// binding Eq/Sm Unit Price data to table
	loadEqOrSm : function(oEvt){
		var that= this;
		var tableListItem = oEvt.getSource().getParent();
		tableListItem.getCells()[0].setValue("");
		tableListItem.getCells()[1].setValue("");
		tableListItem.getCells()[2].setValue("");
		tableListItem.getCells()[3].setValue("");
		var eqSamKey = oEvt.getParameter("selectedItem").getKey();
		//var eqSamKey = oEvt.getParameter().getSelectedItem().getProperty("key");
		that.getEqSmData(eqSamKey);
		tableListItem.getCells()[0].clearSelection();
		tableListItem.getCells()[0].setEnabled(true);
	},
	
	getEqSmData: function(type){
		var that=this;
		var oEqSamModel = new sap.ui.model.json.JSONModel();
		var eqPricePayload ={
				"labId" : that.getView().getModel("oDBModel").getData().requestHeaderDto.labId,
				"userType" : that.getView().getModel("sscRequesterModel").getData().userType,
				"orgType" : that.getView().getModel("sscRequesterModel").getData().orgTypeId,
				"type":type };
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		oEqSamModel.loadData("/kclrfs/rest/pricelist/read",JSON.stringify(eqPricePayload),false,"POST",false,false,oHeader);
		oEqSamModel.iSizeLimit=oEqSamModel.getData().priceListItemDtoList.length;
		that.getView().setModel(oEqSamModel,"oEqSamModel");
	},
	
	getEqOrSmPrice : function(oEvt){
		var tableListItem = oEvt.getSource().getParent();
		tableListItem.getCells()[1].setValue("");
		var itemData= oEvt.getParameter("selectedItem").getBindingContext("oEqSamModel").getObject();
		tableListItem.getCells()[2].setValue(itemData.unitPrice);
		tableListItem.getCells()[3].setValue(itemData.uom);
		tableListItem.getCells()[3].setTooltip(itemData.uom);
		//tableListItem.getCells()[1].setEnabled(false);
	},
	
	getSmData: function(type){
		var that=this;
		var oSamModel = new sap.ui.model.json.JSONModel();
		var eqPricePayload ={
				"labId" : that.getView().getModel("oDBModel").getData().requestHeaderDto.labId,
				"userType" : that.getView().getModel("sscRequesterModel").getData().userType,
				"orgType" : that.getView().getModel("sscRequesterModel").getData().orgTypeId,
				"type":type };
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		oSamModel.loadData("/kclrfs/rest/pricelist/read",JSON.stringify(eqPricePayload),false,"POST",false,false,oHeader);
		oSamModel.iSizeLimit=oSamModel.getData().priceListItemDtoList.length;
		that.getView().setModel(oSamModel,"oSamModel");
		},
	
	
	getSmPrice : function(oEvt){
		var tableListItem = oEvt.getSource().getParent();
		tableListItem.getCells()[1].setValue("");
		var itemData= oEvt.getParameter("selectedItem").getBindingContext("oSamModel").getObject();
		tableListItem.getCells()[2].setValue(itemData.unitPrice);
		tableListItem.getCells()[3].setValue(itemData.uom);
		tableListItem.getCells()[3].setTooltip(itemData.uom);
		//tableListItem.getCells()[1].setEnabled(false);
	},
	
	// Non CWS Manpower table
	getnonCwsMPData: function(type){
		var that=this;
		var oMpModel = new sap.ui.model.json.JSONModel();
		var mpPricePayload ={
				"labId" : that.getView().getModel("oDBModel").getData().requestHeaderDto.labId,
				"userType" : that.getView().getModel("sscRequesterModel").getData().userType,
				"orgType" : that.getView().getModel("sscRequesterModel").getData().orgTypeId,
				"type":type };
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		oMpModel.loadData("/kclrfs/rest/pricelist/read",JSON.stringify(mpPricePayload),false,"POST",false,false,oHeader);
		oMpModel.iSizeLimit=oMpModel.getData().priceListItemDtoList.length;
		that.getView().setModel(oMpModel,"oMpModel");
	},
		
		
// Scientis multi combo box
	readScientist : function(oEvent){
		var that =this;
//		var labKey=keyLab;
		var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
		var serviceArea= that.getView().getModel("oDBModel").getData().serviceAreaDto.serviceAreaDesc;
		var oReadScientistModel = new sap.ui.model.json.JSONModel();
		//var rfsNo =  oData.rfsNo; 
		oReadScientistModel.loadData("/kclrfs/rest/user/teamMembers/"+labKey+"/"+serviceArea,null,false);
		if(oReadScientistModel.getData()==undefined){
		}else{
			if(!(oReadScientistModel.getData().userDtoList instanceof Array)){
				oReadScientistModel.getData().userDtoList=[oReadScientistModel.getData().userDtoList];
			}
			that.getView().setModel(oReadScientistModel,"oReadScientistModel");
		}
	},

	changeScientistSelection:function(oEvent){
		var that=this;
		var selText=oEvent.getParameter("changedItem").getText();
		var selKey=oEvent.getParameter("changedItem").getKey();
		if(oEvent.getParameter("selected")){
			serviceScopeScientistList.push({"assignScientistNm":selText,"assignScientistId":selKey});
			scientistUidList.push({"labTeamMemberUid":oEvent.getParameter("changedItem").getBindingContext("oReadScientistModel").getObject().userUniqueId});
		}else{
			that.findAndRemove(serviceScopeScientistList,"assignScientistNm",selText);
			that.findAndRemove(scientistUidList,"labTeamMemberUid",oEvent.getParameter("changedItem").getBindingContext("oReadScientistModel").getObject().userUniqueId);
		}
	},

	finishScientistSelection:function(oEvent){
			var that=this;
		},
			
	// sscAccptance for requester with task no 8
	/*sscAccRej: function(){
		var that =this; 

		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="SSC Reject";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Rejected";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=2;
		that.completeTask(data,msg);
		}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}

		},*/
		
	commentTask : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('comm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}else{
			var dbData = that.getView().getModel("oDBModel").getData();
			var data = that.getView().getModel("taskJsonModel").getData();
			dbData.requestHeaderDto.statusDesc="Scope and Charges Rejected";
			dbData.serviceScopeDto.requsterComment = comments;
			dbData.serviceScopeDto.isRequesterAccept=false;
			if(data.userTypeNo==3){
			var termsConditionsDto ={"description":that.getView().byId("termsNcondition").getContent(),
					"title":that.getView().byId("reqtAccept").getContent()};
					if(dbData.termsConditionsDto==undefined){
					dbData.termsConditionsDto = termsConditionsDto;
					}
			dbData.termsConditionsToBeSaved = true;
			}
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
			}else{
				sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	
	sscAccRej: function(){
		var that = this;
		if (!that.commDialog) {
			that.commDialog = sap.ui.xmlfragment("corelabs.fragments.commentBox", this);
			that.getView().addDependent(this.commDialog);
			that.commDialog.addStyleClass("sapUiSizeCompact");
		}
		that.commDialog.open();
	},
		
		
	closeCommDialog : function(oEvent){
		var that = this;
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.commDialog.close();
	},

	pendingTask : function(oEvent){
		var that = this;
		var comments = sap.ui.getCore().byId('taskapprComm').getValue().trim();
		if(comments==""||comments==null){
			sap.ui.commons.MessageBox.show("Please enter comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		}else{
			var that =this; 
			var dbData = that.getView().getModel("oDBModel").getData();
			var data = that.getView().getModel("taskJsonModel").getData();
			dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
			dbData.serviceScopeDto.requsterComment = comments;
			if(data.userTypeNo==3){
			var termsConditionsDto ={"description":that.getView().byId("termsNcondition").getContent(),
					"title":that.getView().byId("reqtAccept").getContent()};
					if(dbData.termsConditionsDto==undefined){
					dbData.termsConditionsDto = termsConditionsDto;
					}
			dbData.termsConditionsToBeSaved = true;
			}
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
				var msg="Change request submitted";
				data.uiActionNo=3;
				that.completeTask(data,msg);
			}else{
				sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
			}
		}
	},
	sscAccReqCh : function(){
		var that = this;
		if (!that.pendingDialog) {
			that.pendingDialog = sap.ui.xmlfragment("corelabs.fragments.apprCommentBox", this);
			that.getView().addDependent(this.pendingDialog);
			that.pendingDialog.addStyleClass("sapUiSizeCompact");
		}
		 this.pendingDialog.open();
	},
	
	closeDialog : function(oEvent){
		var that = this;
		oEvent.getSource().getParent().getParent().getParent().getContent()[1].setValue("");
		that.pendingDialog.close();
	},
	
	sscAccAppr : function(){
		var that =this; 
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.requestHeaderDto.statusDesc="Scope and Charges Approved";
		dbData.serviceScopeDto.isRequesterAccept=true;
		var data = that.getView().getModel("taskJsonModel").getData();
		if(data.userTypeNo==3){
		var termsConditionsDto ={"description":that.getView().byId("termsNcondition").getContent(),
				"title":that.getView().byId("reqtAccept").getContent()};
				if(dbData.termsConditionsDto==undefined){
				dbData.termsConditionsDto = termsConditionsDto;
				}
		dbData.termsConditionsToBeSaved = true;
		}
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Accepted";
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Request not created, please try again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
		}
	},
			
	handleChange: function(oEvent){
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
		}
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf kaust_corelabs.ServiceScopeCharges
*/
	onBeforeRendering: function() {
//		var that=this;
//		setTimeout(function(){ 
//			that.getView().getContent()[0].scrollTo(0);
//		}, 1000);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust_corelabs.ServiceScopeCharges
*/
	onAfterRendering: function() {
		var that=this;
//  	that.getView().byId("cwsdateP").$().find("input").attr("readonly", true);
		that.getView().byId("dateP").$().find("input").attr("readonly", true);
		that.getView().byId("mInp").$().find("input").attr("readonly", true);
//		that.getView().byId("eqSmItems").$().find("input").attr("readonly", true);
//		that.getView().byId("eqSmcb").$().find("input").attr("readonly", true);
//		$(".dropDownClass").find("input").attr("readonly", true);
		if(that.getView().getModel("oDBModel").getData().serviceScopeDto){
			setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
			}, 1000);
		}
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf kaust_corelabs.ServiceScopeCharges
*/
//	onExit: function() {
//
//	}

});
var serviceScopeScientistList=[];
var scientistUidList=[];
var taskId="";
var taskJsonModel= new sap.ui.model.json.JSONModel();
var oDBModel = new sap.ui.model.json.JSONModel();