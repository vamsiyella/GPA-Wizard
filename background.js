// Add event listeners for various buttons

document.getElementById("calcregulargpa").addEventListener("click", regularAverageCalculator);
document.getElementById("calcgpabutton").addEventListener("click", weightedaverageCalculator);
document.getElementById("savedata").addEventListener("click", saveGradeData);
document.getElementById("getdata").addEventListener("click", retrieveGradeData);
document.getElementById("switchbackground").addEventListener("click", switchHtmlFiles);

document.getElementById("reportButton").addEventListener("click", generateReport);

document.getElementById("addrowbutton").addEventListener("click", addRow);
document.getElementById("deleterowbutton").addEventListener("click", deleteRow);

var numerator = 0
var denominator = 0
var weightedgpa = "NotCalculated"
var honors =0
var apib = 0
var regular = 0
var unweightedgpa = "NotCalculated"

dynamicSave()
populateTable()

// Add Validation for all numerical fields
function validate() {
    // Get all rows in the table
    const rows = document.querySelectorAll("tr");
    // Get the total number of rows
    const rowCount = rows.length;

    // Get and parse the current GPA input value
    const currentGpaInput = document.getElementById("current gpa").value.trim();
    // Get and parse the number of courses input value
    const numberOfCoursesInput = document.getElementById("number of courses").value.trim();

    // Validate current GPA input if it is not "NotAdded"
    if (currentGpaInput !== "NotAdded" && (isNaN(parseFloat(currentGpaInput)) )) {
        document.getElementById("current gpa").value = "Must be a floating value";
    }

    // Validate number of courses input if it is not "NotAdded"
    if (numberOfCoursesInput !== "NotAdded" && isNaN(parseInt(numberOfCoursesInput)) && numberOfCoursesInput >5 && numberOfCoursesInput <0 ) {
        document.getElementById("number of courses").value = "Must be an Integer";
    }

    // Loop through each row (starting from 1 to exclude header)
    for (let i = 1; i < rowCount; i++) {
        // Get and parse the grade input value for each row
        console.log(document.getElementById("g" + i).value);
        const gradeInput = document.getElementById("g" + i).value.trim();

        // Validate grade input for each row if it is not "NotAdded"
        if (gradeInput !== "NotAdded" && (isNaN(parseFloat(gradeInput)) || !Number.isInteger(parseFloat(gradeInput)))) {
            // If not an integer, update the input value to indicate an error
            document.getElementById("g" + i).value = "Must be an Integer";
        }
    }
}


function dynamicSave(){
    const interval = setInterval(function() {
   saveGradeData();
 }, 3000);

}

function populateTable(){
    window.onload = function() {
    retrieveGradeData();
    }
}


// Function to show weighted values based on course type
function showWeightedValues() {
  // Get the table
  var table = document.getElementById("Semester 1");
  // Get the number of rows in the table
  var rowCount = table.rows.length;

  // Loop through each row
  for (let course = 1; course < rowCount; course++) {
    // Get elements by their IDs
    var weightedvaluenow = document.getElementById("weightedvalue" + String(course));
    var coursetype = document.getElementById("type of course" + String(course));

    // Add event listener for course type change
    document.getElementById("type of course" + String(course)).addEventListener('coursetype', function () {
      // Check course type and update weighted value
      if (coursetype == "Regular") {
        weightedvaluenow += 0;
      } else if (coursetype == "AP/IB") {
        weightedvaluenow += 1;
      } else {
        weightedvaluenow += 0.5;
      }
      document.getElementById("weightedvalue" + String(course)) = weightedvaluenow;
    });
  }
}

// Function to switch HTML files
function switchHtmlFiles() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Update the current tab's URL to the specified HTML file
    chrome.tabs.update(tabs[0].id, {
      url: chrome.runtime.getURL("popup.html")
    });
  });
}

// Function to calculate average and display the result
function Average() {
  // Get input values
  let g1 = parseFloat(document.getElementById("g1").value);
  let g2 = parseFloat(document.getElementById("g2").value);
  let g3 = parseFloat(document.getElementById("g3").value);

  // Calculate and display sum and average
  let answer = "sum of g1, g2, g3 is " + (g1 + g2 + g3) + " Average of " + g1 + " and " + g2 + " and " + g3 + " is " + (g1 + g2 + g3) / 3;
  document.getElementById("gpa").innerHTML = answer;
}



