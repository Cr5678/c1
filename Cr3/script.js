// 对话界面功能
function initChatInterface() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // OpenAI API 密钥
    const OPENAI_API_KEY = ''; // 移除 API key

    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessageToAI(message) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {"role": "system", "content": "你是一个帮助用户的AI助手。"},
                        {"role": "user", "content": message}
                    ],
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("API 调用失败:", error);
            return "抱歉，我遇到了一些问题。请稍后再试。";
        }
    }

    async function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // 显示正在输入的提示
            const typingIndicator = document.createElement('div');
            typingIndicator.textContent = 'Cr-AI 正在输入...';
            typingIndicator.classList.add('typing-indicator');
            chatMessages.appendChild(typingIndicator);

            // 发送消息到 AI 并获取回复
            const aiResponse = await sendMessageToAI(message);
            
            // 移除正在输入的提示
            chatMessages.removeChild(typingIndicator);
            
            // 显示 AI 的回复
            addMessage(aiResponse);
        }
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // 初始欢迎消息
    addMessage('你好！我是 Cr-AI，很高兴与你交谈。有什么我可以帮助你的吗？');
}

// 照片轮播功能
function initPhotoCarousel() {
    const photos = document.querySelectorAll('.profile-photo');
    let currentPhotoIndex = 0;

    function showNextPhoto() {
        photos[currentPhotoIndex].classList.remove('active');
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        photos[currentPhotoIndex].classList.add('active');
    }

    // 每1秒切换一次照片
    setInterval(showNextPhoto, 1000);
}

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', function() {
    initChatInterface();
    initPhotoCarousel();
});