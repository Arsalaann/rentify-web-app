import React, { useState } from 'react';
import style from './LoginForm.module.css';
import { ImCross } from "react-icons/im";
import Loader from './Loader';

const LoginForm = (props) => {

    const [loginData, updateLoginData] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState("");

    const isUserValid = async () => {
        const response = await fetch('/users', {
            method: "POST",
            body: JSON.stringify({
                email: loginData.email,
                password: loginData.password
            }),
            headers: {
                "content-type": "application/json"
            }
        });
        const result = await response.json();
        return result.data;
    }

    const loginFormSubmitHandler = async (event) => {
        props.setLoader(true);
        event.preventDefault();
        const result = await isUserValid();
        if (result !== ""){
            props.updateMyBioData({ ...result });
            props.userAuthenticated();
        }else{
            setLoginError("Invalid Credentials");
            props.setLoader(false);
        }
    }

    return (
        <form className={style['login-form']}>
            {props.loader && <Loader/>}
            <ImCross className={style['cross-icon']} onClick={() => props.setForm(false)}/>
            <div className={style['login-heading']}>Login to <span className={style['company-mark']}>Rentify</span></div>
            <div className={style['login-email']}>
                <label>email</label>
                <input type="text" name="email" onChange={(e)=>updateLoginData((prev)=>({...prev,email:e.target.value}))} required />
            </div>
            <div className={style['login-password']}>
                <label>password</label>
                <input type="password" name="password" onChange={(e)=>updateLoginData((prev)=>({...prev,password:e.target.value}))} required />
            </div>
            <div className={style['login-error']}>{loginError}</div>
            <div className={style['login-btn-container']}>
                <button className={style['login-btn']} type="submit" onClick={loginFormSubmitHandler}>Login</button>
            </div>
            <div className={style['signup-link-suggestion']}>Register here <span className={style['signup-link']} onClick={props.onSignUpButtonClick}>Sign-up</span></div>

        </form>
    );
};

export default LoginForm;
