
export async function submitForm(data) {
  console.log(data);
  // Pretend to call your backend
  await new Promise(r => setTimeout(r, 1000));
  // 1 out of 6 times fail (to test error UI)
  if (Math.random() < 1/6) {
    const err = new Error("Server is busy. Please try again.");
    err.status = 503;
    throw err;
  }
  return { id: String(Date.now()), receivedAt: new Date().toISOString() };
}
