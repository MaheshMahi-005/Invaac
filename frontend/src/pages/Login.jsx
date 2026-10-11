import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const {loginUser} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            await loginUser(username,password);
            navigate('/');
        }
        catch(err){
            setError(err.response?.data?.detail || 'Login Failed');
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Login</h2>
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
                <button type="submit" disabled={loading}>{loading? 'Logging in ....':'Login'}</button>
            </form>
            <p>No account?<Link to='/register'>Register</Link></p>
        </div>
    );   
}