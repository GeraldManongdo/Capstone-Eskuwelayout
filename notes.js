var addingNotesButton = document.querySelector(".addingNotesButton");
var addingNotesBody = document.querySelector(".addingNotesBody");
var notesBodyContainer = document.querySelector(".notesBodyContainer");
var addNotesExitButton = document.getElementById("addNotesExitButton");
var mainNotesContainer = document.getElementById("mainNotesContainer");
var markedContainer = document.getElementById("markedContainer");
var quizSection = document.querySelector(".quizSection");
var navigationNotesContainer = document.getElementById("navigationsNotesContainer");
var addingnotes = 0;
var numberNotes = document.getElementById("numberNotes");
var numberDate = document.getElementById("numberDate");
numberDate.innerHTML = addCurrentDate();

var addTitleNotes = document.getElementById("addTitleNotes");
var addContentNotes = document.getElementById("addContentNotes");

// Load notes from local storage on page load
window.addEventListener('load', function () {
    loadNotes();
});

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(note => {
        addNote(note.title, note.content, note.marked, note.markedflagClass);
    });
}

function showNotes(title, content) {
    var navbar = document.querySelector(".navbar");
    navbar.style.display = "none";
    addingNotesBody.style.display = "block";
    notesBodyContainer.style.display = "none";
    quizSection.style.display = "none";
    calendarSection.style.display = "none"; 
    if (title !== "" || content !== "") {
        addTitleNotes.innerHTML = title;
        addContentNotes.innerHTML = content;
    }

    addNotesExitButton.addEventListener("click", function () {
        var titleValue = addTitleNotes.textContent;
        var contentValue = addContentNotes.textContent;

        if (titleValue !== "") {
            addNote(titleValue, contentValue);
        } else if (contentValue !== "") {
            titleValue = "Untitled";
            addNote(titleValue, contentValue);
        }

        addTitleNotes.innerHTML = "";
        addContentNotes.innerHTML = "";
        addingNotesBody.style.display = "none";
        notesBodyContainer.style.display = "block";

        saveNotes(); // Save notes after adding
    });
}

