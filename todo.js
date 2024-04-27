
let tasks = [];
let addingTasks = 0; // Initialize addingTasks variable

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    updateProgressCircle();
    saveTasksToLocalStorage();
}

function renderTasks(filteredTasks = tasks) {
    let taskList = document.getElementById("todoList");
    taskList.innerHTML = "";

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.category;
        const taskText = document.createElement('span');
        taskText.classList.add('taskText');
        let text = task.text;
        

        
        // Check if task has a deadline (event date)
        if (task.deadline) {
            // Display event name and deadline
            text += `<span class="deadline"> Deadline: ${new Date(task.deadline).toLocaleString()}</span>`;
               // Check if event date exists and add event
               
            const now = new Date();
            const taskDeadline = new Date(task.deadline);
            const timeDifference = Math.abs(taskDeadline.getTime() - now.getTime());
        
            if (taskDeadline.toDateString() === now.toDateString()) {
                // If deadline is today, check if it's within 5 minutes
                if (timeDifference < 300000) { // 5 minutes in milliseconds
                    const minutesRemaining = Math.ceil(timeDifference / 60000); 
                    notif(minutesRemaining + " minutes");
                    li.style.backgroundColor = "red";
                    li.style.color = "white";
                    taskList.appendChild(li);
                    taskList.insertBefore(li, taskList.firstChild);
                }
            } else {
                // If deadline is within 5 days, notify
                const daysFromNow = Math.ceil(Math.abs((now.getTime() - taskDeadline.getTime()) / (24 * 60 * 60 * 1000)));
                if (daysFromNow < 5) {
                    notif(daysFromNow + " days from now");
                    li.style.backgroundColor = "yellow";
                    li.style.color = "black";
                    taskList.insertBefore(li, taskList.firstChild);
                }
            }
        }
            
        // Set task text
        taskText.innerHTML = text;

        // Toggle task completion on click
        taskText.addEventListener('click', function() { 
            toggleTask(index);
        });

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "<i class='bx bx-trash'></i>";
        deleteButton.classList.add('deleteButton');
        deleteButton.addEventListener('click', function(event) {
            deleteTask(index);
            
        });

        // Append task text and delete button to task item
        li.appendChild(taskText); 
        li.appendChild(deleteButton); 

        // Check if task is completed and mark for deletion after 2 seconds
        if (task.completed) {
            taskText.classList.add('crossed');
            // Check if task is crossed out
            if (taskText.classList.contains('crossed')) {
                setTimeout(() => {
                    // Check again if task is still completed and crossed out before deleting
                    if (task.completed && taskText.classList.contains('crossed')) {
                        
                        localStorage.setItem('addingTasks', addingTasks);
                        tasks.splice(index, 1);
                        renderTasks();
                        updateProgressCircle();
                        saveTasksToLocalStorage();addingTasks--;
                        numberTodo.innerHTML = addingTasks;

                    }
                }, 2000); //delete time
            }
        }
        
        // Append task item to task list
        taskList.appendChild(li);
        
 
    });
}


function updateProgressCircle(filteredTasks = tasks) {
    let completedTasks = filteredTasks.filter(task => task.completed).length;
    let totalTasks = filteredTasks.length;
    let progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    let progressCircleInner = document.getElementById("progressCircleInner");
    let progressText = document.getElementById("progressText");

    progressCircleInner.style.clipPath = `inset(${100 - progressPercentage}% 0 0 0)`;
    progressText.textContent = progressPercentage + "%";
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('addingTasks', addingTasks); // Save addingTasks value
}

document.addEventListener('DOMContentLoaded', function() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
        updateProgressCircle();
    }

    const storedAddingTasks = localStorage.getItem('addingTasks');
    if (storedAddingTasks) {
        addingTasks = parseInt(storedAddingTasks); // Parse integer value
        numberTodo.innerHTML = addingTasks; // Update numberTodo
    }

    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const categorySelect = document.getElementById('categorySelect');
    const allButton = document.getElementById('allButton');
    const manageButton = document.getElementById('manageButton');
    const focusButton = document.getElementById('focusButton');
    const importantButton = document.getElementById('importantButton');

    function filterTasksByCategory(category) {
        const filteredTasks = tasks.filter(task => task.category === category);
        renderTasks(filteredTasks);
        updateProgressCircle(filteredTasks);
    }

    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const task = taskInput.value.trim();
        const deadline = deadlineInput.value.trim();

        if (deadline !== "") {
            addEvent(deadline, task); // Corrected line
        }

        const taskObject = {
            text: task,
            completed: false,
            category: categorySelect.value,
            deadline: deadline || null
        };

        tasks.push(taskObject);
        renderTasks();
        updateProgressCircle();
        saveTasksToLocalStorage();

        taskInput.value = '';
        deadlineInput.value = '';
        addingTasks++;
        numberTodo.innerHTML = addingTasks;
        localStorage.setItem('addingTasks', addingTasks);
    });

    allButton.addEventListener('click', function() {
        renderTasks();
        updateProgressCircle();
    });

    manageButton.addEventListener('click', function() {
        filterTasksByCategory('manage');
    });
    
    focusButton.addEventListener('click', function() {
        filterTasksByCategory('focus');
    });
    
    importantButton.addEventListener('click', function() {
        filterTasksByCategory('important');
    });
});

function deleteTask(index, date = null) {
    addingTasks--;
    localStorage.setItem('addingTasks', addingTasks);
    tasks.splice(index, 1);
    renderTasks();
    updateProgressCircle();
    saveTasksToLocalStorage();
    numberTodo.innerHTML = addingTasks;

    // Check if date is provided (indicating it's an event) and delete accordingly
    if (date && events[date]) {
        deleteEvent(date, index);
    }
}

