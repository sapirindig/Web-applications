import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
    return (
        <div style={{ marginTop: '10px' }}>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log("✅ Login Success:", credentialResponse);
                }}
                onError={() => {
                    console.log("❌ Login Failed");
                }}
            />
        </div>
    );
};

export default GoogleLoginButton;
