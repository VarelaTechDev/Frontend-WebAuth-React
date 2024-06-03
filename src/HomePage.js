import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { API_BASE_URL } from './config';
import { useNavigate } from 'react-router-dom';
import * as webauthn from '@github/webauthn-json';
import { saveAs } from 'file-saver';

function HomePage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [error, setError] = useState(null);

    const handleStartRegisterPasskey = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register/registration/start?username=${encodeURIComponent(user)}`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Error starting registration');
            }
            const data = await response.json();
            const options = { publicKey: data.publicKeyCredentialCreationOptions };
    
            // Log the options object
            // console.log("Registration options:", JSON.stringify(options, null, 2));
    
            const credential = await webauthn.create(options);
            console.log('Credential:', credential);

            console.log("Credential ", JSON.stringify(credential, null, 2));
            setRegistrationData({
                registrationId: data.registrationId,
                credential
            });
    
            alert("Passkey registration initiation successful!");
        } catch (error) {
            console.error('Error during registration start:', error);
            setError("Registration initiation failed.");
        } finally {
            setIsLoading(false);
        }
    };

    
    const handleFinishRegisterPasskey = async () => {
        if (!registrationData) {
            alert("No registration data available");
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register/registration/finish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationId: registrationData.registrationId,
                    credential: registrationData.credential
                })
            });
            // if (!response.ok) {
            //     throw new Error('Error finishing registration');
            // }
            // const result = await response.text();
            // console.log('Registration finished:', result);
            alert("Registration successful!");
        } catch (error) {
            console.error('Error during registration finish:', error);
            setError("Registration finish failed.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleStartAuthenticationPasskey = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/start-authenticate-passkey`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user }),
            });

            if (!response.ok) {
                throw new Error('Failed to start authenticate passkey');
            }

            console.log('Start authenticate passkey initiated');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFinishAuthenticationPasskey = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/finish-authenticate-passkey`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user }),
            });

            if (!response.ok) {
                throw new Error('Failed to finish authenticate passkey');
            }

            console.log('Finish authenticate passkey initiated');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Home Page</h2>
            {user ? (
                <>
                    <p>Welcome, {user}!</p>
                    <button onClick={handleStartRegisterPasskey} disabled={isLoading}>Start Register Passkey</button>
                    <button onClick={handleFinishRegisterPasskey} disabled={isLoading}>Finish Register Passkey</button>
                    <button onClick={handleStartAuthenticationPasskey}>Start Authenticate Passkey</button>
                    <button onClick={handleFinishAuthenticationPasskey}>Finish Authenticate Passkey</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
}

export default HomePage;
