/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase'; // Import your Firebase configuration from the appropriate path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { user_auth , google_provider } from '../../firebase';
import { signInWithPopup } from "firebase/auth";
import google from '../assets/google.png'
const SigninForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const handleGoogleSignin = () => {
        signInWithPopup(user_auth, google_provider)
        .then((data) => {
            showSuccessMessage();
            navigate("/session");
        })
        .catch((err) => {
            showFailureMessage();
            console.log(err);
        });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const showSuccessMessage = () => {
        toast.success('successfully logged in!', {
            position: toast.POSITION.TOP_CENTER
        });
    };
    const showFailureMessage = () => {
        toast.error('Failure Notification !', {
            position: toast.POSITION.TOP_CENTER
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth(app);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            showSuccessMessage();
            console.log('User signed in:', userCredential.user);
            navigate('/session');
        } catch (error) {
            if (error.code === 'auth/invalid-login-credentials') {
                showFailureMessage('Invalid login credentials. Please check your email and password.');
            } else {
                showFailureMessage('An error occurred while signing in.');
            }
        }
    };

    return (
        <>
            <div className="flex text-white max-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                    className="block w-full rounded-xl border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link to="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    onChange={handleChange}
                                    value={formData.password}
                                    className="block w-full rounded-xl border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-xl bg-[#3e6259] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div className="">
                    <div className="mt-16 w-full min-w-max px-5 h-[60px] rounded-[16px] bg-[#294936] border-[1px] border-[#000000]/25 flex items-center justify-center">
                    <img src={google} className="h-[28px] mr-2"></img>
                     <div className="text-[18px] font-[700] font-inter hover:cursor-pointer" onClick={handleGoogleSignin}>Continue with Google</div>
                    </div>
                    </div>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Try creating a new account
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default SigninForm;