function saveNotes() {
    const notes = Array.from(document.querySelectorAll('.noteContainer')).map(noteContainer => {
        const title = noteContainer.querySelector('.noteTitle').innerHTML;
        const content = noteContainer.querySelector('.noteContent').innerHTML;
        const marked = noteContainer.classList.contains('markedNote');
        const markedflagClass = noteContainer.querySelector('.marked i').className;
        return { title, content, marked, markedflagClass };
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

//Adding a note to the page
function addNote(title, content, marked, markedflagClass) {
    

    var noteContainer = document.createElement("div");
    noteContainer.className = "noteContainer";
    if (marked) {
        noteContainer.classList.add('markedNote');
        markedContainer.appendChild(noteContainer);
    } else {
        mainNotesContainer.insertBefore(noteContainer, mainNotesContainer.firstChild);
    }

    var titleNote = document.createElement('span');
    titleNote.className = 'noteTitle';
    titleNote.innerHTML = title;

    var contentNote = document.createElement('span');
    contentNote.className = 'noteContent';
    contentNote.innerHTML = content;

    var noteNavigation = document.createElement("div");
    noteNavigation.className = "noteNavigation";

    var noteEditDate = document.createElement('span');
    noteEditDate.className = 'noteEditDate';
    noteEditDate.innerHTML = addCurrentDate();

    var noteOtherNavigation = document.createElement("div");
    var download = document.createElement('i');
    download.setAttribute("class", "bx bxs-download");
    download.addEventListener("click", function () {
        downloadNotesAsDoc(title, content);
    });
    var trash = document.createElement('i');
    trash.setAttribute("class", "bx bx-trash");
    trash.onclick = function () {
        noteContainer.parentNode.removeChild(noteContainer);
        addingnotes--;
        numberNotes.innerHTML = addingnotes;
        newListItem.parentNode.removeChild(newListItem);
        saveNotes(); // Save notes after deleting
    };

    var markedButton = document.createElement("span");
    markedButton.className = "marked";
    var markedflag = document.createElement("i");
    markedflag.className = markedflagClass; // Set the initial class based on the saved data
    markedButton.addEventListener("click", function () {
        if (!noteContainer.classList.contains('markedNote')) {
            noteContainer.classList.add('markedNote');
            markedflag.classList.replace("bx-bookmark", "bxs-bookmark");
            markedContainer.appendChild(noteContainer);
        } else {
            markedflag.classList.replace("bxs-bookmark", "bx-bookmark");
            noteContainer.classList.remove('markedNote');
            mainNotesContainer.appendChild(noteContainer);
        }
        saveNotes(); // Save notes after marking
    });
    
    markedButton.appendChild(markedflag);
    noteOtherNavigation.appendChild(download);
    noteOtherNavigation.appendChild(trash);
    noteNavigation.appendChild(noteEditDate);
    noteNavigation.appendChild(noteOtherNavigation);
    noteContainer.appendChild(titleNote);
    noteContainer.appendChild(contentNote);
    noteContainer.appendChild(noteNavigation);
    noteContainer.appendChild(markedButton);
    addingnotes++;
    numberNotes.innerHTML = addingnotes;

    //Side Navigation
    var newListItem = document.createElement("li");
    newListItem.innerHTML = "<i class='bx bx-file'></i>" + title;
    navigationNotesContainer.appendChild(newListItem);

    newListItem.addEventListener("click", function () {
        showNotes(titleNote.innerHTML, contentNote.innerHTML);
        noteContainer.parentNode.removeChild(noteContainer);
        newListItem.parentNode.removeChild(newListItem);
        addingnotes--;
        numberNotes.innerHTML = addingnotes;
    });

    titleNote.addEventListener("click", function () {
        showNotes(titleNote.innerHTML, contentNote.innerHTML);
        noteContainer.parentNode.removeChild(noteContainer);
        newListItem.parentNode.removeChild(newListItem);
        addingnotes--;
        numberNotes.innerHTML = addingnotes;
    });

    contentNote.addEventListener("click", function () {
        showNotes(titleNote.innerHTML, contentNote.innerHTML);
        noteContainer.parentNode.removeChild(noteContainer);
        newListItem.parentNode.removeChild(newListItem);
        addingnotes--;
        numberNotes.innerHTML = addingnotes;
    });

    
    saveNotes(); // Save notes after adding
}

function addCurrentDate() {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    return formattedDate;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/*PASSIVE */
var editableDiv = document.getElementById("addContentNotes");
editableDiv.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const text = editableDiv.innerText;
        const lines = text.split('\n');
        const lastLine = lines[lines.length - 1];
        
        
        if (/^[^\w\s]/.test(lastLine.charAt(0)) || /^\s\s+[^\w\s]/.test(lastLine)) {
            
            event.preventDefault(); 
            editableDiv.innerText += '\n' + lastLine.match(/^[^\w\s]|\s\s+[^\w\s]/)[0];
            
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(editableDiv);
            range.collapse(false); 
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            
            const listRegex = /^(?:[\-*+])+|\w+\./;
            
            
            if (listRegex.test(lastLine)) {
                
                event.preventDefault(); 
                
                // Extract the list symbol or character from the last line
                const match = lastLine.match(listRegex)[0];
                
                // Increment if it's a numbered list
                let nextValue;
                if (/^\d+\./.test(match)) {
                    const currentNumber = parseInt(match);
                    nextValue = currentNumber + 1 + ".";
                } else if (/^[a-zA-Z]+\./.test(match)) {
                    // For letters (a, b, c, etc.), convert to ASCII code and increment
                    const currentCharCode = match.charCodeAt(0);
                    nextValue = String.fromCharCode(currentCharCode + 1) + ".";
                } else {
                    // For symbols (-, *, +), just duplicate them
                    nextValue = match;
                }
                
                // Duplicate the pattern on the next line with the incremented value
                editableDiv.innerText += '\n' + lastLine.replace(listRegex, nextValue + " ");
                
                // Set focus to the end of the editable div
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(editableDiv);
                range.collapse(false); // collapse range to the end
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }
});

function downloadNotesAsDoc(title, content) {
    const blob = new Blob([content], { type: 'application/msword' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}