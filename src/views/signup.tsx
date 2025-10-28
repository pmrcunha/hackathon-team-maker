export function Signup() {

  return <html>
    <head>
      <title>Sign Up - Hackathon Team Maker</title>
      <link rel="stylesheet" href="/static/styles.css" />
    </head>
    <body>
      <div style="max-width: 400px; margin: 50px auto; padding: 20px;">
        <h1>Sign Up</h1>

        <form id="signup-form">
          <div style="margin-bottom: 15px;">
            <label for="name" style="display: block; margin-bottom: 5px;">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </div>
          <div style="margin-bottom: 15px;">
            <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </div>
          <div style="margin-bottom: 15px;">
            <label for="password" style="display: block; margin-bottom: 5px;">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </div>
          <button type="submit"
            style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >Sign Up</button>
        </form>

        <div id="error" style="color: red; margin-top: 15px;"></div>
        <div style="margin-top: 15px; text-align: center;">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
      <script src="/static/main.js"></script>
      <script src="/static/signup.js"></script>
    </body>
  </html>
}



