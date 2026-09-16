import { useEffect, useState } from 'react';

import { api } from './api';


const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

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
-   creates data
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res: Post[] = await api.get(BASE_URL);
      
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

  return (
    <div>
      <h1>API Client</h1>
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