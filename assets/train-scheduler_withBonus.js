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

//Following Firebase Read-Write Database samples....
function writeNewTrain(itemCount, name, destination, firstTrain, frequency) {
  // A post entry.
  var trainData = {
      name: name,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      itemCount: itemCount
  };

  // Get a key for a new Post.
  var newTrainKey = trainDB.ref().child('trains').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/trains/' + itemCount + '/' + newTrainKey] = trainData;
  // reference: /user-posts/$userid/$postid.
  return firebase.database().ref().update(updates);
}

//Grab user input values on Submit
$("#submitBtn").on("click", function(event){
	event.preventDefault()
	
  name = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format('X');
  frequency = $("#frequency").val().trim();
  itemCount = itemCount;

writeNewTrain();
    // console.log (firstTrain)
 //    var newTrain = {
	// 	  name: name,
	//     destination: destination,
	//     firstTrain: firstTrain,
	//     frequency: frequency,
	//     itemCount: itemCount
	// };
	// trainDB.ref('trains').push(newTrain);
	
	//reset form fields
	document.getElementById("AddTrain").reset();
});

// Retrieve new train info as they are added to the database
//We also have access to the previous post ID from the second prevChildKey argument (firebase documentation)
trainDB.ref('trains').on("child_added", function(snapshot, prevChildKey) {
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
    updateTrain.addClass("btn btn-primary btn-xs edit");
    updateTrain.append("Edit");
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

$(document.body).on("click", ".edit", function() {
      event.preventDefault()

      // Get the number of the button from its data attribute and hold in a variable called trainNumber.
      var trainNumber = $(this).attr("data-to-edit");
      // Select and Remove the specific <tr> element that previously held the train item number.
      // $("#item-" + trainNumber). 

      trainDB.ref('trains').orderByChild('itemCount').on("child_added", function(snapshot) {
      console.log(snapshot.key + " is itemCount " + snapshot.val().itemCount);
      });

      name = snapshot.val().name;
      destination = snapshot.val().destination
      firstTrain = snapshot.val().firstTrain
      frequency = snapshot.val().frequency;

      $("#trainName").val(name);
      $("#destination").val(destination);
      $("#firstTrainTime").val(moment(firstTrain).format("HH:mm"))
      $("#frequency").val(frequency);



      // itemCount = itemCount;


      ///I DON'T KNOW WHAT TO DO FROM HERE....

      		//DISPLAY that train's properties in the text fields
      		// .update() the firebase database
      			//add extra UPDATE button instead of using the SUBMIT button's functionality??
      		// clear the form fields
    });

}); //document on ready 