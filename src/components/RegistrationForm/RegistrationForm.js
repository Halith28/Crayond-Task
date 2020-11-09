import React, {useRef,useState} from 'react';
import axios from 'axios';
import './RegistrationForm.css';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

function RegistrationForm(props) {
    const { register, handleSubmit, errors,watch,clearErrors } = useForm({mode: "onBlur",});
    const password = useRef({});
        password.current = watch("password", "");
    const [state , setState] = useState({
        email : "",
        password : "",
        confirm_password: "",
        successMessage: null
    })
    function onSubmit(data) {
        console.log("Data submitted: ", data);
        axios.post(API_BASE_URL+'register', data)
        .then(function (response) {
            console.log(response.data);
            if(response.data === 200){
                setState(prevState => ({
                    ...prevState,
                    'successMessage' : 'Registration successful. Redirecting to home page..'
                }))
                redirectToLogin();
                props.showError(null)
            }else{
                props.showError("Username Already Exists");
            }
        });
    }
    
    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
    }
    
    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       name="email"
                       autoComplete="off"
                       aria-describedby="emailHelp" 
                       placeholder="Type Email" 
                       ref={register({
                        required: "Enter your e-mail",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                          message: "Enter a valid e-mail address",
                        },
                      })}
                />
                {errors.email && <p className="error" style={{color:"red"}}>{errors.email.message}</p>}
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" 
                    name="password"
                        className="form-control" 
                        id="password" 
                        placeholder="Type Password" 
                        ref={register({ required: "Enter your password",
                    minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters"
                    } })}
                    />
                    {errors.password && <p className="error" style={{color:"red"}}>{errors.password.message}</p>}
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirm_password" 
                        name="confirm_password"
                        placeholder="Type Confirm Password"
                        ref={register({  required: "Enter password again",
                            validate: value =>
                            value === password.current || "The passwords do not match" })} 
                    />
                    {errors.confirm_password && <p className="error" style={{color:"red"}}>{errors.confirm_password.message}</p>}
                </div>
                <div className="form-group">
                    <button type="submit" 
                    className="btn btn-primary " >Register</button>
                <button type="reset" 
                className="btn btn-secondary" 
                style={{marginLeft:"20px"}}
                onClick={() => clearErrors()}>Reset</button>
                </div>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
            
        </div>
    );
};
export default withRouter(RegistrationForm);
