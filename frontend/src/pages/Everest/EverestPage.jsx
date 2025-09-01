import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOneEverest } from "../../services/everests";
import Everest from "../../components/Everest";

export function EverestPage() {
  const { id } = useParams(); // 👈 grab /everests/:id from the URL
  const [everest, setEverest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const out = await getOneEverest(id, token); // pass id + token
        setEverest(out.everest); // backend returns { everest, token }
        localStorage.setItem("token", out.token); // refresh token
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong with getting the Everest");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>{error}</div>;
  if (!everest) return <div>No Everest found</div>;

  return (
    <div className="everest-container">
      <Everest everest={everest} />
    </div>
  );
}