"use client";

import React, {useEffect, useState} from 'react';
import { GridItem, Stack, Flex, Text } from '@chakra-ui/react';
import {
    Chart as ChartJS,
    defaults,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,
} from 'chart.js';
  import {
    Chart
  } from 'react-chartjs-2';

export default function DataChart(props) {
    const {title, data} = props;
    ChartJS.register(CategoryScale);
    ChartJS.register(LinearScale);
    ChartJS.register(PointElement);
    ChartJS.register(LineElement);

    // Define chart options
    const options = {
        scales: {
            x: {
                grid: {
                    color: 'rgba(255,255,255,0.1)', // Set X-axis grid lines to white
                },
                ticks: {
                    color: 'rgba(255,255,255,0.5)', // Set X-axis labels to white
                },
            },
            y: {
                grid: {
                    color: 'rgba(255,255,255,0.1)', // Set Y-axis grid lines to white
                },
                ticks: {
                    color: 'rgba(255,255,255,0.5)', // Set Y-axis labels to white
                }
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                }
            },
            tooltip: { // Explicitly enabling tooltips
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Customizing tooltip background
                titleColor: 'white', // Customizing title color
                bodyColor: 'white', // Customizing body text color
                borderColor: 'gray', // Customizing border color
                borderWidth: 1, // Customizing border width
            }
        },
    };

    return (
        <GridItem colSpan={2} bg="gray.800" h="20rem" p="1rem" borderRadius="10px">
            <Stack align="center">
                <Text fontSize="2rem" fontWeight="bold">{title}</Text>
                <Flex justify="center" align="center" w="100%" h="100%">
                    <Chart type="line" data={data}  height="100%" options={options} />
                </Flex>
            </Stack>
        </GridItem>
    );
}