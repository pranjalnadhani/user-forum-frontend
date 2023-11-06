import { useEffect, useState } from "react";
import { Post } from "./components/Post/Post";
import styles from "./App.module.css";
import { PostForm } from "./components/PostForm/PostForm";

/**
 * Renders the main App component.
 * @returns {JSX.Element} The App component
 */
function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/posts", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <PostForm />
        {posts.map((post) => (
          <Post key={post._id} {...post} />
        ))}
      </section>
    </main>
  );
}

export default App;
