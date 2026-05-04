const prototypeOtp = "123456";

let selectedCountry = {
      code: "+63",
      countryCode: "ph",
      name: "Philippines"
    };

// Validate OTP function for validate-otp.html
function validateOtp() {
    const hardcodedOTP = "123456";
    
    const inputs = document.querySelectorAll(".otp");
    let otp = "";
    
    inputs.forEach(input => otp += input.value);
    
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const message = document.getElementById("message");
    
    if (otp === hardcodedOTP) {
        // OTP matches - proceed with validation
        errorMessage.style.display = "none";
        successMessage.textContent = "✓ OTP verified successfully! Redirecting...";
        successMessage.style.color = "#22c55e";
        successMessage.style.display = "block";
        
        // Disable all OTP inputs to prevent interference
        document.querySelectorAll('.otp').forEach(input => {
            input.disabled = true;
            input.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
            input.style.cursor = "not-allowed";
        });
        
        // Store verification
        localStorage.setItem("verified_user", localStorage.getItem("otp_target"));
        
        // Redirect to mailbox after a delay
        setTimeout(() => {
            window.location.href = "mailbox-clean.html";
        }, 3000);
    } else {
        // OTP doesn't match - show error
        errorMessage.textContent = "Invalid OTP. Please use the hardcoded code: 123456";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        
        // Clear all OTP inputs
        inputs.forEach(input => {
            input.value = "";
            input.style.borderColor = "";
            input.style.boxShadow = "";
        });
        
        // Focus first input
        document.getElementById("otp1").focus();
        
        // Shake the card for error feedback
        const card = document.querySelector(".card");
        card.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
            card.style.animation = "";
        }, 500);
    }
}

// Clear error states function for validate-otp.html
function clearErrorStates() {
    // Clear error messages only (not success message)
    const errorMessage = document.getElementById("error-message");
    const message = document.getElementById("message");
    
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
    if (message) {
        message.textContent = "";
    }
    
    // Clear error borders from all OTP inputs
    document.querySelectorAll('.otp').forEach(otpInput => {
        otpInput.style.borderColor = "";
        otpInput.style.boxShadow = "";
    });
    
    // Reset card animation if it was shaking
    const card = document.querySelector(".card");
    if (card) {
        card.style.animation = "";
    }
}

// Initialize OTP validation for validate-otp.html
document.addEventListener("DOMContentLoaded", () => {
    // Only run if we're on validate-otp.html
    if (window.location.pathname.includes("validate-otp.html")) {
        const hardcodedOTP = "123456";
        
        // Real-time validation for OTP inputs
        document.querySelectorAll('.otp').forEach((input, index) => {
            input.addEventListener('input', function() {
                const value = this.value;
                const successMessage = document.getElementById("success-message");
                const errorMessage = document.getElementById("error-message");
                
                // Clear error states when user starts typing
                clearErrorStates();
                
                // Get current OTP value
                let currentOTP = "";
                document.querySelectorAll('.otp').forEach(otpInput => {
                    currentOTP += otpInput.value;
                });
                
                // Only clear error states on input, don't show success validation
                if (currentOTP.length > 0) {
                    // Remove green border if OTP is incomplete
                    document.querySelectorAll('.otp').forEach(otpInput => {
                        if (otpInput.value === "") {
                            otpInput.style.borderColor = "";
                            otpInput.style.boxShadow = "";
                        }
                    });
                } else {
                    // Reset all borders
                    document.querySelectorAll('.otp').forEach(otpInput => {
                        otpInput.style.borderColor = "";
                        otpInput.style.boxShadow = "";
                    });
                }
                
                // Auto-focus next input
                if (value.length === 1 && index < 5) {
                    document.getElementById(`otp${index + 2}`).focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace') {
                    // Clear error states when user presses backspace
                    clearErrorStates();
                    
                    if (this.value === '' && index > 0) {
                        document.getElementById(`otp${index}`).focus();
                    }
                }
            });
        });
        
        // Display OTP target
        const target = document.getElementById("otpTarget");
        if (target) {
            target.textContent = localStorage.getItem("otp_target") || "Not specified";
        }
    }
});



