
// CountdownTimer.tsx
import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

// Define the shape of the time left object
interface TimeLeft {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
} /*interface defining the shape of the object 
    that holds the remaining time values*/

// Define the props expected by CountdownTimer component
interface CountdownTimerProps {
    targetDate: Date;
}//Looking forward to getting a Date accessory

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
            minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
            seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
        };
    }

    return timeLeft;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);
       
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer);
    }, [timeLeft]); // Added targetDate as a dependency
    /*Defines the component as a functional component 
        that accepts CountdownTimerProps as its props*/
    
    
    
    return (
        <div className="countdown-timer">
            <div className="time-section">
                <span className="time-value">{timeLeft.days} : </span>
                <span className="time-label">days</span>
            </div>
            <div className="time-section">
                <span className="time-value">{timeLeft.hours} : </span>
                <span className="time-label">hours</span>
            </div>
            <div className="time-section">
                <span className="time-value">{timeLeft.minutes} : </span>
                <span className="time-label">minutes</span>
            </div>
            <div className="time-section">
                <span className="time-value">{timeLeft.seconds}</span>
                <span className="time-label">seconds</span>
            </div>
        </div>
    );
};

export default CountdownTimer;
