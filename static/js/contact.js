document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("contact-status");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const message = form.elements["message"].value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = "请填写所有栏位。";
      statusEl.className = "contact-status error";
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const { error } = await supabaseClient
        .from("contact_messages")
        .insert([{ name, email, message }]);

      if (error) throw error;

      statusEl.textContent = "✅ 消息已发送，谢谢你的留言！我会尽快回复。";
      statusEl.className = "contact-status success";
      form.reset();
    } catch (err) {
      console.error("Error submitting contact form:", err.message);
      statusEl.textContent = "⚠️ 发送失败，请稍后再试，或直接用 WhatsApp / Email 联系我。";
      statusEl.className = "contact-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});
