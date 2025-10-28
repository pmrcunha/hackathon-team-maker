export function Login() {

  return <html>
    <head>
      <title>Login - Hackathon Team Maker</title>
      <link rel="stylesheet" href="/static/styles.css" />
    </head>
    <body>
      <div style="max-width: 400px; margin: 50px auto; padding: 20px;">
        <h1>Login</h1>

        <form id="signin-form">
          <div style="margin-bottom: 15px;">
            <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
            <input type="email" id="signin-email" placeholder="Email"
              required
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
            />
          </div>
          <div style="margin-bottom: 15px;">
            <label for="password" style="display: block; margin-bottom: 5px;">Password:</label>
            <input type="password" id="signin-password" placeholder="Password" />
          </div>
          <button type="submit"
            style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >Sign In</button>
        </form>

        <div id="error" style="color: red; margin-top: 15px;"></div>
        <div style="margin-top: 15px; text-align: center;">
          <a href="/signup">Don't have an account? Sign up</a>
        </div>
      </div>
      <script src="/static/main.js"></script>
      <script src="/static/login.js"></script>
    </body>
  </html>
}



