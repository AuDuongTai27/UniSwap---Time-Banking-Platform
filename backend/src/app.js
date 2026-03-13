import AuthPage from "./AuthPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthPage/>
    </GoogleOAuthProvider>
  );

}

export default App;