import { useEffect, useState } from "react";
import { getComments, createComment, deleteComment, updateComment } from "../services/comments";

export default function CommentsSection({ everestId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  let currentUserId = null;
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload?.sub || null;
    }
  } catch {
    currentUserId = null;
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const t = new Date(timestamp);
    const mins = Math.floor((now - t) / (1000 * 60));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    if (!everestId) return;
    const token = localStorage.getItem("token");

    const fetchComments = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getComments(token, everestId);
        if (data?.token) localStorage.setItem("token", data.token);
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (e) {
        setError(e.message || "Failed to load comments");
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [everestId, token]);

 
  function handleStartEdit(comment) {
    setEditingId(comment._id);
    setBody(comment.content || "");
  }


  async function handleSubmit(e) {
    e.preventDefault();
    const message = body.trim();
    if (!message) return;
  
    try {
      if (editingId) {
        const res = await updateComment(token, editingId, message);
        setComments((prev) =>
          prev.map((c) =>
            String(c._id) === String(editingId) ? { ...c, content: message } : c
          )
        );
        setEditingId(null);
      } else {
        const res = await createComment(token, everestId, message);
        setComments((prev) => [res.comment, ...prev]);
      }
      setBody("");
    } catch (e) {
      setError("Failed to submit comment");
    }
  }


  async function handleDeleteComment(commentId) {
    if (!commentId) return;
    try {
      const out = await deleteComment(token, commentId);
      if (out?.token) localStorage.setItem("token", out.token);
      setComments((prev) => prev.filter((c) => String(c._id) !== String(commentId)));


      if (editingId && String(editingId) === String(commentId)) {
        setEditingId(null);
        setBody("");
      }
    } catch (e) {
      setError("Failed to delete comment");
    }
  }

  return (
    <div className="container">
      <div className="box" style={{ backgroundColor: "white", maxWidth: "70rem", margin: "2.5rem auto" }}>
        <p className="title is-5 has-text-weight-normal">Comments</p>

        {error && <div className="notification is-danger">{error}</div>}

        {loading ? (
          <p>Loading comments…</p>
        ) : (
          <>
            <div className="mb-4" style={{ maxHeight: "320px", overflowY: "auto" }}>
              {comments.length === 0 ? (
                <p className="has-text-weight-normal">No comments yet</p>
              ) : (
                comments.map((comment) => {
                  const authorId = comment.author?._id;
                  const isAuthor = currentUserId && authorId && String(authorId) === String(currentUserId);

                  return (
                    <article className="media" key={comment._id}>
                      <div className="media-content">
                      <div className="content">
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div />

                          <div className="has-text-centered">
                            <strong>{comment.author.username || comment.author.email}</strong>
                            {comment.createdAt && (
                              <small className="has-text-weight-normal" style={{ marginLeft: "0.25rem" }}>
                                · {formatTimeAgo(comment.createdAt)}
                              </small>
                            )}
                          </div>

                          <div style={{ justifySelf: "end" }}>
                            {isAuthor && (
                              <>
                                <button
                                  className="button is-small"
                                  style={{ marginLeft: "0.5rem" }}
                                  onClick={() => handleStartEdit(comment)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="button is-small"
                                  style={{ marginLeft: "0.5rem" }}
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <p style={{ marginTop: "0.35rem" }}>{comment.content}</p>
                      </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label has-text-weight-normal">
                  {editingId ? "Edit comment" : "Add a comment"}
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    rows={3}
                    placeholder="Say something..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    maxLength={2000}
                    required
                  />
                </div>
              </div>

              <div className="field is-grouped is-justify-content-flex-end">
                <div className="control">
                  <button
                    type="submit"
                    className="button is-my-green"
                    disabled={!body.trim()}
                    data-testid={editingId ? "save-edited-comment" : "submit-comment"}
                  >
                    {editingId ? "Save changes" : "Post comment"}
                  </button>
                </div>

                {editingId && (
                  <div className="control">
                    <button
                      type="button"
                      className="button is-light"
                      onClick={() => {
                        setEditingId(null);
                        setBody("");
                      }}
                      data-testid="cancel-edit"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}