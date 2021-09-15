/*
	# ICS tiedoston luoja & lataaja
	
	# Tarvitsee 
		- JQuery
	# Käyttö
		Data formista:
			<form>
				<input type="text" name="title" id="title" value="Otsikko">
				<input type="text" name="desc" id="desc" value="Tapahtuman kuvaus">
				<input type="text" name="location" id="location" value="Lahti">
				<input type="text" name="url" id="url" value="https://www.google.fi">
				<input type="datetime-local" name="start" id="startDate" value= "2021-09-16T10:12">
				<input type="datetime-local" name="end" id="end"  value= "2021-09-17T10:12">
				<a id="save" href="#">Save</a>
			</form>

			<script src="ics.js"></script>
			<script>
				ICS.init("save");
				ICS.getFormData("form");
			</script>
			
		Datam syöttö manuaalisesti:
		
			<a id="save" href="#">Save</a>
			
			<script src="ics.js"></script>
			<script>
				ICS.init("save");
				ICS.addEvent({title: "otsikko", desc: "kuvaus", location: "Paikka", url: "webosoite", start:Date(), end: Date()});
			</script>
	
*/

var ICS = {
	props: {
		'begin_cal':	'BEGIN:VCALENDAR\n',
		'end_cal':		'END:VCALENDAR\n',
		'begin_event':	'BEGIN:VEVENT\n',
		'end_event':	'END:VEVENT\n',
		'version':		'VERSION:2.0\n',
		'prodid':		'PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n',
		'scale':		'CALSCALE:GREGORIAN\n',	
		'url':			';VALUE-URI',
		'timezone':		'Europe/Helsinki'
	},
	saveButtonElement: undefined,
	filename: "file.ics",
	icsString: "",
	ended: false,
	init: function(saveBtnElem) {
		ICS.saveButtonElement = saveBtnElem;
		$("#"+ICS.saveButtonElement).on("click", function() {
			ICS.save();
		});
		
		ICS.addHeader();
	},
	
	getFormData: function(formID) {
		var formData = {};
		$(formID).serializeArray().forEach(function(item) {
			formData[item.name] = item.value;
		})
		ICS.icsString += ICS.addEvent(formData);
	},
	
	addHeader: function() {
		ICS.icsString 		=  ICS.props['begin_cal'];
		ICS.icsString 		+= ICS.props['version'];
		ICS.icsString 		+= ICS.props['scale'];
	},
	
	// event = {title: "Otsikko", desc: "Kuvaus", location: "Paikka" startDate: Date(), endData: Date()}
	addEvent: function(eventData) {
		ICS.setFilename(eventData);
		var eventString 	= '';
		var startDate 		= ICS.convertToDate(eventData.start);
		var endDate 		= ICS.convertToDate(eventData.end);
		eventString 		+= ICS.props['begin_event'];
		eventString 		+= `SUMMARY:${eventData.title}\n`;
		eventString 		+= `DTSTART;TZID=${ICS.props.timezone}:${startDate}\n`;
		eventString 		+= `DTEND;TZID=${ICS.props.timezone}:${endDate}\n`;
		eventString 		+= `LOCATION:${eventData.location}\n`;
		eventString 		+= `DESCRIPTION:${eventData.desc}\n`;
		eventString 		+= ICS.props['end_event'];
		return eventString;
	},
	
	setTimezone(timezone) {
		ICS.props.timezone = timezone;
	},
	
	endCalendar: function() {
		if(ICS.ended == false){
			ICS.icsString += ICS.props['end_cal'];
			ICS.ended = true;
		}
	},
	
	convertToDate: function(formdate) {
		var time = new Date(formdate);
		var datestr = '';

		datestr += time.getFullYear().toString();
		datestr += ICS.addPadding((time.getMonth() + 1).toString());
		datestr += ICS.addPadding(time.getDate().toString());
		datestr += "T";
		datestr += ICS.addPadding(time.getHours().toString());
		datestr += ICS.addPadding(time.getMinutes().toString());
		datestr += ICS.addPadding(time.getSeconds().toString());
		return datestr;
	
	},

	addPadding: function(input) {
		var ret = input;
		if(input.length == 1) {
			ret = "0"+input.toString();
		}
		return ret;
	},
		
	setFilename: function(event) {
		ICS.filename = event.title + ".ics";
	},
	
	save: function() {
	
		ICS.endCalendar();
		var elem = document.getElementById(ICS.saveButtonElement);
		
		var mime_type = mime_type || 'application/octet-stream'; // text/html, image/png, et c
		if (ICS.filename) elem.setAttribute('download', ICS.filename);
		elem.href = 'data:'+ mime_type +';base64,'+ btoa(ICS.icsString || '');
	},
	
}