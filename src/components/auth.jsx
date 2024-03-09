import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  const Logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="center">
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        type="email"
      />
      <br />
      <input
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
      <br />
      <button onClick={signIn}>Sign In</button>

      <button onClick={signInWithGoogle}>Sign In with Google</button>

      <button onClick={Logout}>Logout</button>
    </div>
  );
};
