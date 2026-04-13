// Envío Formspree: solicitud de programa (solicitud-tras-pago.html)

function getFormSuccessStatusText() {
    var lang = (typeof localStorage !== 'undefined' && localStorage.getItem('language')) || document.documentElement.lang || 'es';
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang].form_submit_status_success) {
        return translations[lang].form_submit_status_success;
    }
    return 'Solicitud enviada correctamente.';
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('application-form');
    var nextInput = form ? form.querySelector('input[name="_next"]') : null;

    if (nextInput) {
        var baseUrl = window.location.href.split('/').slice(0, -1).join('/') + '/';
        nextInput.value = baseUrl + 'gracias.html';
    }

    var formStatus = document.getElementById('form-status');

    if (window.location.search.indexOf('success=true') !== -1) {
        var successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = '<i class="fas fa-check-circle"></i> ¡Formulario enviado con éxito!';
        document.body.appendChild(successMsg);
        if (window.history && window.history.replaceState) {
            var cleanUrl = window.location.href.replace(/[\?&]success=true/, '');
            window.history.replaceState({}, document.title, cleanUrl);
        }
        setTimeout(function() {
            if (document.contains(successMsg)) {
                successMsg.remove();
            }
        }, 5000);
    }

    if (!form) {
        return;
    }

    var formSubmitEvent = new CustomEvent('formSubmit:success');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var isValidated = form.getAttribute('data-validated') === 'true';

        if (isValidated || !window.formValidationActive) {
            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.style.backgroundColor = 'rgba(255,255,255,0.12)';
                formStatus.style.color = '#fff';
                formStatus.textContent = (document.documentElement.lang === 'en') ? 'Sending…' : 'Enviando formulario…';
            }

            var formData = new FormData(form);

            var submitButton = form.querySelector('button[type="submit"]');
            var originalText = submitButton ? submitButton.innerHTML : '';

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> …';

                setTimeout(function() {
                    if (document.contains(submitButton) && submitButton.disabled) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;
                    }
                }, 10000);
            }

            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    if (data.ok) {
                        document.dispatchEvent(formSubmitEvent);
                        if (formStatus) {
                            formStatus.style.display = 'block';
                            formStatus.style.backgroundColor = 'rgba(40, 167, 69, 0.18)';
                            formStatus.style.color = '#fff';
                            formStatus.style.border = '1px solid rgba(72, 180, 97, 0.55)';
                            formStatus.style.padding = '12px 14px';
                            formStatus.style.borderRadius = '8px';
                            formStatus.textContent = getFormSuccessStatusText();
                        }
                        if (submitButton) {
                            submitButton.disabled = true;
                            submitButton.textContent = (document.documentElement.lang === 'en') ? 'Sent' : 'Enviado';
                        }
                        window.location.href = nextInput ? nextInput.value : 'gracias.html';
                    } else {
                        if (formStatus) {
                            formStatus.style.backgroundColor = '#f8d7da';
                            formStatus.style.color = '#721c24';
                            formStatus.textContent = 'Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.';
                        }
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.innerHTML = originalText || 'Enviar Solicitud';
                        }
                    }
                })
                .catch(function() {
                    if (formStatus) {
                        formStatus.style.backgroundColor = '#f8d7da';
                        formStatus.style.color = '#721c24';
                        formStatus.textContent = 'Error de conexión. Por favor, inténtalo de nuevo.';
                    }
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText || 'Enviar Solicitud';
                    }
                });
        }
    });
});
