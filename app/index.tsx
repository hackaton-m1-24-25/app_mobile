import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, FlatList } from "react-native";
import axios from "axios";
import apiUrl from "@/app/apiUrl";
import "./index.css";

interface Device {
  deviceId: string;
  generationId: string;
  etag: string;
  connectionState: string;
  status: string;
  statusReason: string | null;
  connectionStateUpdatedTime: string;
  statusUpdatedTime: string;
  lastActivityTime: string;
  cloudToDeviceMessageCount: number;
  capabilities: Record<string, unknown>;
  authentication: {
    symmetricKey: {
      primaryKey: string;
      secondaryKey: string;
    };
    x509Thumbprint: {
      primaryThumbprint: string | null;
      secondaryThumbprint: string | null;
    };
    type: string;
  };
}

export default function AdminBoard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceLedState, setDeviceLedState] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAllDevices = async () => {
    try {
      const response = await axios.get(apiUrl() + "/devices", {});
      setDevices(response.data.data);
      response.data.data.forEach((device: Device) => {
        getOneDevice(device);
      });
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  useEffect(() => {
    fetchAllDevices().then(() => {
      console.log("All devices fetched");
    });
  }, []);

  const getOneDevice = async (device: Device) => {
    try {
      const response = await axios.get(apiUrl() + "/devices/" + device.deviceId, {});

      const isActivated: boolean = response.data.data.properties?.desired?.led ?? false;
      console.log("LED State:", isActivated);
      setDeviceLedState((prevState) => ({
        ...prevState,
        [device.deviceId]: isActivated,
      }));
      return isActivated;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'état du device :", error);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <View style={styles.content}>
        <FlatList
          data={devices}
          keyExtractor={(item) => item.deviceId}
          renderItem={({ item }) => (
            <View style={styles.deviceCard}>
              <Text style={styles.deviceTitle}>{item.deviceId || "Title Device"}</Text>
              <Text style={styles.deviceStatus}>
                <Text style={styles.boldText}>{item.status || "Status"}</Text>
              </Text>
              <Text style={styles.deviceConnectionState}>{item.connectionState || "Connection State"}</Text>
              <Text style={styles.deviceLastActivity}>{item.lastActivityTime || "Last Activity"}</Text>
              <Text style={styles.deviceLedState}>
                <Text style={styles.boldText}>LED is {deviceLedState[item.deviceId] ? "ON" : "OFF"}</Text>
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.deviceCard}>
              <Text style={styles.deviceTitle}>
                <Text style={styles.boldText}>Connexion en cours...</Text>
              </Text>
              <Text>Type product</Text>
              <Text>Description</Text>
              <Text>Location</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filters: {
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
  deviceCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deviceStatus: {
    fontSize: 16,
    marginTop: 5,
  },
  deviceConnectionState: {
    fontSize: 16,
    marginTop: 5,
  },
  deviceLastActivity: {
    fontSize: 16,
    marginTop: 5,
  },
  deviceLedState: {
    fontSize: 16,
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
});