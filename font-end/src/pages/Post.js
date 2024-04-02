import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);
  const { authState } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/ById/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, [id]);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };

          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then(() => {
        navigate("/");
      });
  };
  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new title: ");
      axios.put(
        "http://localhost:3001/posts/title",
        { newTitle: newTitle, id: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter new text: ");
      axios.put(
        "http://localhost:3001/posts/postText",
        { newText: newPostText, id: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            <p>{postObject.title}</p>
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}{" "}
            {authState.username === postObject.username && (
              <button onClick={() => deletePost(postObject.id)}>delete</button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            autoComplete="off"
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
          <button className="btnAddComment" onClick={addComment}>
            Add Comment
          </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                <h4 className="username_comment">
                  Username: {comment.username}
                </h4>
                <p className="text_comment">{comment.commentBody}</p>
                {authState.username === comment.username && (
                  <button
                    className="delete_btn"
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    x
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
