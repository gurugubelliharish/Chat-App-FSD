import "./User.css";
import { newChat } from "../../API/API";

const User = (props) => {
  const { user, userId, onUserClick } = props;

  return (
    <div
      className="userListItem"
      onClick={() => {
        onUserClick(user);
        newChat(userId, user.id);
      }}
    >
      <div className="userLogo"></div>
      <div className="userDetails">
        <div>{user?.Name}</div>
        <div>{user?.phoneNumber}</div>
      </div>
    </div>
  );
};

export default User;
