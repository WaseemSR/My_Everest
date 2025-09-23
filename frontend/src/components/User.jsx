
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // connect to back end if needed


function User ({ user}) {
    if (!user) return null;

    return (
        <article>
            <div >
                <h2>{user.fullName}</h2>
                {/* <p>{user.bio}</p> */}
            </div>
        </article>
)}

export default User;