jQuery.sap.declare("sap.ui.demo.MyRouter");
sap.ui.demo.MyRouter = {
	/*  * to monkey patch the router with the mobile nav back handling 
	 */
	myNavBack : function(route, data) {
		var history = sap.ui.core.routing.History.getInstance();
		var url = this.getURL(route, data);
		var direction = history.getDirection(url);
		console.log("direction : "+direction);
		if ("Backwards" === direction) {
			window.history.go(-1);
			this.attachRoutePatternMatched(function(oEvent){
				if (oEvent.getParameter("name") ==="loginToFR1"){
					var view = this.getViews()._oViews["foodkickpicking.loginToFR1"];
					var userName = view.byId("userName");
					var pwd = view.byId("password");
					userName.setValue("");
					pwd.setValue("");
					setTimeout(function(){
						userName.focus();
						}, 1200);
					}
				if (oEvent.getParameter("name") ==="login"){
					var view = this.getViews()._oViews["foodkickpicking.login"];
					var inputScanEmpId = view.byId("scanEmpId");
					setTimeout(function(){
						inputScanEmpId.setValue("");
						inputScanEmpId.focus();
						}, 1200);
					}
				if (oEvent.getParameter("name") ==="exceptionReports"){
					var view = this.getViews()._oViews["foodkickpicking.exceptionReports"];
					var inputScanCO = view.byId("inputScanCheckout");
					setTimeout(function(){
						inputScanCO.setValue("");
						inputScanCO.focus();
						}, 1200);
					}
				});
		} else {
			var replace = true; // otherwise we go backwards with a forward history  
			this.navTo(route, data, replace);
				if (route ===""){
					var view = this.getViews()._oViews["foodkickpicking.loginToFR1"];
					var userName = view.byId("userName");
					userName.setValue("");
					setTimeout(function(){
						userName.focus();
						}, 1200);
					}
				if (route ==="login"){
					var view = this.getViews()._oViews["foodkickpicking.login"];
					var inputScanEmpId = view.byId("scanEmpId");
					inputScanEmpId.setValue("");
					setTimeout(function(){
						inputScanEmpId.focus();
						}, 1200);
					}
				if (route ==="requestOrder"){
					var view = this.getViews()._oViews["foodkickpicking.requestOrder"];
					var reqOrderTile = view.byId("reqOrderTile");
					
					setTimeout(function(){
						reqOrderTile.focus();
						}, 1200);
					}
				if (route ==="scanTote"){
					var view = this.getViews()._oViews["foodkickpicking.scanTote"];
					var scanToteInput = view.byId("scanToteInput");
					scanToteInput.setValue("");
					setTimeout(function(){
						scanToteInput.focus();
						}, 1200);
					}
				if (route ==="displayOrder"){
					var view = this.getViews()._oViews["foodkickpicking.displayOrder"];
					var scanInput = view.byId("scanInput");
					scanInput.setValue("");
					setTimeout(function(){
						scanInput.focus();
						}, 1200);
					/*if(exceptionIndicator==1){
						view.byId("matGrid").setBusy(true);
						}*/
					}
				if (route ==="exceptionReports"){
					var view = this.getViews()._oViews["foodkickpicking.exceptionReports"];
					var inputScanCO = view.byId("inputScanCheckout");
					inputScanCO.setValue("");
					setTimeout(function(){
						inputScanCO.focus();
						}, 1200);
					}
				
				if (route ==="exceptionReports2"){
					var view = this.getViews()._oViews["foodkickpicking.exceptionReports2"];
					var scanPendingBC = view.byId("scanPendingBC");
					scanPendingBC.setValue("");
					setTimeout(function(){
						scanPendingBC.focus();
						}, 1200);
					}
				
				if (route ==="scanCheckout"){
					var view = this.getViews()._oViews["foodkickpicking.scanCheckout"];
					var inputScanCheckout = view.byId("inputScanCheckout");
					inputScanCheckout.setValue("");
					setTimeout(function(){
						inputScanCheckout.focus();
						}, 1200);
					}
				}
		
	}
};