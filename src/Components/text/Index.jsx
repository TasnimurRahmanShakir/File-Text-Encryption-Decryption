import { Component } from "react";
import MessageEncryption from "./EncryptionDecryption.jsx";
import FileEncryption from "../file/index.jsx";

class EncryptionDecryption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      isMessageDisabled: false,
      isFileDisabled: false,
    };
  }

  handleFirstPage = () => {
    this.setState({
      currentPage: 1,
      isMessageDisabled: true,
      isFileDisabled: false,
    });
  };

  handleSecondPage = () => {
    this.setState({
      currentPage: 2,
      isMessageDisabled: false,
      isFileDisabled: true,
    });
  };

  render() {
    return (
      <div className="home">
        <div className="nav">
          <h1>File-Text Encryption/Decryption</h1>
          <button
            onClick={this.handleFirstPage}
            disabled={this.state.isMessageDisabled}
            style={{
              opacity: this.state.isMessageDisabled ? 0.5 : 1,
              cursor: this.state.isMessageDisabled ? "not-allowed" : "pointer",
            }}
          >
            Message
          </button>
          <button
            onClick={this.handleSecondPage}
            disabled={this.state.isFileDisabled}
            style={{
              opacity: this.state.isFileDisabled ? 0.5 : 1,
              cursor: this.state.isFileDisabled ? "not-allowed" : "pointer",
            }}
          >
            File
          </button>
        </div>
        <div className="right">
          {this.state.currentPage === 0 && (
            <div className="welcome">
              <h2>Welcome to the Encryption/Decryption Tool!</h2>
              <p>
                Select an option to get started with file or message encryption.
              </p>
              <div className="welcome-illustration">
                <svg
                  width="100"
                  height="100"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-lock"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <button onClick={this.handleFirstPage} className="start-button">
                Get Started
              </button>
            </div>
          )}
          {this.state.currentPage === 1 && <MessageEncryption />}
          {this.state.currentPage === 2 && <FileEncryption />}
        </div>
      </div>
    );
  }
}

export default EncryptionDecryption;
