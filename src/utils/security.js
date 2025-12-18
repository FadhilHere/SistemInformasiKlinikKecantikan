/**
 * Hashing utility using Web Crypto API
 * @param {string} message 
 * @returns {Promise<string>} Hex string of the hash
 */
export const hashString = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };
  
// Mock Credentials (hashed)
// Email: as22si@mahsiswa.pcr.ac.id
// Password: acop123

// Note: In a real application, these would come from a backend database or auth service.
// For this frontend-only demo, we store the HASHES, not the plain text.
// Please replace these with the correct hashes if you change the password.
const STORED_HASHES = {
    email: '298e83b384666d8ba986e8ca7955c42171120cd21268307db495ba34f5901614', // SHA-256 of 'as22si@mahsiswa.pcr.ac.id'
    password: 'a055743130d22227bd2500c25a0729352467d13e5473aa38600d8924bce65df9' // SHA-256 of 'acop123'
};

/**
 * Verifies the login credentials against stored hashes.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<boolean>}
 */
export const verifyLogin = async (email, password) => {
   const emailHash = await hashString(email);
   const passwordHash = await hashString(password);
   
   return emailHash === STORED_HASHES.email && passwordHash === STORED_HASHES.password;
}
