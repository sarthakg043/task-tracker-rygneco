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
                <div className='flex justify-between items-center p-5'>
                    <h1 className='text-3xl font-bold underline text-white'>
                        Welcome, {user?.name}!
                    </h1>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-2'>
                            <span className='text-white'>Dark Mode</span>
                            <Switch 
                                onClick={() => dispatch(toggleDarkMode())} 
                                className="shadow-md" 
                                checked={darkMode} 
                            />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                
                <h2 className='text-2xl font-bold text-center text-white mb-6'>
                    Redux Todo App
                </h2>
                
                <div className='w-full bg-transparent'>
                    <TodoForm />
                </div>
            </div>
        </div>
    )
}

export default Home
