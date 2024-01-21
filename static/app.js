class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            inputField: document.querySelector('.chatbox__input')
        };

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton, inputField } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        inputField.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        const textField = this.args.inputField;
        const text = textField.value.trim();

        if (text === "") {
            return;
        }

        const userMessage = { name: "User", message: text };
        this.messages.push(userMessage);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(response => {
            const samMessage = { name: "Sam", message: response.answer };
            this.messages.push(samMessage);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        const html = this.messages.map(item => (
            `<div class="messages__item ${item.name === 'Sam' ? 'messages__item--visitor' : 'messages__item--operator'}">
                ${item.message}
             </div>`
        )).join('');

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();
