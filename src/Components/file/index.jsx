import { useState } from "react";
import "./style.css";

// Display message function
function displayMessage(message, className) {
  const messages = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = className;
  messageDiv.textContent = message;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Swap function used in RC4
function swap(data, i, j) {
  const temp = data[i];
  data[i] = data[j];
  data[j] = temp;
}

// Key Scheduling Algorithm (KSA) for RC4
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

// Pseudo-Random Generation Algorithm (PRGA) for RC4
function rc4PRGA(S, i, j) {
  i = (i + 1) % 256;
  j = (j + S[i]) % 256;
  swap(S, i, j);
  return S[(S[i] + S[j]) % 256];
}

// Encrypt function
function rc4Encrypt(data, key) {
  const S = [];
  rc4KSA(key, S);

  let i = 0;
  let j = 0;
  const encryptedData = new Uint8Array(data.length);
  for (let k = 0; k < data.length; k++) {
    encryptedData[k] = data[k] ^ rc4PRGA(S, i, j);
  }
  return encryptedData;
}

// File Encryption and Decryption Component
function FileEncryptionDecryption() {
  const [encryptionFile, setEncryptionFile] = useState(null);
  const [decryptionFile, setDecryptionFile] = useState(null);

  // Handle encryption file selection
  const handleEncryptionFileChange = (e) => {
    setEncryptionFile(e.target.files[0]);
  };

  // Handle decryption file selection
  const handleDecryptionFileChange = (e) => {
    setDecryptionFile(e.target.files[0]);
  };

  // Encrypt the file
  const encryptFile = () => {
    const key = document.getElementById("txtEncpassphrase").value;
    if (!encryptionFile || !key) {
      alert("Please enter both file and key.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = new Uint8Array(e.target.result);
      const encryptedData = rc4Encrypt(fileData, key);

      const blob = new Blob([encryptedData], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${encryptionFile.name}.encrypted`;
      link.click();
      displayMessage("File Encrypted Successfully!", "received-message");
    };
    reader.readAsArrayBuffer(encryptionFile);
  };

  // Decrypt the file
  const decryptFile = () => {
    const key = document.getElementById("txtDecpassphrase").value;
    if (!decryptionFile || !key) {
      alert("Please enter both file and key.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const encryptedData = new Uint8Array(e.target.result);
      const decryptedData = rc4Encrypt(encryptedData, key); // RC4 decryption is symmetric

      const decryptedBlob = new Blob([decryptedData], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(decryptedBlob);
      link.download = decryptionFile.name.replace(".encrypted", "");
      link.click();
      displayMessage("File Decrypted Successfully!", "received-message");
    };
    reader.readAsArrayBuffer(decryptionFile);
  };

  return (
    <div className="fileEncBody">
      <div className="container" id="divEncryptfile">
        <h2>Encrypt a File</h2>
        <p>
          To encrypt a file, enter a password and choose the file to be
          encrypted.
        </p>
        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell">Password</div>
              <div className="divTableCell">
                <input id="txtEncpassphrase" type="password" size="30" />
              </div>
              <div className="divTableCell">(make sure it's strong!)</div>
            </div>
          </div>
        </div>

        <div className="fileInputContainer">
          <label htmlFor="encryptFileInput" className="fileInputLabel">
            Choose a file
          </label>
          <input
            type="file"
            id="encryptFileInput"
            className="fileInput"
            onChange={handleEncryptionFileChange}
          />
          {encryptionFile && (
            <span className="fileNameDisplay">
              Selected file: {encryptionFile.name}
            </span>
          )}
        </div>

        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell">
                <button onClick={encryptFile}>Encrypt File</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" id="divDecryptfile">
        <h2>Decrypt a File</h2>
        <p>
          To decrypt a file, enter the password that was used to encrypt it.
        </p>

        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell">Password</div>
              <div className="divTableCell">
                <input id="txtDecpassphrase" type="password" size="30" />
              </div>
            </div>
          </div>
        </div>

        <div className="fileInputContainer">
          <label htmlFor="decryptFileInput" className="fileInputLabel">
            Choose a file
          </label>
          <input
            type="file"
            id="decryptFileInput"
            className="fileInput"
            onChange={handleDecryptionFileChange}
          />
          {decryptionFile && (
            <span className="fileNameDisplay">
              Selected file: {decryptionFile.name}
            </span>
          )}
        </div>

        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell">
                <button onClick={decryptFile}>Decrypt File</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileEncryptionDecryption;
