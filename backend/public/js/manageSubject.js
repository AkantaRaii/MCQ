async function addSubject(course_id) {
    const subjectName = document.getElementById('newEntry').value.trim();
    if (!subjectName) {
        alert("Please enter a subject name.");
        return;
    }

    try {
        const response = await fetch('/admin/addSubject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject_name: subjectName, course_id: course_id })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json();
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error adding subject:', error);
        alert('Failed to add subject.');
    }
}

let currentSubjectId = null;

async function deleteSubject(subject_id, subject) {
    currentSubjectId = subject_id;
    document.querySelector('#overlay p').innerHTML = 
        `Type <span style="color: red; font-weight: bold;">"delete"</span> to confirm deleting subject: 
        <span style="color: blue; font-weight: bold;">${subject}</span>`;
    document.getElementById('overlay').style.display = 'flex';
}

function makeEditable(subject_id) {
    const editbutton = document.getElementById('edit-button'+'-'+subject_id);
    const deletebutton = document.getElementById('delete-button'+'-'+subject_id);
    editbutton.style.display = 'none';
    deletebutton.style.display = 'none';

    const spanElement = document.getElementById(`name-${subject_id}`);
    const subjectName = spanElement.innerText;

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = subjectName;
    inputElement.id = `edit-name-${subject_id}`;
    
    // Apply styles
    inputElement.style.border = 'none';
    inputElement.style.outline = 'none';
    inputElement.style.fontSize = 'inherit';
    inputElement.style.background = 'transparent';
    inputElement.style.padding = '5px';
    inputElement.style.borderRadius = '5px';
    inputElement.style.minWidth = '50px';
    inputElement.style.width = `${subjectName.length + 2}ch`;
    inputElement.style.maxWidth = '100%';
    inputElement.style.resize = 'none';

    spanElement.replaceWith(inputElement);

    const message = document.createElement('small');
    message.innerText = 'Press Enter to save changes';
    message.style.display = 'block';
    message.style.marginTop = '5px';
    message.style.color = 'gray';
    message.style.fontSize = '12px';
    message.id = `edit-message-${subject_id}`;
    inputElement.after(message);
    message.style.display = 'inline-block';

    inputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            saveSubjectName(subject_id, inputElement.value);
            message.remove();
            editbutton.style.display='inline-block';
            deletebutton.style.display='inline-block';
        }
    });

    inputElement.addEventListener('input', function() {
        inputElement.style.width = `${inputElement.value.length + 2}ch`;
    });

    inputElement.focus();
}

async function saveSubjectName(subject_id, subjectName) {
    try {
        const response = await fetch('/admin/updateSubject', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ subject_id, subject_name: subjectName })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Failed to update subject');
        }
    } catch (error) {
        console.error('Error updating subject:', error);
        alert('Failed to update subject.');
    }
}

// Initialize event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('confirmDelete').click();
        }
    });

    document.getElementById('confirmDelete').addEventListener('click', async () => {
        const input = document.getElementById('confirmInput').value;
        if (input.toLowerCase() === 'delete') {
            try {
                const response = await fetch('/admin/deleteSubject', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ subject_id: currentSubjectId })
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting subject:', error);
                alert('Failed to delete subject.');
            } finally {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('confirmInput').value = '';
            }
        } else {
            alert('You must type "delete" to confirm.');
        }
    });

    document.getElementById('cancelDelete').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('confirmInput').value = '';
    });
}); 