interface LoginResponse {
    token: string;
  }
  
  interface RegisterResponse {
    message: string;
  }
  
  export async function login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    return response.json();
  }
  
  export async function register(username: string, password: string): Promise<RegisterResponse> {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
  
    return response.json();
  }
  