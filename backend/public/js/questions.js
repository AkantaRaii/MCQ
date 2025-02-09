// Modal handling
const modal = document.getElementById('addQuestionModal');
let isEditing = false;
let editQuestionId = null;
let oldOptions = []; // Store original options when editing

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
    
    const questionData = {
        question_text: formData.get('questionText'),
        subject_id: document.getElementById('subjectId').value,
        options: newOptions.map((text, index) => ({
            option_text: text,
            old_option_text: isEditing ? oldOptions[index][0] : null, // Include old option text when editing
            is_correct: index === parseInt(correctOption) ? 1 : 0
        }))
    };

    if (isEditing && editQuestionId) {
        questionData.question_id = editQuestionId;
    }
    console.log(questionData);

    try {
        const response = await fetch(`/admin/${isEditing ? 'updateQuestion' : 'addQuestion'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        });

        if (response.ok) {
            closeModal();
            window.location.reload();
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
    console.log(questionId);
    try {
        const response = await fetch(`/admin/deleteQuestion`, {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
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
