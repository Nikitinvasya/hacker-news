import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsPage: React.FC = () => {
  const { id } = useParams();
  const [newsDetails, setNewsDetails] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  const fetchNewsDetails = async () => {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const newsItem = await response.json();
    setNewsDetails(newsItem);
    if (newsItem.kids) {
      const commentsPromises = newsItem.kids.map(async (commentId: number) => {
        const commentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
        return commentResponse.json();
      });
      const commentsData = await Promise.all(commentsPromises);
      setComments(commentsData);
    }
  };

  useEffect(() => {
    fetchNewsDetails();
  }, [id]);

  if (!newsDetails) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{newsDetails.title}</h1>
      <p>Автор: {newsDetails.by}</p>
      <p>Дата: {new Date(newsDetails.time * 1000).toLocaleString()}</p>
      <p><a href={newsDetails.url} target="_blank" rel="noopener noreferrer">Ссылка на новость</a></p>
      <h2>Комментарии ({comments.length})</h2>
      <div>
        {comments.map(comment => (
          <div key={comment.id}>
            <p>{comment.text}</p>
            <p>Автор: {comment.by}</p>
          </div>
        ))}
      </div>
      <Link to="/">Вернуться к списку новостей</Link>
    </div>
  );
};

export default NewsPage;
