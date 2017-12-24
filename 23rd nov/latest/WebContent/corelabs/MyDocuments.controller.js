sap.ui.controller("corelabs.MyDocuments", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf servicescopeandchargesform.MyDocuments
*/
	onInit: function() {
	if (!jQuery.support.touch||jQuery.device.is.desktop){
		this.getView().addStyleClass("sapUiSizeCompact");
		}
	if(!this.busyDialog){
	    this.busyDialog= sap.ui.xmlfragment("corelabs.fragments.busy", this);
	    this.getView().addDependent(this.busyDialog);
	    this.busyDialog.addStyleClass("sapUiSizeCompact");
    }
	},
	
	handleUploadPress:function(evt){
		var that=this;
		if(that.busyDialog){
			that.busyDialog.open();
		}
		that.getView().byId("uploadBtn").setEnabled(false);
		that.getView().byId("removeBtn").setEnabled(false);
		that.fileEcmUpload();
	},
	
	handleUploadComplete:function(evt){
		var that=this;
	},
	
	changeFile:function(oEvent){
		var that=this;
		fileList = oEvent.oSource.oFileUpload.files[0];
	},
	
	downloadFile:function(oEvent){
		var that=this;
		var selCli=evt.getSource().getParent();
		var selCliData=selCli.getBindingContext("myDocModel").getObject();
		var filePath=selCliData.filePath;
		evt.getSource().setHref(filePath);
	},
	
	removeFromTable:function(oEvent){
		var that=this;
		var docTable = that.getView().byId("docTable");
		var adata=docTable.getModel("myDocModel").getData().documentManagerDtoList;
		var selItems=docTable.getSelectedItems();
		if(selItems.length>0){
			for (var j=adata.length-1; j>=0; j--){			
				if(adata[j].delFlag){
					this.deleteFromRepository(adata[j]);
					adata.splice(j, 1);
				}
			}
		}else{
			sap.ui.commons.MessageBox.show("Select a row to delete", "ERROR", "Error");
		}
		that.getView().byId("docTable").removeSelections();
		var docTable = that.getView().byId("docTable");
		docTable.getModel("myDocModel").refresh();
	},
	
	deleteFromRepository: function(delObj){
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
					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Delete Error");
				}
			});
	},
	
