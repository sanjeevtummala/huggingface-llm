const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const message = userInput.value;
    appendMessage('user', message);

    const formData = new FormData(chatForm);
    const csrfToken = formData.get('csrfmiddlewaretoken');

    try {
        const response = await fetch('/chatbot/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrfToken
            },
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        appendMessage('bot', data.bot_response);
    } catch (error) {
        console.error("Error sending message:", error);
        // Handle the error appropriately (e.g., display an error message to the user)
    }

    userInput.value = '';
});


function appendMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender + '-message');
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

