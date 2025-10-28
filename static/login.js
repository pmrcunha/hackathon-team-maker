document.getElementById("signin-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("login");
  const response = await fetch("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("signin-email").value,
      password: document.getElementById("signin-password").value,
    }),
  });
  console.log(response);
  if (response.ok) {
    window.location.href = "/";
  }
});
