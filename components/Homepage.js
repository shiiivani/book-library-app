import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
} from "react-native";

export default function Homepage() {
  const [books, setBooks] = useState([]);
  const [buttonStates, setButtonStates] = useState(
    new Array(books.length).fill(false)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://openlibrary.org/people/mekBot/books/already-read.json"
        );
        setBooks(response.data.reading_log_entries);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleButton = (index) => {
    const newButtonStates = [...buttonStates];
    newButtonStates[index] = !newButtonStates[index];
    setButtonStates(newButtonStates);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = books.filter(
      (book) =>
        book.work.title &&
        book.work.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={handleSearch}
          value={searchQuery}
          placeholder="Search by title..."
        />
        {filteredBooks.map((filteredbook, index) => (
          <View key={index} style={styles.bookItem}>
            <Image
              source={{
                uri: `https://covers.openlibrary.org/b/id/${filteredbook.work.cover_id}-M.jpg`,
              }}
              style={styles.image}
              resizeMode="cover"
              alt="Image of a Book"
            />
            <View style={styles.info}>
              <Text style={styles.title}>{filteredbook.work.title}</Text>
              <Text style={styles.author}>
                Author: {filteredbook.work.author_names.join(", ")}
              </Text>
              <Text style={styles.year}>
                {filteredbook.work.first_publish_year}
              </Text>
            </View>
            <Button
              title={buttonStates[index] ? "Read" : "Unread"}
              onPress={() => handleButton(index)}
              style={styles.button}
              color={buttonStates[index] ? "green" : "grey"}
            />
          </View>
        ))}

        {books.map(
          (book, index) =>
            book.work.title && (
              <View key={index} style={styles.bookItem}>
                <Image
                  source={{
                    uri: `https://covers.openlibrary.org/b/id/${book.work.cover_id}-M.jpg`,
                  }}
                  style={styles.image}
                  resizeMode="cover"
                  alt="Image of a Book"
                />
                <View style={styles.info}>
                  <Text style={styles.title}>{book.work.title}</Text>
                  <Text style={styles.author}>
                    Author: {book.work.author_names.join(", ")}
                  </Text>
                  <Text style={styles.year}>
                    {book.work.first_publish_year}
                  </Text>
                </View>
                <Button
                  title={buttonStates[index] ? "Read" : "Unread"}
                  onPress={() => handleButton(index)}
                  style={styles.button}
                  color={buttonStates[index] ? "green" : "grey"}
                />
              </View>
            )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 70,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 30,
    width: "90%",
    padding: 5,
  },
  bookItem: {
    width: "45%",
    height: 560,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: "black",
    alignItems: "left",
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  author: {
    marginTop: 5,
    // fontWeight: "bold",
    fontSize: 13,
    color: "grey",
  },
  year: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 13,
    color: "grey",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 5,
    alignSelf: "center",
  },
  info: {
    height: 225,
  },
  button: {
    marginTop: 10,
  },
});
