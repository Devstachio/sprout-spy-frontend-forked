"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { Flex, Stack, Spinner, Text, Grid, Link, Editable, EditableInput, EditablePreview, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import DataChart from 'src/components/DataChart';

function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState(null);

  const [plantName, setPlantName] = useState('');

  const handlePlantNameChange = async (value) => {
    setPlantName(value);

    const { data, error } = await supabase
      .from('plants')
      .update({ plant_name: value })
      .eq('id', plants[0].id);

    if (error) {
      console.error('Error updating plant name: ', error);
    } else {
      console.log('Plant name updated successfully: ', data);
    }
  };

  useEffect(() => {
    if (plants && plants.length > 0) {
      setPlantName(plants[0].plant_name);
    }
  }, [plants]);

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      console.log(response.data.user)
      if (!response.data.user) {
        router.push('/sign-in');
        return;
      }
      supabase.from('plants').select().eq('owner_id', response.data.user.id).then((response) => {
        console.log('plants')
        console.log(response.data)
        setPlants(response.data);

      });

      setUser(response.data.user);
      setLoading(false);


    });
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Stack spacing={4}>
          <Spinner size="xl" thickness='4px' color={"green.400"} />
        </Stack>
      </Flex>
    );
  }
  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      // eslint-disable-next-line no-console
      console.error('ERROR:', error);
    }else{
      router.push('/sign-in');
    }
    
  }

  if (!user) {
    router.push('/sign-in');
  }

  function Grd({plants}){
    return
  }

  return (
    <>
      <Flex marginY={"5px"} width={"100%"} justifyContent={"space-between"}>
        <Link href='/new-plant'>
        <Button colorScheme={"green"} fontSize={"1.5rem"} marginX={"5px"}>+</Button>
        </Link>
        <Button colorScheme={"green"} onClick={ () => {handleSignOut();
        router.push('/sign-in');
      }
        } marginX={"5px"}>
          Sign Out
        </Button>
      </Flex>

      <Stack color="white" align="center">
        <Text fontWeight="semibold" fontSize="4rem" p="1rem">Dashboard</Text>
        <Editable fontWeight="semibold" fontSize="2rem" p="1rem" color="white" value={plantName} onChange={handlePlantNameChange} textAlign="center">
          <EditablePreview />
          <EditableInput />
        </Editable>

        {/* make multiople grids so that you can edit the name of multiple plants */}
        <Grid
          templateColumns={{ sm: 'repeat(2, 1fr)', md: "repeat(4, 1fr)" }}
          gap="3rem"
          w="100%"
          p="3rem"
        >
          {plants && plants.map((plant) => {
            let tempData = plant.temperature_data;
            let tempValues = [];
            let tempLabels = [];
            tempData.map((data) => {
              tempValues.push(data.value);
              tempLabels.push(data.time);
            });
            let humidityData = plant.humidity_data;
            let humidityValues = [];
            let humidityLabels = [];
            humidityData.map((data) => {
              humidityValues.push(data.value);
              humidityLabels.push(data.time);
            });
            let lightData = plant.light_data;
            let lightValues = [];
            let lightLabels = [];
            lightData.map((data) => {
              lightValues.push(data.value);
              lightLabels.push(data.time);
            });
            let soilMoistureData = plant.soil_moisture_data;
            let soilMoistureValues = [];
            let soilMoistureLabels = [];
            soilMoistureData.map((data) => {
              soilMoistureValues.push(data.value);
              soilMoistureLabels.push(data.time);
            });


            return (
              <>
                <DataChart title="Temperature" data={{
                  labels: tempLabels.slice(-20),
                  datasets: [
                    {
                      label: 'Data',
                      data: tempValues.slice(-20),
                      fill: false,
                      backgroundColor: '#68D391',
                      borderColor: '#68D391',
                      tension: 0.1,
                    },
                  ],
                }} />
                <DataChart title="Humidity" data={{
                  labels: humidityLabels.slice(-20),
                  datasets: [
                    {
                      label: 'Data',
                      data: humidityValues.slice(-20),
                      fill: false,
                      backgroundColor: '#68D391',
                      borderColor: '#68D391',
                      tension: 0.1,
                    },
                  ],
                }} />
                <DataChart title="Light" data={{
                  labels: lightLabels.slice(-20),
                  datasets: [
                    {
                      label: 'Data',
                      data: lightValues.slice(-20),
                      fill: false,
                      backgroundColor: '#68D391',
                      borderColor: '#68D391',
                      tension: 0.1,
                    },
                  ],
                }} />
                <DataChart title="Soil Moisture" data={{
                  labels: soilMoistureLabels.slice(-20),
                  datasets: [
                    {
                      label: 'Data',
                      data: soilMoistureValues.slice(-20),
                      fill: false,
                      backgroundColor: '#68D391',
                      borderColor: '#68D391',
                      tension: 0.1,
                    },
                  ],
                }} />

              </>

            );
          })}


        </Grid>

      </Stack></>
  );

}

export default DashboardPage;