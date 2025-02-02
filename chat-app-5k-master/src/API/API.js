import axios from "axios";

const baseURL = "https://azure-chat-app.azurewebsites.net";
// const baseURL = "http://127.0.0.1:5000";

export const verifyLogin = (UserName, password, setUserId, setError) => {
  axios
    .post(`${baseURL}/login`, {
      username: UserName,
      password: password,
    })
    .then((response) => {
      if (response.data.id) {
        setUserId(response.data.id);
      } else {
        setError("username or password is incorrect !");
      }
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const registerUser = (userName, name, password, number) => {
  axios
    .post(`${baseURL}/register`, {
      username: userName,
      name: name,
      password: password,
      number: number,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUsers = (userId, users, setUsers) => {
  axios
    .post(`${baseURL}/users`, { sender: userId })
    .then((response) => {
      setUsers(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const newChat = (sender, receiver) => {
  axios
    .post(`${baseURL}/newchat`, {
      sender: sender,
      receiver: receiver,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getChats = (sender, userChats, setUserChats) => {
  axios
    .post(`${baseURL}/chats`, {
      sender: sender,
    })
    .then((response) => {
      console.log(response.data);
      if (userChats.Length === response.data.Length)
        setUserChats(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const sendMessage = async (
  sender,
  receiver,
  message,
  image,
  video,
  setMessages,
  setSendMessage,
  setSendStatus
) => {
  axios
    .post(
      `${baseURL}/messages`,
      {
        sender: sender,
        receiver: receiver,
        message: message,
        image: image ? image : "",
        video: video ? video : "",
      }
    )
    .then((response) => {
      console.log(response.data);
      setSendStatus(true);
      setSendMessage("");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getMessages = async (sender, receiver, message, setMessages,setGetStatus) => {
  axios
    .post(`${baseURL}/getmessages`, {
      sender: sender,
      receiver: receiver,
      message: message,
    })
    .then((response) => {
      console.log(response.data);
      setGetStatus(true)
      setMessages(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const deleteMessages = async (sender, receiver,setMessages) => {
  axios
    .post(`${baseURL}/deleteChat`, {
      sender: sender,
      receiver: receiver,
    })
    .then((response) => {
      console.log(response.data);
      setMessages([]);
    })
    .catch((error) => {
      console.log(error);
    });
};
