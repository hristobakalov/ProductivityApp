var ctx = document.getElementById("myChart").getContext('2d');
var testNew = new Chart(ctx);

const userAction = async () => {
    var response = await fetch('/api/TasksServices');
    var myJson = await response.json(); //extract JSON from the http response
    // do something with myJson

    testNew = new Chart(ctx, {
        type: 'line',
        data: {

            labels: myJson.Dates,

            datasets: [
                {
                    label: 'Daily Productivity',
                    data: myJson.Values,
                    fill: 'start',      // 0: fill to 'origin'
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    lineTension: 0.1
                }
            ]
        },
    })
};
userAction();


document.querySelector("#form").addEventListener("submit", function (e) {
    e.preventDefault();    //stop form from submitting

    var text = document.querySelector("#task-text").value;
    var number = parseInt(document.querySelector("#task-number").value);
    if (isNaN(number)) {
        alert("Only numbers are allowed!");
        return;
    }
    if (number < 1 || number > 100) {
        alert("Only numbers between 1 and 100 allowed!");
        return;
    }
    
    var date = new Date();
    var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    var formattedDate = date.getDate() + "/" + month + "/" + date.getFullYear();

    var taskObject = {
        'TaskDate': formattedDate,
        'TaskName': text,
        'TaskValue': number
    };

    var stringified = JSON.stringify(taskObject);
    const submitForm = async () => {
        const response = await fetch('/api/TasksServices/AddTask', {
            method: 'POST',
            body: stringified, // string or object
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(function (myJson) {
                removeData(testNew);
                addData(testNew, taskObject.TaskDate, myJson.DayValueSum);
                createTaskTableRow(taskObject.TaskName, taskObject.TaskValue, taskObject.TaskDate);
            })
            .catch(error => console.error(error));
    }
    submitForm();
    // Retrieve the object from storage
    //var retrievedObject = localStorage.getItem('test');

    //console.log('retrievedObject: ', JSON.parse(retrievedObject));
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    console.log(chart);
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function createTaskTableRow(name, value, date) {
    var tableHeaderRow = document.getElementById('tasks-list-header');
    var tableRowNewElm = document.createElement('tr');
    var tableCell = tableRowNewElm.insertCell(0);
    tableCell.innerHTML = name;
    var tableCell2 = tableRowNewElm.insertCell(1);
    tableCell2.innerHTML = value;
    var tableCell3 = tableRowNewElm.insertCell(2);
    tableCell3.innerHTML = date;
    insertAfter(tableRowNewElm, tableHeaderRow);
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}