fileEcmUpload : function() {
		that = this;
		var pageId = this.getView().getId();
		if (document.getElementById(pageId+"--fileUploaderMyDoc-fu")) {
			if (document.getElementById(pageId+"--fileUploaderMyDoc-fu").files[0] != null) {
				var file = document.getElementById(pageId+"--fileUploaderMyDoc-fu").files[0];
			}
		}
		if(file ==null){
			that.getView().byId("uploadBtn").setEnabled(true);
			that.getView().byId("removeBtn").setEnabled(true);
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(
					"Please select a document", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function(oAction) {
						// * do something * / 
						that.busyDialog.close();
						}
					}
			);
			return;
		}
		if (file.name.length > 75) {
			// sap.ui.getCore().byId("dialogUpload").close();
			//	jQuery.sap.require("sap.ui.commons.MessageBox");
			that.getView().byId("uploadBtn").setEnabled(true);
			that.getView().byId("removeBtn").setEnabled(true);
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
			//jQuery.sap.require("sap.ui.commons.MessageBox");
			that.getView().byId("uploadBtn").setEnabled(true);
			that.getView().byId("removeBtn").setEnabled(true);
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
				//Here we put SRM?
				that.createEcmFile("CLRFS_USER", UniqueFileId,fileName, fileEncodedData);
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
	
	createEcmFile : function(applicationArea, UniqueFileId,fileName, file) {
		/*uploading the file*/
		var that=this;
		var userId=loggedinUserModel.getData().userId;
		var uploadPayload = {
			    "appName":applicationArea,
			    "folderName":userId,
			    "file":file,
			    "fileName":fileName,
			    "operationId":userId,
			    //"operationName":"",		//added this for rfs number
			    //"businessDocType":1,
			    "status":"ACTIVE"
		};

		var newFile = {};
		var uploadUrl="/cc_ecm/file/upload";
		
		$.ajax( {
			/*headers:{
			"X-Requested-With" : "XMLHttpRequest",
			"Content-Type" : "application/json; charset=utf-8",
			"Accept": "application/json"
			},*/
			url : uploadUrl,
			type : "POST",
			async : true,
			dataType : "json",
			data : JSON.stringify(uploadPayload),
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				/*xmldoc = jqXHR.responseXML;
				if (xmldoc.getElementsByTagName('return')[0]
				&& xmldoc.getElementsByTagName('return')[0].childNodes[0]) {

					that.UniqueFileId = UniqueFileId;
					//why you call read service
					that.readEcmFile(applicationArea,UniqueFileId, true,newFile);
					(applicationArea,UniqueFileId, true,newFile);
				}*/
				/*var docManagerDto=jqXHR.responseJSON.docManagerDto;
				var fileId=docManagerDto.fileId;
				var fileName=docManagerDto.fileName;
				var updatedDate=docManagerDto.updatedDate;
				var createdDate=docManagerDto.createdDate;
				var businessDocType=docManagerDto.businessDocType;
				var appName=docManagerDto.appName;
				var id=docManagerDto.id;
				var operationId=docManagerDto.operationId;*/
				var docTable = that.getView().byId("docTable");
				var sno=(docTable.getItems().length)+1;
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
				newFile.slno=sno;
				newFile.createdBy=docManagerDto.createdBy;
				newFile.createdDateValue=getFormattedDate(new Date(docManagerDto.createdDateValue));
				newFile.delFlag=false;
				
				if(newFile.status != null) {
	  				if (newFile.status == "SUCCESS") {
//	  					myDocModel.getData().documentManagerDtoList.push(newFile);
	  					var oTable = that.getView().byId("docTable");
	  					oTable.getModel("myDocModel").getData().documentManagerDtoList.push(newFile);
	  					oTable.getModel("myDocModel").refresh();
//	  					oTable.setModel(myDocModel,"myDocModel");
//	  					myDocModel.refresh();
	  					sap.ui.commons.MessageBox.show("File uploaded successfully ", "SUCCESS", "Upload Success");
	  				} else{
	  					if(jqXHR.responseJSON && jqXHR.responseJSON.dbStatus){
		  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
		  					}else{
		  						sap.ui.commons.MessageBox.show("Error while uploading file", "ERROR", "Upload Error");
		  					}
	  				}
	  				that.getView().byId("fileUploaderMyDoc").setValue("");
	  				that.getView().byId("uploadBtn").setEnabled(true);
  					that.getView().byId("removeBtn").setEnabled(true);
	  			}else{
		  			that.getView().byId("uploadBtn").setEnabled(true);
  					that.getView().byId("removeBtn").setEnabled(true);
  					if(jqXHR.responseJSON && jqXHR.responseJSON.dbStatus){
	  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
	  					}else{
	  						sap.ui.commons.MessageBox.show("Error while uploading file", "ERROR", "Upload Error");
	  					}
		  		}
				that.busyDialog.close();
			},
			error : function(data,jqXHR) {
				that.getView().byId("uploadBtn").setEnabled(true);
				that.getView().byId("removeBtn").setEnabled(true);
				if(jqXHR.responseJSON && jqXHR.responseJSON.dbStatus){
  					sap.ui.commons.MessageBox.show(jqXHR.responseJSON.dbStatus, "ERROR", "Upload Error");
  					}else{
  						sap.ui.commons.MessageBox.show("Error while uploading file", "ERROR", "Upload Error");
  					}
				that.busyDialog.close();
			}
		});
	},
	
	readTableData:function(evt){
		var that=this;
		var userId=loggedinUserModel.getData().userId;
		var oHeader= {"Content-Type":"application/json;charset=utf-8"};
		var readDocPayload={
//				"businessDocType":"1",
				"operationId":userId,
				"operationNameEmpty":"true"
//				"operationName":"RFS007"
				};
				var myDocModel=new sap.ui.model.json.JSONModel();
				myDocModel.loadData("/cc_ecm/file/readDocuments",JSON.stringify(readDocPayload),false,"POST",false,false,oHeader);
				
				if (myDocModel.getData()) {
					if (myDocModel.getData().documentManagerDtoList == undefined) {
						myDocModel.getData().documentManagerDtoList = [];
					}
					if (!(myDocModel.getData().documentManagerDtoList instanceof Array)) {
						var dtoList = myDocModel.getData().documentManagerDtoList;
						if (dtoList.createdDateValue != "") {
							getFormattedDate(new Date(myDocModel.getData().documentManagerDtoList.createdDateValue));
						}
						myDocModel.getData().documentManagerDtoList = [ myDocModel.getData().documentManagerDtoList ];
					} else {
						var dtoList = myDocModel.getData().documentManagerDtoList;
						var length = dtoList.length;
						for ( var i = 0; i < length; i++) {
							if (dtoList[i].createdDateValue != "") {
								dtoList[i].createdDateValue = getFormattedDate(new Date(dtoList[i].createdDateValue));
							}
						}
					}
					var oTable = that.getView().byId("docTable");
					oTable.setModel(myDocModel, "myDocModel");
					myDocModel.refresh();
				}
	},
	
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf servicescopeandchargesform.MyDocuments
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
* @memberOf servicescopeandchargesform.MyDocuments
*/
	onAfterRendering: function() {
		var that=this;
		that.readTableData();
		$("#"+that.getView().byId("uploadBtn").getId()).focus();
		setTimeout(function(){ 
			that.getView().getContent()[0].scrollTo(0);
		}, 1000);
	},
	
	filterGlobally : function(oEvent) {
		var aFilters = [];
	    var sQuery = oEvent.getSource().getValue();
	    var filterArry = [];
	    var colArray = ["fileName", "folderName", "createdDateValue", "createdBy"];
	    if (sQuery && sQuery.length > 0) {
	    		for ( var i = 0; i < colArray.length; i++) {
	    			var bindingName = colArray[i];
	    			filterArry.push(new sap.ui.model.Filter(bindingName, sap.ui.model.FilterOperator.Contains, sQuery));
	    		}
	      var filter = new sap.ui.model.Filter(filterArry, false);
	      aFilters.push(filter);
	    }
	    // update list binding
	    var reqList =this.getView().byId("docTable");
    	var binding = reqList.getBinding("items");
	    binding.filter(aFilters, "Application");
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf servicescopeandchargesform.MyDocuments
*/
//	onExit: function() {
//
//	}

});
//var myDocModel=new sap.ui.model.json.JSONModel({"documentManagerDtoList":[]});
