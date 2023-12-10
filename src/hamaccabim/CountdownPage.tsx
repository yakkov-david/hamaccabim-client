

// CountdownPage.tsx
import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import './CountdownLayout.css';
import people from './peopleData'; // import the people data

const CountdownPage: React.FC = () => {
    const eventDate = new Date('2023-12-14T22:00:00');
    const [currentPersonIndex, setCurrentPersonIndex] = useState(0); // State to track the current person

    const currentPerson = people[currentPersonIndex]; // Get the current person's data
    
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
                <a href={currentPerson.twitterUrl} className="red-button">REPORT</a>
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