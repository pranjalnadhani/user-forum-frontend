import format from "date-fns/formatDistanceToNow";
import PropTypes from "prop-types";
import { useState } from "react";
import { PostForm } from "../PostForm/PostForm";
import styles from "./Post.module.css";

/**
 * A component that renders a post with its author, creation date, and comments.
 *
 * @component
 * @param {Object} props - The props object containing the post data.
 * @param {string} props._id - The unique identifier of the post.
 * @param {string} props.title - The title of the post.
 * @param {string} props.body - The body of the post.
 * @param {Object} props.author - The author of the post.
 * @param {string} props.author._id - The unique identifier of the author.
 * @param {string} props.author.username - The username of the author.
 * @param {Object[]} props.comments - The comments of the post.
 * @param {Object} props.comments[].author - The author of the comment.
 * @param {string} props.comments[].author._id - The unique identifier of the author.
 * @param {string} props.comments[].author.username - The username of the author.
 * @param {string} props.comments[].body - The body of the comment.
 * @param {string} props.comments[].createdAt - The creation date of the comment.
 * @param {string} props.comments[].updatedAt - The last update date of the comment.
 * @param {string} props.createdAt - The creation date of the post.
 * @param {string} props.updatedAt - The last update date of the post.
 * @returns {JSX.Element} - The JSX element representing the post.
 */
export function Post(props) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comments, setComments] = useState(props.comments || []);

  const toggleCommenting = () => {
    setIsCommenting((isCommenting) => !isCommenting);
  };

  const loadComments = () => {
    fetch(`http://localhost:8080/posts/${props._id}/comments`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments);
      });
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.author}>{props.author.username}</h2>
          <div className={styles.metadata}>
            {props.createdAt !== props.updatedAt && <span>(Edited)</span>}
            <span>{format(new Date(props.createdAt))} ago</span>
          </div>
        </div>
        <p className={styles.content}>{props.body}</p>
        <div className={styles.actions}>
          {!comments.length && (
            <button className={styles["comment-button"]} onClick={loadComments}>
              View
            </button>
          )}
          <button
            className={styles["comment-button"]}
            onClick={toggleCommenting}
          >
            Comment
          </button>
          <button className={styles["edit-button"]}>Edit</button>
          <button className={styles["delete-button"]}>Delete</button>
        </div>
        {isCommenting && <PostForm parentPostId={props._id} />}
      </div>
      {Boolean(comments.length) &&
        comments.map((comment) => (
          <div key={comment._id} className={styles.comments}>
            <Post {...comment} />
          </div>
        ))}
    </div>
  );
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  author: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      author: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ),
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
};
