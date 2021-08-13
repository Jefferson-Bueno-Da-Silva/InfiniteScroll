import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

import axios from 'axios'

export default function App() {
  const baseURL = 'https://api.github.com'
  const perPage = 20

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadApi()
  }, [])

  const loadApi = async () => {
    if (loading) return

    setLoading(true)
    // /search/repositories?q=react&per_page=5&page=1
    const response = await axios.get(
      `${baseURL}/search/repositories?q=react&per_page=${perPage}&page=${page}`,
    )

    setData([...data, ...response.data.items])
    setPage(page + 1)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={data}
        style={{ marginTop: 30 }}
        contentContainerStyle={{ marginHorizontal: 20 }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ListItem data={item} />}
        onEndReached={loadApi}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<FooterList load={loading} />}
      />
    </View>
  )
}
const ListItem = ({ data }) => {
  const { id, full_name } = data
  return (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{full_name}</Text>
    </View>
  )
}
const FooterList = ({ load }) => {
  if(!load) return null;

  return (
    <View style={styles.loading}>
      <ActivityIndicator size={25} color="#121212" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listItem: {
    backgroundColor: '#121212',
    padding: 30,
    marginTop: 20,
    borderRadius: 10,
  },
  listText: {
    fontSize: 16,
    color: '#fff',
  },
  loading: {
    padding: 10,
  },
})
