
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // connect to back end if needed


function User ({ user}) {
    if (!user) return null;

    return (
        <article>
            <div>
                <p>{user.fullName}</p>
                <p>{user.bio}</p>
            </div>
        </article>
)}

export default User;