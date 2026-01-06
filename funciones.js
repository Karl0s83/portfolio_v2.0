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
    // 0. Ensure explicit lowercase consistency
    lang = lang.toLowerCase();

    // 1. Update visual active state
    document.querySelectorAll('.lang-app').forEach(btn => btn.classList.remove('active'));
    
    // Explicitly find the button
    const btnId = `btn-${lang}`;
    const activeBtn = document.getElementById(btnId);
    
    if(activeBtn) {
        activeBtn.classList.add('active');
    }

    // 2. Fetch translations
    const response = await fetch(`Languages/${lang}.json`);
    if (!response.ok) throw new Error("Translation file not found");
    
    const translations = await response.json();

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.getAttribute("data-i18n");
      // 3. Text Content
      if (translations[key]) {
         if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
             element.placeholder = translations[key];
         } else {
             element.innerHTML = translations[key];
         }
      }
    });

    // Save preference
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;

  } catch (error) {
    console.error("Error loading language:", error);
  }
}
