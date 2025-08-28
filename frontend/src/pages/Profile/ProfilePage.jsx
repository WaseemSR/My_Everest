import { useEffect, useState } from 'react'
import { getUserEverests } from "../../services/everests";
import Everest from "../../components/Everest"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function ProfilePage() {

  const [user, setUser] = useState({ _id: "", fullName: "", bio: "" });
  const [everests, setEverests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        // Allow either { user: {...} } or direct user doc
        const user = data.user ?? data;
        setUser(user);

        if (user?._id) {
          const everestsData = await getUserEverests(user._id, token);
          // Allow either { everests: [...] } or direct array
          setEverests(everestsData);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong with getting user everests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>{user.fullName}</h1>
      {user.bio && <p>{user.bio}</p>}

      <h2>Everests</h2>
      {everests.length === 0 ? (
        <p>No Everests yet</p>
      ) : (
        <ul>
          <Everest />
        </ul>
      )}
    </div>
  )
}