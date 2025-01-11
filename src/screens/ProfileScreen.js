import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth, firestore } from "../../firebase-config"; // Adjust path if necessary
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    isAdmin: false,
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

        const docRef = doc(firestore, "users", user.uid); // Fetch document by UID
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

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "No user is logged in.");
        return;
      }

      const docRef = doc(firestore, "users", user.uid); // Update document by UID
      const { isAdmin, ...updatableProfile } = profile; // Exclude isAdmin from being updated
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
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={profile.email}
        editable={false} // Email is not editable
      />

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={profile.firstName}
        onChangeText={(text) => setProfile({ ...profile, firstName: text })}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={profile.lastName}
        onChangeText={(text) => setProfile({ ...profile, lastName: text })}
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={profile.mobileNumber}
        onChangeText={(text) => setProfile({ ...profile, mobileNumber: text })}
      />

      <Text style={styles.label}>Is Admin</Text>
      <TextInput
        style={styles.input}
        value={profile.isAdmin ? "Yes" : "No"}
        editable={false} // isAdmin is displayed but not editable
      />

      <Button title="Save Changes" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
});
