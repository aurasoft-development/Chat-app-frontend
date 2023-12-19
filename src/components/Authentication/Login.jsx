import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { toast } from 'react-toastify'
import commonApiRequest from "../../api/commonApi";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.warn("Please Fill all the Feilds")
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
     
      const { data } =   await commonApiRequest('post', '/api/user/login', { email, password },config);
      swal({
        title: "Login Successful",
        icon: "success",
        button: "OK"
      })
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/chat', { replace: true })
    } catch (error) {
      toast.error("Error Occured!")
      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired className="fontS ">
        <FormLabel className="fontS sizeF">Email Address</FormLabel>
        <Input
          className="sizeF"
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired >
        <FormLabel className="fontS sizeF">Password</FormLabel>
        <InputGroup size="md">
          <Input
            className="sizeF"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem" className="fontS sizeF">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        className="sizeF"
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        className="sizeF"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;