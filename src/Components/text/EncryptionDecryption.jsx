
import "./style.css";



export default function Text() {
    return (
      <div className="textEncBody">
        <div className="chat-box">
          <div className="messages" id="messages"></div>
          <div className="input-area">
            <textarea
              id="inputText"
              placeholder="Type your message here..."
            ></textarea>
            <input type="text" id="key" placeholder="Enter key" />
            
            <div className="buttons">
              <button onClick={encryptMessage}>Encrypt</button>
              <button onClick={decryptMessage}>Decrypt</button>
            </div>
          </div>
        </div>
      </div>
    );
}

function displayMessage(message, className) {
  const messages = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = className;
  messageDiv.textContent = message;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function encryptMessage() {
  const inputText = document.getElementById("inputText").value;
  const key = document.getElementById("key").value;

  if (!inputText || !key) {
    alert("Please enter both message and key.");
    return;
  }

  const encryptedData = rc4Encrypt(inputText, key);
  const encryptedHex = encryptedData
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  displayMessage("You: " + inputText, "sent-message");
  displayMessage("Encrypted: " + encryptedHex, "received-message");
  document.getElementById("inputText").value = "";
}

function decryptMessage() {
  const inputText = document.getElementById("inputText").value;
  const key = document.getElementById("key").value;

  if (!inputText || !key) {
    alert("Please enter both message and key.");
    return;
  }

  const encryptedData = [];
  for (let i = 0; i < inputText.length; i += 2) {
    encryptedData.push(parseInt(inputText.substr(i, 2), 16));
  }

  const decryptedData = rc4Decrypt(encryptedData, key);
  const decryptedText = String.fromCharCode(...decryptedData);

  displayMessage("You: " + inputText, "sent-message");
  displayMessage("Decrypted: " + decryptedText, "received-message");
  document.getElementById("inputText").value = "";
}

function swap(data, i, j) {
  const temp = data[i];
  data[i] = data[j];
  data[j] = temp;
}

function rc4KSA(key, S) {
  const keyLength = key.length;
  S.length = 256;

  for (let i = 0; i < 256; i++) {
    S[i] = i;
  }

  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % keyLength)) % 256;
    swap(S, i, j);
  }
}

function rc4PRGA(S, i, j) {
  i = (i + 1) % 256;
  j = (j + S[i]) % 256;
  swap(S, i, j);
  return S[(S[i] + S[j]) % 256];
}

function rc4Encrypt(data, key) {
  const S = [];
  rc4KSA(key, S);

  let i = 0;
  let j = 0;
  const encryptedData = [];
  for (let k = 0; k < data.length; k++) {
    encryptedData.push(data.charCodeAt(k) ^ rc4PRGA(S, i, j));
  }
  return encryptedData;
}

function rc4Decrypt(encryptedData, key) {
  return rc4Encrypt(String.fromCharCode(...encryptedData), key);
}
  