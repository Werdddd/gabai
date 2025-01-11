import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import axios from 'axios';
import { GEMINI_KEY } from '../../api-keys';

export default function Summary({ route, navigation }) {
    const reviewerId = route.params?.reviewerId;
    // Sample text for testing
    const [sampleText] = useState(`
        Data Structures and Algorithms are fundamental concepts in computer science.
        A Queue is a data structure that follows First-In-First-Out (FIFO) principle.
        Basic operations in a Queue include:
        - Enqueue: Adding an element to the rear
        - Dequeue: Removing an element from the front
        - Front: Getting the front element without removing it
        - IsEmpty: Checking if the queue is empty
        
        A Stack follows Last-In-First-Out (LIFO) principle.
        Basic operations in a Stack include:
        - Push: Adding an element to the top
        - Pop: Removing an element from the top
        - Peek: Getting the top element without removing it
        - IsEmpty: Checking if the stack is empty
        
        Linked Lists are linear data structures where elements are stored in nodes.
        Each node contains data and a reference to the next node.
        Types of Linked Lists:
        - Singly Linked List: Each node points to the next node
        - Doubly Linked List: Each node points to both next and previous nodes
        - Circular Linked List: Last node points back to the first node
    `);

    return (
        <View style={styles.container}>
            <Text>{sampleText}</Text>
        </View>
    );
}
