import type { Topic } from "../db/schema.js";

type TopicsListProps = {
  topics: Topic[];
  currentUser: string
}

export function TopicsList({ topics }: TopicsListProps) {

  return <div id="topicsList">
    {topics.length === 0 ? <div class="empty-state">
      <p>No topics yet. Be the first to propose one! 🎯</p>
    </div> : topics.map(topic => {

      const userCurrentTopic = '';
      {/* const currentUserId = currentUser */ }
      const members: any[] = topic.currentMembers || [];

      const isJoined = userCurrentTopic === topic.id;
      {/* const isMember = members.includes(currentUserId); */ }

      return <div class={`topic-card ${isJoined ? "joined" : ""}`}>
        <div class="topic-header">
          <h3 class="topic-title">{topic.title}</h3>
          {isJoined ? '<span class="joined-badge">✓ Joined</span>' : ""}
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
                    `<div class="member-avatar" title="${member}">${getInitials(member)}</div>`,
                )
                .join("")}
              {members.length > 5 ? `<div class="member-avatar" title="More members">+${members.length - 5}</div>` : ""}
            </div>
          </div>
          <button class={`join-btn ${isJoined ? "leave" : ""}`} onclick="toggleJoin(${topic.id})">
            {isJoined ? "Leave Topic" : "Join Topic"}
          </button>
        </div>
      </div>
    })
    }
  </div>
}


function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