// Function to add event listeners for course type change
function addEventListenerForCourseTypeChange() {
  // Get the table
  var table = document.getElementById("Semester 1");
  // Get all rows in the table
  var rows = table.getElementsByTagName("tr");

  // Loop through each row
  for (var i = 0; i < rows.length; i++) {
    // Get input elements for course type and weighted value
    var courseTypeInput = rows[i].querySelector('input[id^="type of course"]');
    var weightedValueInput = rows[i].querySelector('input[id^="weighted value"]');

    // Add event listener for course type change
    if (courseTypeInput && weightedValueInput) {
      (function (courseTypeInput, weightedValueInput) {
        var oldValue = courseTypeInput.value;

        courseTypeInput.addEventListener("change", function () {
          // Check if course type has changed and update weighted value
          if (courseTypeInput.value !== oldValue) {
            oldValue = courseTypeInput.value;
            weightedValueInput.value = parseInt(weightedValueInput.value) + 1;

            // Set the updated value back into the document
            weightedValueInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      })(courseTypeInput, weightedValueInput);
    }
  }
}

// Call the function to add event listeners for course type change
addEventListenerForCourseTypeChange();

// Function to save grade data to local storage
function saveGradeData() {
  var table = document.getElementById("Semester 1");
  var rowCount = table.rows.length;

  const grades = [];
  const gradeValues = [];

  // Loop through each row and save grade values
  for (let i = 1; i < rowCount; i++) {
    let grade = "g" + i;
    var gradeValue = document.getElementById(grade).value;
    grades.push(g1);
    gradeValues.push(gradeValue);
  }

  // Save the grade values to local storage
  chrome.storage.local.set({ grades: gradeValues }, function () {
    console.log("Grades " + grades + " saved with values " + gradeValues + " to local storage.");
    document.getElementById("gpa").innerHTML = "";
  });
}

// Function to retrieve grade data from local storage
function retrieveGradeData() {
  chrome.storage.local.get('grades', function (gradeValues) {
    var table = document.getElementById("Semester 1");
    var rowCount = table.rows.length;

    // Loop through each row and set the retrieved grade values
    for (let i = 0; i < rowCount - 1; i++) {
      document.getElementById("g" + (i + 1)).defaultValue = gradeValues.grades[i];
    }
  });
}

// Function to add a new row to the table
function addRow() {
  var table = document.getElementById("Semester 1");
  var rowCount = table.rows.length;
  var currentRowNumber = rowCount; // first one is heading row 
  var row = table.insertRow(rowCount);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  console.log("new row number is " + currentRowNumber);

  // Populate cells with input fields for course name, grade, course type, and weighted value
  cell1.innerHTML = "<td style=\"width: 100px\"><input type=\"text\" id=\"coursename" + currentRowNumber + "\" value=\"Course " + currentRowNumber + "\"></td>";
  cell2.innerHTML = "<input type=\"text\" id=g" + currentRowNumber + " name=\"grade\" value=100.0>";
  cell3.innerHTML = "<label for=\"type of course\"></label> <select name=\"coursetype\" id=\"coursetype" + currentRowNumber + "\">" +
    "<option value=\"Regular\">Regular</option>" +
    "<option value=\"AP/IB\">AP/IB</option>" +
    "<option value=\"Honors\">Honors</option>" +
    "</select>";
  cell4.innerHTML = "<td style=\"width: 100px\"><input type=\"text\" id=\"weightedvalue" + currentRowNumber + "\" name=\"weightedgrade\" value=\"4.0\"></td>";
}

// Function to delete the last row from the table
function deleteRow() {
  var table = document.getElementById("Semester 1");
  var rowCount = table.rows.length;

  // Delete the last row
  table.deleteRow(rowCount - 1);
}


// Function to calculate the weighted GPA
function weightedaverageCalculator() {
  validate()
  const rows = document.querySelectorAll("tr");
  const rowCount = rows.length;

  var currentgpanumerator = 0;
  var currentgpadenominator = 0;

  var tablenumerator = 0;
  var tabledenominator = 0;
    
  var currentgpa = document.getElementById("current gpa");
  var coursenumber = document.getElementById("number of courses");
    
  var regularcoursecount = 0;
  var apibcoursecount = 0;
  var honorscoursecount = 0;

  // Calculate the numerator and denominator for weighted GPA
  if (currentgpa.value != "NotAdded") {
    currentgpanumerator = parseFloat(currentgpa.value)
    currentgpadenominator = parseFloat(coursenumber.value);
  }

  // Loop through each row to calculate the weighted GPA
  for (let i = 1; i < rowCount; i++) {
    var coursetype = document.getElementById("coursetype" + (i));
    var gpagrade = 0
    
    // Check course type and update values accordingly
    if (coursetype.value == "Regular") {
      var grade = document.getElementById("g" + (i)).value;
      regular = regular + 1
        if (grade>89 && grade <101) {
            var gpagrade = 4.0
        }
        if (grade>79 && grade <90) {
            var gpagrade = 3.0
        }
        if (grade>69 && grade <80) {
            var gpagrade = 2.0
        }
        if (grade<70) {
            var gpagrade = 0.0
        }
        
      tablenumerator = parseFloat(tablenumerator) + parseFloat(gpagrade);
      tabledenominator = tabledenominator + 1;
      regularcoursecount += 1;
      (document.getElementById("weightedvalue" + (i)).value) = gpagrade;
        
    } else if (coursetype.value == "AP/IB") {
      var grade = parseFloat(document.getElementById("g" + (i)).value);
      apib = apib +1
        if (grade>89 && grade <101) {
            var gpagrade = 5.0
        }
        if (grade>79 && grade <90) {
            var gpagrade = 4.0
        }
        if (grade>69 && grade <80) {
            var gpagrade = 3.0
        }
        if (grade<70) {
            var gpagrade = 0.0
        }
      tablenumerator = parseFloat(tablenumerator) + parseFloat(gpagrade);
      tabledenominator = tabledenominator + 1;
      apibcoursecount += 1;
      (document.getElementById("weightedvalue" + (i)).value) = gpagrade;
        
    } else {
      var grade = parseFloat(document.getElementById("g" + (i)).value);
      honors = honors+1
        if (grade>89 && grade <101) {
            var gpagrade = 4.0
        }
        if (grade>79 && grade <90) {
            var gpagrade = 3.0
        }
        if (grade>69 && grade <80) {
            var gpagrade = 2.0
        }
        if (grade<70) {
            var gpagrade = 0.0
        }
        
      tablenumerator = parseFloat(tablenumerator) + parseFloat(gpagrade);
      tabledenominator = tabledenominator + 1;
      honorscoursecount += 1;
      (document.getElementById("weightedvalue" + (i)).value) = gpagrade;
    }
  }

  // Calculate and display the weighted GPA
  console.log("currentgpanumerator is" + currentgpanumerator)
  console.log("currentgpadenominator is" + currentgpadenominator)
  console.log("tablenumerator is" + tablenumerator)
  console.log("tabledenominator is" + tabledenominator)

  numerator = (((currentgpanumerator)*(currentgpadenominator)) + (tablenumerator))
  denominator = (currentgpadenominator+tabledenominator)
                
  average = numerator / denominator ;
  roundedAverage = average.toFixed(2);
    

  document.getElementById("gradepointaverage").innerHTML = "<span style=\"font-size:18px\">Weighted GPA:"+ roundedAverage; ;
  weightedgpa = roundedAverage
}

// Function to calculate the unweighted GPA
function regularAverageCalculator() {
  validate()
  const rows = document.querySelectorAll("tr");
  const rowCount = rows.length;

  var total = 0;

  // Loop through each row to calculate the unweighted GPA
  for (let i = 1; i < rowCount; i++) {
    var grade = document.getElementById("g" + (i)).value;
    total = total + parseFloat(grade);
  }

  // Calculate and display the unweighted GPA
  var average = total / (rowCount - 1);
  roundedAverage = average.toFixed(2);
  document.getElementById("courseCount").innerHTML = "<span style=\"font-size:18px\">Course Count: " + (rowCount - 1);
  document.getElementById("gradepoints").innerHTML = "<span style=\"font-size:18px\">Grade Points: " + total;
  document.getElementById("gradepointaverage").innerHTML = "<span style=\"font-size:18px\">Unweighted GPA: " + roundedAverage;
}

// Function to generate a report with course details
function generateReport() {
  // read saved data from REPORTS variable
  // Open a new window for the report

  var apCount = 0
  var regularCount=0
  var honorsCount=0
  const rows = document.querySelectorAll("tr");
  const rowCount = rows.length;

  var opened = window.open("");
  opened.document.write("<!DOCTYPE html><html><head><style>body {font-family: 'Times New Roman', Times, serif;}.container {display: flex;flex-direction: column;align-items: right;}.box {border: 1px solid black;padding: 10px;margin: 5px;width: 70%;}.box:nth-child(1) {height: 20%;}.box:nth-child(2) {height: auto;font-size: 12px;}.box:nth-child(3) {height: 20%;font-size: 12px;}.box:nth-child(4) {height: 20%; font-size: 14px;font-weight: bold;}h2 {font-size: 20px;}</style></head><body><div class=\"container\"><div class=\"box\"><h1 style=\"font-size: 20px;\">GPAScholar Report</h1></div><div class=\"box\"><h2>Courses:</h2><ul style=\"font-size: 20px;\">");
  for (let i = 1; i < rowCount; i++) {
    var courseName = document.getElementById("coursename" + i).value;
    var weightedgrade = document.getElementById("weightedvalue" + i).value;
    opened.document.write("<li>" + courseName + " : " + weightedgrade + "</li>");
  }
  opened.document.write("</ul></div><div class=\"box\"><h2>Course Types Count</h2><ul style=\"font-size: 18px;\">");
      
    opened.document.write("<li> Regular Courses: " + regular + "</li>");
    opened.document.write("<li> AP/IB Courses: " + apib + "</li>");
    opened.document.write("<li> Honor Courses: " + honors + "</li>");
  
  opened.document.write("</ul></div><div class=\"box\"><h2>GPA:</h2><ul style=\"font-size: 18px;\">");


    opened.document.write("<li> Weighted GPA: " + weightedgpa + "</li>");
  
  opened.document.write("</ul></div></div></body></html>");
}