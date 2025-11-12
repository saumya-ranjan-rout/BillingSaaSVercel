import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

interface DecodedToken {
  exp: number;
  userId: string;
  tenantId: string;
  email: string;
}

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadTokensFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      this.token = localStorage.getItem(TOKEN_KEY);
      this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
      this.clearTokens();
    }
  }

  setTokens(token: string, refreshToken: string): void {
    try {
      this.token = token;
      this.refreshToken = refreshToken;

      // Decode token to get expiry
      const decoded = jwtDecode<DecodedToken>(token);
      const expiryTime = decoded.exp * 1000; // Convert to milliseconds

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('Error setting tokens:', error);
      this.clearTokens();
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.loadTokensFromStorage();
    }
    return this.token;
  }

  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.loadTokensFromStorage();
    }
    return this.refreshToken;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  isTokenExpiringSoon(thresholdMinutes: number = 5): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      const thresholdSeconds = thresholdMinutes * 60;
      return (decoded.exp - currentTime) < thresholdSeconds;
    } catch (error) {
      return true;
    }
  }

  async refreshAuthToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return null;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.token, data.refreshToken);
        return data.token;
      } else {
        this.clearTokens();
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      return null;
    }
  }

  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = AuthService.getInstance();

















// class AuthManager {
//   private token: string | null = null;
//   private refreshToken: string | null = null;
//   private refreshPromise: Promise<string | null> | null = null;

//   constructor() {
//     this.initializeFromStorage();
//   }

//   private initializeFromStorage() {
//     if (typeof window === 'undefined') return;
    
//     try {
//       this.token = localStorage.getItem('auth_token');
//       this.refreshToken = localStorage.getItem('auth_refresh_token');
//     } catch (error) {
//       console.warn('Failed to read auth tokens from storage:', error);
//       this.clearTokens();
//     }
//   }

//   setTokens(token: string, refreshToken: string) {
//     try {
//       this.token = token;
//       this.refreshToken = refreshToken;
      
//       localStorage.setItem('auth_token', token);
//       localStorage.setItem('auth_refresh_token', refreshToken);
      
//       // Set expiry time (24 hours from now)
//       const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
//       localStorage.setItem('auth_token_expiry', expiryTime.toString());
//     } catch (error) {
//       console.error('Failed to set auth tokens:', error);
//     }
//   }

//   getToken(): string | null {
//     if (!this.token) {
//       this.initializeFromStorage();
//     }
    
//     // Check if token is expired
//     if (this.isTokenExpired()) {
//       console.warn('Token is expired, clearing...');
//       this.clearTokens();
//       return null;
//     }
    
//     return this.token;
//   }

//   private isTokenExpired(): boolean {
//     try {
//       const expiry = localStorage.getItem('auth_token_expiry');
//       if (!expiry) return true;
      
//       return Date.now() > parseInt(expiry);
//     } catch {
//       return true;
//     }
//   }

//   async refreshToken(): Promise<string | null> {
//     // Prevent multiple simultaneous refresh attempts
//     if (this.refreshPromise) {
//       return this.refreshPromise;
//     }

//     this.refreshPromise = new Promise(async (resolve) => {
//       try {
//         const currentRefreshToken = this.refreshToken;
//         if (!currentRefreshToken) {
//           this.clearTokens();
//           resolve(null);
//           return;
//         }

//         const response = await fetch('/api/auth/refresh', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ refreshToken: currentRefreshToken }),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           this.setTokens(data.token, data.refreshToken);
//           resolve(data.token);
//         } else {
//           console.error('Token refresh failed:', response.status);
//           this.clearTokens();
//           resolve(null);
//         }
//       } catch (error) {
//         console.error('Token refresh error:', error);
//         this.clearTokens();
//         resolve(null);
//       } finally {
//         this.refreshPromise = null;
//       }
//     });

//     return this.refreshPromise;
//   }

//   clearTokens() {
//     this.token = null;
//     this.refreshToken = null;
//     this.refreshPromise = null;
    
//     try {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('auth_refresh_token');
//       localStorage.removeItem('auth_token_expiry');
//       localStorage.removeItem('auth_user');
//     } catch (error) {
//       console.warn('Failed to clear auth tokens:', error);
//     }
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
// }

// // Singleton instance
// export const authManager = new AuthManager();