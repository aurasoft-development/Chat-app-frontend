import { React, useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'
import '../assets/css/pages/Home.css'
const Homepage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        if (user) {
            navigate("/chat", { replace: true })
        }
    }, [navigate]);
    return <Container maxW='xl' centerContent className='home-container'>
        <Box className='home-box'>
            <Text className='fontS home-tax' >Chat Application</Text>
        </Box>
        <Box className='home-box1'>
            <Tabs variant='soft-rounded' className="fontS sizeF">
                <TabList mb="1em" >
                    <Tab className='tab' width={"50%"} color="black"  >Login</Tab>
                    <Tab className='tab' width={"50%"} color="black" >Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel >{<Login />} </TabPanel>
                    <TabPanel>{<Signup />}</TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container >
}
export default Homepage