import axios, { AxiosResponse } from "axios";
import { API_URL } from "@env";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
}
const API_BASE_URL = `${API_URL}/api/auth`;

const authService = {
  signup: async (
    userData: SignupData
  ): Promise<AxiosResponse<SignupResponse>> => {
    try {
      const response = await axios.post<SignupResponse>(
        `${API_BASE_URL}/signup`,
        userData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (userData: LoginData): Promise<AxiosResponse<LoginResponse>> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/login`,
        userData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;

interface Profile {
  email: string;
  firstName: string;
  lastName: string;
}

export async function getProfile(userId: string): Promise<Profile> {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile?id=${userId}`);
    return response.data as Profile;
  } catch (error) {
    throw new Error("Failed to fetch profile");
  }
}
export interface AddToLibraryRequest {
  userID: string;
  songID: string;
}

export interface AddToLibraryResponse {
  success: boolean;
  message: string;
}

export const addToLibraryService = async ({
  userID,
  songID,
}: AddToLibraryRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/addtolibrary`, {
      userID: userID,
      songID: songID,
    });
    return response.data as AddToLibraryResponse;
  } catch (error) {
    console.error("Failed to add song to library:", error);
    throw error;
  }
};

export const removeFromLibraryService = async ({
  userID,
  songID,
}: AddToLibraryRequest) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/auth/removefromlibrary`,
      {
        data: {
          userID: userID,
          songID: songID,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to remove song from library:", error);
    throw error;
  }
};
