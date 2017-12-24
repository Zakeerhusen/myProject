sap.ui.controller("fullscreenapp.UserManagement", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf fullscreenapp.UserManagement
*/
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		var that=this;
		
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "userManagement") {
				that.onProfileIdChange();
				that.onUserManagement();
			}
		});
	
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf fullscreenapp.UserManagement
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf fullscreenapp.UserManagement
*/
	onAfterRendering: function() {
		var that = this;
		this.getView().byId("userImage").attachBrowserEvent("click", 
				function(oEvent) {
				empId = this.getBindingContext('userModel').getObject().Zempid;
					that.onModifyUsers();
				}
		);
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf fullscreenapp.UserManagement
*/
//	onExit: function() {
//
//	}
	
	onUserManagement : function() {
		var that = this;
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("UserMangeSet",null,null,true,
				function(oData, oResponse) {
					if (!(oData.results instanceof Array)) {
						array.push(oData.results);
					} else {
						array = oData.results;
					}
//					for(var i = 0; i<array.length; i++){
//						array[i]
//					}
					for(var i=0; i<array.length;i++){
						if(array[i].Accesslevel==="01" || array[i].Accesslevel==="1"){
							array[i].role = "01-ADMIN";
						}
						else if(array[i].Accesslevel==="02" || array[i].Accesslevel==="2"){
							array[i].role = "02-ERPOPS";
						}
						else if(array[i].Accesslevel==="03" || array[i].Accesslevel==="3"){
							array[i].role = "03-MANAGER";
						}
						else if(array[i].Accesslevel==="04" || array[i].Accesslevel==="4"){
							array[i].role = "04-LEAD";
						}
						else if(array[i].Accesslevel==="05" || array[i].Accesslevel==="5"){
							array[i].role = "05-STAFF";
						}
						else {
							array[i].role = "NA";
						}
					}
					that.getView().getModel('userModel').oData["UserMangeSet"] = array;
					that.getView().getModel('userModel').refresh();
					that.onProfileIdChange();
//					that.getView().byId("userId").setValue("").setEditable(false);
//					that.getView().byId("userbarcode").setValue("").setEditable(false);
//					that.getView().byId("lastname").setValue("").setEditable(false);
//					that.getView().byId("firstname").setValue("").setEditable(false);
//					that.getView().byId("profileid").setValue("").setEditable(false);
//					that.getView().byId("username").setValue("").setEditable(false);
//					that.getView().byId("password").setValue("").setEditable(false);
//					var valout = that.getView().byId("vboxCheck").mAggregations.items;
//					for (var i = 0; i < valout.length; i++) {
//						valout[i].setSelected("").setEditable(false);
//					}
//					that.getView().byId("save").setEnabled(false);
//					that.getView().byId("Undo").setEnabled(false);
//					that.getView().byId("lastupdatedby").setValue("");
//					that.getView().byId("lastupdate").setValue("");
				},
				function(oError) {
					that.getView().getModel('userModel').setData([]);
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
//		var oTable = this.getView().byId("idUserManagementTable");
//		oTable.removeSelections();
//		this.onProfileIdChange();
	},
	
	
	
	onSwipe:function(oEvent){
		var that = this;
		var listItem = oEvent.getParameter('listItem');
		var oTable = that.getView().byId("idUserManagementTable");
		oTable.getSwipeContent().setBindingContext(oEvent.getParameter('listItem'));
		
	},
	onModifyWithSwipe:function(oEvent){
		var that = this;
		var oTable = that.getView().byId("idUserManagementTable");
		oTable.fireSelectionChange({
				listItem:oTable.getSwipeContent().getBindingContext(),
				listItems:[oTable.getSwipeContent().getBindingContext()],
				selected:true
		});
		this.onModifyUsers(oEvent);
		
	},
	onDeleteWithSwipe:function(oEvent){
		var that = this;
		var oTable = that.getView().byId("idUserManagementTable");
		oTable.fireSelectionChange({
				listItem:oTable.getSwipeContent().getBindingContext(),
				listItems:[oTable.getSwipeContent().getBindingContext()],
				selected:true
		});
		this.onDelete(oEvent);
	},

	onUserManagementListPress : function(oEvent){
		this.getView().byId("gridViewDevice").setVisible(true);
		this.getView().byId("listViewDevice").setVisible(false);
		this.getView().byId("idUserManagementTable").setVisible(true);
		this.getView().byId("gridView").setVisible(false);
		this.getView().byId("transparentBox").setVisible(false);
	},
	
	onUserManagementGridPress : function(oEvent){
		this.getView().byId("gridViewDevice").setVisible(false);
		this.getView().byId("listViewDevice").setVisible(true);
		this.getView().byId("idUserManagementTable").setVisible(false);
		this.getView().byId("gridView").setVisible(true);
		this.getView().byId("transparentBox").setVisible(true);
	},

	
	
	onSelectionChange:function(oEvent){	
		var oTable = oEvent.getSource();
		var selectedItems = oTable.getSelectedItems();
		if(selectedItems.length===0){
			if (!this._oSwipeContent) {
				this._oSwipeContent = sap.ui.xmlfragment("sap.ui.demo.fragments.SwipeUser", this);
				this.getView().addDependent(this._oSwipeContent);
			}
			oTable.setSwipeContent(this._oSwipeContent)
			
		}
		else{
			oTable.setSwipeContent();
		}
		oTable.removeSelections(true);
		if(oEvent.getParameter('selected')){
			oTable.setSelectedItem(oEvent.getParameter('listItem'));
			this.getView().byId('idUserManagement').setVisible(true);
		}
		else{
			//set exception buttons invisible
			this.getView().byId('idUserManagement').setVisible(false);
		}
		
	},
	
	onUserClick : function(oEvent){
		this.onSelectionChange(oEvent);
		var that = this;
	},
	
	onModifyUsers : function(){
		if (!this._oDialog2) {
			this._oDialog2 = sap.ui.xmlfragment("sap.ui.demo.fragments.UserDetails", this);
			this._oDialog2.setModel(this.getView().getModel('userDetailsModel'));
		}
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		this._oDialog2.open();
		},
		/*var empId = oEvent.getParameter('listItem').getBindingContext('userModel').getObject().Zempid;
		//this.getView().getModel('jsonModel10').setProperty('/OrderId', row.ImOrdbag);
		this.getUserDetails(empId);
		this.getView().addDependent(this._oDialog2);
		this._oDialog2.open();
		for(var i=0;i<oValueItem.length;i++){
			if(oValueItem[i].ZprofileId==accLevel || oValueItem[i].ZprofileId=="0"+accLevel){
				sap.ui.getCore().byId("profileid").setValue(oValueItem[i].ZprofileId+"-"+oValueItem[i].ProfileName).setEditable(false);				sap.ui.getCore().byId("crProfileid").setSelectedKey(oValueItem[i].ZprofileId+"-"+oValueItem[i].ProfileName).setEditable(false);
			}
		}
		if(readUser){
			sap.ui.getCore().byId("updateButton").setText("Edit");
		}
		else{
			sap.ui.getCore().byId("updateButton").setText("Save");
		}
		
	
		 
	},*/
	
	closeUserDetails : function(){
		this._oDialog2.close();
	},
	
	getUserDetails : function(empId) {
		that = this;
		var oModel = this.getView().getModel('myOdataModel');
		oModel.read("UserMangeSet(Action='',Zempid='"+ empId + "')",null,null,false,
				function(oData, oResponse) {
					object1 = oData;
					that.getView().getModel('userDetailsModel').setData(oData);
					for(var i=0;i<oValueItem.length;i++){
						if(oValueItem[i].ZprofileId==object1.Accesslevel){
							sap.ui.getCore().byId("profileid").setValue(oValueItem[i].ZprofileId+"-"+oValueItem[i].ProfileName).setEditable(true);
//							that.getView().byId("profileid").setSelectedKey(oValueItem[i].ZprofileId+"-"+oValueItem[i].ProfileName).setEditable(false);
						}
					}
					var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern : "hh:mm:ss a"});
					var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
					var lastupdate = object1.LastUtime;
					var stores = oData.Stores;
					var store = stores.split(",");
					if(typeof lastupdate === 'string' || lastupdate instanceof String){
						lastupdate = object1.LastUtime;
					}
					else{
						if(lastupdate.ms===0){
							object1.LastUtime = "00:00:00 AM";
						}
						else{
							object1.LastUtime = timeFormat.format(new Date(lastupdate.ms+ TZOffsetMs));
						}
					}
					var vbox = sap.ui.getCore().byId("vboxCheck");
					var acheckbox = vbox.getItems();
					for(var j=0; j<store.length; j++){
						for (var i = 0; i < acheckbox.length; i++) {
							var acheckbox1 = acheckbox[i];
							if (acheckbox1.getText() == store[j]) {
								acheckbox1.setSelected(true).setEditable(true);
							} else {
								if(store.length>1){
									acheckbox1.setEditable(false);
								}
								else{
									acheckbox1.setSelected(false).setEditable(false);
								}
							}
						}
					}
				},
				function(oError) {
					that.getView().getModel('userDetailsModel').setData(a);
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
	},
	
	onProfileIdChange : function() {
		var oModel = this.getView().getModel('myOdataModel');
		var that = this;
		oModel.read("ProfilesSet",null,null,true,
				function(oData, oResponse) {
					oValueItem = oData.results;
					that.getView().getModel('oProfileIdModel').setData(oData.results);
					/*sap.ui.getCore().byId("profileid").setModel(that.getView().getModel('oProfileIdModel'));
					sap.ui.getCore().byId("crProfileid").setModel(that.getView().getModel('oProfileIdModel'));*/
				},
				function(oError) {
					sap.m.MessageToast.show(jQuery.parseXML(oError.response.body));
				}
		);
	},
	
	onModify : function(){
		this.onModifyUser();
		this.closeUserDetails();
	},
	
	onModifyUser : function() {
		var that = this;
		var status;
		var object = this.getView().getModel("userDetailsModel").getData();
		var empId = object.Zempid;
		var profile = sap.ui.getCore().byId("profileid").getValue();
		var split1 = profile.split("-");
		var profile1 = split1[0];
		object.Accesslevel = profile1;
		object.Stores = "";
		var valout = sap.ui.getCore().byId("vboxCheck").mAggregations.items;
		for (var i = 0; i < valout.length; i++) {
			if (valout[i].getSelected()) {
				if (object.Stores == "") {
					object.Stores = valout[i].mProperties.text;
				} else {
					object.Stores = object1.Stores + ","+ valout[i].mProperties.text;
				}
			}
		}
		this.getView().getModel("userDetailsModel").refresh();
		var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern : "hh:mm:ss a"});
		var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
		var milliSecTime = new Date(timeFormat.parse(0).getTime()- TZOffsetMs).getTime();
		object.LastUtime = {
				__edmType : "Edm.Time",
				ms : milliSecTime
		};
		var oModel = this.getView().getModel('myOdataModel');
		oModel.update("/UserMangeSet(Action='U',Zempid='"+ empId + "')",object,null,
				function(oData) {
					status = "success";
					console.log("update success");
					that.onUserManagement();
				},
				function(oError) {
//					object.LastUtime = milliSecTime;
					status = "error";
					jQuery.sap.require("sap.m.MessageBox");
					if (oError.response.statusCode == "500") {
						sap.m.MessageBox.error("Internal System Error");
					} else {
						sap.m.MessageBox.error(jQuery.parseXML(oError.response.body).childNodes[0].childNodes[1].innerHTML);
					}
				}
		);
	},
	
	onEdit : function(oEvent){
		empId = oEvent.getSource().getBindingContext('userModel').getObject().Zempid;
		accLevel = oEvent.getSource().getBindingContext('userModel').getObject().Accesslevel;
		readUser = false;
		this.onModifyUsers();
	},
	
	onRead : function(oEvent){
		empId = oEvent.getSource().getBindingContext('userModel').getObject().Zempid;
		accLevel = oEvent.getSource().getBindingContext('userModel').getObject().Accesslevel;
		readUser = true;
		this.onModifyUsers();
	},
	
	onCreateUser : function() {
		if((/^[a-zA-Z0-9- ]*$/.test(sap.ui.getCore().byId("crUserId").getValue()) == false) || (/^[a-zA-Z0-9- ]*$/.test(sap.ui.getCore().byId("crUserbarcode").getValue()) == false)){
			sound.play();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.alert("UserId or User Barcode should not contain special Characters");
			setTimeout(function(){
				$(document.activeElement).blur();
				},150);
		}
		else{
			var that = this;
			check = "createUser";
			var status;
			var object = {};
			object.Zempid = sap.ui.getCore().byId("crUserId").getValue();
			empId = sap.ui.getCore().byId("crUserId").getValue();
			object.UserBarcode = sap.ui.getCore().byId("crUserbarcode").getValue();
			object.Firstname = sap.ui.getCore().byId("crFirstname").getValue();
			object.Lastname = sap.ui.getCore().byId("crLastname").getValue();
			object.Username = sap.ui.getCore().byId("crUsername").getValue();
			object.Password = sap.ui.getCore().byId("crPassword").getValue();
			var profile = sap.ui.getCore().byId("crProfileid").getValue();
			var split1 = profile.split("-");
			var profile1 = split1[0];
			object.Accesslevel = profile1;
			object.Stores = "";
			var valout = sap.ui.getCore().byId("crVboxCheck").mAggregations.items;
			for (var i = 0; i < valout.length; i++) {
				if (valout[i].getSelected()) {
					if (object.Stores == "") {
						object.Stores = valout[i].mProperties.text;
					} else {
						object.Stores = object.Stores + ","+ valout[i].mProperties.text;
					}
				}
			}
			object.LastUdate = null;
			object.Dayssince = 0;
			object.Action = 'C';
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern : "hh:mm:ss a"});
			var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
			var milliSecTime = new Date(timeFormat.parse(0).getTime()- TZOffsetMs).getTime();
			object.LastUtime = {
					__edmType : "Edm.Time",
					ms : milliSecTime
			};
			var oModel = this.getView().getModel('myOdataModel');
			oModel.create("/UserMangeSet",object,null,
					function(oData) {
						status = "success";
						console.log("update success");
						that.onUserManagement();
						that.closeCreateUser();
					},
					function(oError) {
						object.LastUtime = milliSecTime;
						sound.play();
						jQuery.sap.require("sap.m.MessageBox");
						sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
						setTimeout(function(){
							$(document.activeElement).blur();
							},150);
					}
			);
		}
	},
	
	onCreate : function(oEvent){
		if (!this._oDialog3) {
			this._oDialog3 = sap.ui.xmlfragment("sap.ui.demo.fragments.CreateUser", this);
		}
		this.getView().addDependent(this._oDialog3);
		this._oDialog3.open();
	},
	
	closeCreateUser : function(){
		this._oDialog3.close();
	},
	
	onDelete : function(oEvent){
		if (!this._oDialog4) {
			this._oDialog4 = sap.ui.xmlfragment("sap.ui.demo.fragments.DeleteUser", this);
			this._oDialog4.setModel(this.getView().getModel('userDetailsModel'))
		}
		this.getView().addDependent(this._oDialog4);
		this._oDialog4.open();
	},
	
	onDeleteUser : function() {
		var that = this;
		var status;
		var object = this.getView().getModel("userDetailsModel").getData();
		var empId = object.Zempid;
		var oModel = this.getView().getModel('myOdataModel');
		oModel.update("/UserMangeSet(Action='D',Zempid='"+ empId + "')",object,null,
				function(oData) {
					status = "success";
					console.log("delete success");
					that.onUserManagement();
					that.closeDeleteUser();
				},
				function(oError) {
					status = "error";
					sound.play();
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.alert(jQuery.parseJSON(oError.response.body).error.message.value);
					setTimeout(function(){
						$(document.activeElement).blur();
						},150);
				}
		);
	},
	
	closeDeleteUser : function(){
		this._oDialog4.close();
	},
	
	applySearchPatternToListItem: function(i, searchValue) {
	    if (searchValue == "") {
	        return true;
	    }
	    var property = this.getView().getModel("userModel").getData().UserMangeSet[i.getContent().sId.split("-")[6]];
	    for (var k in property) {
	        var v = property[k];
	    	if (typeof v == "string") {
	            if (v.toLowerCase().indexOf(searchValue) != -1) {
	                return true;
	            }
	        }
	    }
	    return false;
	},

	search : function(oEvt){
		var searchValue = oEvt.getSource().getValue();
		searchValue = searchValue.toLowerCase();
	    var items = this.getView().byId("userGrid").getContent();
	    var v;
	    var count = 0;
	    var g = null;
	    var C = 0;
	    for (var i = 0; i < items.length; i++) {
	        if (items[i] instanceof sap.m.GroupHeaderListItem) {
	            if (g) {
	                if (C == 0) {
	                    g.setVisible(false);
	                } else {
	                    g.setVisible(true);
	                    g.setCount(C);
	                }
	            }
	            g = items[i];
	            C = 0;
	        } else {
	            v = this.applySearchPatternToListItem(items[i], searchValue);
	            items[i].setVisible(v);
	            if (v) {
	                count++;
	                C++;
	            }
	        }
	    }
	    if (g) {
	        if (C == 0) {
	            g.setVisible(false);
	        } else {
	            g.setVisible(true);
	            g.setCount(C);
	        }
	    }
	    return count;
	},

});
var readUser = false;
var oValueItem;
var empId;
var accLevel;
var a='';