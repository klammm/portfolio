import { useEffect, useState } from 'react';

import { api } from './api';


const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

type NewPost = Pick<Post, 'title' | 'body'>;

/*
Build Exercise

API Client

Create:

    api.get() x
    api.post() x
    api.patch() x
    api.delete() x

Then build a UI that:

-   fetches data x
-   creates data x
-   updates data
-   deletes data
-   handles loading
-   handles errors
-   retries failed requests
-   cancels requests
*/
export const ApiClient = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreatePostOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name.includes("title")) {
      setNewPost(prev => ({
        ...prev,
        title: e.target.value,
      }));
    } else if (e.target.name.includes('body')) {
      setNewPost(prev => ({
        ...prev,
        body: e.target.value,
      }));
    }
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const createPost = async (newPost: NewPost) => {
      const reqBody = {
        title: newPost.title,
        body: newPost.body,
      };
      const res = await api.post<Post, NewPost>(BASE_URL, reqBody);

      if (res) {
        setPosts(prev => [res, ...prev]);
        setNewPost({ title: "", body: "" });
        setShowSuccess(true);
      }
    };

    if (newPost.title && newPost.body) {
      createPost(newPost);
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get<Post[]>(BASE_URL);
      
        if (res) {
          setPosts(res);
        }
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>API Client</h1>
      <h2>Create a post here!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="api-client-create-post-field-title">Title</label>
        <input value={newPost.title} onChange={handleCreatePostOnChange} id="api-client-create-post-field-title" name="api-client-create-post-field-title" />
        <label htmlFor="api-client-create-post-field-body">Body</label>
        <input value={newPost.body} onChange={handleCreatePostOnChange} id="api-client-create-post-field-body" name="api-client-create-post-field-body" />
        <button type="submit">
          Submit
        </button>
      </form>
      {showSuccess && <p>Your new post was created!</p>}
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
        )
      })}
    </div>
  )
};

export default ApiClient;