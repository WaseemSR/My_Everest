
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;  // connect to back end if needed


function User ({ user}) {
    if (!user) return null;

    return (
        <article>
            <div >
                <h2 className="title is-3 has-text-white has-text-weight-normal">{user.fullName}</h2>
                {/* <p>{user.bio}</p> */}
            </div>
        </article>
)}

export default User;