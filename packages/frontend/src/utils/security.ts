export const sanitizeHTML = (html: string): string => {
  // Basic HTML sanitization to prevent XSS
  const allowedTags = [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
  ];
  
  const allowedAttributes = {
    a: ['href', 'title', 'target'],
  };
  
  // In a real implementation, use a library like DOMPurify
  // This is a simplified version for demonstration
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script tags and event handlers
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove unwanted attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove all attributes not in allowedAttributes for this tag
    Array.from(el.attributes).forEach(attr => {
      const tagName = el.tagName.toLowerCase();
      const allowedAttrs = allowedAttributes[tagName as keyof typeof allowedAttributes] || [];
      
      if (!allowedAttrs.includes(attr.name)) {
        el.removeAttribute(attr.name);
      }
    });
    
    // Remove tags not in allowedTags
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.outerHTML = el.innerHTML;
    }
  });
  
  return tempDiv.innerHTML;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const generateCSRFToken = (): string => {
  // Generate a random token for CSRF protection
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const encryptData = async (data: string, key: string): Promise<string> => {
  // Simple encryption for sensitive data (in a real app, use a more secure method)
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(key);
  
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    cryptoKey,
    dataBuffer
  );
  
  // Combine iv and encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
};

export const decryptData = async (encryptedData: string, key: string): Promise<string> => {
  try {
    const decoder = new TextDecoder();
    const keyBuffer = new TextEncoder().encode(key);
    
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      cryptoKey,
      encrypted
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};
