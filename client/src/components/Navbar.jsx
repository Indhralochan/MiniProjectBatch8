import { Disclosure, Menu} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigate } from "react-router-dom";
import img from "../assets/—Pngtree—sound wave music logo vector_5221287.png"
const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Signup', href: '/signup', current: false },
  { name: 'Signin', href: '/signin', current: false },
  { name: 'Contact Us', href: '/contactus', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {

  const navigator = useNavigate()

  return (
    <Disclosure as="nav" className="bg-[#09090B] border-0 focus:outline-none rounded text-lg shadow-lg shadow-[#294936] text-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="h-20 w-auto justify-start"
                    src={img}
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block py-14 rounded-lg">
                  <div className="flex space-x-4 rounded-lg">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={()=>navigator(item.href)}
                        className={classNames(
                          item.current ? 'text-white rounded-lg ' : 'text-gray-300  hover:text-white rounded-lg',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-lg  p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full  text-sm focus:outline-none ">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <span className='text-gray-300 hover:text-gray-700 hover:text-white px-3 py-2 shadow-md rounded-lg  shadow-md shadow-[#294936] text-white'>Signout</span>
                    </Menu.Button>
                  </div>
                  
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'rounded-lg  shadow-md shadow-[#294936] text-white' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}