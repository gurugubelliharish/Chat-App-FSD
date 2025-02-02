import "./ChatScreen.css";
import { useEffect, useState, useRef } from "react";
import { sendMessage, getMessages, deleteMessages } from "../../API/API";
import { Buffer } from "buffer";

const ChatScreen = (props) => {
  const { userId, user } = props;
  const [inputMessage, setSendMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState();
  const [video, setVedio] = useState();
  const [sendStatus,setSendStatus] = useState(false);
  const [getStatus,setGetStatus] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      userId && getMessages(userId, user.id, inputMessage, setMessages,setGetStatus);
    };
    fetchData();
  }, [user,getStatus,sendStatus,messages]);

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result);
      setImage(buffer.toString("base64"));
      console.log(buffer.toString("base64"));
    };
    reader.readAsArrayBuffer(file);
  };
  const handleVedioUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result);
      setVedio(buffer.toString("base64"));
      console.log(buffer.toString("base64"));
    };
    if (file && file.size > maxFileSize) {
      alert("maximum allowed file size is 5mb....!");
    } else {
      reader.readAsArrayBuffer(file);
    }
  };
  const handleSendMessage = async () => {
    await sendMessage(
      userId,
      user.id,
      inputMessage,
      image,
      video,
      setMessages,
      setSendMessage,
      setSendStatus
    )
    setSendMessage("");
    setImage();
    setVedio();
  };

  return (
    <div className="chatScreen">
      <div className="chatScreenHead">
        <div className="chatScreenHeadLogo"></div>
        <div className="chatScreenUserDetails">
          <div className="chatScreenUserName">{user.Name}</div>
          <div>{user.phoneNumber}</div>
        </div>
        <div
          className="chatDelete"
          onClick={() => deleteMessages(userId, user.id,setMessages)}
        ></div>
      </div>
      <div className="chatScreenMessageSpace">
        {messages?.map((message) => {
          let cn =
            message.split("::")[0] === userId
              ? "message_receive"
              : "message_send";
          if (message.split("::||")[1]) {
            return (
              <div className={cn}>
                <video
                  className={"messageImage"}
                  src={`data:video/mp4;base64,${message.split("::||")[1]}`}
                  alt={"inputvideo"}
                  height={"100px"}
                  controls
                />
              </div>
            );
          } else if (message.split("::|")[1]) {
            return (
              <div className={cn}>
                <img
                  className={"messageImage"}
                  src={`data:image/*;base64,${message.split("::|")[1]}`}
                  alt={"inputImge"}
                  height={"100px"}
                />
              </div>
            );
          } else {
            return (
              <div className={cn}>
                <div className={"message"}>{message.split("::")[1]}</div>
              </div>
            );
          }
        })}
        <div id="scrollBottom" ref={ref}>
          .
        </div>
      </div>
      <div className="chatScreenFoot">
        {image && (
          <div className="chatScreenImage">
            <img
              src={`data:image/*;base64,${image}`}
              alt={"inputImage"}
              height={"100px"}
            />
          </div>
        )}
        {video && (
          <div className="chatScreenImage">
            <video
              src={`data:video/mp4;base64,${video}`}
              alt={"inputvideo"}
              height={"100px"}
              controls
            />
          </div>
        )}
        {!image && !video && (
          <input
            className="chatScreenInput"
            value={inputMessage}
            onChange={(e) => setSendMessage(e.target.value)}
          />
        )}
        <div className="camera">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            maxLength="10000000"
          />
        </div>
        <div className="Video">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleVedioUpload}
            maxLength="10000000"
          />
        </div>
        <div className="Send" onClick={() => handleSendMessage()}>
          send
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
