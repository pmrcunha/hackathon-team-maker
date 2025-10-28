document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("calling signup");
  const response = await fetch("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      name: document.getElementById("name").value,
    }),
  });
  console.log(response);
  const data = await response.json();
  if (response.ok) {
    console.log("Signed up:", data);
    window.location.href = "/";
  }
});
