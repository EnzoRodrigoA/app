import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";

interface Database {
  version: number;
  max_connections: number;
  opened_connections: number;
}

interface Dependencies {
  database: Database;
}

interface ApiResponse {
  updated_at: string;
  dependencies: Dependencies;
}

export default function ApiStatus() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<ApiResponse>("https://wolfit-1.onrender.com/api/v1/status")
      .then((response) => setData(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  // transformar objeto em lista p/ FlatList
  const listData = [
    { key: "Versão", value: data?.dependencies.database.version },
    {
      key: "Max. de Conexões",
      value: data?.dependencies.database.max_connections,
    },
    {
      key: "Conexões Abertas",
      value: data?.dependencies.database.opened_connections,
    },
    { key: "Atualizado em", value: data?.updated_at },
  ];

  return (
    <FlatList
      data={listData}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <ThemedView style={{ backgroundColor: "transparent" }}>
          <ThemedText>
            {item.key}: {item.value}
          </ThemedText>
        </ThemedView>
      )}
      ListHeaderComponent={
        <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
          Status do Banco
        </ThemedText>
      }
      scrollEnabled={false}
    />
  );
}
