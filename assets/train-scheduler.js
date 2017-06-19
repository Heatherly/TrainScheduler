$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDIrfplKXQ0MjnEYLCWgcXHFTsaiCHM05Y",
    authDomain: "trainscheduler-5ef17.firebaseapp.com",
    databaseURL: "https://trainscheduler-5ef17.firebaseio.com",
    projectId: "trainscheduler-5ef17",
    storageBucket: "",
    messagingSenderId: "181340423207"
  };
  firebase.initializeApp(config);

var trainDB = firebase.database();

//Grab user input values on Submit
$("#submitBtn").on("click", function(event){
	event.preventDefault()
	name = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format('X');
    frequency = $("#frequency").val().trim();
	// console.log (firstTime)
    var newTrain = {
		name: name,
	    destination: destination,
	    firstTrain: firstTrain,
	    frequency: frequency
	};
	trainDB.ref().push(newTrain);
	
	document.getElementById("AddTrain").reset();
});

// Retrieve new posts as they are added to our database
trainDB.ref().on("child_added", function(snapshot, prevChildKey) {
	var addedTrain = snapshot.val();
	  console.log(addedTrain)
	var tName = snapshot.val().name;
	var tDestination = snapshot.val().destination;
	var tFrequency = snapshot.val().frequency;
	var tFirstTrain = snapshot.val().firstTrain;

//Calculate train times
	// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
	var difference = moment().diff(moment.unix(tFirstTrain), "minutes");
	var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency ;
	var tMinutes = tFrequency - tRemainder;

	// To calculate the arrival time, add the tMinutes to the currrent time
	var tArrival = moment().add(tMinutes, "m").format("hh:mm A"); 
		console.log(difference + " time difference")
		console.log(tMinutes + " tMinutes");
		console.log(tRemainder + " tRemainder");
		console.log(tArrival + " tArrival");
		
	//"Print trainDB to html table"
$("#currentTrainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
//


});


}); //document on ready 