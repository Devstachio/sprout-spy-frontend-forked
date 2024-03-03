"use client";

import React, {useEffect, useState} from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// @ts-ignore
import { Flex, Text, Box, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
// @ts-ignore
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';


const NewPlantPage = () => {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [plantName, setPlantName] = useState('');
    const [plantID, setPlantID] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then((response) => {
            console.log(response.data.user)
            if (!response.data.user) {
                router.push('/sign-in');
                return;
            }
            setUser(response.data.user);
        }
        );
    }, []);


    // @ts-ignore
    const PlantSchema = Yup.object().shape({
        plantName: Yup.string().required('Required'),
        plantID: Yup.number().required('Required'),
    });

    const onSubmit = () => {
        // checks to see if plantID is a number
        if (isNaN(Number(plantID))) {
            alert('Plant ID must be a number');
            return;
        }
        
        // adds plantID,  plantName and user_id to the plants table in the database
        
        // if the plantID already has a id in the database, it will not add the plant, and will return an error
        if (plantID === '' || plantName === '') {
            alert('Plant ID and Plant Name must be filled out');
            return;
        }

        if(user === null) {
            alert('User not found');
            router.push('/sign-in');
            return;
        }


        supabase.from('plants').select().eq('id', plantID).then((response) => {
            // checks to see if the user.id is the same as the owner_id in the database
            let plant = response.data[0];
            while (plant !== undefined && plant.owner_id !== user.id) {
                if (plant.owner_id === user.id) {
                    alert('Plant ID already exists');
                    return;
                }
            }

        }
        ).catch((error) => {
            console.error('Error checking plant ID: ', error);
        });

        supabase.from('plants').insert([{ id: plantID, owner_id: user.id, plant_name: plantName }]).then((response) => {
            console.log(response);
            router.push('/dashboard');
        }).catch((error) => {
            console.error('Error adding plant: ', error);
        });

        console.log(plantID, plantName);
        
    }


        return (
            <Flex flexDir={"column"} justifyContent={"center"} align={"center"} minH={"100vh"}>
                <Flex marginY={"40px"}>
                    <Text fontSize={"6xl"} fontWeight={"bolder"} color={"white"}>Sprout</Text>
                    <Text fontSize={"6xl"} fontWeight={"bolder"} color={"green.400"}>Spy</Text>
                </Flex>
                <Box flexDir={"column"} justifyContent={"center"}
                    // @ts-ignore
                    align={"center"} borderRadius={"10px"} bgColor={"gray.700"} minW={{ md: "25rem", sm: "20rem", base: "40%" }} paddingX={"20px"} paddingY={"50px"}>
                    <Text fontSize={"5xl"} fontWeight={"bolder"} color={"gray.300"}>Add New Plant</Text>
                    <Input placeholder="Plant Name" value={plantName} onChange={(e) => setPlantName(e.target.value)} style={{ backgroundColor: "white", borderRadius: "5px", paddingLeft: "5px", paddingTop: "2px", paddingBottom: "2px" }} my={"10px"}/>
                    <Input placeholder="Plant ID" value={plantID} onChange={(e) => setPlantID(e.target.value)} style={{ backgroundColor: "white", borderRadius: "5px", paddingLeft: "5px", paddingTop: "2px", paddingBottom: "2px" }} my={"10px"}/>
                    <Button colorScheme={"green"} onClick={onSubmit}>Submit</Button>
                </Box>
            </Flex>
        )
    }

    export default NewPlantPage;

