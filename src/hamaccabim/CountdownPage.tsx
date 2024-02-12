

// CountdownPage.tsx
import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import './CountdownLayout.css';
import people from './peopleData'; // import the people data
import { response } from 'express';
import ResponseDialog from './ResponseDialog';

const CountdownPage: React.FC = () => {
    //const eventDate = new Date('2023-12-20T22:00:00');
    const [eventDate, setEventDate] = useState(new Date()); // Initialize with current date

    const [currentPersonIndex, setCurrentPersonIndex] = useState(0); // State to track the current person

    const currentPerson = people[currentPersonIndex]; // Get the current person's data

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        // Fetch the countdown date when the component mounts
        const fetchCountdownDate = async () => {
            try {
                const response = await fetch('http://localhost:3030/lending-pages');
                const data = await response.json();
                setEventDate(new Date(data.date));
            } catch (error) {
                console.error('Error fetching countdown date:', error);
            }
        };

        fetchCountdownDate();
    }, []);


    const handleReportClick = async () => {
        try {
            const response = await fetch('http://localhost:3030/ip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: "aaaaa"
                })

            });
            //console.log('Making a request to', 'http://localhost:3030/ip');

            // Check if the response is okay and is of type JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else if (!response.headers.get('content-type')?.includes('application/json')) {
                const responseBody = await response.text();
                throw new Error(`Expected JSON but received: ${responseBody}`);
            }

            const data = await response.json();
            console.log('Report successful:', data);
        } catch (error) {
            console.error('Error reporting:', error);
        }

        setDialogOpen(true);
    };


    const handleCloseDialog = () => {
        setDialogOpen(false);
    };



    return (
        <div className="countdown-page">
            <div className="header" dir="rtl">
                <h2>המכבים - "מעטים מול רבים."</h2>
            </div>
            <div className="main-content" dir='rtl'>
                <p className='p'>
                    עם ישראל היקר,<br />
                    אנו עושים מאמצים רבים בהסברה ברשתות החברתיות<br />
                    לצערנו מכיון שאנו היהודים מיעוט זניח ביחס לעולם, קולנו בקושי נשמע ונבלע באוקיינוס האיסלאם<br />
                    עלינו להתאחד ולייצר כוח שאיתו נוכל לנצח
                </p>
                <div dir='ltr'>
                    <CountdownTimer targetDate={eventDate} />
                    <hr className="horizontal-line" />
                </div>
                <div dir='rtl'>
                    <p>
                        השבוע נתאחד כולנו ונחסום את החשבון טוויטר<br />
                        של צורר היהודים ושונא ישראל, הלא הוא:<br />
                        {currentPerson.name}
                    </p>
                </div>
                <img src={currentPerson.imageUrl} alt="Event" className='img' />
                <a href={currentPerson.twitterUrl} className="red-button" onClick={handleReportClick} target="_blank">REPORT</a>
                {/* Response Dialog */}
                <ResponseDialog open={dialogOpen} onClose={handleCloseDialog} />
            </div>
            <div className="footer" dir='rtl'>
                <p>
                    מדובר באזרח אמריקאי צעיר עם כמות מאוד גדולה של עוקבים בטוויטר. <br />
                    אל תתנו לשם האמריקאי להטעות אתכם, אדם זה מעלה פוסט בטוויטר כל עשר <br />
                    דקות - רבע שעה בו הוא תוקף את ישראל בצורה ארסית ומפיץ ידיעות כוזבות ולועג<br />
                    לחיילי צה"ל
                </p>
            </div>
        </div>
    );
};

export default CountdownPage;