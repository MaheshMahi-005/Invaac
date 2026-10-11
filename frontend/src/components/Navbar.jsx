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
        <nav style={{display:'flex',gap:'1rem',padding:'1rem',borderBottom:'1px solid hsl(0, 63%, 46%)'}}>
            <Link to='/'>Home</Link>
            {!isAuthenticated && <Link to='/login'>Login</Link>}
            {!isAuthenticated && <Link to='/register'>Register</Link>}
            {isAdmin && <Link to='/categories'>Categories</Link>}
            {isAdmin && <Link to='/add-product'>Add Product</Link>}
            {isAuthenticated && <span>Hello,{user.username} {isAdmin && '(admin)'}</span>}
            {isAuthenticated && <span><button onClick={handleLogout}>Logout</button></span>}
        </nav>
    );
}