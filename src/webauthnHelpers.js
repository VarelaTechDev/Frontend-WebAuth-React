import { saveAs } from 'file-saver';

export const saveRegistrationData = (credential, registrationId) => {
    // Extract values
    const base64ClientData = credential.response.clientDataJSON;
    const decodedClientDataJSON = JSON.parse(atob(base64ClientData));
    const base64AttestationObject = credential.response.attestationObject;

    // Assuming signed_challenge is the attestationObject
    const unsignedChallenge = decodedClientDataJSON.challenge;
    const signedChallenge = base64AttestationObject;

    const valuesToSave = {
        unsigned_challenge: unsignedChallenge,
        signed_challenge: signedChallenge,
        credentialId: credential.id,
        publicKey: base64AttestationObject
    };

    // Save to JSON file
    const blob = new Blob([JSON.stringify(valuesToSave, null, 2)], { type: 'application/json' });
    saveAs(blob, 'registrationData.json');

    console.log('Values saved to registrationData.json:', valuesToSave);
};
