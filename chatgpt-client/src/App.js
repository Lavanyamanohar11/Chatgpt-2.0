import './normal.css';
import './App.css';
import {useState, useEffect} from 'react';

function App() {
  useEffect(() => {
    getEngines()
  }, [])

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003")
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "how can I help you?"
    },
    // {
    //   user: "me",
    //   message: "I want to use chatgpt"
    // }

  ]);

  function clearChat(){
    setChatLog([]);
    setInput("");
  }

  function getEngines(){
    fetch("http://localhost:8000/models")
    .then(res => res.json())
    .then(data => setModels(data.models))
  }

  async function handleSubmit(e){
    e.preventDefault();
    console.log('submit');
    let chatLogNew = [...chatLog, {user: "me", message: `${input}`}];
    // setInput("")
    setChatLog([...chatLogNew])

    const messages = chatLogNew.map((message) => message.message).join("\n")
    try{
      const response = await fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: input,
        currentModel
      })
    });
      const data = await response.json()
      setChatLog([...chatLogNew, {user: "gpt", message: `${data.message}`}])
      setInput("")
    }catch(err){
      console.log(err.message)
    }
    
    //console.log(data.message)
  }

  return (
    <div className="App">
        <aside className="sidemenu">
            <div className="side-menu-button" onClick={clearChat}>
              <span>＋</span>New Chat
            </div>
            <p class="model-title">AI Models</p>
            <i class="model-recommended">text-davinci-003 - recommended</i>
            <div className="models">
              <select onChange={(e) => setCurrentModel(e.target.value)}>
                {models.map((model, index) => (
                  <option key={index} value={model.id}>{model.id}</option>
                ))}
              </select>
            </div>
        </aside>
        <section id = "chatbox">
            <div className="chat-log">
                {chatLog.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}

            </div>
            {/* <div className="chat-input-holder"> */}
                <form onSubmit={handleSubmit}>
                  <input rows="1" 
                  className="chat-input-textarea" 
                  placeholder="Type your message here"
                  value = {input}
                  onChange={(e) => setInput(e.target.value)}
                  >
                  </input>
                </form>
                
            {/* </div> */}
        </section>
    </div>
  );
}


const ChatMessage = ({message}) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
        <div className="chat-message-center">
            <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
              {message.user === "gpt" && 
               <svg
               width={41}
               height={41}
               fill="none"
               xmlns="http://www.w3.org/2000/svg"
               strokeWidth={1.5}
               className="h-6 w-6"
             >
               <path
                 d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813ZM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496ZM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744ZM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.01L7.04 23.856a7.504 7.504 0 0 1-2.743-10.237Zm27.658 6.437-9.724-5.615 3.367-1.943a.121.121 0 0 1 .113-.01l8.052 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.65-1.132Zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763Zm-21.063 6.929-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225Zm1.829-3.943 4.33-2.501 4.332 2.5v5l-4.331 2.5-4.331-2.5V18Z"
                 fill="currentColor"
               />
             </svg> }
            </div>
            <div className="message">
              {message.message}
            </div>
        </div>
    </div>
  )
}

export default App;




//   <svg
//   xmlns="http://www.w3.org/2000/svg"
//   viewBox="0 0 296 300"
//   xmlSpace="preserve"
//   fill="white"

