
//CreateEditLandingPage.tsx

import React, { useState } from 'react';

import './CreateEditLandingPage.css';


// Define a type for our form state
interface FormState {
  countdownDate: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}

const CreateEditLandingPage: React.FC = () => {
  // Set up state for form fields
  const [formState, setFormState] = useState<FormState>({
    countdownDate: '',
    title: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
  });

  // Handle change in form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

// Handle form submission
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // URL of your backend endpoint
  const endpoint = 'http://localhost:3030/landing-pages';


  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include other headers as needed, for example, authorization headers
    },
    body: JSON.stringify({
      text: '',
      CountdownDate: formState.countdownDate,
      Title: formState.title,
      Paragraph1: formState.paragraph1,
      Paragraph2: formState.paragraph2,
      Paragraph3: formState.paragraph3,}),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // Handle success. For example, you can clear the form, or display a success message.
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle errors here, for example, by displaying an error message to the user.
  });
};



return (
  <form onSubmit={handleSubmit}>
    <label>
      Countdown Date
      <input type="datetime-local" name="countdownDate" value={formState.countdownDate} onChange={handleChange} />
      </label>
      <label>
        Title
        <input type="text" name="title" value={formState.title} onChange={handleChange} />
      </label>
      <label>
        Paragraph 1
        <textarea name="paragraph1" value={formState.paragraph1} onChange={handleChange} />
      </label>
      <label>
        Paragraph 2
        <textarea name="paragraph2" value={formState.paragraph2} onChange={handleChange} />
      </label>
      <label>
        Paragraph 3
        <textarea name="paragraph3" value={formState.paragraph3} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default CreateEditLandingPage;

