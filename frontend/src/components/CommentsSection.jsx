import { useEffect, useState } from "react";
import { getComments, createComment } from "../services/comments";

export default function CommentsSection({ everestId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Time-ago formatter
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

  // Fetch comments whenever the target Everest changes
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

  async function handleSubmit(e) {
    e.preventDefault();
    const message = body.trim();
    if (!message) return;

    try {
      setError("");
      const res = await createComment(token, everestId, message);
      if (res?.token) localStorage.setItem("token", res.token);
      if (res?.comment) setComments((prev) => [res.comment, ...prev]);

      setBody("");
    } catch (e) {
      setError(e.message || "Failed to post comment");
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="box">
          <p className="title is-5">Comments</p>

          {error && <div className="notification is-danger">{error}</div>}

          {loading ? (
            <p>Loading comments…</p>
          ) : (
            <>
              <div
                className="mb-4"
                style={{ maxHeight: "320px", overflowY: "auto" }}
              >
                {comments.length === 0 ? (
                  <p className="has-text-grey">No comments yet.</p>
                ) : (
                  comments.map((comment) => (
                    <article className="media" key={comment._id}>
                      <div className="media-content">
                        <div className="content">
                          <p>
                            <strong>{comment.author.fullName ||comment.author.email}</strong>
                            {comment.createdAt && (
                              <small className="has-text-grey">
                                · {formatTimeAgo(comment.createdAt)}
                              </small>
                            )}
                            <br />
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label">Add a comment</label>
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
                      className="button is-primary"
                      disabled={!body.trim()}
                    >
                      Post comment
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}