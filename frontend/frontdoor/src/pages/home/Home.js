import { useQuery, useMutation } from '@apollo/client';
import {React, useEffect} from 'react'
import { Redirect, useHistory } from 'react-router';
import {setToken, AUTHENTICATION} from '../../hooks/useAuth'; 
import {CHANGE_PASSWORD, LOG_OUT, SHOW_PROFILE} from '../../graphql/mutations';
import './Home.css';
import {Formik, Form, ErrorMessage, useField} from 'formik';
import * as Yup from 'yup';

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

function ChangePassword(props){
    const [changePassword, {data, error, loading}] = useMutation(CHANGE_PASSWORD);

    const status = _ => {
        if(error){
            return <div style={{color:'red'}}>
                {error.message}
            </div>
        }else if(data){
            return (
                <div style={{color:'green'}}>
                    Password changed successfully.
                </div>
            )
        }else{
            return null;
        }
    }

    return (
        <div className="cp-container">
        <Formik
                initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: ""
                }}
                onSubmit={(values, actions)=>{
                    changePassword({
                        variables:{
                            username: AUTHENTICATION.username,
                            oldPassword: values.oldPassword,
                            newPassword: values.newPassword
                        }
                    }).then(res=>{
                        setToken(res.data.changePassword.token);
                        //alert("Password changed successfully.");
                        actions.resetForm();
                        props.refetch();
                    }).catch(e=>{
                        console.log(e.message);
                    })
                }}
                validationSchema={Yup.object({
                    oldPassword: Yup.string().required('required'),
                    newPassword: Yup.string().required('required'),
                    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'password must match.').required('required.')
                })}
            >{
                props=> 
                    <Form autoComplete="off">
                        <h6>Change Password</h6>
                        <Input type="password" name="oldPassword"/>
                        <Input type="password" name="newPassword" />
                        <Input type="password" name="confirmNewPassword"/>
                        {<div className="status">{status()}</div>}
                        <button type="submit">Change Password</button>
                    </Form>
                
            }
            </Formik>
        </div>
    )

}





function DisplayData({data,error,loading}){


    if(error){
        console.log(`data can not be fetched because ${error.message}. Logging out.`);
        return `data can not be fetched because ${error.message}. Logging out.`;
    }
    else if(loading){
        return "loading..."
    }
    else if(data){
        const {name, username, password} = data.myProfile;
        return (
        <div className="profile-container">
            <p>Name : {name} </p>
            <p>Username : {username} </p>
            <p>Password : {password} </p>
        </div>
        );
    }
}



function Home() {
    const [logout] = useMutation(LOG_OUT);

    const history = useHistory();
    const logoutHandler = ()=>{
        setToken(null);
        logout();
        history.push('/login');
    }

    const {data, error, loading, refetch} = useQuery(SHOW_PROFILE,{
        fetchPolicy:'no-cache'
    });

    if(error){
        history.push('/login');
        //setTimeout(()=>history.push('/login'), 5000);
    } 

    return (
        <div className="home-container">
            <h1>{`Welcome to your home page, ${AUTHENTICATION.username}`}</h1>
            <div className="home-main-container">
                <DisplayData data={data} error={error} loading={loading}/>
                <ChangePassword refetch={refetch}/>
            </div>
            
            <div className="buttons">
                <button onClick={logoutHandler}>Log Out</button>
                <button onClick={()=>refetch()}>Update Data</button>
            </div>
        </div>
    )
}

export default Home;
