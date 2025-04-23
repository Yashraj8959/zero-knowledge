import { SignIn, SignUp, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Homepage from "./pages/Homepage";

const App = () => {
  
  const { isSignedIn, user } = useUser();
  return (
    <div>
      <Homepage />
    </div>
  );
}

export default App
