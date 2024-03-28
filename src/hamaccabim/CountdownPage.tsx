// CountdownPage.tsx
import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import './CountdownLayout.css';
import people from './peopleData'; // import the people data
import ResponseDialog from './ResponseDialog';

import { useParams } from 'react-router-dom'; // Import useParams

const CountdownPage: React.FC = () => {
    const [eventDate, setEventDate] = useState(""); // Initialize with current date
    const [pageTitle, setPageTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [Paragraph1, setParagraph1] = useState<JSX.Element[]>([]);
    const [Paragraph2, setParagraph2] = useState<JSX.Element[]>([]);
    const [Paragraph3, setParagraph3] = useState<JSX.Element[]>([]);

    const [currentPersonIndex, setCurrentPersonIndex] = useState(0); // State to track the current person
    const currentPerson = people[currentPersonIndex]; // Get the current person's data

    const [dialogOpen, setDialogOpen] = useState(false);

    const { documentId } = useParams<{ documentId: string }>(); // Extract the document ID from the URL

    useEffect(() => {
        const fetchCountdownDate = async () => {
            if (documentId) {
                try {
                    const response = await fetch(`http://localhost:3030/landing-pages/${documentId}`);
                    const data = await response.json();

                    setEventDate(data.CountdownDate);
                    setPageTitle(data.Title);
                    setParagraph1(convertNewLinesToJSX(data.Paragraph1));
                    setParagraph2(convertNewLinesToJSX(data.Paragraph2));
                    setParagraph3(convertNewLinesToJSX(data.Paragraph3));
                    setImageUrl(data.ImageUrl);
                } catch (error) {
                    console.error('Error fetching countdown date:', error);
                }
            }
        };

        fetchCountdownDate();
    }, [documentId]);

    // Utility function to convert new lines to JSX
    const convertNewLinesToJSX = (text: string): JSX.Element[] => {
      return text.split('\n').map((line, index, array) => (
        index === array.length - 1 ? <React.Fragment key={index}>{line}</React.Fragment> : <React.Fragment key={index}>{line}<br /></React.Fragment>
      ));
    };

    const handleReportClick = async () => {
        try {
            const response = await fetch('http://localhost:3030/ip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: "Report content or any relevant information"
                })
            });
    
            // Check if the response is okay and is of type JSON
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else if (!response.headers.get('content-type')?.includes('application/json')) {
                const responseBody = await response.text();
                throw new Error(`Expected JSON but received: ${responseBody}`);
            }
    
            const data = await response.json();
            console.log('Report successful:', data);
            // Optionally, handle the response data (e.g., show a success message)
    
        } catch (error) {
            console.error('Error reporting:', error);
            // Optionally, handle the error (e.g., show an error message)
        }
    
        // Open the dialog to show feedback about the report action.
        // This could be adjusted based on successful or error outcomes.
        setDialogOpen(true);
    };
    

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <div className="countdown-page">
            <div className="header" dir="rtl">
                <div>{pageTitle}</div>
            </div>
            <div className="main-content" dir='rtl'>
                <p className='p'>{Paragraph1}</p>
                <div dir='ltr'>
                    <CountdownTimer targetDate={new Date(eventDate)} />
                    <hr className="horizontal-line" />
                </div>
                <p>{Paragraph2}</p>
                {imageUrl && <img src={imageUrl} alt="Event" className='img' />}
                <a href={currentPerson.twitterUrl} className="red-button" onClick={handleReportClick} target="_blank">REPORT</a>
                {/* Response Dialog */}
                <ResponseDialog open={dialogOpen} onClose={handleCloseDialog} />
                <p>{Paragraph3}</p>
            </div>
            <div className="footer" dir='rtl'></div>
        </div>
    );
};

export default CountdownPage;
