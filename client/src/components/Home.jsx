import Navbar from './Navbar'
import img from '../assets/bg.png'
function home() {
  return (
    <div className="overflow-y-hidden h-screen bg-[#09090B]">
    <div className="py-2"><Navbar /></div>
      <section className="text-gray-600 body-font px-10 ">
        <div className="mx-auto flex px-5 py-0 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">

            <img className="object-cover object-center rounded" alt="hero" src={img} />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <div className="title-font  text-7xl mb-4 font-medium text-white">Gramophone</div>
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">Enjoy Music &
              <br className="hidden lg:inline-block" />Get Better Recommendations
            </h1>
            <p className="mb-8 leading-relaxed text-white"> Create account and start your journey</p>
            <div className="flex justify-center">
              <a href="/signup"> <button className="inline-flex text-white bg-[#3e6259] border-0 py-2 px-6 focus:outline-none  rounded text-lg shadow-lg shadow-[#294936]">SignUp</button> </a>
              <a href="/signin"> <button className="ml-4 inline-flex text-white bg-[#294936] border-0 py-2 px-6 focus:outline-none  rounded text-lg shadow-lg shadow-[#294936]">Login</button> </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default home