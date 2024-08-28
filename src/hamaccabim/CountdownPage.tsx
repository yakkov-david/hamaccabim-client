import React, { useState, useEffect } from 'react';
import config from '../config';
import CountdownTimer from './CountdownTimer';
import './CountdownLayout.css';
import ResponseDialog from './ResponseDialog';
import { useParams } from 'react-router-dom';

const CountdownPage: React.FC = () => {
    const [eventDate, setEventDate] = useState("");
    const [pageTitle, setPageTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [Paragraph1, setParagraph1] = useState<JSX.Element[]>([]);
    const [Paragraph2, setParagraph2] = useState<JSX.Element[]>([]);
    const [Paragraph3, setParagraph3] = useState<JSX.Element[]>([]);
    const [name, setName] = useState(""); // New state for name
    const [twitterLink, setTwitterLink] = useState(""); // New state for Twitter link

    const [dialogOpen, setDialogOpen] = useState(false);

    const { documentId } = useParams<{ documentId: string }>();

    useEffect(() => {

        // Temporary function to update page content with the desired values
        const updatePageContent = () => {
            setEventDate("2024-08-31T22:00:00.000+02:00");
            setPageTitle("אתר מכבים");
            setParagraph1(convertNewLinesToJSX("אתר מכבים הוקם על מנת שנתאגד ביחד ונתנגד לשונאי ישראל שמפיצים דברי הסתה על מדינת ישראל."));
            setParagraph2(convertNewLinesToJSX("באתר זה נפרסם כל פעם דפים של מסיתים וביחד נכנס לדפים אלו, נתלונן על אותם אנשים ונגרום לכך שהרשתות החברתיות יחסמו להם את הדפים."));
            setParagraph3(convertNewLinesToJSX("בואו נתאגד ונפעל למען מדינת ישראל."));
        };

        updatePageContent(); // Call the temporary function






        /*const fetchCountdownData = async () => {
            if (documentId) {
                try {
                    const headers = new Headers();
                    headers.set('Content-Type', 'application/json');
                    if (config.apiKey) {
                        headers.set('x-api-key', config.apiKey);
                        headers.set('Access-Control-Allow-Origin', '*')
                    }

                    const response = await fetch(config.apiUrl + `/landing-pages/${documentId}`, {
                        headers: headers,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Fetched data:", data);  // Debugging log

                        setEventDate(data.CountdownDate);
                        setPageTitle(data.title);
                        setParagraph1(convertNewLinesToJSX(data.paragraph1));
                        setParagraph2(convertNewLinesToJSX(data.paragraph2));
                        setParagraph3(convertNewLinesToJSX(data.paragraph3));
                        setImageUrl(data.ImageUrl);
                        setName(data.name);
                        setTwitterLink(data.twitterLink);
                    } else {
                        throw new Error('Failed to fetch countdown data');
                    }
                } catch (error) {
                    console.error('Error fetching countdown data:', error);
                }
            }
        };
        fetchCountdownData();*/
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
                headers.set('Access-Control-Allow-Origin', '*')
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

    const convertNewLinesToJSX = (text: string | undefined): JSX.Element[] => {
        if (!text) {
            return []; // Return an empty array if the text is undefined or empty
        }
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
                headers.set('Access-Control-Allow-Origin', '*')
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
                <div>
                    <h1>
                        {pageTitle}
                    </h1>
                </div>
            </div>
            <div className="main-content" dir='rtl'>
                <p className='p'>
                    <h2>
                        {Paragraph1}
                    </h2>
                </p>
                <div dir='ltr'>
                    <CountdownTimer targetDate={new Date(eventDate)} />
                    <hr className="horizontal-line" />
                </div>
                <p>
                    <h2>
                        {Paragraph2}
                    </h2>
                </p>
                {name && <p><strong>{name}</strong></p>}
                {imageUrl && <img src={imageUrl} alt="Event" className='img' />}
                <a
                    href={twitterLink}
                    className="red-button"
                    onClick={handleReportClick}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    REPORT
                </a>
                <ResponseDialog open={dialogOpen} onClose={handleCloseDialog} />
            </div>
            <div className="footer" dir='rtl'>
                <p>
                    <h2>
                        {Paragraph3}
                    </h2>
                </p>
            </div>
        </div>
    );
};

export default CountdownPage;
