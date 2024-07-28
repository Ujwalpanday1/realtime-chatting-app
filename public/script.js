document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchBox = document.getElementById('searchBox');
    const searchResult = document.querySelector('.searchResult');

    const chatArea = document.getElementById('chat-area');


    document.addEventListener('click', allowAudioPlay);

    let currentChat=null;

function allowAudioPlay() {
    const silentSound = document.getElementById('silentSound');
    silentSound.play().then(() => {
        document.removeEventListener('click', allowAudioPlay);
    }).catch(error => {
        console.error('Silent sound play failed:', error);
    });
}

    searchForm.addEventListener('keyup', async (e) => {
        e.preventDefault();
        const query = searchBox.value;
        const response = await fetch(`https://realtime-chatting-app-qnm1.onrender.com/findSuggestions/${query}`);
        const results = await response.json();
        if(results.length==0){
            searchResult.innerHTML=`<img src="notFound.png">`
        }
        else{
            searchResult.innerHTML = results.map(user => `
           <div class="suggestionItem p-2 hover:bg-gray-600">
                        <button type="button" class="w-full text-left text-white" onclick="selectContact('${user._id}')">
                            ${user.fName} ${user.lName}
                        </button>
                </div>
        `).join('');
        }
    });
});


async function selectContact(userId) {
    currentChat=userId;
    searchBox.value='';
    document.querySelector('.searchResult').innerHTML=''
    const response = await fetch(`https://realtime-chatting-app-qnm1.onrender.com/select/${userId}`);
    const data = await response.json();
    
    const chatArea = document.getElementById('chat-area');
    
    if (data.receiver && (data.messageArray.length!=0)) {
        chatArea.innerHTML = `
            <div class="chat-header mb-4">
                <h2 class="text-gray-700 text-lg font-semibold">Chat with ${data.receiver.fName}</h2>
            </div>
            <div class="messages flex flex-col space-y-2 overflow-y-auto flex-grow">
                ${data.messageArray.map(message => 
                    `
                    <div class="chat-bubble ${message.sender === parsedUser._id ? 'sent' : 'received'}">
                        ${message.message}
                    </div>
                `).join('')}
            </div>
            <div class="formBox flex items-center mt-4">
            
               
            </div>
        `;
        createForm(data.receiver);
        let messages=document.querySelector(".messages")
        messages.scrollTop = messages.scrollHeight;
    } else {
        chatArea.innerHTML = `
            <div class="flex-grow flex items-center justify-center text-gray-500">
                <p>Select a contact to start chatting</p>
            </div>
        `;
    }
}




function createForm(receiverId) {
    const form = document.createElement('form');
    form.className = 'flex w-full';
    form.id = 'form';

    form.onsubmit = function(event) {
        send(event, receiverId);
        return false;
    };

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'msgBox';
    input.name = 'message';
    input.placeholder = 'Type your message here';
    input.className = 'flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500';

    const button = document.createElement('button');
    button.type = 'submit';
    button.id = 'sendBtn';
    button.className = 'bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors';
    button.textContent = 'Send';

    form.appendChild(input);
    form.appendChild(button);

    document.querySelector('.formBox').appendChild(form);
}




const socket=io()
const parsedUser=JSON.parse(user)
socket.emit("login",parsedUser._id)
document.getElementById('chat-area').addEventListener('submit', function(event) {
    if (event.target && event.target.id === 'form') {
        send(event, window.receiverId);
    }
});

socket.on("receivePrivateMsg",(data)=>{
    document.querySelector("#notificationSound").play();
    if(currentChat==data.sender){
        
        let messages=document.querySelector(".messages")
        let msg=document.createElement('div');
        msg.className="chat-bubble received";
        msg.textContent=data.message;   
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }
})
 
function send(event, receiverId) {
    event.preventDefault(); 
    const messageInput = document.getElementById('msgBox');
    const message = messageInput.value;

    if (message) {
         
        // Emiting the private message event to the server
        socket.emit('privateMsg', {
           
            message: message,
            receiver:receiverId,
            sender:parsedUser._id
        });
        let messages=document.querySelector(".messages")
        let msg=document.createElement('div');
        msg.className="chat-bubble sent";
        msg.textContent=message;   
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;

        // Clearing the message input box
        messageInput.value = '';
    }

}

