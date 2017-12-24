function dateConvertion(date, format) {
	var time = "";
	var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern : format});
	var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
	var dispTime = date;
	if(dispTime.ms===0){
		time = "00:00:00 AM"
	}
	else{
		time = timeFormat.format(new Date(dispTime.ms+ TZOffsetMs));
	}
	return time;
}

