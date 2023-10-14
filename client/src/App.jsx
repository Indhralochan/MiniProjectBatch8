/* eslint-disable no-unused-vars */
import { Flex, Text, Button } from '@radix-ui/themes';
import './App.css'
import React from 'react'
const App = () => {
  return (
    <Flex direction="column" gap="2">
    <Text>Hello from Radix Themes :)</Text>
    <Button>Let&apos;s go</Button>
  </Flex>
  );
}

export default App