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
            <span className='brand'>Invaac</span>
            <div className='nav-links'>
                <Link to='/'>Home</Link>
                {isAdmin && <Link to='/categories'>Categories</Link>}
                {isAdmin && <Link to='/add-product'>Add Product</Link>}
            </div>
            <div className='nav-auth'>
                {!isAuthenticated && <Link to='/login'>Login</Link>}
                {!isAuthenticated && <Link to='/register'>Register</Link>}
                {isAuthenticated && <span className='user'>{user.username} {isAdmin && '(admin)'}</span>}
                {isAuthenticated && <button className='secondary' onClick={handleLogout}>Logout</button>}
            </div>
        </nav>
    );
}