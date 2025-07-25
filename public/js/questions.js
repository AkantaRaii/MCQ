
// Modal handling
const modal = document.getElementById('addQuestionModal');
let isEditing = false;
let editQuestionId = null;
let oldOptions = []; // Store original options when editing
let page = Infinity;
function openModal() {
    modal.style.display = 'flex';
    isEditing = false;
    oldOptions = []; // Reset old options
    document.getElementById('questionForm').reset();
    document.getElementById('questionText').focus();
}

function closeModal() {
    modal.style.display = 'none';
    document.getElementById('questionForm').reset();
    oldOptions = []; // Reset old options
}

function editQuestion(questionId, questionText, options) {
    // Show modal
    modal.style.display = 'flex';
    isEditing = true;
    editQuestionId = questionId;
    oldOptions = options; // Store original options

    // Set question text
    document.getElementById('questionText').value = questionText;

    // Set options and correct answer
    const optionInputs = document.querySelectorAll('input[name="options[]"]');
    const radioButtons = document.querySelectorAll('input[name="correctOption"]');

    options.forEach((option, index) => {
        optionInputs[index].value = option[0];  // Set option text
        if (option[1] === 1) {                  // Check radio if correct answer
            radioButtons[index].checked = true;
        }
    });

    // Focus on question text
    document.getElementById('questionText').focus();
}

async function submitQuestion(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const correctOption = formData.get('correctOption');
    const newOptions = formData.getAll('options[]');
    const subject_id = document.getElementById('subject_id').value;
    console.log(subject_id);
    
    const questionData = {
        question_text: formData.get('questionText'),
        subject_id: document.getElementById('subject_id').value,
        options: newOptions.map((text, index) => ({
            option_text: text,
            old_option_text: isEditing ? oldOptions[index][0] : null, // Include old option text when editing
            is_correct: index === parseInt(correctOption) ? 1 : 0
        }))
    };
    console.log(questionData);
    if (isEditing && editQuestionId) {
        questionData.question_id = editQuestionId;
        page=document.getElementById('current_page').value;
    }

    try {
        const response = await fetch(`/admin/${isEditing ? 'updateQuestion' : 'addQuestion'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(questionData)
        });

        if (response.ok) {
            closeModal();
            // window.location.reload();
            window.location.href = `/admin/questions/${subject_id}?page=${page}`;

        } else {
            throw new Error(`Failed to ${isEditing ? 'update' : 'add'} question`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to ${isEditing ? 'update' : 'add'} question. Please try again.`);
    }
}

// Close modal if clicked outside
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
} 
async function deleteQuestion(questionId){
    try {
        const response = await fetch(`/admin/deleteQuestion`, {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/JSON'
            },

            body: JSON.stringify({ questionId })

        });
        if (response.ok) {
            window.location.reload();
        } else {
            throw new Error(`Failed to delete question`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to delete question. Please try again.`);
    }

    window.location.reload();
}

async function loadPage(page) {
    page = parseInt(page);
    const subject_id = document.getElementById('subject_id').value;
    const total_pages = parseInt(document.getElementById('total_pages').value);
    console.log(`Loading page ${page} for subject ${subject_id}`);
    // Validate page number
    console.log(`Total pages}`);
    if (page < 1 || page > total_pages) return;
    
    try {
        const response = await fetch(`/admin/questions/${subject_id}?page=${page}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/JSON'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load page');
        }
        
        // Reload the page with the page parameter in the URL
        window.location.href = `/admin/questions/${subject_id}?page=${page}`;
        
    } catch (error) {
        console.error('Error loading page:', error);
        alert('Failed to load page. Please try again.');
    }
}

// Add these pagination functions
function handlePageInputKeyPress(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const page = parseInt(input.value);
        const max = parseInt(input.max);
        const min = parseInt(input.min);
        
        if (page >= min && page <= max) {
            loadPage(page);
        } else {
            // Reset to current page if invalid
            input.value = document.getElementById('current_page').value;
        }
    }
}

