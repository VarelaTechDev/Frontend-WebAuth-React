import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Navbar() {
    const { user, setUser } = useContext(UserContext);

    const handleSignout = () => {
        setUser(null);
    };

    return (
        <nav>
            <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/home">Home</Link></li>
                {user && <li><button onClick={handleSignout}>Signout</button></li>}
            </ul>
        </nav>
    );
}

export default Navbar;
