import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app , auth, db } from "../../config/firebaseConfig"; 




const SignUp = () => {
  const [selectedRole, setSelectedRole] = useState<"tuition" | "student">("tuition");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("All fields are required!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role: selectedRole,
        uid: user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Success!", "Account created successfully.");
      // Navigate to dashboard or login...
    } catch (error:any) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="person-add" size={32} color="#4467EE" />
        </View>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Join our learning community today</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Select Account Type</Text>
        <View style={styles.roleContainer}>
          {/* Role Buttons */}
          <Pressable
            style={[
              styles.roleBox,
              selectedRole === "tuition" && styles.roleBoxSelected,
            ]}
            onPress={() => setSelectedRole("tuition")}
          >
            <View style={styles.roleIcon}>
              <MaterialCommunityIcons
                name="account-tie"
                size={24}
                color={selectedRole === "tuition" ? "#4467EE" : "#666"}
              />
            </View>
            <Text
              style={
                selectedRole === "tuition"
                  ? styles.roleTextSelected
                  : styles.roleText
              }
            >
              Tuition Sir
            </Text>
            <Text style={styles.roleSubtext}>Teach & manage students</Text>
          </Pressable>

          <Pressable
            style={[
              styles.roleBox,
              selectedRole === "student" && styles.roleBoxSelected,
            ]}
            onPress={() => setSelectedRole("student")}
          >
            <View style={styles.roleIcon}>
              <Ionicons
                name="school"
                size={24}
                color={selectedRole === "student" ? "#4467EE" : "#666"}
              />
            </View>
            <Text
              style={
                selectedRole === "student"
                  ? styles.roleTextSelected
                  : styles.roleText
              }
            >
              Student
            </Text>
            <Text style={styles.roleSubtext}>Learn & grow</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#888"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Create a strong password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#888"
            />
          </Pressable>
        </View>

        {/* Submit Button */}
        <Pressable style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Create Account</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#fff"
            style={styles.buttonIcon}
          />
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?
            <Link href="/auth/signin">
              <Text style={styles.linkText}> Sign In</Text>
            </Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F9FAFB",
    minHeight: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#1F2937",
  },
  subheading: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "400",
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginTop: 8,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  roleBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleBoxSelected: {
    borderColor: "#4467EE",
    backgroundColor: "#F8FAFF",
    shadowColor: "#4467EE",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  roleIcon: {
    marginBottom: 8,
  },
  roleText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  roleTextSelected: {
    color: "#4467EE",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },
  roleSubtext: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#374151",
  },
  passwordInput: {
    paddingRight: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: "#4467EE",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#4467EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 14,
  },
  linkText: {
    color: "#4467EE",
    fontWeight: "600",
  },
});

export default SignUp;
