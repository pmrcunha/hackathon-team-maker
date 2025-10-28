// Sample data
// let topics = [
//   {
//     id: 1,
//     title: "AI-Powered Code Reviewer",
//     description:
//       "Build an intelligent code review assistant that analyzes pull requests, suggests improvements, and detects potential bugs using machine learning. Looking for ML engineers and frontend developers.",
//     members: ["Alice", "Bob", "Charlie"],
//   },
//   {
//     id: 2,
//     title: "Sustainable City Dashboard",
//     description:
//       "Create a real-time dashboard that tracks and visualizes urban sustainability metrics like energy consumption, air quality, and waste management. Need data visualization experts and backend developers.",
//     members: ["Diana", "Eve"],
//   },
//   {
//     id: 3,
//     title: "Decentralized Social Network",
//     description:
//       "Develop a blockchain-based social media platform that gives users complete control over their data and content. Looking for blockchain developers and UX designers.",
//     members: ["Frank"],
//   },
// ];

let currentUserId = "You";
let userCurrentTopic = null; // ID of topic user is currently in

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function renderTopics() {
  const topicsList = document.getElementById("topicsList");

  if (topics.length === 0) {
    topicsList.innerHTML = `
                    <div class="empty-state">
                        <p>No topics yet. Be the first to propose one! 🎯</p>
                    </div>
                `;
    return;
  }

//   topicsList.innerHTML = topics
//     .map((topic) => {
//       const isJoined = userCurrentTopic === topic.id;
//       const isMember = topic.members.includes(currentUserId);
//
//       return `
//                     <div class="topic-card ${isJoined ? "joined" : ""}">
//                         <div class="topic-header">
//                             <h3 class="topic-title">${topic.title}</h3>
//                             ${isJoined ? '<span class="joined-badge">✓ Joined</span>' : ""}
//                         </div>
//                         <p class="topic-description">${topic.description}</p>
//                         <div class="topic-footer">
//                             <div class="team-members">
//                                 <span class="member-count">👥 ${topic.members.length} member${topic.members.length !== 1 ? "s" : ""}</span>
//                                 <div class="members-list">
//                                     ${topic.members
//                                       .slice(0, 5)
//                                       .map(
//                                         (member) =>
//                                           `<div class="member-avatar" title="${member}">${getInitials(member)}</div>`,
//                                       )
//                                       .join("")}
//                                     ${topic.members.length > 5 ? `<div class="member-avatar" title="More members">+${topic.members.length - 5}</div>` : ""}
//                                 </div>
//                             </div>
//                             <button class="join-btn ${isJoined ? "leave" : ""}" onclick="toggleJoin(${topic.id})">
//                                 ${isJoined ? "Leave Topic" : "Join Topic"}
//                             </button>
//                         </div>
//                     </div>
//                 `;
//     })
//     .join("");
// }

function toggleJoin(topicId) {
  const topic = topics.find((t) => t.id === topicId);

  if (userCurrentTopic === topicId) {
    // Leave current topic
    topic.members = topic.members.filter((m) => m !== currentUserId);
    userCurrentTopic = null;
  } else {
    // Leave previous topic if any
    if (userCurrentTopic !== null) {
      const previousTopic = topics.find((t) => t.id === userCurrentTopic);
      if (previousTopic) {
        previousTopic.members = previousTopic.members.filter(
          (m) => m !== currentUserId,
        );
      }
    }

    // Join new topic
    if (!topic.members.includes(currentUserId)) {
      topic.members.push(currentUserId);
    }
    userCurrentTopic = topicId;
  }

  renderTopics();
}

document.getElementById("proposeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("topicTitle").value.trim();
  const description = document.getElementById("topicDescription").value.trim();

  if (title && description) {
    const newTopic = {
      id: topics.length > 0 ? Math.max(...topics.map((t) => t.id)) + 1 : 1,
      title: title,
      description: description,
      members: [currentUserId],
    };

    // If user is in another topic, remove them
    if (userCurrentTopic !== null) {
      const previousTopic = topics.find((t) => t.id === userCurrentTopic);
      if (previousTopic) {
        previousTopic.members = previousTopic.members.filter(
          (m) => m !== currentUserId,
        );
      }
    }

    topics.unshift(newTopic);
    userCurrentTopic = newTopic.id;

    // Clear form
    document.getElementById("topicTitle").value = "";
    document.getElementById("topicDescription").value = "";

    renderTopics();
  }
});

// Initial render
renderTopics();
