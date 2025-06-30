import { useRef, useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const passRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState("");
  const navigate = useNavigate();

  async function signin() {
    const password = passRef.current?.value;
    const email = emailRef.current?.value;
    try {
      const res = await axios.post(BACKEND_URL + "/api/v1/signin", {
        password,
        email,
      });
      if (!res) {
        setLoading(true);
      }
      const token = res.data.token;
      setLoading(false);
      localStorage.setItem("token", token);
      navigate("/");
    } catch (e) {
      setMessages("User dosen't exists");
      console.log(e);
    }
  }
  return (
    <div className="top-0 left-0 h-screen w-screen bg-black-600 text-white flex justify-center items-center font-custom">
      <div className="bg-black-400 min-w-96 min-h-72 rounded-md">
        <div className="p-4 mt-2">
          <div className="text-xl font-semibold">SignIn</div>
          <div className="pt-2">
            <div>Email</div>
            <Input ref={emailRef} placeholder={"abc@gmail.com"} />
            <div>Password</div>
            <Input ref={passRef} type="password" placeholder={"******"} />
            <div className="pt-2 flex justify-center">
              <Button
                onClick={signin}
                variant="primary"
                text="Log In"
                fullWidth={true}
                loading={loading}
              />
            </div>
            <div className="flex justify-center">{messages}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
