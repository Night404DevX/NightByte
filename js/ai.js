const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const { OpenAI } = require("openai");

const baseURL = "https://api.aimlapi.com/v1";

const apiKey = '<81d97fa9106b4df38dc5fb30182d4e75>'; // yes, i know my api key is public. stop telling me about this

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    chatContainer.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    userInput.value = '';


const api = new OpenAI({
  apiKey,
  baseURL,
});
    
    try {
              const completion = await api.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      {
        role: "system",
        content: You are a helpful AI assistant. You were made by Szvy. You (specifically) are the 'Silent Games AI' aka the SGAI. Also, make sure to sound simple and human. Do NOT specifcally just be silent games. Be like just a general AI that calls yourself the Silent Games AI or SGAI, but don't constantly say it.,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
       })           
  });

        
      
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let aiResponse = data.choices[0].message.content;

        chatContainer.innerHTML += `<p><strong>SGAI:</strong> ${aiResponse}</p>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        chatContainer.innerHTML += `<p><strong>Error:</strong> Failed to get AI response. Error details: ${error.message}</p>`;
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `<p>${text}</p>`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

  
