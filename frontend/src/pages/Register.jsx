import {  useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";


export default function Register(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const {registerUser} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            await registerUser(username,password);
            navigate('/login');
        }
        catch(err){
            setError(err.response?.data?.detail || "Registration failed");
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <div className="card">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                {error && <p style={{color:'red'}}>{error}</p>}
                <button type="submit" disabled={loading}>{loading?'Registering....' : 'Register'}</button>
            </form>
            <p>Already have an account?<Link to='/login'>Login</Link></p>
        </div>
    );
}