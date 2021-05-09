import {React, useState} from 'react';
import {Formik, Form, useField, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useMutation} from '@apollo/client';
import './Login.css';
import { SIGN_IN, SIGN_UP } from '../../graphql/mutations';
import {setToken} from '../../hooks/useAuth';
import { useHistory } from 'react-router';
function Input(props){
    const [fields, meta] = useField(props);
    return (<>
        <input className={meta.touched && meta.error && "error-input"} {...props} {...fields}  placeholder={fields.name}/>
        <div className="error-msg-container">
            <ErrorMessage name={fields.name} component="div"/>
        </div>
        </>
    )
}

function SignUp(){
    const history = useHistory();
    const [signup, {data, error, loading}] = useMutation(SIGN_UP);


    return (
        <Formik
        initialValues={{
            name:"",
            username:"",
            password:"",
            confirmPassword:""
        }}
        validationSchema={
            Yup.object({
                name:Yup.string().matches(/^[a-zA-Z ]+(([',. -][a-zA-Z ])?[a-zA-Z ]*)*$/, 'enter a valid name.').required('name required.'),
                username:Yup.string().min(1,'minimum length must be 1.').max(15, 'maximum length must be 15.').matches(/^[A-Za-z0-9_]{1,15}$/,'only A-Z, a-z, 0-9, or _ allowed.').required('username required.'),
                password:Yup.string().required('password required.'),
                confirmPassword:Yup.string()
                .oneOf([Yup.ref('password'), null], 'password must match')
                .required('confirm password is required'),
            })
        }
        onSubmit={(values, actions) => {
            signup({
                variables:{
                    username:values.username,
                    password:values.password,
                    name:values.name
                }
            }).then(res=>{
                setToken(res.data.signUp.token);
                history.push('/home');
                actions.resetForm();
            }).catch(e=>{
                //PASS
            });
        }}>{
            props=>(
                <Form autoComplete="off">
                    <h1>Sign Up</h1>
                    <Input type="text" name="name"/>
                    <Input type="text"  name="username" />
                    <Input type="password" name="password" />
                    <Input type="password" name="confirmPassword"/>
                    <div className="error-msg-bottom ">{error&&error.message}</div>
                    <button type="submit">Sign Up</button>
                </Form>
            )
        }
      </Formik>
    )
}

function SignIn(){

    const history = useHistory();
    const [signin, {data, error, loading}] = useMutation(SIGN_IN);

    return (
     <Formik
        initialValues={{
            username:"",
            password:""
        }}
        validationSchema={
            Yup.object({
                username:Yup.string().required('username required.'),
                password:Yup.string().required('password required.')
            })
        }
        onSubmit={(values, actions) => {
            
            signin({
                variables:{
                    username:values.username,
                    password:values.password
                }
            }).then(res=>{
                setToken(res.data.signIn.token);
                history.push('/home');
                actions.resetForm();
            }).catch(e=>{
                console.log(e.message);
                actions.resetForm();
            });
                
        }}>{
            props=>(
                <Form onSubmit={props.handleSubmit} autoComplete="off">
                    <h1>Sign In</h1>
                    <Input name="username" type="text"/>
                    <Input name="password" type="password"/>
                    <div className="error-msg-bottom ">{error&&error.message}</div>
                    <button type="submit">Sign In</button>
                </Form>
            )
        }
      </Formik>
    );
}






function Login() {

    const [signUpActive, setSignUpActive] = useState(true);

    return (
        <div className={signUpActive?"container":"container right-panel-active"} id="container">
        <div className="form-container sign-up-container">
            <SignUp/>
        </div>
        <div className="form-container sign-in-container">
            <SignIn />
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Please login with your credentials.</p>
              <button className="ghost" id="signIn" onClick={()=>setSignUpActive(true)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us.</p>
              <button className="ghost" onClick={()=>setSignUpActive(false)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Login;
