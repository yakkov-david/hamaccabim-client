import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import config from '../config';
import './AnalyticsPage.css';

Chart.register(...registerables);

interface AnalyticsData {
    event: string;
    timestamp: string;
}

interface GraphData {
    date: string;
    visits: number;
    clicks: number;
}

const AnalyticsPage: React.FC = () => {
    const [visits, setVisits] = useState<number>(0);
    const [clicks, setClicks] = useState<number>(0);
    const [graphData, setGraphData] = useState<GraphData[]>([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                if (config.apiKey) { // Ensure the API key is defined
                    const headers = new Headers();
                    headers.set('Content-Type', 'application/json');
                    headers.set('x-api-key', config.apiKey);

                    const response = await fetch(config.apiUrl + '/analytics', {
                        headers: headers,
                    });

                    if (response.ok) {
                        const data: AnalyticsData[] = await response.json();
                        console.log('Fetched data:', data);
                        if (data) {
                            const visitCount = data.filter(item => item.event === 'visit').length;
                            const clickCount = data.filter(item => item.event === 'click').length;
                            setVisits(visitCount);
                            setClicks(clickCount);

                            processGraphData(data);
                        } else {
                            console.error('Data is undefined:', data);
                        }
                    } else {
                        throw new Error('Failed to fetch analytics data');
                    }
                } else {
                    throw new Error('API key is missing');
                }
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalyticsData();
    }, []);

    const processGraphData = (data: AnalyticsData[]) => {
        if (!data) {
            console.error('processGraphData received undefined data');
            return;
        }

        const graphMap: { [key: string]: { visits: number; clicks: number } } = {};

        data.forEach(item => {
            const date = new Date(item.timestamp).toLocaleDateString();
            if (!graphMap[date]) {
                graphMap[date] = { visits: 0, clicks: 0 };
            }
            if (item.event === 'visit') {
                graphMap[date].visits += 1;
            } else if (item.event === 'click') {
                graphMap[date].clicks += 1;
            }
        });

        const formattedGraphData: GraphData[] = Object.keys(graphMap).map(date => ({
            date,
            visits: graphMap[date].visits,
            clicks: graphMap[date].clicks,
        }));

        console.log('Formatted graph data:', formattedGraphData);
        setGraphData(formattedGraphData);
    };

    const chartData = {
        labels: graphData.map(d => d.date),
        datasets: [
            {
                label: 'Visits',
                data: graphData.map(d => d.visits),
                borderColor: '#8884d8',
                backgroundColor: 'rgba(136, 132, 216, 0.5)',
                fill: false,
            },
            {
                label: 'Clicks',
                data: graphData.map(d => d.clicks),
                borderColor: '#82ca9d',
                backgroundColor: 'rgba(130, 202, 157, 0.5)',
                fill: false,
            },
        ],
    };

    const barChartData = {
        labels: graphData.map(d => d.date),
        datasets: [
            {
                label: 'Visits',
                data: graphData.map(d => d.visits),
                backgroundColor: '#8884d8',
            },
            {
                label: 'Clicks',
                data: graphData.map(d => d.clicks),
                backgroundColor: '#82ca9d',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                type: 'category' as const,
                time: {
                    unit: 'day',
                },
            },
        },
    };

    return (
        <div className="container">
            <h1 className="title">Analytics</h1>
            <div className="stats-container">
                <div className="stat-box">
                    <h2>Visitors</h2>
                    <p>{visits}</p>
                </div>
                <div className="stat-box">
                    <h2>Clickers</h2>
                    <p>{clicks}</p>
                </div>
            </div>
            <div className="graph-container">
                <Line data={chartData} options={chartOptions} />
            </div>
            <div className="graph-container">
                <Bar data={barChartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default AnalyticsPage;
