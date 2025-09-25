

function Username({ user}) {
  if (!user) return null;



  return (
    <article>
        <div>
            {user.username}
        </div>
    </article>
)
}

export default Username