function handlePageInputBlur(event) {
    const input = event.target;
    const page = parseInt(input.value);
    const max = parseInt(input.max);
    const min = parseInt(input.min);
    
    // Reset to current page if invalid
    if (!page || page < min || page > max) {
        input.value = document.getElementById('current_page').value;
    }
}
function OpenTextAreaForJSONQuestionUpload() {
    const modal = document.getElementById('JSONUploadModal');
    modal.style.display = 'flex';
    document.getElementById('JSONQuestionTextarea').focus();
}

function closeJSONModal() {
    const modal = document.getElementById('JSONUploadModal');
    modal.style.display = 'none';
    document.getElementById('JSONQuestionTextarea').value = '';
}
window.addEventListener('click', function(event) {
    const modal = document.getElementById('JSONUploadModal');
    if (event.target === modal) {
        closeJSONModal();
    }
});
function submitJSONQuestions (){
    const textarea = document.getElementById('JSONQuestionTextarea');
    const JSONQuestions = textarea.value.trim();
    const subject_id = document.getElementById('subject_id').value;
    console.log(subject_id);
    if (!JSONQuestions) {
        alert('Please enter valid JSON data.');
        return;
    }

    try {
        const parsedJson = JSON.parse(JSONQuestions);
        

        const jsonData = {
            ...parsedJson,
            subject_id: subject_id
        };
        console.log(jsonData);

        if (!jsonData.question_text || !Array.isArray(jsonData.options) || !jsonData.options.length === 4 || !jsonData.subject_id) {
                throw new Error('Invalid question format. Each question must have a "question_text" and an "options" array.');
        }

        fetch('/admin/addJSONQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (response.ok) {
                closeJSONModal();
                window.location.reload();
            } else {
                throw new Error('Failed to add JSON questions');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add JSON questions. Please try again.');
        });
        
    } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON format. Please check your input.');
    }
}



//bulk UPload
// Open the bulk upload modal and focus on the textarea
function openBulkJSONUploadModal() {
    const modal = document.getElementById('BulkJSONUploadModal');
    modal.style.display = 'flex';
    document.getElementById('BulkJSONQuestionTextarea').focus();
}

// Close the bulk upload modal and clear the textarea
function closeBulkJSONModal() {
    const modal = document.getElementById('BulkJSONUploadModal');
    modal.style.display = 'none';
    document.getElementById('BulkJSONQuestionTextarea').value = '';
}

// Close modal when clicking outside its content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('BulkJSONUploadModal');
    if (event.target === modal) {
        closeBulkJSONModal();
    }
});

// Function to submit bulk JSON questions
function submitBulkJSONQuestions() {
    const textarea = document.getElementById('BulkJSONQuestionTextarea');
    const JSONQuestions = textarea.value.trim();
    const subject_id = document.getElementById('subject_id').value;

    if (!JSONQuestions) {
        alert('Please enter valid JSON data.');
        return;
    }

    try {
        const parsedJson = JSON.parse(JSONQuestions);

        if (!Array.isArray(parsedJson)) {
            throw new Error('Bulk JSON must be an array of questions.');
        }

        // Validate each question structure (but don't modify it)
        parsedJson.forEach((question, index) => {
            if (
                !question.question_text ||
                !Array.isArray(question.options) ||
                question.options.length !== 4
            ) {
                throw new Error(
                    `Invalid question at index ${index}. Must have "question_text" and 4 options.`
                );
            }
        });
        console.log(parsedJson);
        // POST the bulk data to your server endpoint
        fetch('/admin/addBulkJSONQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject_id: subject_id,
                JSONQuestions: parsedJson  // still stringified
            })
        })
        .then(response => {
            if (response.ok) {
                closeBulkJSONModal();
                window.location.reload();
            } else {
                throw new Error('Failed to add JSON questions');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add JSON questions. Please try again.');
        });

    } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON format. Please check your input.');
    }
}
