async function addCourse() {
    const courseName = document.getElementById('newEntry').value.trim();
    if (!courseName) {
        alert("Please enter a course name.");
        return;
    }

    try {
        const response = await fetch('/admin/addCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ course: courseName })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            const data = await response.json();
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error adding course:', error);
        alert('Failed to add course.');
    }
}

let currentCourseId = null;

async function deleteCourse(courseId, course) {
    currentCourseId = courseId;
    document.querySelector('#overlay p').innerHTML = 
        `Type <span style="color: red; font-weight: bold;">"delete"</span> to confirm deleting course: 
        <span style="color: blue; font-weight: bold;">${course}</span>`;
    document.getElementById('overlay').style.display = 'flex';
}

function makeEditable(courseId) {
    const editbutton = document.getElementById('edit-button'+'-'+courseId);
    const deletebutton = document.getElementById('delete-button'+'-'+courseId);
    editbutton.style.display = 'none';
    deletebutton.style.display = 'none';

    const spanElement = document.getElementById(`text-${courseId}`);
    const courseName = spanElement.innerText;

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.value = courseName;
    inputElement.id = `edit-text-${courseId}`;
    
    // Apply styles
    inputElement.style.border = 'none';
    inputElement.style.outline = 'none';
    inputElement.style.fontSize = 'inherit';
    inputElement.style.background = 'transparent';
    inputElement.style.padding = '5px';
    inputElement.style.borderRadius = '5px';
    inputElement.style.minWidth = '50px';
    inputElement.style.width = `${courseName.length + 2}ch`;
    inputElement.style.maxWidth = '100%';
    inputElement.style.resize = 'none';

    spanElement.replaceWith(inputElement);

    const message = document.createElement('small');
    message.innerText = 'Press Enter to save changes';
    message.style.display = 'block';
    message.style.marginTop = '5px';
    message.style.color = 'gray';
    message.style.fontSize = '12px';
    message.id = `edit-message-${courseId}`;
    inputElement.after(message);
    message.style.display = 'inline-block';

    inputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            saveCourseName(courseId, inputElement.value);
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

async function saveCourseName(courseId, courseName) {
    try {
        const response = await fetch('/admin/updateCourse', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId, course: courseName })
        });

        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error('Failed to update course');
        }
    } catch (error) {
        console.error('Error updating course:', error);
        alert('Failed to update course.');
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
                const response = await fetch('/admin/deleteCourse', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ courseId: currentCourseId })
                });

                if (response.ok) {
                    window.location.reload();
                } else {
                    const data = await response.json();
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course.');
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