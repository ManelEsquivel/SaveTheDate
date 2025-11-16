const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setCurrentStep(7);

  const allAnswered = Object.values(answers).every(val => val.trim() !== '');
  if (!allAnswered) {
    alert("Error: Por favor, responde a todas las preguntas antes de enviar.");
    setIsSubmitting(false);
    setCurrentStep(6);
    return;
  }

  // Crear formulario oculto
  const tempForm = document.createElement('form'); 
  tempForm.action = BASE_FORM_URL;
  tempForm.method = 'POST';
  tempForm.target = 'google-iframe-target';
  tempForm.style.display = 'none';

  const data = {
    [entryMap.guestName]: answers.guestName,
    [entryMap.q1]: answers.q1,
    [entryMap.q2]: answers.q2,
    [entryMap.q3]: answers.q3,
    [entryMap.q4]: answers.q4,
    [entryMap.q5]: answers.q5,
    "fvv": "1",
    "fbzx": Date.now().toString(),
    "pageHistory": "0"
  };

  for (const key in data) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = data[key];
    tempForm.appendChild(input);
  }

  // Asegurar iframe
  let iframe = document.querySelector('iframe[name="google-iframe-target"]');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'google-iframe-target';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  document.body.appendChild(tempForm);
  console.log("✅ Enviando datos a Google Forms:", data);

  try {
    tempForm.submit();
    console.log("✅ Formulario enviado");
  } catch (err) {
    console.error("❌ Error al enviar:", err);
  }

  document.body.removeChild(tempForm);

  // Forzar pantalla final aunque falle el envío
  localStorage.setItem(QUIZ_COMPLETED_KEY, 'true');
  setIsCompleted(true);

  setTimeout(() => {
    setIsSubmitting(false);
    setCurrentStep(8);
  }, 2000);
};
