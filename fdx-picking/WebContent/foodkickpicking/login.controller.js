sap.ui.controller("foodkickpicking.login", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf foodkickpicking.login
*/
	 
	onInit: function() {
		this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var that = this;
				var inputLogin = that.getView().byId("scanEmpId");

				inputLogin.setValue("");
				setTimeout(function(){
					inputLogin.focus();
				      }, 1200);
				
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "login") {
			currentView = oEvent.getParameter("name");
			inputLogin.onsapenter=(function(oEvent) {
				sap.m.InputBase.prototype.onsapenter.apply(inputLogin,arguments);
				var input=inputLogin.getValue();
				that.navToReqOrder(input);
				}).bind(that);
				
			}
		});
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf foodkickpicking.login
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf foodkickpicking.login
*/
//	onAfterRendering: function() {
//		
//	},


/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf foodkickpicking.login
*/
//	onExit: function() {
//
//	}
	
	
	
	navToReqOrder : function(input){
//		var input = this.getView().byId("scanEmpId").getValue();
		
		var oDialog = this.getView().byId("BusyDialog");
		oDialog.open();
		var message = "";
		var that = this;
		var oModel = that.getView().getModel();
		
		oModel.read("/EmployeeSet(Zempid='"+input+"',IpAddr='1.1.1.1')/", null, null, true, 
				function(oData){
					var inputLogin = that.getView().byId("scanEmpId");

					console.log(oData);
					oLoginJsonModel.setData(oData);
					pphThreshold= oData.PphThres;
					pphThreshold = parseInt(pphThreshold);
					if(isNaN(pphThreshold)){
						pphThreshold =0;
					}
					if(oData.Vbeln==""){
					that.oRouter.myNavBack("requestOrder");
					}else{
						orderNum = oData.Vbeln;	
					that.oRouter.myNavBack("scanTote");	
					}
					oDialog.close();
					}, 
					function(oError){
						oDialog.close();
						var statusCode = oError.response.statusCode;
						jQuery.sap.require("sap.m.MessageBox");
						 if(statusCode==500){
						sound.play();
						sap.m.MessageBox.error("Internal System Error",{
					          onClose: function(oAction) { 
					        	  var inputLogin = that.getView().byId("scanEmpId");

					        	  inputLogin.setValue("");
									setTimeout(function(){
											inputLogin.focus();
									}, 400);
					          }
					      }
					    );
					}else if(statusCode==401){
						sound.play();
						sap.m.MessageBox.error("FR1 Login authentication failed",{
					          onClose: function(oAction) { 
					        	  var inputLogin = that.getView().byId("scanEmpId");

					        	  inputLogin.setValue("");
									setTimeout(function(){
											inputLogin.focus();
									}, 400);
					          }
					      }
					    );
					}else{
						sound.play();
						if(jQuery.parseJSON(oError.response.body).error.message.value.startsWith("Value")){
							sap.m.MessageBox.error("Invalid Scan",{
						          onClose: function(oAction) { 
						        	  var inputLogin = that.getView().byId("scanEmpId");

						        	  inputLogin.setValue("");
										setTimeout(function(){
												inputLogin.focus();
										}, 400);
						          }
						      });
						}else{
						sap.m.MessageBox.error(jQuery.parseJSON(oError.response.body).error.message.value,{
					          onClose: function(oAction) { 
					        	  var inputLogin = that.getView().byId("scanEmpId");

					        	  inputLogin.setValue("");
									setTimeout(function(){
											inputLogin.focus();
									}, 400);
					          }
					      });
					}
					}
					});
		
	},
	
	
	logout:function(){
		//this.getView().getModel().destroy();
	 	//navigator.app.exitApp();
	var that = this;

	//parentApp.getModel().destroy();

    //that.oRouter.myNavBack("loginToFR1");

                              		
	      /* $.ajax({
	           type: "GET",  
	           url: server+"sap/public/bc/icf/logoff" //Clear SSO cookies: SAP Provided service to do that
	        }).done(function(data){ //Now clear the authentication header stored in the browser  
	                            if (!document.execCommand("ClearAuthenticationCache")) {  
	                                 //"ClearAuthenticationCache" will work only for IE. Below code for other browsers  
	                                 $.ajax({  
	                                               type: "GET",  
	                                               url: server+"sap/opu/odata/SAP/ZFK_ORD_HEADERDETAILS_SRV/", //any URL to a Gateway service  
	                                               username: 'dummy', //dummy credentials: when request fails, will clear the authentication header  
	                                               password: 'dummy',  
	                                               statusCode: { 401: function() { 
	                                	 				//location.reload();
	                                	 parentApp.getModel().detachMetadataLoaded(function(oEvent){
	                                	 				that.oRouter.navTo("loginToFR1");
	                                	 });
	                                	 			//alert("401 error came");
	                                                         //This empty handler function will prevent authentication pop-up in chrome/firefox  
	                                               } },  
	                                               error: function() {  
	                                                   // alert('reached error of wrong username password')  
	                                               }  
	                                });  
	                            }  
	        }) ;
	        
	         */
	}
	
	

});