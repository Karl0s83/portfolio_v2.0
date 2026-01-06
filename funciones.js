// Portfolio v2.0 Functions

document.addEventListener("DOMContentLoaded", () => {
    // 1. Language System
    const savedLang = localStorage.getItem('preferredLanguage') || 'es';
    setLanguage(savedLang);

// 2. Tab System (CSS Class Based)
    window.switchTab = function(tabId) {
       // Buttons
       document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
       document.querySelector(`.tab[aria-controls="${tabId}"]`).classList.add('active');

       // Panels - Use CSS classes for transition
       document.querySelectorAll('.panel').forEach(p => p.classList.remove('active-panel'));
       const target = document.getElementById(tabId);
       if(target) target.classList.add('active-panel');
    }
    
    // Attach click listeners
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            const controls = tab.getAttribute("aria-controls");
            window.switchTab(controls);
        });
    });
});

// Language Function
async function setLanguage(lang) {
  try {
    lang = lang.toLowerCase();
    document.querySelectorAll('.lang-app').forEach(btn => btn.classList.remove('active'));
    
    const btnId = `btn-${lang}`;
    const activeBtn = document.getElementById(btnId);
    
    if(activeBtn) {
        activeBtn.classList.add('active');
    }

    const response = await fetch(`Languages/${lang}.json`);
    if (!response.ok) throw new Error("Translation file not found");
    
    const translations = await response.json();

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      if (translations[key]) {
         if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
             element.placeholder = translations[key];
         } else {
             element.innerHTML = translations[key];
         }
      }
    });
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;

    // Update WhatsApp Message
    if(typeof whatsappLogic !== 'undefined') {
        whatsappLogic.updateLang(lang);
    }

  } catch (error) {
    console.error("Error loading language:", error);
    alert("Error loading language. Check console.");
  }
}

// WhatsApp Function
const whatsappLogic = {
    phoneNumber: "34600000000", // Replace with actual number
    linkElement: null,
    currentLang: 'es',
    messages: {
        'es': "Hola Carlos, he visto tu portfolio y me gustaría contactar contigo 🙂",
        'en': "Hi Carlos, I saw your portfolio and I'd like to get in touch 🙂",
        'ca': "Hola Carlos, he vist el teu portafoli i m'agradaria contactar amb tu 🙂"
    },
    
    init: function() {
        this.linkElement = document.getElementById("whatsapp-link");
        if(!this.linkElement) return;

        this.linkElement.addEventListener("click", (e) => {
            e.preventDefault();
            this.open();
        });

        this.linkElement.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const url = this.getURL();
            navigator.clipboard.writeText(url).then(() => {
                alert("WhatsApp link copied!");
            });
        });
    },

    updateLang: function(lang) {
        this.currentLang = lang;
    },

    getURL: function() {
        // Fallback to ES if message missing
        const msg = this.messages[this.currentLang] || this.messages['es'];
        return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(msg)}`;
    },

    open: function() {
        window.open(this.getURL(), "_blank");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    whatsappLogic.init();

    // Footer Year
    const yearSpan = document.getElementById("year");
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