// Email OTP functions for otp-email.html
function validateEmailFormat(email) {
    // Comprehensive email validation regex
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Additional validation checks
    if (!emailPattern.test(email)) {
        return false;
    }
    
    // Check for consecutive dots
    if (email.includes('..')) {
        return false;
    }
    
    // Check for dot at beginning or end of local part
    const [localPart, domain] = email.split('@');
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return false;
    }
    
    // Check for consecutive dots in domain
    if (domain.includes('..')) {
        return false;
    }

    // Check for common misspelled TLDs
    const domainLower = domain.toLowerCase();
    const invalidTlds = ['.cot', '.con', '.cm', '.om', '.coom', '.comm'];
    if (invalidTlds.some(tld => domainLower.endsWith(tld))) {
        return false;
    }
    
    // Check domain format (at least one dot, no consecutive dots)
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
        return false;
    }
    
    // Check TLD (top-level domain) is at least 2 characters
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2) {
        return false;
    }
    
    return true;
}

function sendEmailOtp() {
    const email = document.getElementById("email").value;
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    
    // Validate email format
    if (validateEmailFormat(email)) {
        // Email format is valid - proceed with OTP
        errorMessage.style.display = "none";
        successMessage.textContent = "✓ OTP sent successfully! Redirecting...";
        successMessage.style.color = "#22c55e";
        successMessage.style.display = "block";
        
        // Store email
        localStorage.setItem("otp_target", email);
        localStorage.setItem("otp_method", "email");
        
        // Redirect to OTP validation after processing delay
        setTimeout(() => {
            window.location.href = "validate-otp.html";
        }, 1500);
    } else {
        // Email format is invalid - show error
        errorMessage.textContent = "Invalid email format. Please use a valid email like user@domain.com";
        errorMessage.style.display = "block";
        successMessage.style.display = "none";
        
        // Shake the card for error feedback
        const card = document.querySelector(".card");
        if (card) {
            card.style.animation = "shake 0.5s ease-in-out";
            setTimeout(() => {
                card.style.animation = "";
            }, 500);
        }
    }
}

