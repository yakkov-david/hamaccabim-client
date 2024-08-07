import React, { useState, useEffect } from 'react';
import config from '../config';
import CountdownTimer from './CountdownTimer';
import './CountdownLayout.css';
import people from './peopleData';
import ResponseDialog from './ResponseDialog';

import { useParams } from 'react-router-dom';

const CountdownPage: React.FC = () => {
    const [eventDate, setEventDate] = useState("");
    const [pageTitle, setPageTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [Paragraph1, setParagraph1] = useState<JSX.Element[]>([]);
    const [Paragraph2, setParagraph2] = useState<JSX.Element[]>([]);
    const [Paragraph3, setParagraph3] = useState<JSX.Element[]>([]);

    const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
    const currentPerson = people[currentPersonIndex];

    const [dialogOpen, setDialogOpen] = useState(false);

    const { documentId } = useParams<{ documentId: string }>();

    useEffect(() => {
        const fetchCountdownDate = async () => {
            if (documentId) {
                try {
                    const headers = new Headers();
                    headers.set('Content-Type', 'application/json');
                    if (config.apiKey) {
                        headers.set('x-api-key', config.apiKey);
                    }

                    const response = await fetch(config.apiUrl + `/landing-pages/${documentId}`, {
                        headers: headers,
                    });

                    if (response.ok) {
                        const data = await response.json();

                        setEventDate(data.CountdownDate);
                        setPageTitle(data.Title);
                        setParagraph1(convertNewLinesToJSX(data.Paragraph1));
                        setParagraph2(convertNewLinesToJSX(data.Paragraph2));
                        setParagraph3(convertNewLinesToJSX(data.Paragraph3));
                        setImageUrl(data.ImageUrl);
                    } else {
                        throw new Error('Failed to fetch countdown date');
                    }
                } catch (error) {
                    console.error('Error fetching countdown date:', error);
                }
            }
        };
        fetchCountdownDate();
    }, [documentId]);

    useEffect(() => {
        reportVisit();
    }, []);

    const reportVisit = async () => {
        try {
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            if (config.apiKey) {
                headers.set('x-api-key', config.apiKey);
            }

            await fetch(config.apiUrl + '/analytics', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    event: 'visit',
                    timestamp: new Date().toISOString(),
                })
            });
        } catch (error) {
            console.error('Error reporting visit:', error);
        }
    };

    const convertNewLinesToJSX = (text: string): JSX.Element[] => {
        return text.split('\n').map((line, index, array) => (
            index === array.length - 1 ? <React.Fragment key={index}>{line}</React.Fragment> : <React.Fragment key={index}>{line}<br /></React.Fragment>
        ));
    };

    const handleReportClick = async () => {
        try {
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            if (config.apiKey) {
                headers.set('x-api-key', config.apiKey);
            }

            const response = await fetch(config.apiUrl + '/ip', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    text: "Report content or any relevant information"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            } else if (!response.headers.get('content-type')?.includes('application/json')) {
                const responseBody = await response.text();
                throw new Error(`Expected JSON but received: ${responseBody}`);
            }

            const data = await response.json();
            console.log('Report successful:', data);

            await fetch(config.apiUrl + '/analytics', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    event: 'click',
                    timestamp: new Date().toISOString()
                })
            });

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
                <a
                    href={currentPerson.twitterUrl}
                    className="red-button"
                    onClick={handleReportClick}
                    target="_blank"
                >
                    REPORT
                </a>
                <ResponseDialog open={dialogOpen} onClose={handleCloseDialog} />
                <p>{Paragraph3}</p>
            </div>
            <div className="footer" dir='rtl'></div>
        </div>
    );
};

export default CountdownPage;
