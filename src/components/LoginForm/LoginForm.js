import React, {useState} from 'react';
import axios from 'axios';
import './LoginForm.css';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

function LoginForm(props) {
    const { register, handleSubmit, errors } = useForm({mode: "onBlur",});
    const [inputVal, setInputVal] = useState("abdul@gmail.com");
    const history = useHistory();
    
    const [state , setState] = useState({
      
        successMessage: null
    })
    function onSubmit(data) {
        console.log("Data submitted: ", data);
        axios.put(API_BASE_URL+'logg', data)
            .then(function (response) {
                alert(response.data)
                if(response.data === inputVal){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    redirectToAdmin();
                    props.showError(null)
                }
                else if(response.data === data.email){
                    axios.put(API_BASE_URL+'checkuser', data)
		            .then(response => {
                        if(response.data===1){
                            console.log(data)
                            axios.put(API_BASE_URL+'loginid', data)
                            .then(response => {
                                const id=response.data
                                console.log(response.data)
                                // history.push(`/home`,{params:{id}})
                                history.push(`/masterform`,{params:{id}})
                                props.showError(null)
                            })
                        }else{
                            props.showError("Ask Admin to access login");
                            
                        }
		        })
                }
                else{
                    props.showError("Username does not exists");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const redirectToRegister = () => {
        props.history.push('/registration'); 
        props.updateTitle('Registration');
    }
    const redirectToAdmin = () => {
        props.history.push('/adminaccess'); 
        props.updateTitle('Admin');
    }


    return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group text-left">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="email" 
                        name="email"
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="Type email" 
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
                       ref={register({ required: "Enter your password" })}
                />
                {errors.password && <p className="error" style={{color:"red"}}>{errors.password.message}</p>}
                </div>
                <div className="form-check">
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span> <br/>
                
            </div>
            
        </div>
    )
}

export default withRouter(LoginForm);

