import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/useAuth';

export default function Navbar(){
    const {isAuthenticated,isAdmin,user,logout} = useAuth();
    const navigate = useNavigate();
    function handleLogout(){
        logout();
        navigate('/login');
    }
    return (
        <nav className='navbar'>
            {isAuthenticated && <span className='user'>{user.username} {isAdmin && '(admin)'}</span>}
            <Link to='/'>Home</Link>
            {isAdmin && <Link to='/categories'>Categories</Link>}
            {isAdmin && <Link to='/add-product'>Add Product</Link>}
            <span className='spacer'/>
            {!isAuthenticated && <Link to='/login'>Login</Link>}
            {!isAuthenticated && <Link to='/register'>Register</Link>}
            {isAuthenticated && <span><button className='secondary' onClick={handleLogout}>Logout</button></span>}
        </nav>
    );
}