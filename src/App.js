import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://avmxxvzhcysdtkaewbby.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bXh4dnpoY3lzZHRrYWV3YmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTM4NzAsImV4cCI6MjA1OTk2OTg3MH0.mwRNEB7j0fp86-0QsxkPG8HrVuBGAc-BjV_ItVCEgig');

function App() {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    const { data } = await supabase.from('lectures').select('*');
    if (data) setLectures(data);
  };

  const addLecture = async () => {
    if (!title || !videoUrl) return alert('Title and video URL required');
    await supabase.from('lectures').insert({ title, video_url: videoUrl, pdf_url: pdfUrl });
    setTitle(''); setVideoUrl(''); setPdfUrl('');
    fetchLectures();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Study Ratna Clone</h1>
      <input placeholder="Lecture Title" value={title} onChange={(e) => setTitle(e.target.value)} /><br/>
      <input placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /><br/>
      <input placeholder="PDF URL" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} /><br/>
      <button onClick={addLecture}>Add Lecture</button>

      {lectures.map((lec) => (
        <div key={lec.id} style={{ marginTop: 20 }}>
          <h2>{lec.title}</h2>
          <iframe src={lec.video_url} style={{ width: '100%', height: 315 }} allowFullScreen></iframe>
          {lec.pdf_url && <a href={lec.pdf_url} target="_blank" rel="noreferrer">View Notes</a>}
        </div>
      ))}
    </div>
  );
}

export default App
