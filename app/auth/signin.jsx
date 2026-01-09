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
import { Link, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app , auth, db } from "../../config/firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message"; 




const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  

const handleSignIn = async () => {
  if (!email || !password) {
    Alert.alert("Please enter both email and password.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();

      // ✅ Save full user data to AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      // ✅ Show toast
      Toast.show({
        type: "success",
        text1: `${userData.role === "student" ? "Student" : "Teacher"} logged in`,
      });

      // ✅ Navigate based on role
      if (userData.role === "student") {
        router.replace("/(sidebar)/student/dashboard");
      } else {
        router.replace("/(sidebar)/teacher/dashboard");
      }
    } else {
      Alert.alert("Error", "User data not found in Firestore.");
    }
  } catch (error ) {
    console.error(error);
    Alert.alert("Login Failed", error.message);
  }
};



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={36} color="#4467EE" />
        </View>
        <Text style={styles.welcome}>
          Welcome to <Text style={styles.brand}>Clasnia</Text>
        </Text>
        <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Account Details</Text>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
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
          <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#888"
            />
          </Pressable>
        </View>

        {/* Remember Me + Forgot */}
        <View style={styles.row}>
          <Pressable style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
            <View style={styles.checkboxContainer}>
              {rememberMe ? (
                <MaterialIcons name="check-box" size={20} color="#4467EE" />
              ) : (
                <MaterialIcons name="check-box-outline-blank" size={20} color="#888" />
              )}
            </View>
            <Text style={styles.remember}>Remember me</Text>
          </Pressable>

          <Pressable style={styles.forgotContainer}>
            <Ionicons name="help-circle-outline" size={16} color="#4467EE" style={styles.forgotIcon} />
            <Text style={styles.forgot}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* Sign In Button */}
        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
          <Ionicons name="log-in" size={18} color="#fff" style={styles.buttonIcon} />
        </Pressable>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Auth Placeholder */}
        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.signup}>
            Do not have an account?
            <Link href="/auth/signup">
              <Text style={styles.link}>Sign up</Text>
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
    minHeight: '100%'
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 40
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E8EDFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#4467EE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcome: { 
    fontSize: 28, 
    fontWeight: "700", 
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 8
  },
  brand: { 
    color: "#4467EE", 
    fontWeight: "800"
  },
  subtitle: { 
    textAlign: "center", 
    color: "#6B7280", 
    fontSize: 16,
    fontWeight: "400"
  },
  formContainer: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16
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
    marginRight: 12
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#374151"
  },
  passwordInput: {
    paddingRight: 12
  },
  eyeIcon: {
    padding: 4
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxRow: { 
    flexDirection: "row", 
    alignItems: "center",
    flex: 1
  },
  checkboxContainer: {
    marginRight: 8
  },
  remember: { 
    fontSize: 14, 
    color: "#374151",
    fontWeight: "500"
  },
  forgotContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  forgotIcon: {
    marginRight: 4
  },
  forgot: { 
    fontSize: 14, 
    color: "#4467EE",
    fontWeight: "600"
  },
  button: {
    backgroundColor: "#4467EE",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 24,
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
    marginRight: 8
  },
  buttonIcon: {
    marginLeft: 4
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB"
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500"
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialIcon: {
    marginRight: 12
  },
  socialButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16
  },
  footer: {
    alignItems: "center"
  },
  signup: { 
    textAlign: "center", 
    color: "#6B7280",
    fontSize: 14
  },
  link: { 
    color: "#4467EE", 
    fontWeight: "600"
  },
});

export default SignIn;   