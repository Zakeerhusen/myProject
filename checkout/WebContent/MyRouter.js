jQuery.sap.declare("sap.ui.demo.MyRouter");
sap.ui.demo.MyRouter = {
	/*  * to monkey patch the router with the mobile nav back handling 
	 */
		myNavBack : function(route, data) {
			var history = sap.ui.core.routing.History.getInstance();
			var url = this.getURL(route, data);
			var direction = history.getDirection(url);
			if ("Backwards" === direction) {
				//window.history.go(-1);
				this.navTo(route, data, true);
				this.attachRoutePatternMatched(function(oEvent){
					if (oEvent.getParameter("name") ==="Checkout"){
						var view = this.getViews()._oViews["fdx_checkout.Checkout"];
						var inputEmpId = view.byId("loginId");
						setTimeout(function(){
							inputEmpId.setValue("");
							inputEmpId.focus();
						}, 600);
					}
				});

			} else {
				var replace = true; // otherwise we go backwards with a forward history  
				this.navTo(route, data, replace);
				if (route ==="Checkout"){
					var view = this.getViews()._oViews["fdx_checkout.Checkout"];
					var inputEmpId = view.byId("loginId");
					setTimeout(function(){
						inputEmpId.setValue("");
						inputEmpId.focus();
					}, 600);
				}
			}
		},
};