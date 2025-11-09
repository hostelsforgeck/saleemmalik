
    // Email copy button functionality
document.addEventListener('DOMContentLoaded', () => {
    const copyEmailBtn = document.getElementById('copy-email');
    const emailText = copyEmailBtn.querySelector('span');
    const email = "saleemmalikgeck24@gmail.com"; 
    
    // Store the original width of the button to maintain it
    let originalWidth = null;
    
    copyEmailBtn.addEventListener('click', async () => {
        // Store the original width on first click if not already stored
        if (!originalWidth) {
            originalWidth = copyEmailBtn.offsetWidth + 'px';
            // Set a fixed width to prevent resizing
            copyEmailBtn.style.width = originalWidth;
        }
        
        try {
            // Copy the email to clipboard
            await navigator.clipboard.writeText(email);
            
            // Change the text with fade transition
            emailText.style.opacity = '0';
            
            setTimeout(() => {
                emailText.textContent = 'Copied!';
                emailText.style.opacity = '1';
                
                // Add a temporary success state
                copyEmailBtn.classList.add('success');
                
                // Set timeout to revert back after 5 seconds
                setTimeout(() => {
                    // Fade out text again
                    emailText.style.opacity = '0';
                    
                    setTimeout(() => {
                        // Change text back and fade in
                        emailText.textContent = 'Copy email';
                        emailText.style.opacity = '1';
                        copyEmailBtn.classList.remove('success');
                    }, 300);
                }, 5000);
            }, 300);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            
            // Show error state briefly
            emailText.style.opacity = '0';
            
            setTimeout(() => {
                emailText.textContent = 'Error!';
                emailText.style.opacity = '1';
                copyEmailBtn.classList.add('error');
                
                setTimeout(() => {
                    emailText.style.opacity = '0';
                    
                    setTimeout(() => {
                        emailText.textContent = 'Copy email';
                        emailText.style.opacity = '1';
                        copyEmailBtn.classList.remove('error');
                    }, 300);
                }, 2000);
            }, 300);
        }
    });
});