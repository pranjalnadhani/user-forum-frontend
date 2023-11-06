import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./PostForm.module.css";

export function PostForm(props) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the form submit event.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event
   */
  const createPost = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const createEndpoint = props.parentPostId
      ? `http://localhost:8080/posts/${props.parentPostId}/comments`
      : "http://localhost:8080/posts";

    setIsLoading(true);
    fetch(createEndpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Sample post",
        body: data.content,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        }
        throw new Error("Unable to create post");
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={createPost} className={styles.container}>
      <fieldset className={styles["input-wrapper"]}>
        <textarea
          name="content"
          placeholder="What's on your mind?"
          disabled={isLoading}
          className={styles.input}
        />
      </fieldset>
      <button type="submit" disabled={isLoading} className={styles.submit}>
        {props.parentPostId ? "Comment" : "Post"}
      </button>
    </form>
  );
}

PostForm.propTypes = {
  parentPostId: PropTypes.string,
};
