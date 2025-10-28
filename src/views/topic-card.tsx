
type TopicCardProps = {
  topic: any;
  members: any[];
  currentUser: string
}

export function TopicCard({ topic, members, currentUser }: TopicCardProps) {

  const isJoined = members.some(member => member.id === currentUser)

return <div id={`topic-${topic.id}`} class={`topic-card ${isJoined ? "joined" : ""}`}>
        <div class="topic-header">
          <h3 class="topic-title">{topic.title}</h3>
          {isJoined ? <span class="joined-badge">✓ Joined</span> : null}
        </div>
        <p class="topic-description">{topic.description}</p>
        <div class="topic-footer">
          <div class="team-members">
            <span class="member-count">👥 {members.length} member{members.length !== 1 ? "s" : ""}</span>
            <div class="members-list">
              {members
                .slice(0, 5)
                .map(
                  (member) =>
                    <div class="member-avatar" title={member.name}>{getInitials(member.name)}</div>
                )}
              {members.length > 5 ? <div class="member-avatar" title="More members">+{members.length - 5}</div> : null}
            </div>
          </div>
            {isJoined ? 
          <button data-on:click={`@post('/topics/${topic.id}/leave')`} class="join-btn leave">
            Leave Topic
          </button> : 
          <button data-signals:userId={`'${currentUser}'`} data-on:click={`@post('/topics/${topic.id}/join')`} class="join-btn">
            Join Topic
          </button>
            }
        </div>
      </div>
}


function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
