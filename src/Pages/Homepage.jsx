import { React, useEffect } from 'react'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'
const Homepage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        if (user) {
            navigate("/chat", { replace: true })
        }
    }, [navigate]);
    return <Container maxW='xl' centerContent bgColor={'white'} mt={"30px"} mb={'30px'}>
        <Box
            d="flex"
            justifyContent="center"
            p={3}
            // bg={"white"}
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        // zIndex={"+5"}
        // backgroundColor={"white"}
        >
            <Text className='fontS' fontSize="25px" color="black" fontWeight={"600"} >Chat Application</Text>
        </Box>
        <Box w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px" mb={'20px'}>
            <Tabs variant='soft-rounded'>
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