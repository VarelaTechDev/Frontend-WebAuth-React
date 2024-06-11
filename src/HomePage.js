import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { API_BASE_URL } from './config';
import { useNavigate } from 'react-router-dom';
import * as webauthnJson from '@github/webauthn-json';

function HomePage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [assertionData, setAssertionData] = useState(null);
    const [error, setError] = useState(null);

    const handleStartRegisterPasskey = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/register/registration/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user }),
            });
            if (!response.ok) {
                throw new Error('Error starting registration');
            }
            const data = await response.json();
            const options = { publicKey: data.publicKeyCredentialCreationOptions };

            const credential = await webauthnJson.create(options);
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
            const requestBody = {
                registrationId: registrationData.registrationId,
                credential: registrationData.credential
            };
            console.log('Request Body: ', JSON.stringify(requestBody));

            
            const response = await fetch(`${API_BASE_URL}/register/registration/finish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error('Error finishing registration');
            }
            const result = await response.text();
            console.log('Result: ', result);
            alert("Registration successful!");
        } catch (error) {
            console.error('Error during registration finish:', error);
            setError("Registration finish failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartAuthenticationPasskey = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/authenticate/assertion/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user }),
            });

            if (!response.ok) {
                throw new Error('Failed to start authenticate passkey');
            }

            const data = await response.json();
            const options = { publicKey: data.publicKeyCredentialRequestOptions };
            const credential = await webauthnJson.get(options);

            setAssertionData({
                assertionId: data.assertionId,
                credential
            });

            alert("Passkey authentication initiation successful!");
        } catch (error) {
            console.error('Error during authentication start:', error);
            setError("Authentication initiation failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinishAuthenticationPasskey = async () => {
        if (!assertionData) {
            alert("No assertion data available");
            return;
        }
        setIsLoading(true);
    
        const requestBody = {
            assertionId: assertionData.assertionId,
            credential: assertionData.credential
        };
    
        console.log('Request Body:', requestBody);
    
        try {
            const response = await fetch(`${API_BASE_URL}/authenticate/assertion/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) {
                throw new Error('Failed to finish authenticate passkey');
            }
    
            const result = await response.text();
            console.log('Authentication finished:', result);
            alert("Passkey authentication successful!");
        } catch (error) {
            console.error('Error during authentication finish:', error);
            setError("Authentication finish failed.");
        } finally {
            setIsLoading(false);
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
                    <button onClick={handleStartAuthenticationPasskey} disabled={isLoading}>Start Authenticate Passkey</button>
                    <button onClick={handleFinishAuthenticationPasskey} disabled={isLoading}>Finish Authenticate Passkey</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
}

export default HomePage;
