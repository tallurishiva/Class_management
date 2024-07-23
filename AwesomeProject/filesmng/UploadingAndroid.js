import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import ProgressBar from "./ProgressBar";
import { Ionicons } from "@expo/vector-icons";

export function UploadingAndroid({ file, progress }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      ]}
    >
      <View
        style={{
          width: "70%",
          alignItems: "center",
          paddingVertical: 10,
          rowGap: 12,
          borderRadius: 14,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Ionicons name="document" size={100} color="black" />
        <Text style={{ fontSize: 12 }}>Uploading...</Text>
        <ProgressBar progress={progress} />
        <View
          style={{
            height: 1,
            borderWidth: StyleSheet.hairlineWidth,
            width: "100%",
            borderColor: "#00000020",
          }}
        />
        <TouchableOpacity>
          <Text style={{ fontWeight: "500", color: "#3478F6", fontSize: 17 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
