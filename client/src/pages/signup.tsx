import { useRef, useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signup() {
    const username = usernameRef.current?.value;
    const password = passRef.current?.value;
    const email = emailRef.current?.value;
    try {
      const res = await axios.post(BACKEND_URL + "/api/v1/signup", {
        username,
        password,
        email,
      });
      if (!res) {
        setLoading(true);
      }
      setLoading(false);
      localStorage.setItem("token", res.data.token);
      alert("Signed Up");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="top-0 left-0 h-screen w-screen text-white bg-black-800 flex justify-center items-center font-custom">
      <div className="bg-black-400 min-w-96 min-h-96 rounded-md">
        <div className="p-4 mt-2">
          <div className="text-xl font-semibold">Signup</div>
          <div className="pt-2">
            <div>Email</div>
            <Input ref={emailRef} placeholder={"abc@gmail.com"} />
            <div>Password</div>
            <Input ref={passRef} type="password" placeholder={"******"} />
            <div>Username</div>
            <Input ref={usernameRef} placeholder={"User Name..."} />
            <div className="pt-2 flex justify-center">
              <Button
                onClick={signup}
                variant="primary"
                text="Sign Up"
                fullWidth={true}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