// Initialize email OTP validation
document.addEventListener("DOMContentLoaded", () => {
    // Only run if we're on otp-email.html
    if (window.location.pathname.includes("otp-email.html")) {
        // Real-time validation for email
        const emailInput = document.getElementById("email");
        if (emailInput) {
            emailInput.addEventListener("input", function() {
                const email = this.value;
                const successMessage = document.getElementById("success-message");
                const errorMessage = document.getElementById("error-message");
                
                if (email.length > 0) {
                    if (validateEmailFormat(email)) {
                        successMessage.textContent = "";
                        successMessage.style.display = "block";
                        successMessage.style.color = "#22c55e";
                        this.style.borderColor = "#22c55e";
                        this.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.2)";
                        errorMessage.style.display = "none";
                    } else {
                        successMessage.style.display = "none";
                        errorMessage.textContent = "Invalid email format. Use: user@domain.com";
                        errorMessage.style.display = "block";
                        errorMessage.style.color = "#f59e0b";
                        this.style.borderColor = "#f59e0b";
                        this.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.2)";
                    }
                } else {
                    successMessage.style.display = "none";
                    errorMessage.style.display = "none";
                    this.style.borderColor = "";
                    this.style.boxShadow = "";
                }
            });
        }
    }
});

  // Phone OTP Page Functions

    function el(id) {
      return document.getElementById(id);
    }

    // Extended country data
    const countries = [
      { code: "+1", countryCode: "ca", name: "Canada" },
      { code: "+1", countryCode: "us", name: "United States" },
      { code: "+52", countryCode: "mx", name: "Mexico" },
      { code: "+55", countryCode: "br", name: "Brazil" },
      { code: "+44", countryCode: "gb", name: "United Kingdom" },
      { code: "+33", countryCode: "fr", name: "France" },
      { code: "+49", countryCode: "de", name: "Germany" },
      { code: "+39", countryCode: "it", name: "Italy" },
      { code: "+34", countryCode: "es", name: "Spain" },
      { code: "+31", countryCode: "nl", name: "Netherlands" },
      { code: "+41", countryCode: "ch", name: "Switzerland" },
      { code: "+43", countryCode: "at", name: "Austria" },
      { code: "+46", countryCode: "se", name: "Sweden" },
      { code: "+47", countryCode: "no", name: "Norway" },
      { code: "+45", countryCode: "dk", name: "Denmark" },
      { code: "+358", countryCode: "fi", name: "Finland" },
      { code: "+351", countryCode: "pt", name: "Portugal" },
      { code: "+32", countryCode: "be", name: "Belgium" },
      { code: "+48", countryCode: "pl", name: "Poland" },
      { code: "+420", countryCode: "cz", name: "Czech Republic" },
      { code: "+36", countryCode: "hu", name: "Hungary" },
      { code: "+30", countryCode: "gr", name: "Greece" },
      { code: "+90", countryCode: "tr", name: "Turkey" },
      { code: "+7", countryCode: "ru", name: "Russia" },
      { code: "+380", countryCode: "ua", name: "Ukraine" },
      { code: "+81", countryCode: "jp", name: "Japan" },
      { code: "+82", countryCode: "kr", name: "South Korea" },
      { code: "+86", countryCode: "cn", name: "China" },
      { code: "+852", countryCode: "hk", name: "Hong Kong" },
      { code: "+886", countryCode: "tw", name: "Taiwan" },
      { code: "+65", countryCode: "sg", name: "Singapore" },
      { code: "+60", countryCode: "my", name: "Malaysia" },
      { code: "+66", countryCode: "th", name: "Thailand" },
      { code: "+62", countryCode: "id", name: "Indonesia" },
      { code: "+63", countryCode: "ph", name: "Philippines" },
      { code: "+91", countryCode: "in", name: "India" },
      { code: "+92", countryCode: "pk", name: "Pakistan" },
      { code: "+880", countryCode: "bd", name: "Bangladesh" },
      { code: "+94", countryCode: "lk", name: "Sri Lanka" },
      { code: "+61", countryCode: "au", name: "Australia" },
      { code: "+64", countryCode: "nz", name: "New Zealand" },
      { code: "+27", countryCode: "za", name: "South Africa" },
      { code: "+20", countryCode: "eg", name: "Egypt" },
      { code: "+966", countryCode: "sa", name: "Saudi Arabia" },
      { code: "+971", countryCode: "ae", name: "United Arab Emirates" },
      { code: "+972", countryCode: "il", name: "Israel" },
      { code: "+213", countryCode: "dz", name: "Algeria" },
      { code: "+212", countryCode: "ma", name: "Morocco" },
      { code: "+234", countryCode: "ng", name: "Nigeria" },
      { code: "+254", countryCode: "ke", name: "Kenya" },
      { code: "+256", countryCode: "ug", name: "Uganda" },
      { code: "+233", countryCode: "gh", name: "Ghana" },
      { code: "+54", countryCode: "ar", name: "Argentina" },
      { code: "+56", countryCode: "cl", name: "Chile" },
      { code: "+57", countryCode: "co", name: "Colombia" },
      { code: "+58", countryCode: "ve", name: "Venezuela" },
      { code: "+51", countryCode: "pe", name: "Peru" },
      { code: "+593", countryCode: "ec", name: "Ecuador" },
      { code: "+598", countryCode: "uy", name: "Uruguay" },
      { code: "+595", countryCode: "py", name: "Paraguay" },
      { code: "+591", countryCode: "bo", name: "Bolivia" }
    ];

    // Initialize phone input when DOM is ready
    document.addEventListener("DOMContentLoaded", () => {
      const phoneInput = el("phone");

      // Initialize country selector and list
      updateCountrySelector();
      populateCountryList();

      if (phoneInput) {
        phoneInput.addEventListener("input", validatePhoneInput);
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      const dropdown = el("country-dropdown");
      const wrapper = document.querySelector(".phone-input-wrapper");

      if (!dropdown || !wrapper) return;

      if (!wrapper.contains(event.target)) {
        dropdown.style.display = "none";
        const arrow = document.getElementById("dropdown-arrow");
        if (arrow) arrow.classList.remove("open");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCountryDropdown();
      }
    });

         function updateCountrySelector() {
      const flagElement = document.getElementById("country-flag");
      flagElement.style.backgroundImage = `url(https://flagcdn.com/w40/${selectedCountry.countryCode}.png)`;
      document.getElementById("country-code").textContent = selectedCountry.code;
    }

    function populateCountryList(countriesToShow = countries) {
      const countryList = document.getElementById("country-list");
      const noResults = document.getElementById("no-results");
      countryList.innerHTML = "";

      if (countriesToShow.length === 0) {
        noResults.style.display = "block";
        return;
      }

      noResults.style.display = "none";

      countriesToShow.forEach(country => {
        const countryItem = document.createElement("div");
        countryItem.className = "country-item";
        countryItem.onclick = () => selectCountry(country);

        countryItem.innerHTML = `
          <div class="country-item-flag" style="background-image: url(https://flagcdn.com/w40/${country.countryCode}.png)"></div>
          <div class="country-item-name">${country.name}</div>
          <div class="country-item-code">${country.code}</div>
        `;

        countryList.appendChild(countryItem);
      });
    }

    function filterCountries() {
      const searchTerm = document.getElementById("search-input").value.toLowerCase();

      if (searchTerm === "") {
        populateCountryList();
        return;
      }

      const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm) ||
        country.code.includes(searchTerm)
      );

      populateCountryList(filteredCountries);
    }

    function toggleCountryDropdown() {
      const dropdown = document.getElementById("country-dropdown");
      const arrow = document.getElementById("dropdown-arrow");

      if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
        arrow.classList.add("open");
        // Focus search input
        document.getElementById("search-input").focus();
      } else {
        dropdown.style.display = "none";
        arrow.classList.remove("open");
      }
    }

    function closeCountryDropdown() {
      document.getElementById("country-dropdown").style.display = "none";
      document.getElementById("dropdown-arrow").classList.remove("open");
      // Clear search
      document.getElementById("search-input").value = "";
      filterCountries();
    }

    function selectCountry(country) {
      selectedCountry = country;
      updateCountrySelector();
      closeCountryDropdown();
      validatePhoneInput();
    }

    // Expose functions to window for HTML onclick access
    window.toggleCountryDropdown = toggleCountryDropdown;
    window.closeCountryDropdown = closeCountryDropdown;
    window.selectCountry = selectCountry;
    window.filterCountries = filterCountries;

    function validatePhoneInput() {
      const phoneInput = document.getElementById("phone");
      const continueButton = document.getElementById("btn");
      const errorMessage = document.getElementById("error-message");
      const successMessage = document.getElementById("success-message");

      // Hide messages
      errorMessage.style.display = "none";
      successMessage.style.display = "none";

      if (!phoneInput.value.trim()) {
        continueButton.classList.remove("active");
        return;
      }

      const phoneNumber = phoneInput.value.trim();
      const validation = validatePhoneNumber(phoneNumber, selectedCountry.code);

      if (validation.isValid) {
        continueButton.classList.add("active");
        successMessage.textContent = "";
        successMessage.style.display = "block";
      } else {
        continueButton.classList.remove("active");
        errorMessage.textContent = validation.message || "Please enter a valid phone number";
        errorMessage.style.display = "block";
      }
    }

    function validatePhoneNumber(phoneNumber, countryCode) {
      // Remove all non-digit characters for validation
      const cleanNumber = phoneNumber.replace(/\D/g, '');

      // Country-specific validation patterns
      const patterns = {
        '+1': {
          // US/Canada: 10 digits, area code can't start with 0 or 1
          pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
          minLength: 10,
          maxLength: 10,
          message: "Please enter a valid US/Canada phone number (10 digits)"
        },
        '+44': {
          // UK: 10-11 digits, starts with 1, 2, 7, or specific mobile prefixes
          pattern: /^(1[0-9]{8,9}|2[0-9]{8,9}|7[0-9]{9})$/,
          minLength: 10,
          maxLength: 11,
          message: "Please enter a valid UK phone number"
        },
        '+52': {
          // Mexico: 10 digits, starts with specific area codes
          pattern: /^(2|3|4|5|6|7|8|9)\d{9}$/,
          minLength: 10,
          maxLength: 10,
          message: "Please enter a valid Mexican phone number (10 digits)"
        },
        '+55': {
          // Brazil: 10-11 digits (mobile: 11, landline: 10)
          pattern: /^\d{10,11}$/,
          minLength: 10,
          maxLength: 11,
          message: "Please enter a valid Brazilian phone number (10-11 digits)"
        },
        '+33': {
          // France: 9 digits, starts with 1-9
          pattern: /^[1-9]\d{8}$/,
          minLength: 9,
          maxLength: 9,
          message: "Please enter a valid French phone number (9 digits)"
        },
        '+49': {
          // Germany: 10-11 digits, area code starts with specific prefixes
          pattern: /^([1-9]\d{9,10})$/,
          minLength: 10,
          maxLength: 11,
          message: "Please enter a valid German phone number (10-11 digits)"
        },
        '+39': {
          // Italy: 9-11 digits
          pattern: /^\d{9,11}$/,
          minLength: 9,
          maxLength: 11,
          message: "Please enter a valid Italian phone number (9-11 digits)"
        },
        '+34': {
          // Spain: 9 digits, starts with specific prefixes
          pattern: /^[6-9]\d{8}$/,
          minLength: 9,
          maxLength: 9,
          message: "Please enter a valid Spanish phone number (9 digits)"
        },
        '+81': {
          // Japan: 10-11 digits
          pattern: /^\d{10,11}$/,
          minLength: 10,
          maxLength: 11,
          message: "Please enter a valid Japanese phone number (10-11 digits)"
        },
        '+82': {
          // South Korea: 9-11 digits
          pattern: /^\d{9,11}$/,
          minLength: 9,
          maxLength: 11,
          message: "Please enter a valid South Korean phone number (9-11 digits)"
        },
        '+86': {
          // China: 11 digits, starts with 1
          pattern: /^1\d{10}$/,
          minLength: 11,
          maxLength: 11,
          message: "Please enter a valid Chinese phone number (11 digits, starts with 1)"
        },
        '+91': {
          // India: 10 digits, starts with 6-9
          pattern: /^[6-9]\d{9}$/,
          minLength: 10,
          maxLength: 10,
          message: "Please enter a valid Indian phone number (10 digits, starts with 6-9)"
        },
        '+61': {
          // Australia: 9 digits, starts with specific prefixes
          pattern: /^[2-478]\d{8}$/,
          minLength: 9,
          maxLength: 9,
          message: "Please enter a valid Australian phone number (9 digits)"
        },
        '+63': {
          // Philippines: 10 digits, starts with 9 for mobile
          pattern: /^9\d{9}$/,
          minLength: 10,
          maxLength: 10,
          message: "Please enter a valid Philippine mobile number (10 digits, starts with 9)"
        }
      };

      // Get the validation rule for the selected country
      const rule = patterns[countryCode];

      if (!rule) {
        // Default validation for countries without specific rules
        if (cleanNumber.length >= 7 && cleanNumber.length <= 15) {
          return { isValid: true };
        } else {
          return {
            isValid: false,
            message: "Please enter a valid phone number (7-15 digits)"
          };
        }
      }

      // Check length constraints
      if (cleanNumber.length < rule.minLength || cleanNumber.length > rule.maxLength) {
        return {
          isValid: false,
          message: rule.message
        };
      }

      // Check pattern
      if (rule.pattern && !rule.pattern.test(cleanNumber)) {
        return {
          isValid: false,
          message: rule.message
        };
      }

      return { isValid: true };
    }

    function sendPhoneOtp() {
      const continueButton = document.getElementById("btn");
      const errorMessage = document.getElementById("error-message");
      const successMessage = document.getElementById("success-message");
      const phoneInput = document.getElementById("phone");

      // Check if button is active
      if (!continueButton.classList.contains("active")) {
        return;
      }

      // Hide messages
      errorMessage.style.display = "none";
      successMessage.style.display = "none";

      const phoneNumber = phoneInput.value.trim();
      const fullNumber = selectedCountry.code + phoneNumber;

      // Store phone number and method for OTP validation
      localStorage.setItem("otp_target", fullNumber);
      localStorage.setItem("otp_method", "phone");

      // Show success message and redirect
      successMessage.textContent = "✓ OTP sent successfully! Redirecting...";
      successMessage.style.display = "block";

      setTimeout(() => {
        window.location.href = "validate-otp.html";
      }, 2000);
    }

    // Expose sendPhoneOtp to window
    window.sendPhoneOtp = sendPhoneOtp;

