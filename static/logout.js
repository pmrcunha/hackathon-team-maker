async function logout() {
  console.log("logout");
  const response = await fetch("/api/auth/sign-out", {
    method: "POST",
  });
  if (response.ok) {
    window.location.href = "/login";
  }
}
