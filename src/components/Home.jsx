import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import TodoForm from './TodoForm'
import { Switch } from './ui/switch'
import { toggleDarkMode } from '@/features/darkMode/darkModeSlice'
import { logout } from '@/features/auth/authSlice'
import { useEffect } from 'react'

const Home = () => {
    const darkMode = useSelector(state => state.darkMode.darkMode)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // actual change in theme
    useEffect(() => {
        document.querySelector('html').classList.remove('light', 'dark')
        document.querySelector('html').classList.add(darkMode ? 'dark' : 'light')
    }, [darkMode])

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const BackgroundImage = 'https://images.pexels.com/photos/242124/pexels-photo-242124.jpeg'
    
    return (
        <div
            className="w-full h-screen bg-cover bg-no-repeat dark:bg-black"
            style={{
                background: `${darkMode ? "linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6))" : "linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3))"},url('${BackgroundImage}') center repeat`,
            }}
        >
            <div className='overflow-y-scroll h-full'>
                <header>
                    <div className='flex flex-col sm:flex-row justify-between items-center p-3 sm:p-5 space-y-4 sm:space-y-0'>
                        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold underline text-white text-center sm:text-left'>
                            Welcome, {user?.name}!
                        </h1>
                        <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
                            <div className='flex items-center space-x-2'>
                                <span className='text-white text-sm sm:text-base'>Dark Mode</span>
                                <Switch 
                                    onClick={() => dispatch(toggleDarkMode())} 
                                    className="shadow-md" 
                                    checked={darkMode} 
                                />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    
                    <h2 className='text-lg sm:text-xl lg:text-2xl font-bold text-center text-white mb-4 sm:mb-6 px-3'>
                        Redux Todo App
                    </h2>
                </header>
                
                <div className='w-full bg-transparent'>
                    <TodoForm />
                </div>
            </div>
        </div>
    )
}

export default Home
