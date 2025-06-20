// Elite Futbol - Validaciones del formulario
document.addEventListener('DOMContentLoaded', function() {
    // Indicar que nuestro sistema de validación está activo
    window.formValidationActive = true;
    
    const applicationForm = document.getElementById('application-form');
    if (!applicationForm) return;

    // Reglas de validación por campo
    const validationRules = {
        name: {
            validate: value => value.trim().length >= 3 && /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(value),
            message: 'Por favor, introduce un nombre válido (mínimo 3 caracteres, sin números ni caracteres especiales)'
        },
        dob: {
            validate: value => {
                if (!value) return false;
                const today = new Date();
                const birthDate = new Date(value);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age >= 14 && age <= 23;
            },
            message: 'La edad debe estar entre 14 y 23 años'
        },
        email: {
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Por favor, introduce una dirección de email válida'
        },
        phone: {
            validate: value => /^[+\d\s()\-.]{7,20}$/.test(value.trim()),
            message: 'Por favor, introduce un número de teléfono válido (mínimo 7 dígitos)'
        },
        nationality: {
            validate: value => value.trim().length >= 2,
            message: 'Por favor, introduce tu nacionalidad'
        },
        position: {
            validate: value => value !== '',
            message: 'Por favor, selecciona tu posición de juego'
        },
        program: {
            validate: value => value !== '',
            message: 'Por favor, selecciona un programa'
        },
        'start-date': {
            validate: value => {
                if (!value) return false;
                const today = new Date();
                const selectedDate = new Date(value);
                return selectedDate >= today;
            },
            message: 'La fecha de inicio debe ser igual o posterior a la fecha actual'
        },
        experience: {
            validate: value => value.trim().length >= 10,
            message: 'Por favor, describe tu experiencia futbolística (mínimo 10 caracteres)'
        },
        video: {
            validate: value => {
                // Si está vacío, es válido (campo opcional)
                if (!value.trim()) return true;
                // Si tiene valor, debe ser una URL válida de YouTube o Vimeo
                return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/.+/.test(value);
            },
            message: 'Por favor, introduce una URL válida de YouTube o Vimeo'
        },
        message: {
            // Campo opcional, siempre válido
            validate: () => true,
            message: ''
        }
    };

    // Función para validar un campo
    function validateField(field) {
        const fieldName = field.id;
        const rule = validationRules[fieldName];
        
        if (!rule) return true; // Si no hay regla para este campo, se considera válido
        
        const isValid = rule.validate(field.value);
        
        if (!isValid) {
            field.classList.add('error');
            
            // Añadir mensaje de error si no existe
            let errorMsg = field.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                field.parentElement.appendChild(errorMsg);
            }
            
            errorMsg.textContent = rule.message;
        } else {
            field.classList.remove('error');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
        
        return isValid;
    }

    // Validar campos a medida que el usuario los completa
    const formFields = applicationForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            // Solo validar campos requeridos o campos con valor
            if (this.hasAttribute('required') || this.value.trim()) {
                validateField(this);
            }
        });
        
        field.addEventListener('input', function() {
            // Quitar el estilo de error mientras el usuario escribe
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    // Validación completa del formulario antes de enviar
    applicationForm.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Validar todos los campos requeridos
        const requiredFields = this.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validar campos opcionales que tienen valor
        const optionalFilledFields = Array.from(this.querySelectorAll('input:not([required]), textarea:not([required])'))
            .filter(field => field.value.trim() !== '');
            
        optionalFilledFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault(); // Prevenir envío si hay errores
            
            // Scroll al primer error
            const firstError = this.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            
            return false;
        }
        
        // Marcar el formulario como validado
        this.setAttribute('data-validated', 'true');
        
        // No prevenir el envío del formulario aquí, para permitir que form-handler.js lo procese
    });

    // Traducciones para los mensajes de error según el idioma actual
    function updateValidationMessages() {
        const currentLang = document.documentElement.lang || 'es';
        
        if (currentLang === 'en') {
            validationRules.name.message = 'Please enter a valid name (minimum 3 characters, no numbers or special characters)';
            validationRules.dob.message = 'Age must be between 14 and 23 years';
            validationRules.email.message = 'Please enter a valid email address';
            validationRules.phone.message = 'Please enter a valid phone number (minimum 7 digits)';
            validationRules.nationality.message = 'Please enter your nationality';
            validationRules.position.message = 'Please select your playing position';
            validationRules.program.message = 'Please select a program';
            validationRules['start-date'].message = 'Start date must be on or after today';
            validationRules.experience.message = 'Please describe your soccer experience (minimum 10 characters)';
            validationRules.video.message = 'Please enter a valid YouTube or Vimeo URL';
        } else {
            validationRules.name.message = 'Por favor, introduce un nombre válido (mínimo 3 caracteres, sin números ni caracteres especiales)';
            validationRules.dob.message = 'La edad debe estar entre 14 y 23 años';
            validationRules.email.message = 'Por favor, introduce una dirección de email válida';
            validationRules.phone.message = 'Por favor, introduce un número de teléfono válido (mínimo 7 dígitos)';
            validationRules.nationality.message = 'Por favor, introduce tu nacionalidad';
            validationRules.position.message = 'Por favor, selecciona tu posición de juego';
            validationRules.program.message = 'Por favor, selecciona un programa';
            validationRules['start-date'].message = 'La fecha de inicio debe ser igual o posterior a la fecha actual';
            validationRules.experience.message = 'Por favor, describe tu experiencia futbolística (mínimo 10 caracteres)';
            validationRules.video.message = 'Por favor, introduce una URL válida de YouTube o Vimeo';
        }
    }

    // Actualizar mensajes al cargar y cuando se cambia el idioma
    updateValidationMessages();
    document.addEventListener('languageChanged', updateValidationMessages);
}); 