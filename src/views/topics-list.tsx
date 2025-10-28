import type { Topic } from "../db/schema.js";
import { TopicCard } from "./topic-card.js";

type TopicsListProps = {
  topics: Topic[];
  currentUser: string
}

export function TopicsList({ topics, currentUser }: TopicsListProps) {

  return <div id="topicsList">
    {topics.length === 0 ? <div class="empty-state">
      <p>No topics yet. Be the first to propose one! 🎯</p>
    </div> : topics.map(topic => {
      const members: any[] = topic.members || [];
      return <TopicCard currentUser={currentUser} topic={topic} members={members} />
    })
    }
  </div>
}

