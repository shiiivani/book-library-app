import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export default function Homepage() {
  const [books, setBooks] = useState([]);
  const [buttonStates, setButtonStates] = useState(
    new Array(books.length).fill(false)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://openlibrary.org/people/mekBot/books/already-read.json"
        );
        setBooks(response.data.reading_log_entries);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="blue"
        style={{ marginTop: "95%" }}
      />
    );
  }

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
              <TouchableOpacity
                onPress={() => handleButton(index)}
                style={[
                  styles.button,
                  {
                    borderWidth: buttonStates[index] ? 0 : 1,
                    backgroundColor: buttonStates[index]
                      ? "green"
                      : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: buttonStates[index] ? "white" : "black" },
                  ]}
                >
                  {buttonStates[index] ? "Read" : "Unread"}
                </Text>
              </TouchableOpacity>
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
                  <TouchableOpacity
                    onPress={() => handleButton(index)}
                    style={[
                      styles.button,
                      {
                        borderWidth: buttonStates[index] ? 0 : 1,
                        backgroundColor: buttonStates[index]
                          ? "green"
                          : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: buttonStates[index] ? "white" : "black" },
                      ]}
                    >
                      {buttonStates[index] ? "Read" : "Unread"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
          )}
        </View>
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
    height: "max-content",
    borderWidth: 0.4,
    borderColor: "grey",
    alignItems: "left",
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  author: {
    marginTop: 5,
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
    height: "max-content",
  },
  button: {
    marginTop: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
  },
  buttonText: {
    textAlign: "center",
    padding: 8,
  },
});
