import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<{
    name: string;
    role: string;
    avatar: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("useUserInfo hook called");

 
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching user info from AsyncStorage");
      const data = await AsyncStorage.getItem("userData");
      console.log("AsyncStorage data:", data);

      if (data) {
        const parsed = JSON.parse(data);
        console.log("Parsed user data:", parsed);

        const avatar = parsed.role === "tuition" ? "👨‍🏫" : "👩‍🎓";
        const roleLabel =
          parsed.role === "tuition" ? "Tuition Teacher" : "Student";

        const newUserInfo = {
          name: parsed.fullName,
          role: roleLabel,
          avatar: avatar,
        };

        setUserInfo(newUserInfo);
        console.log("User info set to:", newUserInfo);
      } else {
        console.log("No user data found in AsyncStorage");
        setError("No user data found");
      }
    } catch (error) {
      console.error("Failed to load user info:", error);
      setError("Failed to load user info");
    } finally {
      setLoading(false);
      console.log("Fetch complete, loading:", false);
    }
  };

  useEffect(() => {
    console.log("useEffect running in useUserInfo");
    fetchUserInfo(); // Call it inside effect
  }, []);

  return { userInfo, loading, error, refetch: fetchUserInfo };
};

export default useUserInfo;
