import React from 'react';
import { List } from 'react-native-paper';

export default function ListAccordion({expanded, ...props}: any) {
  const [isExpanded, setIsExpanded] = React.useState(expanded || false);

  const handlePress = () => setIsExpanded(!isExpanded);

  return (
    <List.Accordion {...props} expanded={isExpanded} onPress={handlePress}/>
  )
}
