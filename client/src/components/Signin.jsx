import SigninForm from './SigninForm'
import Navbar from './Navbar'
const Signin = () => {
  return (
    <div className="overflow-y-scroll h-screen bg-gradient-to-b from-gray-700 to-gray-800">
    <Navbar/>
    <SigninForm/>
    </div>
  )
}

export default Signin