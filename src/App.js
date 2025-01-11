import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import React  from "react";
import Post from "./Post";

import PostPage from "./PostPage";
import UserProfile from "./UserProfile";
import LoggedinUsr from "./LoggedinUsr";
import Postingpage from "./postingpage";
import Login from "./login";
import UserProfileEdit from "./useredit";
import Home from "./home";
import Register from "./Register";
import Slash from "./slash";
import TopicPage from "./Topics";




function App() {
  return (
     <Routes>
      <Route path = '/Blogs' element = {<Post/>} />
      <Route path = '/Blogpage/:_id' element = {<PostPage/>} />
      <Route path = '/User/:Username' element = {<UserProfile/>} />
      <Route path = '/LoggedUser/Profile/:_id' element = {<LoggedinUsr/>} />
      <Route path = '/postingpage/:_id' element = {<Postingpage/>} />
      <Route path = '/UserLogin' element = {<Login/>} />
      <Route path = '/UserLoggedin/UserProfile/Settings/:_id' element = {<UserProfileEdit/>} />
      <Route path = '/Homepage/:_id' element = {<Home/>} />
      <Route path = '/UserRegisteration' element = {<Register/>} />
      <Route path = '/Blog/:Topic' element = {<TopicPage/>} />
      <Route path = '/' element = {<Slash/>} />
     </Routes>
  );
}

export default App;
