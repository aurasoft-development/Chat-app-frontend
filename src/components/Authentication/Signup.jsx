import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react'
import { uploadImages } from '../../config/UploadImage';
import { toast } from 'react-toastify';
import commonApiRequest from '../../api/commonApi';
function Signup() {
    const [show, setShow] = useState()
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [picData, setPicData] = useState();
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false)
    const [picLoading, setPicLoading] = useState(false);
    const navigate = useNavigate();
    const handleClick = () => setShow(!show);



    // Function to upload captured images
    const upload = async () => {
        if (!pic) {
            toast.warn("Please Choose File.")
            return;
        } else {
            setLoading(true);
            const response = await uploadImages(pic)
            if (response) {
                setPicData(response.data)
                toast.success("File uploaded successfully")
                setLoading(false);
                return;
            }
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !picData) {
            toast.warn("Please Fill all the Feilds")
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast.warn("Password Do Not Match")
            return;
        }
        try {
            const info = {
                name: name,
                email: email,
                password: password,
                pic: picData
            }
            const { data } = await commonApiRequest('post', '/api/user/register', info);
            swal({
                title: "Registration Successful",
                icon: "success",
                button: "OK"
            })

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chat', { replace: true });
        } catch (error) {
            toast.error("Error Occured")
            setPicLoading(false)
        }
    }
    return <VStack spacing={"2px"}>
        <FormControl id="first-name" isRequired>
            <FormLabel className='sizeF fontS'>Name</FormLabel>
            <Input className='sizeF' placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl id="email" isRequired className="fontS sizeF">
            <FormLabel className='fontS sizeF'>Email</FormLabel>
            <Input className='fontS sizeF' placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired className="fontS sizeF">
            <FormLabel className='fontS sizeF'>Password</FormLabel>
            <InputGroup>
                <Input
                    className='fontS sizeF'
                    type={show ? "text" : "password"}
                    placeholder='Enter Your Password'
                    onChange={(e) => setPassword(e.target.value)} />
                <InputRightElement width="4.5rem">
                    <Button className='fontS' h="1.75rem" size="sm" color={"black"} onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired className="fontS">
            <FormLabel className='fontS sizeF'>Confirm Password</FormLabel>
            <InputGroup>
                <Input
                    className='fontS sizeF'
                    type={show ? "text" : "password"}
                    placeholder='Enter Your Confirm Password'
                    onChange={(e) => setConfirmpassword(e.target.value)} />
                <InputRightElement width="4.5rem">
                    <Button className='fontS' h="1.75rem" size="sm" color={"black"} onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="pic" isRequired className="fontS ">
            <FormLabel className='fontS sizeF'>Upload Your Picture</FormLabel>
            <InputGroup>
                <Input
                    className='fontS sizeF'
                    type="file"
                    p={1.5}
                    fontSize={'13px'}
                    accept='image/*'
                    onChange={(e) => setPic(e.target.files[0])} />
                <InputRightElement width="4.5rem">
                    {loading === true ? <Spinner /> : <Button className='fontS' h="1.75rem" size="sm" color={"black"} onClick={() => upload()}>
                        upload
                    </Button>}
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            className='fontS sizeF'
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