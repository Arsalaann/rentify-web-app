import React, { useEffect, useState } from 'react';
import style from './App.module.css';
import { updateIsAuthenticated, updateIsRentant } from './app/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Post from './components/Post';
import MyPosts from './components/MyPosts';
import ApplyFilter from './components/ApplyFilter';
import AddProperty from './components/AddProperty';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Loader from './components/Loader';

const App = () => {

  const [properties, updateProperties] = useState([]);
  const [AuthenticationForm, setAuthenticationForm] = useState(false);
  const [userExist, updateUserExist] = useState(true);
  const [loader, setLoader] = useState(false);
  const [noPostsYet, setNoPostsYet] = useState(true);;

  const [myBioData, updateMyBioData] =
    useState({
      name: "Login",
      lastName: "",
      email: "",
      mobile: "",
      postLiked: [],
      posts: []
    });

  const isRentant = useSelector(state => state.user.isRentant);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);


  const getFeedPosts = async () => {
    const result = await fetch('/all-posts')
    const user = await result.json();
    updateProperties(user.data);
    for (let i = 0; i < user.data.length; i++) {
      if (user.data[i].posts.length > 0) {
        setNoPostsYet(false);
        break;
      }
    }
    setLoader(false);
  }
  
  const userAlreadyAuthenticated=async()=>{
    const response = await fetch('/users', {
    	method: "POST",
        body: JSON.stringify({
        	email: localStorage.getItem("arsalan-rentify-email"),
       		password: localStorage.getItem("arsalan-rentify-password")
        }),
        headers: {
           "content-type": "application/json"
        }
    });
    const result = await response.json();
    updateMyBioData({...result.data});
    dispatch(updateIsAuthenticated());
  }


  useEffect(() => {
    setLoader(true);
    if(localStorage.getItem("arsalan-rentify-email"))
    	userAlreadyAuthenticated();
    getFeedPosts();
  }, [])
  
  useEffect(()=>{
  	if(myBioData.email!==""){
  		localStorage.setItem("arsalan-rentify-email",myBioData.email);
  		localStorage.setItem("arsalan-rentify-password",myBioData.password);
  	}
  },[myBioData])


  const dispatch = useDispatch();

  const toggleIntentionHandler = () => {
    if (!isAuthenticated)
      setAuthenticationForm(true);
    else
      dispatch(updateIsRentant());
  }

  const showFormHandler = () => {
    if (!isAuthenticated)
      setAuthenticationForm(true);
  }

  const userAuthenticatedHandler = () => {
    setAuthenticationForm(false);
    dispatch(updateIsAuthenticated());
    setLoader(false);
  }
  
  const logoutHandler=()=>{
  	dispatch(updateIsAuthenticated(false));
  	updateMyBioData({
      name: "Login",
      lastName: "",
      email: "",
      mobile: "",
      postLiked: [],
      posts: []
    });
    dispatch(updateIsRentant(true));
    localStorage.clear();
  }

  return (
    <div className={style['app-container']}>
      {loader && <Loader />}
      {AuthenticationForm &&
        <div className={style['authenticate-form-container']}>
          <div className={style['authenticate-form-background']}></div>
          {userExist ?
            <LoginForm
              onSignUpButtonClick={() => updateUserExist(false)}
              userAuthenticated={userAuthenticatedHandler}
              updateMyBioData={updateMyBioData}
              setForm={setAuthenticationForm}
              loader={loader}
              setLoader={setLoader}
            /> :
            <SignUpForm
              userAuthenticated={userAuthenticatedHandler}
              updateMyBioData={updateMyBioData}
              setForm={setAuthenticationForm}
              userExist={updateUserExist}
              loader={loader}
              setLoader={setLoader}
            />}
        </div>
      }

      <Navbar
        userName={myBioData.name}
        onLoginButtonClick={showFormHandler}
        onLogoutButtonClick={logoutHandler}
        toggleIntention={toggleIntentionHandler}
        buttonText={isRentant ? "My Property" : "Rent"}
      />


      {isRentant && (noPostsYet ? <h1>No posts yet</h1> :
        <div className={style['posts-container']}>
          <ApplyFilter
          	getFeedPosts={getFeedPosts}
          	updateProperties={updateProperties}
            loader={loader}
            setLoader={setLoader}
          />
          <div className={style['post-properties']}>
            {properties.map((property) =>
              property.posts.map((userPost) =>
                <Post
                  key={userPost._id}
                  isLiked={!isAuthenticated ? false : myBioData.postLiked.includes(userPost._id)}
                  postData={userPost}
                  userData={property}
                  showForm={showFormHandler}
                  getFeedPosts={getFeedPosts}
                  myBioData={isAuthenticated ? myBioData : ""}
                  updateMyBioData={isAuthenticated ? updateMyBioData : ""}
                  loader={loader}
                  setLoader={setLoader}
                />
              )
            )}
          </div>
        </div>
      )}


      {!isRentant && 
        <div className={style['posts-container']}>
          <AddProperty
            myBioData={myBioData}
            updateMyBioData={updateMyBioData}
            getFeedPosts={getFeedPosts}
            loader={loader}
            setLoader={setLoader}
          />
          <div className={style['posts-properties']}>
            {myBioData.posts.length<1 && <h1>Not uploaded any property yet</h1>}
            {myBioData.posts.map((post, ind) =>
              <MyPosts
                key={ind}
                postData={post}
                updateMyBioData={updateMyBioData}
                getFeedPosts={getFeedPosts}
                loader={loader}
                setLoader={setLoader}
              />
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default App;
