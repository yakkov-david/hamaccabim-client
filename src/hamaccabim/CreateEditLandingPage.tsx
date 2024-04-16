
//CreateEditLandingPage.tsx

import React, { useState, useRef } from 'react';

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

  const [selectedImage, setSelectedImage] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger file input click
  const handleImageInputClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Create a URL for the file
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Note: Consider revoking the created URL when appropriate to release memory
      // URL.revokeObjectURL(imageUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Handle Image Upload
    const imageData = new FormData();
    if (imageInputRef.current?.files?.[0]) {
      imageData.append('file', imageInputRef.current.files[0]);

      try {
        const imageUploadResponse = await fetch('http://localhost:3030/upload-image', {
          method: 'POST',
          body: imageData,
        });
        const imageUploadData = await imageUploadResponse.json();
        const imageUrl = imageUploadData.imageUrl; // Assuming 'imageUrl' is the key in the response

        // Now include imageUrl in the original POST request
        const body = JSON.stringify({
          text: '',
          CountdownDate: formState.countdownDate,
          Title: formState.title,
          Paragraph1: formState.paragraph1,
          Paragraph2: formState.paragraph2,
          Paragraph3: formState.paragraph3,
          ImageUrl: imageUrl, // Append the image URL here
        });

        // The rest of your original fetch call remains the same
        fetch('http://localhost:3030/landing-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
        })
          .then(response => response.json())
          .then(data => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });

      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

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
        Image Upload
        <div className="file-input-container" onClick={handleImageInputClick}>
          <div className="custom-file-button">Select Image</div>
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="file-input"
            onChange={handleFileChange} />
        </div>
      </label>
      {selectedImage && <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', height: 'auto' }} />}
      <label>
        Paragraph 3
        <textarea name="paragraph3" value={formState.paragraph3} onChange={handleChange} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default CreateEditLandingPage;