// Modify deleteEvent function to remove the "event" class
function deleteEvent(date, eventName, dateToDelete) {
    if (events[date]) {
        const eventIndex = events[date].indexOf(eventName);
        if (eventIndex !== -1) {
            events[date].splice(eventIndex, 1);
            if (events[date].length === 0) {
                delete events[date];
            }
            displayEvents(date);
            saveEventsToLocalStorage();
        }
    }

    // Find the task corresponding to the eventName and date, then delete it
    const taskToDelete = tasks.find(task => task.text === eventName && task.deadline === dateToDelete);
    if (taskToDelete) {
        const taskIndex = tasks.indexOf(taskToDelete);
        if (taskIndex !== -1) {
            deleteTask(taskIndex, dateToDelete);
        }
    }

    // Remove the "event" class from the corresponding day element
    const dayElement = document.querySelector(`.day[data-date="${date}"]`);
    if (dayElement) {
        dayElement.classList.remove('event');
    }
}
setInterval(function notif( timeLimit){
    
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
          // Create a new notification
          const notification = new Notification("ESKULAYOUT", {
            body: "You need to pass your taks in " + timeLimit,
            // icon: "Logo_Centered.png",
          });

          notification.onclick = function(event) {
            event.preventDefault(); 
            alert("Notification clicked!");
          };
          notification.addEventListener("error", e => {
            alert("Error creating notification");
          });
        }
      });
}, 3600000);

function notif( timeLimit){
    
    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
          // Create a new notification
          const notification = new Notification("ESKUWELAYOUT", {
            body: "You need to pass your taks in " + timeLimit,
            // icon: "Logo_Centered.png",
          });

          notification.onclick = function(event) {
            event.preventDefault(); 
            alert("Notification clicked!");
          };
          notification.addEventListener("error", e => {
            alert("Error creating notification");
          });
        }
      });
}



//Calendar
// Initialize events from localStorage
let events = JSON.parse(localStorage.getItem('events')) || {};

// Function to save events to localStorage
function saveEventsToLocalStorage() {
    localStorage.setItem('events', JSON.stringify(events));
}
let currentYear, currentMonth;

// Function to create calendar
function createCalendar(year, month) {
    const calendar = document.querySelector('.calendar');
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
    
    calendar.innerHTML = ''; // Clear previous calendar
    
    // Display days of the week
    for (let i = 1; i <= 7; i++) {
        const dayName = document.createElement('div');
        dayName.classList.add('day');
        dayName.textContent = getDayName(i);
        calendar.appendChild(dayName);
    }

    // Add placeholders for the first days of the month if it doesn't start on Monday
    for (let i = 0; i < firstDayOfMonth - 1; i++) {
        const placeholderDay = document.createElement('div');
        placeholderDay.classList.add('day');
        calendar.appendChild(placeholderDay);
    }

    // Create day elements for the calendar
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;
        const date = new Date(year, month, i);
        dayElement.setAttribute('data-date', date.toISOString().split('T')[0]); // Format date consistently
        
        // Add style for today's date
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Add style for dates with events
        const eventDate = date.toISOString().split('T')[0];
        if (events[eventDate] && events[eventDate].length > 0) {
            dayElement.classList.add('event');
        }
        
        dayElement.onclick = function() {
            displayEvents(date.toISOString().split('T')[0]);
        };
        calendar.appendChild(dayElement);
    }
}


// Function to get day name
function getDayName(dayIndex) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex - 1];
}

// Function to add event
function addEvent(eventDate, eventName) {
    if (eventDate && eventName) {
        const eventDateTime = new Date(eventDate);
        const timeZoneOffsetInMinutes = eventDateTime.getTimezoneOffset();
        eventDateTime.setMinutes(eventDateTime.getMinutes() + timeZoneOffsetInMinutes); // Adjust to local time zone
        const formattedDate = eventDateTime.toISOString().split('T')[0];

        if (!events[formattedDate]) {
            events[formattedDate] = [];
        }
        
        events[formattedDate].push(eventName);
        displayEvents(formattedDate);
        saveEventsToLocalStorage();
        const dayElement = document.querySelector(`.day[data-date="${formattedDate}"]`);
            if (dayElement) {
                dayElement.classList.add('event');
            }
    }
}

// Function to display events for a specific date
function displayEvents(date) {
    const eventContainer = document.getElementById('eventContainer');
    eventContainer.innerHTML = ''; // Clear previous events

    if (events[date]) {
        events[date].forEach(eventName => {
            const eventElement = document.createElement('li');
            eventElement.textContent = eventName;

            // Create delete button for event
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = "<i class='bx bx-trash'></i>";
            deleteButton.classList.add('deleteButton');
            deleteButton.addEventListener('click', function(event) {
                deleteEvent(date, eventName, date); // Pass date as the third argument
            });

            // Append event and delete button to event element
            eventElement.appendChild(deleteButton);

            // Append event element to event container
            eventContainer.appendChild(eventElement);
        });
    } else {
        const noEventElement = document.createElement('li');
        noEventElement.textContent = 'No events for this day.';
        eventContainer.appendChild(noEventElement);
    }
}


// Function to go to previous month
function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
}

// Function to go to next month
function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

// Function to update calendar with new month
function updateCalendar() {
    document.getElementById('monthYear').textContent = `${getMonthName(currentMonth)} ${currentYear}`;
    createCalendar(currentYear, currentMonth);
}

// Helper function to get month name
function getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
}

// Initialize calendar
const currentDate = new Date();
currentYear = currentDate.getFullYear();
currentMonth = currentDate.getMonth();
updateCalendar();