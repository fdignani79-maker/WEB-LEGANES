// Función para cambiar el idioma del sitio web
function setLanguage(lang) {
    // Guardar preferencia de idioma en localStorage
    localStorage.setItem('language', lang);
    
    // Actualizar idioma del documento HTML
    document.documentElement.lang = lang;
    
    // Actualizar clases activas en selectores de idioma existentes
    document.querySelectorAll('.language-option').forEach(link => {
        if (link.getAttribute('data-lang') === lang) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Aplicar traducciones
    updatePageTexts(lang);
}

// Función para aplicar traducciones utilizando el objeto translations existente
function updatePageTexts(lang) {
    // Verificar que el idioma solicitado existe
    if (!translations[lang]) {
        console.error(`No se encontraron traducciones para el idioma: ${lang}`);
        return;
    }
    
    // Actualizar el título de la página
    if (translations[lang].page_title) {
        document.title = translations[lang].page_title;
    }
    
    // Aplicar traducciones a todos los elementos con atributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[lang][key]) {
            // Si el elemento es un input o textarea, actualizar el placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } 
            // Si es un elemento option, actualizar el text
            else if (element.tagName === 'OPTION') {
                element.text = translations[lang][key];
            }
            // Si el elemento es un botón, actualizar el text
            else if (element.tagName === 'BUTTON') {
                element.textContent = translations[lang][key];
            }
            // Para cualquier otro elemento, actualizar el contenido HTML
            else {
                // Si el valor contiene HTML (como <br>, <strong>), usar innerHTML
                if (translations[lang][key].includes('<') && translations[lang][key].includes('>')) {
                    element.innerHTML = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        } else {
            console.warn(`No se encontró traducción para la clave: ${key} en idioma: ${lang}`);
        }
    });
}

// Inicializar los eventos del selector de idiomas
function initializeLanguage() {
    // Agregar eventos a los selectores de idioma existentes
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const language = this.getAttribute('data-lang');
            setLanguage(language);
        });
    });
    
    // Aplicar idioma guardado o predeterminado
    const savedLang = localStorage.getItem('language') || 'es';
    setLanguage(savedLang);
}

// Inicializar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializeLanguage); 