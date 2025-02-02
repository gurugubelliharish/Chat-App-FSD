import { useEffect, useState } from "react";
import "./NewChat.css";
import User from "../User/User";
import {getUsers} from "../../API/API";

const NewChat = (props) => {
  // const [users, setUsers] = useState();
  const [show, setShow] = useState(false);
  const [users,setUsers] = useState([]);
  useEffect(()=>{
    getUsers(props.userId,users,setUsers);
  },[])

  return (
    <>
      <div className="newChat" onClick={()=>setShow(!show)}></div>
      {show && <div className="chatList" onClick={()=>setShow(!show)}>
        {users.map((user)=>{
          return <User key={user.phoneNumber} user={user} userId={props.userId} onUserClick={props.onUserClick}/>
        })}</div>}
    </>
  );
};

export default NewChat;
