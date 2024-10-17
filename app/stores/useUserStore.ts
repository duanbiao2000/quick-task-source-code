import { create } from "zustand";
import { Result } from "../api/signin/route";

type User = {
  id: string;
  email: string;
};
interface UserStoreInterface {
  user: User | null;
  setUser: (newUser: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleLogout: () => Promise<void>;
  validateUser: () => Promise<boolean>;
  // login function structure
  loginFunction: (data: {
    email: string;
    password: string;
  }) => Promise<{ result?: Result; error?: string; isLoggedIn: boolean }>;
  //sign up function structure
  signUpFunction: (data: {
    email: string;
    password: string;
  }) => Promise<{ result?: Result; error?: string }>;
}

export const useUserStore = create<UserStoreInterface>((set) => {
  return {
    user: null,
    isLoading: false,
    setUser: (newUser: User | null) => {
      set({ user: newUser });
    },

    setIsLoading: (isLoading: boolean) => {
      set({ isLoading: isLoading });
    },

    validateUser: async () => {
      try {
        set({ isLoading: true });
        const response = await fetch("/api/validate-user");
        const data = await response.json();

        // If user is authenticated, store the user data in state
        if (data.isAuthenticated) {
          set({ user: data.user });
          return true;
        } else {
          set({ user: null });
          return false;
        }
      } catch (error) {
        console.error("Validation error:", error);
        set({ user: null });
        return false;
      } finally {
        set({ isLoading: false });
      }
    },

    handleLogout: async () => {
      try {
        set({ isLoading: true });
        const response = await fetch("/api/logout", { method: "GET" });
        const data = await response.json();
        if (data.success) {
          set({ user: null }); // Clear the user from the Zustand store
        } else {
          throw new Error(data.error || "Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    loginFunction: async (data: { email: string; password: string }) => {
      set({ isLoading: true });

      try {
        const response = await fetch("/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const result: Result = await response.json();

        // Type guard to check if the result has 'success'
        if ("success" in result && result.success === true) {
          return { result, isLoggedIn: true };
        } else if ("error" in result) {
          // If 'error' is present in the result
          return { error: result.error || "Sign in failed", isLoggedIn: false };
        }
      } catch (error) {
        console.log("sign in error", error);
        return { error: "An unexpected error occurred", isLoggedIn: false };
      } finally {
        set({ isLoading: false });
      }

      // In case something went wrong and no explicit return happened, return a default value.
      return { error: "Unknown error", isLoggedIn: false };
    },

    signUpFunction: async (data: { email: string; password: string }) => {
      set({ isLoading: true });

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        const result: Result = await response.json();

        if ("success" in result && result.success) {
          return { result };
        } else if ("error" in result && result.error) {
          return { error: result.error };
        }
      } catch (error) {
        console.log("sign in error", error);
        return { error: "An unexpected error occurred" };
      } finally {
        set({ isLoading: false });
      }

      return { error: "Unknown error" };
    },
  };
});
