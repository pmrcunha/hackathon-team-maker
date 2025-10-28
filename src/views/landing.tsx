import type { Topic } from '../db/schema.js';
import { TopicsList } from './topics-list.js'

type LandingProps = {
  topics: Topic[];
  currentUser: any
}

export function Landing({topics, currentUser}: LandingProps) {
  console.log(currentUser)
  return <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hackathon Topic Proposals</title>
      <link rel="stylesheet" href="/static/styles.css" />
      <script type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js"></script>
    </head>

    <body data-signals:current-user={`'${currentUser.id}'`}>
      <div class="container">
        <header>
          <h1>🚀 Hackathon Topics</h1>
          <p class="subtitle">Propose your ideas and form your team</p>
          <div onclick="logout()" class="current-user">
            Logged in as: <strong>{currentUser.name}</strong>
          </div>
        </header>

        <div class="propose-section">
          <h2>✨ Propose a New Topic</h2>
          <form id="proposeForm">
            <div class="form-group">
              <label for="topicTitle">Topic Title *</label>
              <input type="text" id="topicTitle" name="title" placeholder="e.g., AI-Powered Climate Monitor" required />
            </div>
            <div class="form-group">
              <label for="topicDescription">Description *</label>
              <textarea id="topicDescription"
                name="description"
                placeholder="Describe your topic idea, what you want to build, and what skills would be helpful..."
                required></textarea>
            </div>
            <button type="submit" data-on:click="@post('/topics', {contentType: 'form'})">Propose Topic</button>
          </form>
        </div>

        <div class="topics-section">
          <h2>📋 Available Topics</h2>
          <TopicsList currentUser={currentUser.id} topics={topics} />
        </div>
      </div>

      <script src="/static/main.js"></script>
      <script src="/static/logout.js"></script>
    </body>

  </html>
}