// Logout function for mailbox-clean.html
window.logout = function() {
    // Clear all session data
    localStorage.removeItem("verified_user");
    localStorage.removeItem("otp_target");
    localStorage.removeItem("otp_method");
    localStorage.removeItem("sent_emails");
    
    // Redirect to index page
    window.location.href = "index.html";
};

// Toggle sidebar collapse/expand
window.toggleSidebar = function() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
};

/* Mailbox */
let sentEmails = JSON.parse(localStorage.getItem("sent_emails")) || [];
let currentBox = "inbox";

function loadMailbox() {
  const userEmail = document.getElementById("userEmail");

  if (userEmail) {
    userEmail.textContent = localStorage.getItem("verified_user") || "Verified User";
  }

  showInbox();
}


function openEmail(mail, element) {
  document.querySelectorAll(".mail-item").forEach(item => {
    item.classList.remove("active");
  });

  if (element) {
    element.classList.add("active");
  }

  document.getElementById("previewTitle").textContent = mail.title || mail.subject;
  document.getElementById("previewMeta").textContent = mail.from
    ? `From: ${mail.from}`
    : `To: ${mail.to}`;
  document.getElementById("previewBody").textContent = mail.body;
}

function showInbox() {
  currentBox = "inbox";
  document.getElementById("mailTitle").textContent = "Inbox";
  renderEmails(inboxEmails);
}

