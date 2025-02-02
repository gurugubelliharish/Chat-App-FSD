import "./UserChat.css";

const UserChat = (props) => {
  const {user} = props

  return (
    <div className="userChatContainer" onClick={props.onUserClick}>
      <div className="userChatLogo"></div>
      <div className="userName">{user.Name}</div>
      <div className="userChatMessagesCount">10</div>
    </div>
  );
};

export default UserChat;
