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
	// console.log (firstTrain)
    var newTrain = {
		name: name,
	    destination: destination,
	    firstTrain: firstTrain,
	    frequency: frequency
	};
	trainDB.ref().push(newTrain);
	//reset form fields
	document.getElementById("AddTrain").reset();
});

// Retrieve new train info as they are added to the database
//We also have access to the previous post ID from the second prevChildKey argument (firebase documentation)
trainDB.ref().on("child_added", function(snapshot, prevChildKey) {
	var addedTrain = snapshot.val();
	  // console.log(addedTrain)
	var trainName = snapshot.val().name;
	var trainDestination = snapshot.val().destination;
	var trainFrequency = snapshot.val().frequency;
	var firstTrainTime = snapshot.val().firstTrain;

//Calculate train times
// To calculate the minutes to arrival, subtract the FirstTrainTime from the current time, find the modulus between the frequency and compare to the difference 
	var difference = moment().diff(moment.unix(firstTrainTime), "minutes");
		console.log("first train" + firstTrainTime);
		console.log("current time" + moment().unix())
		console.log("difference" + difference);
	var remainder = moment().diff(moment.unix(firstTrainTime), "minutes") % trainFrequency ;
	console.log(remainder)
	var minutes = trainFrequency - remainder;

	// To calculate the arrival time, add minutes to the currrent time
	var arrival = moment().add(minutes, "m").format("hh:mm A"); 
		
	//"Print trainDB to html table"
$("#currentTrainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");


});


}); //document on ready 