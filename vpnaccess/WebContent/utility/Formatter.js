jQuery.sap.declare("kaust.ui.kitsvpnaccess.utility.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

kaust.ui.kitsvpnaccess.utility.Formatter = {
 
RmsDate:function(value){
			return value.substring(4, 6) + '/' + value.substring(6, 8)  + '/' + value.substring(0, 4) ;	 					
		 }
};