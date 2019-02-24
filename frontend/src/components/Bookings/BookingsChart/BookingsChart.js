import React from 'react';
import {Bar} from 'react-chartjs-2';
import './BookingsChart.css';

const BOOKINGS_BUCKETS = {
    'Cheap': [0, 100],
    'Normal': [101, 200],
    'Expensive': [201, 100000000]
}


const bookingsChart = props => {
    const chartData = {
        labels: [],
        datasets: []
    };
    let values = [];
    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((total, current) => {
            const price = current.event.price;
            const [min, max] = BOOKINGS_BUCKETS[bucket];
            if (price >=min && price <= max) {
                return total+1;
            }
            return total;
        }, 0);
        values.push(filteredBookingsCount);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            label: bucket,
            backgroundColor: "rgba(220,220,220,0.5)",
            borderColor: "rgba(220,220,220,0.8)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(220,220,220,0.75)",
            hoverBorderColor: "rgba(220,220,220,1)",
            data: values
        });

        values = [...values];
        values[values.length - 1] = 0; 
    }

    return (
        <>
            <div className="cart-div">
                <h2> Bookings Chart</h2>
                <Bar
                    data={chartData}
                    width={100}
                    height={50}
                    options={{
                        maintainAspectRatio: false
                    }}
                />
            </div>
        </>
    );
};

export default bookingsChart;