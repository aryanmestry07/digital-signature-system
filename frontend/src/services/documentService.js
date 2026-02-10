const API_BASE_URL = "http://localhost:5000/api";

// Fetch user-specific documents
export const fetchUserDocuments = async (userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/documents?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};
