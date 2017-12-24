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
    
	taskId=this.getTask();
	if(taskId!=""){
		this.rejectDialog = sap.ui.xmlfragment("corelabs.fragments.sscRejTask", this);
	    this.getView().addDependent(this.rejectDialog);
	    this.rejectDialog.addStyleClass("sapUiSizeCompact");
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
				  that.getView().setModel(oDBModel,"oDBModel");
				//to get the requester model for data binding
				  
				  
				  
				  var labKey = oDBModel.getData().requestHeaderDto.labId;
				  	if(labKey=="CWS"){
					  that.getView().byId('cws').setVisible(true);
					  that.getView().byId('noncws').setVisible(false);
					  var sscData =oDBModel.getData().serviceScopeDto;
					  if(sscData){
							that.getView().byId('cwsSerScope').setValue(sscData.finalScopeCharge);
							var expDate = new Date(sscData.estCompletionDate); 
							that.getView().byId('cwsdateP').setDateValue(expDate); 
							 if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMT instanceof Array)){
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
							  that.getView().byId('cwsTotalEstCharge').setValue(sscData.totalEstServiceCharge);
					  }
					  
				  }else{
					  that.getView().byId('cws').setVisible(false);
					  that.getView().byId('noncws').setVisible(true);
					  var sscData =oDBModel.getData().serviceScopeDto;
					  if(labKey=="BCL"){
						  that.getView().byId('bclLab').setVisible(true);
					  }
					  
					  var requesterModel =new sap.ui.model.json.JSONModel();
					  requesterModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.requesterId,null,false);
					  that.getView().setModel(requesterModel,"sscRequesterModel");
					  
					  if(sscData){
						  if(sscData.isRoutineStandard=="true"){that.getView().byId('routine').setSelected(true);}
						  else{that.getView().byId('routine').setSelected(false);}
						  if(sscData.isAdvanceCustom=="true"){that.getView().byId('advCustom').setSelected(true);}
						  else{that.getView().byId('advCustom').setSelected(false);}
							that.getView().byId('sampleclfText').setValue(sscData.sampleClarification);
							that.getView().byId('methodappText').setValue(sscData.methodApplied);
							that.getView().byId('delivText').setValue(sscData.deliverable);
							that.getView().byId('samplelocText').setValue(sscData.storageLocation);
							 if(sscData.isIBECApprovalReqd=="true"){that.getView().byId('ibec').setSelected(true);}
							  else{that.getView().byId('ibec').setSelected(false);}
							 if(sscData.isMatTranAgreemntReqd=="true"){that.getView().byId('matTransport').setSelected(true);}
							  else{that.getView().byId('matTransport').setSelected(false);}
							that.getView().byId('ncwstotalEstimatedCharge').setValue(sscData.totalEstServiceCharge);
							var expDate = new Date(sscData.estCompletionDate);      
							that.getView().byId('dateP').setDateValue(expDate); 
					  
							if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM instanceof Array)){
								that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM];
							}
						  var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM;
						  
						  if(eqOrSamData && eqOrSamData.length>=1){
						  
						  that.getView().byId('euipTable').bindItems("oDBModel>/estimatedServiceChargeDtoListEQ_SM",new sap.m.ColumnListItem({
								cells:[
									      new sap.m.ComboBox({
									    	  items:[
									    	 new sap.ui.core.Item({
							 	                   	text:'Equipment',
							 	                   	key:'EQ'}),
							 	                   	new sap.ui.core.Item({
								 	                   	text:'Sample/Consumables',
								 	                   	key:'SM'})
									      			],
									      			selectedKey: '{oDBModel>type}',
									      			selectionChange: function(oEvt){
									    	  		that.loadEqOrSm(oEvt);
									   	  }}),
									      new sap.m.ComboBox({
									    	  items:{
									    	  path:'oEqSamModel>/priceListItemDtoList',
									    	  template: new sap.ui.core.Item({
							 	                   	text:'{oEqSamModel>item}'
							 	                	   })
									      			},
									      			value : '{oDBModel>desc}',	
									      	selectionChange:function(oEvt){
												   		  that.getEqOrSmPrice(oEvt);
												   	  }}),
									      new sap.m.Input({value : '{oDBModel>quantity}',type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
									   		  that.calculateSubTotal(oEvent);
									   	  }}),
									   	  new sap.m.Input({value : '{oDBModel>price}',liveChange:function(oEvent){
									   		  that.calculateSubTotal(oEvent);
									   	  },enabled:false}),
									   	  new sap.m.Input({value : '{oDBModel>uom}',enabled:false}),
									   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
									   		  that.CalculateTotal(oEvent);
									   	  },enabled:false})
									      ]})); 
						  that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM);
						  
						  var eqItems = that.getView().byId('euipTable').getItems();
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
						  } 
						  
					  } 
					  
					 
					  var mpData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMP;
					  if(mpData && mpData.length>1){
						  var size=mpData.length;
						  that.getView().byId('mpTbl').bindItems("oDBModel>/estimatedServiceChargeDtoListMP",new sap.m.ColumnListItem({
								cells:[
									      new sap.m.Text({
									      			text :'{oDBModel>desc}'
									      			}),
									      new sap.m.Input({value : '{oDBModel>quantity}',type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
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
							 that.getView().byId('mInp').setValue(sciList); 
							 }
						  }else{
						  that.readScientist();
					  }
					 }
				  
				  if(oDBModel.getData().requestHeaderDto.labDirectorId && !(oDBModel.getData().requestHeaderDto.labDirectorId.indexOf("_")>-1)){
					  var dirNameModel =new sap.ui.model.json.JSONModel();
					  dirNameModel.loadData("/utilweb/rest/user/auth/read/"+oDBModel.getData().requestHeaderDto.labDirectorId,null,false);
					  that.getView().byId("labDir").setValue(dirNameModel.getData().firstNm+" "+dirNameModel.getData().lastNm); 
				  }
				  	
				  if(taskData.taskNo==6){
						that.getView().byId('dirRev').setVisible(true);
						that.getView().byId('dirSec').setVisible(false);
						that.disableFields();
					}else if(taskData.taskNo==4||taskData.taskNo==7){
						that.getView().byId('ltSscRev').setVisible(true);
						//that.disableFields();
						if(labKey!="CWS"){
						that.getEqSmData("EQ");
						that.getnonCwsMPData("MP");
						}
						that.getView().byId('dirSec').setVisible(false);
					}else if(taskData.taskNo==8){
						that.disableFields();
						if(taskData.userTypeNo==3){
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
						that.getView().byId('dirSec').setVisible(false);
						that.disableFields();
					}else if(taskData.taskNo==10){
						that.getView().byId('piAuthPer').setVisible(true);
						that.getView().byId('dirSec').setVisible(true);
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
							that.getView().byId('maSlaPayment').setText("Pending Payment");
						}
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
					}
		 },function(oError){
	  			sap.ui.commons.MessageBox.show("Error while fetching Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
	//var rfsNo="1001600339";
	
	
	var oDBModel = new sap.ui.model.json.JSONModel();
	oDBModel.loadData("/kclrfs/rest/requestheader/readWrapper/"+rfsNo,null,false);
	that.getView().setModel(oDBModel,"oDBModel");
	if(oDBModel.getData().requestHeaderDto.labId){
	var labKey = oDBModel.getData().requestHeaderDto.labId;
  	if(labKey=="CWS"){
	  that.getView().byId('cws').setVisible(true);
	  that.getView().byId('noncws').setVisible(false);
	  var sscData =oDBModel.getData().serviceScopeDto;
	  if(sscData){
		  that.getView().byId('mtAdd').setVisible(false);
		  that.getView().byId('mtRemove').setVisible(false);
			that.getView().byId('cwsSerScope').setValue(sscData.finalScopeCharge);
			var expDate = new Date(sscData.estCompletionDate); 
			that.getView().byId('cwsdateP').setDateValue(expDate); 
			 if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMT instanceof Array)){
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
							   	  new sap.m.Input({value : '{oDBModel>price}',type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
							   		  that.calculateSubTotal(oEvent);
							   	  }}),
							   	  new sap.m.Input({value : '{oDBModel>uom}',enabled:false}),
							   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
							   		  that.CalculateTotal(oEvent);
							   	  },enabled:false})
							      ]}));  
				  that.getView().byId('totmanchargeipt').setValue(oDBModel.getData().estimatedServiceChargeSubTotalCWS_MP);
			  }
			  that.getView().byId('cwsTotalEstCharge').setValue(sscData.totalEstServiceCharge);
	  }
	  
  }else{
	  that.getView().byId('cws').setVisible(false);
	  that.getView().byId('noncws').setVisible(true);
	  var sscData =oDBModel.getData().serviceScopeDto;
	  if(sscData){
		  that.getView().byId('eqAdd').setVisible(false);
		  that.getView().byId('eqRemove').setVisible(false);
		  if(sscData.isRoutineStandard=="true"){that.getView().byId('routine').setSelected(true);}
		  else{that.getView().byId('routine').setSelected(false);}
		  if(sscData.isAdvanceCustom=="true"){that.getView().byId('advCustom').setSelected(true);}
		  else{that.getView().byId('advCustom').setSelected(false);}
			that.getView().byId('sampleclfText').setValue(sscData.sampleClarification);
			that.getView().byId('methodappText').setValue(sscData.methodApplied);
			that.getView().byId('delivText').setValue(sscData.deliverable);
			that.getView().byId('samplelocText').setValue(sscData.storageLocation);
			 if(sscData.isIBECApprovalReqd=="true"){that.getView().byId('ibec').setSelected(true);}
			  else{that.getView().byId('ibec').setSelected(false);}
			 if(sscData.isMatTranAgreemntReqd=="true"){that.getView().byId('matTransport').setSelected(true);}
			  else{that.getView().byId('matTransport').setSelected(false);}
			that.getView().byId('ncwstotalEstimatedCharge').setValue(sscData.totalEstServiceCharge);
			var expDate = new Date(sscData.estCompletionDate);      
			that.getView().byId('dateP').setDateValue(expDate); 
	  
		 if(!(that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM instanceof Array)){
				that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM=[that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM];
			}
		  var eqOrSamData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListEQ_SM;
		  if(eqOrSamData && eqOrSamData.length>=1){
		 
		  that.getView().byId('euipTable').bindItems("oDBModel>/estimatedServiceChargeDtoListEQ_SM",new sap.m.ColumnListItem({
				cells:[
					      new sap.m.ComboBox({
					    	  items:[
					    	 new sap.ui.core.Item({
			 	                   	text:'Equipment',
			 	                   	key:'EQ'}),
			 	                   	new sap.ui.core.Item({
				 	                   	text:'Sample/Consumables',
				 	                   	key:'SM'})
					      			],
					      			value : '{oDBModel>type}',
					      			selectionChange: function(oEvt){
					    	  		that.loadEqOrSm(oEvt);
					   	  }}),
					      new sap.m.ComboBox({
					    	  items:{
					    	  path:'oEqSamModel>/priceListItemDtoList',
					    	  template: new sap.ui.core.Item({
			 	                   	text:'{oEqSamModel>item}'
			 	                	   })
					      			},
					      			value : '{oDBModel>desc}',	
					      	selectionChange:function(oEvt){
								   		  that.getEqOrSmPrice(oEvt);
								   	  }}),
					      new sap.m.Input({value : '{oDBModel>quantity}',maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
					   		  that.calculateSubTotal(oEvent);
					   	  }}),
					   	  new sap.m.Input({value : '{oDBModel>price}',liveChange:function(oEvent){
					   		  that.calculateSubTotal(oEvent);
					   	  },enabled:false}),
					   	  new sap.m.Input({value : '{oDBModel>uom}',enabled:false}),
					   	  new sap.m.Input({value : '{oDBModel>subTotal}',liveChange : function(oEvent){
					   		  that.CalculateTotal(oEvent);
					   	  },enabled:false})
					      ]})); 
		  that.getView().byId('ncwstotequipcharge').setValue(oDBModel.getData().estimatedServiceChargeSubTotalEQ_SM);
		  
		  var eqItems = that.getView().byId('euipTable').getItems();
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
		  } 
	  }
	  
	 
	  var mpData= that.getView().getModel("oDBModel").getData().estimatedServiceChargeDtoListMP;
	  if(mpData && mpData.length>1){
		  var size=mpData.length;
		  that.getView().byId('mpTbl').bindItems("oDBModel>/estimatedServiceChargeDtoListMP",new sap.m.ColumnListItem({
				cells:[
					      new sap.m.Text({
					      			text :'{oDBModel>desc}'
					      			}),
					      new sap.m.Input({value : '{oDBModel>quantity}',type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
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
  }
  	that.disableFields();
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
	var bValidate=false;
	 var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
	var aId;
	if(labKey=="CWS"){
		aId=["cwsSerScope","cwsdateP"];  //"labDir"
	  }else{
		aId=["dateP","ncwstotalEstimatedCharge"];  //"labDir",
	  }
	
	//		var aProperties=["value"]; "mInp","totalamt1","totalamt2",
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
		that.ltSubmit();
		}
},*/

validateltSubmit:function(){
	var that=this;
	var bValidate=false;
	 var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
	var aId;
	if(labKey=="CWS"){
		aId=["cwsSerScope","cwsdateP"];  //"labDir"
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
				bValidate=false;
				break;
			}
		}
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
		that.ltSubmit();
		}
},

getNonCwsData : function(){
	var that=this;
	var taskData = that.getView().getModel("taskJsonModel").getData();
	var serviceScopeDto={
		 "isRoutineStandard": that.getView().byId('routine').getSelected(),
		 "isAdvanceCustom": that.getView().byId('advCustom').getSelected(),
		 "sampleClarification": that.getView().byId('sampleclfText').getValue(),
		 "methodApplied": that.getView().byId('methodappText').getValue(),
		 "deliverable": that.getView().byId('delivText').getValue(),
		 "storageLocation":that.getView().byId('samplelocText').getValue(),
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
		"finalScopeCharge":that.getView().byId('cwsSerScope').getValue(),
		 "totalEstServiceCharge":  that.getView().byId('cwsTotalEstCharge').getValue(),
		 "estCompletionDate":that.getEstComplDate(that.getView().byId('cwsdateP').getDateValue()),
		 
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
	 var mpArr=[];
	 var labKey = dbData.requestHeaderDto.labId;
		if(labKey=="CWS"){
			serviceScopeDto = that.getCwsData();
			var mtItems = that.getView().byId('mattable').getItems();
			var mtItemsLen = mtItems.length;
			for(var i=0;i<mtItemsLen;i++)
			{
				eqOrMtArr.push({"sNo":i,"type":"MT","desc":mtItems[i].getCells()[0].getValue(),"quantity":"1","price":mtItems[i].getCells()[1].getValue()});
			}
			dbData.estimatedServiceChargeDtoListMT= eqOrMtArr;
			
			var mpItems = that.getView().byId('mantable').getItems();
			var mpItemsLen = mpItems.length;
			for(var i=0;i<mpItemsLen;i++)
			{
				mpArr.push({"sNo":i,"type":"CWS_MP","desc":mpItems[i].getCells()[0].getText(),"quantity":mpItems[i].getCells()[1].getValue(),"price":mpItems[i].getCells()[2].getValue(),"uom":mpItems[i].getCells()[3].getValue()});
			}
			dbData.estimatedServiceChargeDtoListCWS_MP= mpArr;
		  }else{
			  serviceScopeDto = that.getNonCwsData();
			  	var eqItems = that.getView().byId('euipTable').getItems();
				var eqItemsLen = eqItems.length;
				for(var i=0;i<eqItemsLen;i++)
				{
					eqOrMtArr.push({"sNo":i,"type":eqItems[i].getCells()[0].getSelectedKey(),"desc":eqItems[i].getCells()[1].getValue(),"quantity":eqItems[i].getCells()[2].getValue(),"price":eqItems[i].getCells()[3].getValue(),"uom":eqItems[i].getCells()[4].getValue()});
				}
				dbData.estimatedServiceChargeDtoListEQ_SM= eqOrMtArr;
				
				var mpItems = that.getView().byId('mpTbl').getItems();
				var mpItemsLen = mpItems.length;
				for(var i=0;i<mpItemsLen;i++)
				{
					mpArr.push({"sNo":i,"type":"MP","desc":mpItems[i].getCells()[0].getText(),"quantity":mpItems[i].getCells()[1].getValue(),"price":mpItems[i].getCells()[2].getValue(),"uom":mpItems[i].getCells()[3].getValue()});
				}
				dbData.estimatedServiceChargeDtoListMP= mpArr;    
		  }
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
			sap.ui.commons.MessageBox.show("Record not Created, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
	//db save for (comments)
	var comments = sap.ui.getCore().byId('sscTaskRejectionComm').getValue().trim();
	if(comments==""||comments==null){
		sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		//alert("Please Enter Comments");
	}else{
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.serviceScopeDto.labDirectorComment=comments;
	dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
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
	}
},

dirReviewAppr : function(){
	var that =this;
	//db save for (comments)
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
		var msg="Approved successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

/*//'SSC Re-Review Task' for Lab Team Lead with taskNo = 7;
sscReviewSub : function(){
	var that =this;
	//db save for (comments)
	var data = that.getView().getModel("taskJsonModel").getData();
	data.uiActionNo=1;
	that.completeTask(data);
},*/

//'SSC Reject Task' for Lab Team Lead with taskNo = 9;
sscRejSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="RFS Rejected";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Rejection submitted";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		sap.ui.commons.MessageBox.show("Error in Rejecting",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
	}
}, 

toReject1 : function(){
	var that =this;
	//db save for (comments)
	var comments = sap.ui.getCore().byId('sscTaskRejectionComm').getValue().trim();
	if(comments==""||comments==null){
		sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		//alert("Please Enter Comments");
	}else{
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.serviceScopeDto.piComment=comments;
	dbData.requestHeaderDto.statusDesc="Scope and Charges Rejected";
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
		sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		//alert("Please Enter Comments");
	}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.serviceScopeDto.piComment=comments;
		dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="Request for change submitted";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=3;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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


closeCommDialog1 : function(){
	var that = this;
	that.commDialog1.close();
},


piAuthPerAppr : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Scope and Charges Approved";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Approved Successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

//'Lab Member selection Task' for Lab Team Lead with taskNo =11
lmSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.serviceScopeDto.serviceScopeScientistList=serviceScopeScientistList;
//	dbData.requestHeaderDto.statusDesc="RFS Assigned";
	//status changed by Abhash
	dbData.requestHeaderDto.statusDesc="Pending SLA Verification";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},

// 'SLA/paymnet verify Task' for master admin with taskNo =12 
maSlaVerify : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
//	dbData.requestHeaderDto.statusDesc="SLA Verified";
	//Status changed by Abhash
	dbData.requestHeaderDto.statusDesc="RFS Assigned";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Submitted successfully";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
		//alert("Please Enter Comments");
	}else{
		var dbData = that.getView().getModel("oDBModel").getData();
		dbData.serviceScopeDto.masterAdminComment=comments;
//		dbData.requestHeaderDto.statusDesc="Pending SLA Verification";
		// Status changed by Abhash
		dbData.requestHeaderDto.statusDesc="Pending Payment";
		var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
		if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
			var msg="SLA verifiaction submitted";
			var data = that.getView().getModel("taskJsonModel").getData();
			data.uiActionNo=3;
			that.completeTask(data,msg);
		}else{
			sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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


closeCommDialog2 : function(){
	var that = this;
	that.commDialog2.close();
},


//'Payment doc upload confirm Task' for Requester with taskNo = 13;
ltPayDocUpSub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
//	dbData.requestHeaderDto.statusDesc="Pending Payment";
	dbData.requestHeaderDto.statusDesc="Payment Received";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Payment document submitted";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
	}
},
	
//'Design/Sample Resubmission Confirm task' for Requester with taskNo =15
rqSamResub : function(){
	var that =this;
	//db save for (comments)
	var dbData = that.getView().getModel("oDBModel").getData();
	dbData.requestHeaderDto.statusDesc="Sample Resubmitted";
	var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
	if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
		var msg="Sample resubmission submitted";
		var data = that.getView().getModel("taskJsonModel").getData();
		data.uiActionNo=1;
		that.completeTask(data,msg);
	}else{
		sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
	        	sap.ui.commons.MessageBox.show("Error while getting Data",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
	if(evt.getParameter("type")=="removed")
	{
	var selText=evt.getParameter("token").getText();
	that.findAndRemove(serviceScopeScientistList,"assignScientistNm",selText);
	}
},

findAndRemove :function (array, property, value) {
	  array.forEach(function(result, index) {
	    if(result[property] === value) {
	      //Remove from array
	      array.splice(index, 1);
	    }    
	  });
	},
	
disableFields:function(evt){
		var that=this;
		 var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
			var aId;
			if(labKey=="CWS"){
				aId=["cwsSerScope","cwsdateP"];  //,"labDir"
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
				aId=["routine","advCustom","sampleclfText","methodappText","delivText","samplelocText","ibec","matTransport","dateP"];  //,"labDir"
				var eqSmData=that.getView().byId("euipTable").getItems();
				var eqSmDataLen=eqSmData.length;
				for(var i=0;i<eqSmDataLen;i++){
					eqSmData[i].getCells()[0].setEnabled(false);
					eqSmData[i].getCells()[1].setEnabled(false);
					eqSmData[i].getCells()[2].setEnabled(false);
					eqSmData[i].getCells()[3].setEnabled(false);
					eqSmData[i].getCells()[4].setEnabled(false);
					eqSmData[i].getCells()[5].setEnabled(false);
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
				
			  }
			
	//	var aId=["sampleclfText","methodappText","delivText","samplelocText","estchargeText","totalamt1","totalamt2","totalEstimatedCharge","dateP","mInp","labDir"];
//	   ,"asgnScientist","estcomplDP","totalchargeText","totalmanpowerCharge","fdTable","totalamt1","euipTable","bclhbox","scopeandchargesform"		var aProperties=["value"];
		for(var i=0;i<aId.length;i++){
			var oControl = that.getView().byId(aId[i]);
			if((oControl.getEnabled()) || oControl.getId()=="mpTbl" || oControl.getId()=="euipTable"){
				oControl.setEnabled(false);
			}else if(oControl.getId()=="mpTbl" || oControl.getId()=="euipTable"){
				var items=oControl.getItems();
				for(var i=1;i<items.length;i++){
					var tItemControl=items[1];
					if(tItemControl.getEnabled()){
						tItemControl.setEnabled(false);
					}
				}
			}
		}
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
			for(var count=0;count<(matTabItems.length);count++)
				{
					if(tableId=="mattable")
					{ 
					var iptVal=matTable.getItems()[count].getCells()[1].getValue();
					}
					else if(tableId=="mantable")
					{
					var iptVal=matTable.getItems()[count].getCells()[4].getValue();
					}
					else if(tableId=="euipTable")
					{
					var iptVal=matTable.getItems()[count].getCells()[5].getValue();
					}
					else if(tableId=="mpTbl")
					{
						var iptVal=matTable.getItems()[count].getCells()[4].getValue();
					}
					totalVal=totalVal+(parseFloat(iptVal)||0);
				}
//		}
		if(tableId=="mattable")
		{
			that.getView().byId("totmatchargeipt").setValue(totalVal);
			that.getView().byId("totmatchargeipt").fireLiveChange(evt);
		}
		else if(tableId=="mantable")
		{
			that.getView().byId("totmanchargeipt").setValue(totalVal);
			that.getView().byId("totmanchargeipt").fireLiveChange(evt);
		}
		else if(tableId=="euipTable")
		{
			that.getView().byId("ncwstotequipcharge").setValue(totalVal);
			that.getView().byId("ncwstotequipcharge").fireLiveChange(evt);
		}
		else if(tableId=="mpTbl")
		{
			that.getView().byId("ncwsmptotalcharge").setValue(totalVal);
			that.getView().byId("ncwsmptotalcharge").fireLiveChange(evt);
		}
		
//		that.getView().byId("totmatchargeipt").setValue(totalVal);
		
	},
	
	addColumn:function(evt){
		var that = this;
		var matTable=evt.getSource().getParent().getParent();
		matTable.setMode("None");
		var tableId=matTable.getId().split("--")[1];
		
		if(tableId=="mattable"){
		var clItem= new sap.m.ColumnListItem({
			cells:[
			      new sap.m.Input(),
			      new sap.m.Input({liveChange : function(oEvent){
			   		  that.CalculateTotal(oEvent);
			   	  },type:'Number',maxLength:10,change:function(evt){that.numDecValidation(evt);}})
			      ]});
		}
		
		else if(tableId=="euipTable"){
			var clItem= new sap.m.ColumnListItem({
				cells:[
				      new sap.m.ComboBox({
				    	  items:[
				    	 new sap.ui.core.Item({
		 	                   	text:'Equipment',
		 	                   	key:'EQ'}),
		 	                   	new sap.ui.core.Item({
			 	                   	text:'Sample/Consumables',
			 	                   	key:'SM'})
				      			],
				      			value : 'Equipment',
				      			selectedKey:'EQ',
				      			selectionChange: function(oEvt){
				    	  		that.loadEqOrSm(oEvt);
				   	  }}),
				      new sap.m.ComboBox({
				    	  items:{
				    	  path:'oEqSamModel>/priceListItemDtoList',
				    	  template: new sap.ui.core.Item({
		 	                   	text:'{oEqSamModel>item}'
		 	                	   })
				      			},
				      	selectionChange:function(oEvt){
							   		  that.getEqOrSmPrice(oEvt);
							   	  }}),
				      new sap.m.Input({type:"Number",maxLength:7,change:function(evt){that.numDecValidation(evt);},liveChange:function(oEvent){
				   		  that.calculateSubTotal(oEvent);
				   	  }}),
				   	  new sap.m.Input({liveChange:function(oEvent){
				   		  that.calculateSubTotal(oEvent);
				   	  },enabled:false}),
				   	  new sap.m.Input({enabled:false}),
				   	  new sap.m.Input({liveChange : function(oEvent){
				   		  that.CalculateTotal(oEvent);
				   	  },enabled:false})
				      ]});
			clItem.getCells()[0].$().find("input").attr("readonly", true);
			clItem.getCells()[1].$().find("input").attr("readonly", true);
		}
		
		var matTabItems=matTable.getItems();
		if(matTabItems.length>11){
				//alert("No more rows can be added");
				sap.ui.commons.MessageBox.show("No more rows can be added",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
			}
		else{
				var index=(matTabItems.length);
				matTable.insertItem(clItem,index);
			}
	},
	
	delColumn:function(evt){
		var that = this;
		var matTable=evt.getSource().getParent().getParent();
		var tableId=matTable.getId().split("--")[1];
		matTable.setMode("MultiSelect");
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
					else if(tableId=="euipTable"){
						selItems[i].getCells()[5].setValue("");
						selItems[i].getCells()[5].fireLiveChange(evt);
						matTable.removeItem(selItems[i]);
					}
				}
			}else{
				//alert("Select an Item to Remove");
				sap.ui.commons.MessageBox.show("Select an Item to Remove",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				}
	},
	
	calculateSubTotal:function(evt){
		var listItem=evt.getSource().getParent();
		var tableId=listItem.getParent().getId().split("--")[1];
		// mpTbl
		if(tableId=="mantable"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			/*if (selValId.search("hoursId") > -1) {
			//	var regex =  /^\d{1,4}$/;
				var regex = /^\d+(\.\d{1,2})?$/;
				if (!regex.test(selectedVal)) {
					sap.m.MessageToast.show("Invalid! Please Enter Numeric Value");
				//	evt.getSource().setValueState(sap.ui.core.ValueState.Error);
					evt.getSource().setValue("");
				}else{*/
					var input1 = (parseFloat(listItem.getCells()[1].getValue()))||0;
					var input2 = (parseFloat(listItem.getCells()[2].getValue()))||0;
					var input3 = input1*input2;
					evt.getSource().setValueState(sap.ui.core.ValueState.None);
					listItem.getCells()[4].setValue(input3);
					listItem.getCells()[4].fireLiveChange(evt);
//				}
//			}
			/*else if(selValId.search("hoursId") === -1) {
					var input1 = (parseFloat(listItem.getCells()[1].getValue()))||0;
					var input2 = (parseFloat(listItem.getCells()[2].getValue()))||0;
					var input3 = input1*input2;
					listItem.getCells()[4].setValue(input3);
					listItem.getCells()[4].fireLiveChange(evt);
			}*/
		}
		else if(tableId=="euipTable"){
			var input1=(parseFloat(listItem.getCells()[2].getValue()))||0;
			var input2=(parseFloat(listItem.getCells()[3].getValue()))||0;
			var input3=input1*input2;
			listItem.getCells()[5].setValue(input3);
			listItem.getCells()[5].fireLiveChange(evt);
		}
		else if(tableId=="mpTbl"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			//	var regex =  /^\d{1,4}$/;
			//var regex = /^\d+(\.\d{1,2})?$/;

				/*if (!regex.test(selectedVal)) {
					sap.m.MessageToast.show("Invalid! Please Enter Numeric Value");
				//	evt.getSource().setValueState(sap.ui.core.ValueState.Error);
					evt.getSource().setValue("");
					listItem.getCells()[4].setValue("");
					
				}else{*/
					var input1=(parseFloat(listItem.getCells()[1].getValue()))||0;
					var input2=(parseFloat(listItem.getCells()[2].getValue()))||0;
					var input3=input1*input2;
					evt.getSource().setValueState(sap.ui.core.ValueState.None);
					listItem.getCells()[4].setValue(input3);
					listItem.getCells()[4].fireLiveChange(evt);
			//}
		}
	},
	
	numDecValidation: function(evt){
		var listItem=evt.getSource().getParent();
		var tableId=listItem.getParent().getId().split("--")[1];
		var regex = /^\d{1,4}(\.\d{1,2})?$/;
		if(tableId=="euipTable"){
			if (!regex.test(listItem.getCells()[2].getValue())) {
				sap.m.MessageToast.show("Invalid! Please enter in XXXX or XXXX.XX format");
				listItem.getCells()[2].setValue("");
				listItem.getCells()[5].setValue(0);
				listItem.getCells()[5].fireLiveChange(evt);
				
			}
		}
		else if(tableId=="mpTbl"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			if (!regex.test(selectedVal)) {
				sap.m.MessageToast.show("Invalid! Please enter in XXXX or XXXX.XX format");
				evt.getSource().setValue("");
				listItem.getCells()[4].setValue(0);
				listItem.getCells()[4].fireLiveChange(evt);
			}
		}
		else if(tableId=="mattable"){
			var regex = /^\d{1,7}(\.\d{1,2})?$/;
			if (!regex.test(listItem.getCells()[1].getValue())) {
				sap.m.MessageToast.show("Invalid! Please enter in XXXXXXX or XXXXXXX.XX format");
				listItem.getCells()[1].setValue("");
				listItem.getCells()[1].fireLiveChange(evt);
			}
		}
		else if(tableId=="mantable"){
			var selectedVal = evt.getParameter("newValue");
			var selValId = evt.getParameter("id");
			if (!regex.test(selectedVal)) {
				sap.m.MessageToast.show("Invalid! Please enter in XXXX or XXXX.XX format");
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
			sap.ui.commons.MessageBox.show("Invalid! Please Enter Numeric Value with two decimal digit",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		that.getView().byId('cwsTotalEstCharge').setValue(total);
	},
	
	ncwsTotalValue : function(){
		var that= this;
		var equipCharge= parseFloat(that.getView().byId('ncwstotequipcharge').getValue())||0;
		var mpCharge =parseFloat(that.getView().byId('ncwsmptotalcharge').getValue())||0;
		var total = parseFloat(equipCharge)+parseFloat(mpCharge);
		that.getView().byId('ncwstotalEstimatedCharge').setValue(total);
	},
	
	// binding Eq/Sm Unit Price data to table
	
	loadEqOrSm : function(oEvt){
		var that= this;
		var tableListItem = oEvt.getSource().getParent();
		tableListItem.getCells()[1].setValue("");
		tableListItem.getCells()[2].setValue("");
		tableListItem.getCells()[3].setValue("");
		tableListItem.getCells()[4].setValue("");
		var eqSamKey = oEvt.getParameter("selectedItem").getKey();
		that.getEqSmData(eqSamKey);
		tableListItem.getCells()[1].clearSelection();
		tableListItem.getCells()[1].setEnabled(true);
	},
	
	getEqSmData: function(type){
	var that=this;
	var oEqSamModel = new sap.ui.model.json.JSONModel();
	oEqSamModel.iSizeLimit=200;
	var eqPricePayload ={
			"labId" : that.getView().getModel("oDBModel").getData().requestHeaderDto.labId,
			"userType" : that.getView().getModel("sscRequesterModel").getData().userType,
			"orgType" : that.getView().getModel("sscRequesterModel").getData().orgTypeId,
			"type":type };
	var oHeader= {"Content-Type":"application/json;charset=utf-8"};
	oEqSamModel.loadData("/kclrfs/rest/pricelist/read",JSON.stringify(eqPricePayload),false,"POST",false,false,oHeader);
	that.getView().setModel(oEqSamModel,"oEqSamModel");
	},
	
	getEqOrSmPrice : function(oEvt){
		var tableListItem = oEvt.getSource().getParent();
		tableListItem.getCells()[2].setValue("");
		var itemData= oEvt.getParameter("selectedItem").getBindingContext("oEqSamModel").getObject();
		tableListItem.getCells()[3].setValue(itemData.unitPrice);
		tableListItem.getCells()[4].setValue(itemData.uom);
		tableListItem.getCells()[1].setEnabled(false);
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
		that.getView().setModel(oMpModel,"oMpModel");
		},
		
		
// Scientis multi combo box
		
		readScientist : function(oEvent){
			var that =this;
//				var labKey=keyLab;
			var labKey = that.getView().getModel("oDBModel").getData().requestHeaderDto.labId;
			var oReadScientistModel = new sap.ui.model.json.JSONModel();
			//var rfsNo =  oData.rfsNo; 
			oReadScientistModel.loadData("/utilweb/rest/ume/auth/teamMembers/"+labKey,null,false);
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
		if(oEvent.getParameter("selected"))
		{
			serviceScopeScientistList.push({"assignScientistNm":selText,"assignScientistId":selKey});
		}
		else
		{
		that.findAndRemove(serviceScopeScientistList,"assignScientistNm",selText);
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
				sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
				//alert("Please Enter Comments");
			}else{
				var dbData = that.getView().getModel("oDBModel").getData();
				dbData.requestHeaderDto.statusDesc="Scope and Charges Rejected";
				dbData.serviceScopeDto.requsterComment = comments;
				var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
				var oHeader= {"Content-Type":"application/json;charset=utf-8"};
				rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
				if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
				var data = that.getView().getModel("taskJsonModel").getData();
				var msg="Rejected";
				data.uiActionNo=2;
				that.completeTask(data,msg);
				}else{
				sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		
		
		closeCommDialog : function(){
			var that = this;
			that.commDialog.close();
		},

				//Deepak
				pendingTask : function(oEvent){
					var that = this;
					var comments = sap.ui.getCore().byId('taskapprComm').getValue().trim();
					if(comments==""||comments==null){
						sap.ui.commons.MessageBox.show("Please Enter Comments",sap.ui.commons.MessageBox.Icon.INFORMATION,"Information");
						//alert("Please Enter Comments");
					}else{
					var that =this; 
						//db save for (comments)
						var dbData = that.getView().getModel("oDBModel").getData();
						dbData.requestHeaderDto.statusDesc="Scope and Charges Review";
						dbData.serviceScopeDto.requsterComment = comments;
						var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
						var oHeader= {"Content-Type":"application/json;charset=utf-8"};
						rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
						that.pendingDialog.close();
						if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
							var msg="Request for change submitted";
							var data = that.getView().getModel("taskJsonModel").getData();
							data.uiActionNo=3;
							that.completeTask(data,msg);
						}else{
							sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
			
			closeDialog : function(){
				var that = this;
				that.pendingDialog.close();
			},
			
			sscAccAppr : function(){
				var that =this; 
				//db save for (comments)
				var dbData = that.getView().getModel("oDBModel").getData();
				dbData.requestHeaderDto.statusDesc="Scope and Charges Approved";
				var rfsSaveDataModel = new sap.ui.model.json.JSONModel();
				var oHeader= {"Content-Type":"application/json;charset=utf-8"};
				rfsSaveDataModel.loadData("/kclrfs/rest/requestheader/createWrapper",JSON.stringify(dbData),false,"POST",false,false,oHeader);
				if(rfsSaveDataModel.getData().responseDto.status=="SUCCESS"){
					var msg="Approved successfully";
					var data = that.getView().getModel("taskJsonModel").getData();
					data.uiActionNo=1;
					that.completeTask(data,msg);
				}else{
					sap.ui.commons.MessageBox.show("Record not Submitted, Please Try Again",sap.ui.commons.MessageBox.Icon.ERROR,"Error");
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
		var that=this;
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf kaust_corelabs.ServiceScopeCharges
*/
	onAfterRendering: function() {
		var that=this;
		that.getView().byId("cwsdateP").$().find("input").attr("readonly", true);
		that.getView().byId("dateP").$().find("input").attr("readonly", true);
		that.getView().byId("mInp").$().find("input").attr("readonly", true);
//		that.getView().byId("eqSmItems").$().find("input").attr("readonly", true);
//		that.getView().byId("eqSmcb").$().find("input").attr("readonly", true);
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
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