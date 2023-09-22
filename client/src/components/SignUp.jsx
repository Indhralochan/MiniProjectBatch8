/* eslint-disable no-unused-vars */
import React from 'react'
import Navbar from './Navbar'
import SignupForm from './SignupForm'
function SignUp() {
  return (
    <div className="overflow-y-scroll h-screen bg-gradient-to-b from-gray-700 to-gray-800">
   <Navbar/>
   <SignupForm/>
    </div>
  )
}

export default SignUp