import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, firestore } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import NavBar from "../components/NavBar";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    isAdmin: false,
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "No user is logged in.");
          return;
        }

        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          Alert.alert("Error", "User profile not found.");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateInputs = () => {
    if (!profile.firstName || !profile.lastName || !profile.mobileNumber) {
      Alert.alert("Validation Error", "Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        const user = auth.currentUser;
        if (!user) {
          Alert.alert("Error", "No user is logged in.");
          return;
        }

        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);

        const response = await fetch(uri);
        if (!response.ok) throw new Error("Failed to fetch the image file.");

        const blob = await response.blob();

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        const docRef = doc(firestore, "users", user.uid);
        await updateDoc(docRef, { profilePicture: downloadURL });

        setProfile({ ...profile, profilePicture: downloadURL });
        Alert.alert("Success", "Profile picture updated!");
      } else {
        console.log("Image picking was canceled");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to update profile picture: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!validateInputs()) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No user is logged in.");
        return;
      }

      const docRef = doc(firestore, "users", user.uid);
      const { isAdmin, ...updatableProfile } = profile;
      await updateDoc(docRef, updatableProfile);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../../assets/gabai-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Edit your account.</Text>
        <TouchableOpacity onPress={handleImagePick} style={styles.profilePicContainer}>
          <Image
            source={{
              uri: profile.profilePicture || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.editPhotoText}>Edit Photo</Text>
        </TouchableOpacity>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.fullWidth]}
            value={profile.email}
            editable={false}
          />
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={profile.firstName}
                onChangeText={(text) =>
                  setProfile({ ...profile, firstName: text })
                }
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={profile.lastName}
                onChangeText={(text) =>
                  setProfile({ ...profile, lastName: text })
                }
              />
            </View>
          </View>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={[styles.input, styles.fullWidth]}
            value={profile.mobileNumber}
            onChangeText={(text) =>
              setProfile({ ...profile, mobileNumber: text })
            }
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
          <Text style={styles.loginButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
      <NavBar navigation={navigation} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 120,
  },
  label: {
    fontSize: 16,
    marginBottom: -5,
    fontWeight: "600",
    marginTop: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    marginBottom: 20,
    color: "#403D3D",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    borderWidth: 3,
    borderColor: "#B2A561",
  },
  editPhotoText: {
    color: "#B2A561",
    marginTop: 10,
    fontWeight: "bold",
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  fullWidth: {
    width: "100%",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#103E5B",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 10,
  },
});
