import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';

function Forum() {
  const { user } = useUser();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getForumTopics();
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching forum topics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async (topicId) => {
    setIsLoading(true);
    try {
      const response = await apiService.getForumPosts(topicId);
      setSelectedTopic({
        ...topics.find(topic => topic.id === topicId),
        posts: response.data
      });
    } catch (error) {
      console.error('Error fetching forum posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = (topicId) => {
    fetchPosts(topicId);
  };

  const handleNewPost = async () => {
    if (!newPost.trim() || !selectedTopic) return;

    setIsLoading(true);
    try {
      await apiService.createForumPost(selectedTopic.id, newPost);
      setNewPost('');
      fetchPosts(selectedTopic.id);
    } catch (error) {
      console.error('Error creating new post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forum">
      <h2>Community Forum</h2>
      <div className="forum-layout">
        <div className="topic-list">
          <h3>Topics</h3>
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`topic-item ${selectedTopic?.id === topic.id ? 'active' : ''}`}
              onClick={() => handleTopicSelect(topic.id)}
            >
              {topic.title}
            </div>
          ))}
        </div>
        <div className="topic-content">
          {selectedTopic ? (
            <>
              <h3>{selectedTopic.title}</h3>
              <div className="posts">
                {selectedTopic.posts.map((post) => (
                  <div key={post.id} className="post">
                    <div className="post-header">
                      <span className="post-author">{post.author}</span>
                      <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="post-content">{post.content}</div>
                  </div>
                ))}
              </div>
              {user && (
                <div className="new-post">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write a new post..."
                  />
                  <button onClick={handleNewPost} disabled={isLoading || !newPost.trim()}>
                    Post
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Select a topic to view posts</p>
          )}
        </div>
      </div>
      {isLoading && <div className="loading-overlay">Loading...</div>}
    </div>
  );
}

export default Forum;