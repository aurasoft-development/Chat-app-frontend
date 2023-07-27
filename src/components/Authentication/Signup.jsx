import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [show, setShow] = useState()
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false)
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !pic) {
            console.log("hello")
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Password Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            return;
        }
        try {

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            const formData = new FormData();
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('pic', pic)
            const { data } = await axios.post('https://chat-app-backend-95q8.onrender.com/api/multer/upload', formData,
                config
            );
            swal({
                title: "Registration Successful?",
                icon: "success",
                button: "ok"
            })

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chat', { replace: true });
        } catch (error) {
            toast({
                title: "Error Occured",
                // description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setPicLoading(false)
        }
    }
    return <VStack spacing={"2px"}>
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    placeholder='Enter Your Password'
                    onChange={(e) => setPassword(e.target.value)} />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" color={"black"} onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>password
                <Input
                    type={show ? "text" : "password"}
                    placeholder='Enter Your Confirm Password'
                    onChange={(e) => setConfirmpassword(e.target.value)} />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" color={"black"} onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic" isRequired>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input
                type="file"
                p={1.5}
                fontSize={'13px'}
                accept='image/*'
                onChange={(e) => setPic(e.target.files[0])} />
        </FormControl>
        <Button
            colorScheme='blue'
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={picLoading}
        >
            Sign Up
        </Button>
    </VStack>
}

export default Signup;