import React, { useState } from 'react';
import style from './SignUpForm.module.css'
import { ImCross } from "react-icons/im";
import Loader from './Loader';

const SignUpForm = (props) => {

    const [signUpData, updateSignUpData] = useState({ email: "", password: "", name: "", lastName: "", mobile: "" });
    const [formInputError, updateFormInputError] = useState("");

    const createUserAccount = async () => {
        props.setLoader(true);
        const response = await fetch('/users/add-user', {
            method: "POST",
            body: JSON.stringify({
                email: signUpData.email,
                password: signUpData.password,
                name: signUpData.name,
                lastName: signUpData.lastName,
                mobile: signUpData.mobile
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result = await response.json();
        if (result.data.length > 0){
            updateFormInputError("Email already registered")
            props.setLoader(false);
        }else {
            props.updateMyBioData((prev)=>({
                ...prev,
                name:signUpData.name,
                lastName:signUpData.lastName,
                email:signUpData.email,
                password:signUpData.password,
                mobile:signUpData.mobile,
            }))
            props.userAuthenticated();
        }
    }

    const checkValidity = (e) => {
        e.preventDefault();
        if (signUpData.name > 15)
            updateFormInputError("name is not valid");
        else if (signUpData.lastName > 15)
            updateFormInputError("last name is not valid");
        else if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)))
            updateFormInputError('email is not valid');
        else if (!(/^\d{10}$/.test(signUpData.mobile)))
            updateFormInputError("mobile number not valid");
        else if (signUpData.password.length < 8)
            updateFormInputError("password must be of at least 8 characters")
        else
            createUserAccount();

    }

    return (

        <form onSubmit={checkValidity} className={style['signup-form']}>
            {props.loader && <Loader/>}
            <ImCross 
                className={style['cross-icon']} 
                onClick={()=>{props.setForm(false);props.userExist(true)}}
            />
            <div className={style['signup-heading']}>Register to <span className={style['company-mark']}>Rentify</span></div>
            <div className={style['signup-name']}>
                <label>Name</label>
                <input type="text" name="name" onChange={(e) => updateSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} required />
            </div>
            <div className={style['signup-lastname']}>
                <label>LastName</label>
                <input type="text" name="lastName" onChange={(e) => updateSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} required />
            </div>
            <div className={style['signup-email']}>
                <label>email</label>
                <input type="text" name="email" onChange={(e) => updateSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} required />
            </div>
            <div className={style['signup-password']}>
                <label>Password</label>
                <input type="password" name="password" onChange={(e) => updateSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} required />
            </div>
            <div className={style['signup-mobile']}>
                <label>Mobile</label>
                <input type="text" name="mobile" onChange={(e) => updateSignUpData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} required />
            </div>
            <div className={style['signup-error']}>{formInputError}</div>
            <div className={style['signup-btn-container']}>
                <button className={style['signup-btn']} type="submit">Signup</button>
            </div>
            <div className={style['signup-rules']}>
                <span>Input Rules:</span>
                <li>Name and lastname should not be more than of 15 characters</li>
                <li>Email should be valid</li>
                <li>Password should be at least of 8 characters</li>
                <li>Mobile Number should be of 10 digits</li>
            </div>
        </form>

    );
};

export default SignUpForm;