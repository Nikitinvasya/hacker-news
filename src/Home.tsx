import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@mui/material';


const Home: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);

  const fetchNews = async () => {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/newstories.json');
    const newsIds = await response.json();
    const newsPromises = newsIds.slice(0, 100).map(async (id: number) => {
      const newsResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return newsResponse.json();
    });
    const newsItems = await Promise.all(newsPromises);
    setNews(newsItems);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Обновление каждую минуту
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Hacker News</h1>
      {news.map(item => (
        <Card key={item.id} style={{ margin: '10px', padding: '10px' }}>
          <Link to={`/news/${item.id}`}>{item.title}</Link>
          <p>{item.score} points by {item.by} on {new Date(item.time * 1000).toLocaleString()}</p>
        </Card>
      ))}
      <Button variant="contained" onClick={fetchNews}>Обновить список</Button>
    </div>
  );  
};

export default Home;
