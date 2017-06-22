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

var itemCount = 0;

//Grab user input values on Submit
$("#submitBtn").on("click", function(event){
	event.preventDefault()
	name = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format('X');
    frequency = $("#frequency").val().trim();
    itemCount = itemCount;

    // console.log (firstTrain)
    var newTrain = {
		name: name,
	    destination: destination,
	    firstTrain: firstTrain,
	    frequency: frequency,
	    itemCount: itemCount
	};
	trainDB.ref().push(newTrain);
		console.log("New train " + newTrain);
	
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
	var trainCount = snapshot.val().itemCount;

//Calculate train times
// To calculate the minutes to arrival, subtract the FirstTrainTime from the current time, find the modulus between the frequency and compare to the difference 
	var difference = moment().diff(moment.unix(firstTrainTime), "minutes");
	var remainder = moment().diff(moment.unix(firstTrainTime), "minutes") % trainFrequency ;
	var minutes = trainFrequency - remainder;

	// To calculate the arrival time, add minutes to the currrent time
	var arrival = moment().add(minutes, "m").format("hh:mm A"); 
		
	//"Print trainDB to html table"
	var trainItem = $("<tr>");
    trainItem.attr("id", "item-" + itemCount);
    trainItem.append("<td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td>");

    var removeTrain = $("<button>");
    removeTrain.attr("data-to-remove", itemCount);
    removeTrain.addClass("btn btn-warning btn-xs remove");
    removeTrain.append("X");

    var updateTrain = $("<button>");
    updateTrain.attr("data-to-update", itemCount);
    updateTrain.addClass("btn btn-info btn-xs");
    updateTrain.append("Update");
    // Append the buttons to the train's row
    trainItem = trainItem.append(updateTrain);
    trainItem = trainItem.append(removeTrain);

	$("#currentTrainTable > tbody").append(trainItem);
	
	itemCount++;
});

$(document.body).on("click", ".remove", function() {
      // Get the number of the button from its data attribute and hold in a variable called trainNumber.
      var trainNumber = $(this).attr("data-to-remove");
      // Select and Remove the specific <tr> element that previously held the train item number.
      $("#item-" + trainNumber).remove();
    });

}); //document on ready 