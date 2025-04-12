import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase details
const supabaseUrl = 'https://avmxxvzhcysdtkaewbby.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bXh4dnpoY3lzZHRrYWV3YmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTM4NzAsImV4cCI6MjA1OTk2OTg3MH0.mwRNEB7j0fp86-0QsxkPG8HrVuBGAc-BjV_ItVCEgig';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to generate embed link or fallback
const getEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com") && parsed.pathname === "/watch") {
      const videoId = parsed.searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
  } catch {
    return null;
  }
};

function App() {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [lectures, setLectures] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchLectures = async () => {
    const { data, error } = await supabase.from('lectures').select('*').order('created_at', { ascending: false });

    if (error) {
      setMessage('Error fetching lectures: ' + error.message);
      setMessageType('error');
    } else {
      setLectures(data || []);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !videoUrl) {
      setMessage('Title and video URL are required.');
      setMessageType('error');
      return;
    }

    const { data, error } = await supabase.from('lectures').insert([
      {
        title,
        video_url: videoUrl,
        pdf_url: pdfUrl,
      },
    ]);

    if (error) {
      setMessage('Failed to add lecture: ' + error.message);
      setMessageType('error');
    } else {
      setMessage('Lecture added successfully!');
      setMessageType('success');
      setTitle('');
      setVideoUrl('');
      setPdfUrl('');
      fetchLectures();
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Study Ratna Clone</h1>

      {message && (
        <div
          style={{
            padding: '10px',
            marginBottom: '1rem',
            color: messageType === 'error' ? 'red' : 'green',
            border: `1px solid ${messageType === 'error' ? 'red' : 'green'}`,
            borderRadius: '5px',
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Lecture title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          placeholder="PDF URL (optional)"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Add Lecture</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h2>Lectures</h2>
      {lectures.length === 0 && <p>No lectures found.</p>}
      {lectures.map((lecture) => {
        const embedUrl = getEmbedUrl(lecture.video_url);

        return (
          <div key={lecture.id} style={{ marginBottom: '2rem' }}>
            <h3>{lecture.title}</h3>
            {embedUrl ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={embedUrl}
                  title={lecture.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <a href={lecture.video_url} target="_blank" rel="noopener noreferrer">
                <button style={{ marginTop: '10px' }}>Play Video</button>
              </a>
            )}

            {lecture.pdf_url && (
              <p>
                <a href={lecture.pdf_url} target="_blank" rel="noopener noreferrer">
                  View PDF Notes
                </a>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
              
