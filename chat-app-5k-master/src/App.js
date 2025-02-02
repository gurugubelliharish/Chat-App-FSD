import "./App.css";
import Login from "./Components/Login/Login";
import NavBoard from "./Components/NavBoard/NavBoard";
import UserChat from "./Components/UserChat/UserChat";
import ChatScreen from "./Components/ChatScreen/ChatScreen";
import NewChat from "./Components/NewChat/NewChat";
import { useEffect, useState } from "react";
import { getChats } from "./API/API";

function App() {
  const [userId, setUserId] = useState();
  const [userChats, setUserChats] = useState([]);
  const [user, setUser] = useState();
  const onClick = (user) => {
    setUser(user);
  };

  useEffect(() => {
    userId && getChats(userId, userChats, setUserChats);
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      userId && getChats(userId, userChats, setUserChats);
    };
    fetchData();
    const intervalId = setInterval(fetchData, 3000); // fetch data every 10 seconds
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {!userId && <Login setUserId={setUserId} />}
      {userId && (
        <div className="App">
          <div className="sectionLeft">
            <NavBoard />
            <div>
              {userChats.map((user) => {
                return (
                  <UserChat
                    onUserClick={() => onClick(user)}
                    user={user}
                    userId={userId}
                  />
                );
              })}
            </div>
            <NewChat userId={userId} onUserClick={onClick}/>
          </div>
          <div className="sectionRight">
            {user && <ChatScreen userId={userId} user={user} />}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