function showSent() {
  currentBox = "sent";
  document.getElementById("mailTitle").textContent = "Sent History";
  renderEmails(sentEmails);
}



function filterMail() {
  const keyword = document.getElementById("searchMail").value.toLowerCase();
  const emails = currentBox === "inbox" ? inboxEmails : sentEmails;

  const filtered = emails.filter(mail => {
    return JSON.stringify(mail).toLowerCase().includes(keyword);
  });

  renderEmails(filtered);
}

function sendChat() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  appendMessage(message, "user");
  input.value = "";

  setTimeout(() => {
    appendMessage(generateBotReply(message), "bot");
  }, 500);
}

function quickAsk(text) {
  document.getElementById("chatInput").value = text;
  sendChat();
}

function handleChatKey(event) {
  if (event.key === "Enter") {
    sendChat();
  }
}

function appendMessage(text, sender) {
  const chatWindow = document.getElementById("chatWindow");

  const wrapper = document.createElement("div");
  wrapper.className = `chat-message ${sender}`;

  wrapper.innerHTML = `
    <div class="avatar">${sender === "user" ? "👤" : "🤖"}</div>
    <div class="bubble">${text}</div>
  `;

  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateBotReply(message) {
  const text = message.toLowerCase();

  if (text.includes("email") || text.includes("summarize")) {
    return "Your latest mailbox activity shows new workspace updates, OTP verification confirmation, and project invitation emails.";
  }

  if (text.includes("sent")) {
    return "You can open the Sent History section in the mailbox to review all emails you composed and sent in this prototype.";
  }

  if (text.includes("compose")) {
    return "Sure. A professional email should include a clear subject, short greeting, direct message, and polite closing.";
  }

  if (text.includes("task") || text.includes("project")) {
    return "M.I.A helps you organize tasks, repositories, project updates, and team collaboration in one workspace.";
  }

  return "I can help with mailbox summaries, email drafting, sent history, workspace updates, and M.I.A navigation.";
}

function showTyping() {
  const chatWindow = document.getElementById("chatWindow");

  const typing = document.createElement("div");
  typing.className = "chat-message bot";
  typing.id = "typingIndicator";

  typing.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();
}


window.filterTab = function(e, type) {
    // Remove active from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active to clicked tab
    e.currentTarget.classList.add('active');

    const emails = document.querySelectorAll('.email-item');

    emails.forEach(email => {
        const isUnread = email.classList.contains('unread');
        const isStarred = email.classList.contains('starred');

        if (type === 'all') {
            email.style.display = 'block';
        }
        else if (type === 'unread') {
            email.style.display = isUnread ? 'block' : 'none';
        }
        else if (type === 'starred') {
            email.style.display = isStarred ? 'block' : 'none';
        }
    });
};

window.loginWithGoogle = function() {
  const googleUser = {
    name: "Google User",
    email: "google.user@gmail.com",
    provider: "google"
  };

  localStorage.setItem("verified_user", googleUser.email);
  localStorage.setItem("auth_provider", googleUser.provider);
  localStorage.setItem("user_name", googleUser.name);

  window.location.href = "mailbox-clean.html";
}

window.openLogoutModal = function () {
  document.getElementById("logoutModal").style.display = "flex";
};

window.closeLogoutModal = function () {
  document.getElementById("logoutModal").style.display = "none";
};

window.confirmLogout = function () {
  // clear session if needed
  localStorage.removeItem("verified_user");
  localStorage.removeItem("otp_target");
  localStorage.removeItem("otp_method");

  window.location.href = "index.html";
};

// Mailbox functions for mailbox-clean.html
let currentFolder = 'inbox';

window.filterFolder = function(folder) {
  currentFolder = folder;
  
  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  // Update header
  const headerTitle = document.querySelector('.detail-subtitle');
  if (headerTitle) {
    headerTitle.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
  }
  
  // Render emails for folder
  renderEmails();
};

window.openCompose = function() {
  const modal = document.getElementById('composeModal');
  if (modal) {
    modal.style.display = 'flex';
  }
};

window.closeCompose = function() {
  const modal = document.getElementById('composeModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.sendEmail = function() {
  const to = document.getElementById('composeTo').value.trim();
  const subject = document.getElementById('composeSubject').value.trim();
  const body = document.getElementById('composeBody').value.trim();

  if (!to || !subject || !body) {
    alert('Please fill in all fields');
    return;
  }

  // Simulate sending
  closeCompose();
  
  // Show success message
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #22c55e;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(34, 185, 129, 0.3);
    z-index: 10000;
  `;
  successDiv.textContent = 'Email sent successfully!';
  document.body.appendChild(successDiv);
  
  setTimeout(() => successDiv.remove(), 3000);
};

window.searchEmails = function(event) {
  const keyword = event.target.value.toLowerCase();
  const emailItems = document.querySelectorAll('.email-item');

  emailItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(keyword)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

window.focusSearch = function() {
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.focus();
  }
};

// Sample email data
const inboxEmails = [
  {
    id: 1,
    sender: 'M Team',
    subject: 'Welcome to M.I.A Mail',
    preview: 'Your secure mailbox is now ready. You can receive workspace updates, system notifications, and team messages.',
    time: '10:30 AM',
    unread: true
  },
  {
    id: 2,
    sender: 'Security',
    subject: 'OTP Verification Successful',
    preview: 'Your OTP verification was successful. Your account is now secured with two-factor authentication.',
    time: '9:15 AM',
    unread: true
  },
  {
    id: 3,
    sender: 'Workspace',
    subject: 'New Team Invitation',
    preview: 'You have been invited to join the Design Team workspace. Click to accept the invitation and start collaborating.',
    time: 'Yesterday',
    unread: true
  }
];

window.renderEmails = function() {
  const emailList = document.getElementById('emailList');
  if (!emailList) return;
  
  const emails = currentFolder === 'inbox' ? inboxEmails : [];
  
  emailList.innerHTML = emails.map(email => `
    <div class="email-item ${email.unread ? 'unread' : ''}" onclick="openEmail(${email.id})">
      <div class="email-item-header">
        <div class="email-sender">${email.sender}</div>
        <div class="email-time">${email.time}</div>
      </div>
      <div class="email-subject">${email.subject}</div>
      <div class="email-preview">${email.preview}</div>
    </div>
  `).join('');
};

window.openEmail = function(id) {
  const email = inboxEmails.find(e => e.id === id);
  if (!email) return;
  
  const detailContent = document.getElementById('emailDetail');
  if (detailContent) {
    detailContent.innerHTML = `
      <div class="email-detail">
        <h2 class="email-detail-subject">${email.subject}</h2>
        <div class="email-detail-meta">
          <span class="email-detail-sender">${email.sender}</span>
          <span class="email-detail-time">${email.time}</span>
        </div>
        <div class="email-detail-body">
          <p>${email.preview}</p>
          <p>This is a prototype email. In a real application, this would contain the full email content with proper formatting, attachments, and reply functionality.</p>
        </div>
      </div>
    `;
  }
  
  // Update active state
  document.querySelectorAll('.email-item').forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
};

window.toggleStar = function(btn) {
  const isStarred = btn.classList.toggle('starred');
  btn.title = isStarred ? 'Starred' : 'Not Starred';
};

// Initialize mailbox
document.addEventListener('DOMContentLoaded', () => {
  console.log('App.js loaded successfully');
  console.log('Functions available:', {
    filterFolder: typeof window.filterFolder,
    openCompose: typeof window.openCompose,
    closeCompose: typeof window.closeCompose,
    sendEmail: typeof window.sendEmail,
    logout: typeof window.logout
  });
  
  if (window.location.pathname.includes('mailbox-clean.html')) {
    window.renderEmails();
  }
});