// >
//   <path d="M122 1c7.354 0 14.708 0 22.76.316 16.461 2.92 30.264 9.642 41.632 20.82 2.808 2.76 5.48 2.91 8.793 2.855 6.888-.115 13.849-.67 20.655.084 19.186 2.125 35.045 10.902 47.422 25.708 17.175 20.545 22.783 43.787 16.027 69.898-.403 1.558.324 3.708 1.16 5.236 3.778 6.915 7.934 13.625 11.648 20.573 1.959 3.663 3.289 7.662 4.903 11.51 0 0 0 .5-.18.847-.06.615.06.884.18 1.153 0 10.354 0 20.708-.33 31.68-.824 1.626-1.45 2.59-1.797 3.645-8.823 26.808-26.203 44.949-53.687 52.636-3.485.975-4.548 3.349-5.658 6.041-7.338 17.797-19.529 31.201-36.85 39.538-6.568 3.161-13.767 5.012-20.678 7.46-8.688 0-17.375 0-26.755-.314-15.605-3.334-28.707-9.75-39.712-20.454-1.763-1.715-4.942-3.258-7.22-2.965-28.247 3.633-51.914-4.755-70.195-26.719-16.993-20.416-22.15-43.669-15.128-69.482.347-1.277.005-3.234-.8-4.255-6.722-8.51-11.917-17.78-15.004-28.218-.384-1.3-1.44-2.4-2.186-3.593 0-11.02 0-22.042.335-33.687.756-1.31 1.265-1.957 1.584-2.686 3.357-7.675 5.761-15.95 10.206-22.928C23.02 70.16 37.053 59.48 55.044 54.5c3.617-1.001 6.037-2.51 7.672-6.501 7.72-18.84 21-32.644 39.787-40.688C108.756 4.633 115.487 3.071 122 1m153.955 182.186c.019-4.728.32-9.475.004-14.181-1.115-16.598-8.788-30.153-22.45-38.908-20.54-13.163-42.011-24.874-63.152-37.09-1.02-.59-2.949-.586-3.987-.012-7.206 3.984-14.288 8.193-21.644 12.465 1.21.935 2.164 1.856 3.278 2.506 22.373 13.043 44.7 26.17 67.208 38.975 4.41 2.509 5.883 5.614 5.85 10.418-.146 20.806-.062 41.614-.062 62.422v6.43c9.201-3.899 16.436-8.6 22.316-15.654 6.528-7.83 10.616-16.6 12.64-27.37M153.064 66.516c-10.143 5.868-20.234 11.828-30.457 17.553-3.705 2.075-6.276 4.13-5.74 9.105.584 5.433.107 10.978.148 16.474.013 1.681.207 3.36.34 5.375 3.39-1.802 6.058-3.118 8.63-4.603 20.58-11.89 41.172-23.763 61.692-35.76 4.58-2.677 8.832-2.896 13.428-.132 8.768 5.273 17.64 10.375 26.475 15.539 10.518 6.148 21.041 12.287 32.383 18.91.42-2.488.991-4.311.994-6.136.024-19.195-6.898-35.202-22.502-46.782-18.125-13.45-41.336-14.676-60.597-3.556-8.007 4.623-16.109 9.083-24.794 14.013m-57.97 159.99L38.099 193.42c-.458 3.717-1.186 6.335-1.024 8.896.578 9.13 2.711 17.826 6.996 26.066 13.049 25.093 46.73 36.69 71.765 23.491 21.32-11.24 41.953-23.784 62.857-35.808.903-.52 2.101-1.59 2.116-2.424.156-8.543.096-17.09.096-26.342-2.183 1.002-3.562 1.507-4.816 2.23-21.466 12.365-43.039 24.552-64.29 37.276-5.794 3.468-10.683 3.33-16.704-.297M57 138.45V76.615c-1.767.608-3.055.87-4.167 1.462-19.915 10.6-30.877 26.716-30.86 49.752.017 21.201 9.45 37.062 27.361 47.787 18.824 11.272 37.92 22.093 57.023 32.886 1.629.92 4.609.907 6.286.032 6.989-3.644 13.72-7.783 20.927-11.963-1.798-1.206-3.107-2.204-4.524-3.017-20.9-11.983-41.888-23.815-62.65-36.032-3.48-2.048-6.693-5.336-8.711-8.816-1.4-2.413-.537-6.139-.685-10.256m163 66.05c0-14.983.061-29.967-.089-44.95-.017-1.7-.728-4.166-1.962-4.957-6.87-4.397-14.001-8.387-21.949-13.048v6.891c0 24.64-.042 49.279.031 73.918.016 5.266-1.8 9.182-6.515 11.857-16.22 9.204-32.38 18.513-48.536 27.83-3.551 2.048-6.988 4.295-10.75 6.619 11.773 8.59 23.347 12.761 40.58 11.412 23.008-1.801 44.816-20.963 48.016-43.787 1.418-10.118.844-20.515 1.174-31.785M78 89.5c0 17.317.072 34.635-.058 51.95-.027 3.616.42 6.239 4.327 7.812 3.477 1.4 6.517 3.859 9.818 5.73 3.026 1.715 6.143 3.268 9.913 5.258v-7.018c0-24.477.026-48.953-.023-73.43-.008-4.413 1.039-8.402 4.967-10.704 13.528-7.924 27.188-15.624 40.778-23.442 6.635-3.818 13.228-7.71 20.05-11.69-26.561-21.921-68.057-12.718-83.75 17.77C77.999 63.444 77.603 75.855 78 89.5m92.649 37.386c-5.977-3.501-11.838-7.23-18.002-10.36-1.782-.906-4.835-.87-6.62.056a431.229 431.229 0 0 0-25.005 14.07c-1.79 1.085-3.763 3.586-3.835 5.503-.379 10.133-.255 20.29-.084 30.434.023 1.336.97 3.23 2.072 3.886 9.066 5.394 18.217 10.653 27.49 15.68 1.325.719 3.767.564 5.142-.19 8.67-4.755 17.083-9.985 25.808-14.631 2.898-1.544 3.493-3.353 3.433-6.249-.15-7.15-.743-14.39.13-21.436 1.057-8.532-1.96-13.747-10.53-16.763z" />
//   <path
//     fill="currentColor"
//     d="M297 157.531c-1.614-3.379-2.944-7.378-4.903-11.041-3.714-6.948-7.87-13.658-11.648-20.573-.836-1.528-1.563-3.678-1.16-5.236 6.756-26.11 1.148-49.353-16.027-69.898-12.377-14.806-28.236-23.583-47.422-25.708-6.806-.754-13.767-.199-20.655-.084-3.314.055-5.985-.095-8.793-2.856-11.368-11.177-25.17-17.899-41.164-20.819C195.595 1 246.19 1 297 1v156.531zM1 145.469c.745.724 1.802 1.825 2.186 3.124 3.087 10.438 8.282 19.707 15.003 28.218.806 1.021 1.148 2.978.801 4.255-7.021 25.813-1.865 49.066 15.128 69.482 18.28 21.964 41.948 30.352 70.195 26.72 2.278-.294 5.457 1.249 7.22 2.964 11.005 10.704 24.107 17.12 39.243 20.454C101.072 301 51.143 301 1 301V145.469zM121.531 1c-6.044 2.072-12.775 3.633-19.028 6.311C83.717 15.355 70.436 29.16 62.716 48c-1.635 3.991-4.055 5.5-7.672 6.501C37.053 59.481 23.02 70.161 13.124 85.7 8.68 92.677 6.277 100.952 2.92 108.627c-.32.73-.828 1.376-1.584 2.217C1 74.403 1 37.806 1 1h120.531zM178.469 301c6.442-2.448 13.641-4.299 20.21-7.46 17.32-8.337 29.511-21.741 36.849-39.538 1.11-2.692 2.173-5.066 5.658-6.041 27.484-7.687 44.864-25.828 53.687-52.636.347-1.056.973-2.02 1.798-3.176C297 228.263 297 264.527 297 301H178.469zM297 159.75c-.12-.019-.24-.288-.18-.653.18-.097.18.403.18.653zM275.908 183.622c-1.976 10.335-6.064 19.106-12.592 26.935-5.88 7.053-13.115 11.755-22.316 15.654v-6.43c0-20.808-.084-41.616.062-62.422.033-4.804-1.44-7.91-5.85-10.418-22.509-12.805-44.835-25.932-67.208-38.975-1.114-.65-2.068-1.571-3.278-2.506 7.356-4.272 14.438-8.48 21.644-12.465 1.038-.574 2.966-.577 3.987.013 21.141 12.215 42.612 23.926 63.151 37.089 13.663 8.755 21.336 22.31 22.451 38.908.317 4.706.015 9.453-.05 14.617z"
//   />
//   <path
//     fill="currentColor"
//     d="M153.378 66.32c8.372-4.733 16.474-9.193 24.481-13.816 19.26-11.12 42.472-9.894 60.597 3.556 15.604 11.58 22.526 27.587 22.502 46.782-.003 1.825-.575 3.648-.994 6.135-11.342-6.622-21.865-12.76-32.383-18.91-8.835-5.163-17.707-10.265-26.475-15.538-4.596-2.764-8.848-2.545-13.428.132-20.52 11.997-41.111 23.87-61.693 35.76-2.571 1.485-5.24 2.801-8.63 4.603-.132-2.015-.326-3.694-.339-5.375-.04-5.496.436-11.04-.148-16.474-.536-4.975 2.035-7.03 5.74-9.105 10.223-5.725 20.314-11.685 30.77-17.75zM95.42 226.7c5.696 3.435 10.585 3.573 16.379.105 21.251-12.724 42.824-24.911 64.29-37.276 1.254-.723 2.633-1.228 4.816-2.23 0 9.252.06 17.799-.096 26.342-.015.833-1.213 1.905-2.116 2.424-20.904 12.024-41.537 24.568-62.857 35.808-25.035 13.2-58.716 1.602-71.765-23.49-4.285-8.241-6.418-16.937-6.996-26.067-.162-2.561.566-5.18 1.024-8.896 19.497 11.319 38.247 22.203 57.32 33.28z"
//   />
//   <path
//     fill="currentColor"
//     d="M57 138.94c.148 3.627-.714 7.353.685 9.766 2.018 3.48 5.23 6.768 8.711 8.816 20.762 12.217 41.75 24.049 62.65 36.032 1.417.813 2.726 1.811 4.524 3.017-7.208 4.18-13.938 8.32-20.927 11.963-1.677.875-4.657.888-6.286-.032-19.104-10.793-38.2-21.614-57.023-32.886-17.91-10.725-27.344-26.586-27.36-47.787-.018-23.036 10.944-39.152 30.86-49.752 1.111-.592 2.4-.854 4.166-1.462v62.324zM220 205c-.33 10.77.244 21.167-1.174 31.285-3.2 22.824-25.008 41.986-48.016 43.787-17.233 1.35-28.807-2.822-40.58-11.412 3.762-2.324 7.199-4.571 10.75-6.62 16.156-9.316 32.316-18.625 48.536-27.829 4.714-2.675 6.531-6.591 6.515-11.857-.073-24.639-.031-49.279-.03-73.918v-6.891c7.947 4.66 15.078 8.65 21.948 13.048 1.234.79 1.945 3.256 1.962 4.958.15 14.982.088 29.966.089 45.449z"
//   />
//   <path
//     fill="currentColor"
//     d="M78 89c-.399-13.146-.002-25.557 6.023-37.263 15.692-30.489 57.188-39.692 83.748-17.772-6.821 3.98-13.414 7.873-20.05 11.69-13.59 7.82-27.249 15.519-40.777 23.443-3.928 2.302-4.975 6.29-4.967 10.704.05 24.477.023 48.953.023 73.43v7.018c-3.77-1.99-6.887-3.543-9.913-5.258-3.301-1.871-6.341-4.33-9.818-5.73-3.906-1.573-4.354-4.196-4.327-7.811.13-17.316.058-34.634.058-52.45zM171 127c8.218 2.902 11.235 8.117 10.178 16.65-.873 7.044-.28 14.285-.13 21.435.06 2.896-.535 4.705-3.433 6.249-8.725 4.646-17.138 9.876-25.808 14.631-1.375.754-3.817.909-5.142.19-9.273-5.027-18.424-10.286-27.49-15.68-1.102-.656-2.049-2.55-2.072-3.886-.17-10.145-.295-20.3.084-30.434.072-1.917 2.044-4.418 3.835-5.504a431.229 431.229 0 0 1 25.005-14.069c1.785-.925 4.838-.962 6.62-.057 6.164 3.132 12.025 6.86 18.354 10.475z"
//   />
//   </svg>