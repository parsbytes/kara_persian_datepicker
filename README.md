# Kara Persian DatePicker

A modern, Persian date picker for React applications. This date picker supports both light and dark themes, providing a sleek and user-friendly interface for selecting dates.

## Installation

### npm

To install the package via npm, run:

```bash
npm install kara-persian-datepicker
```

### yarn
```bash
yarn add kara-persian-datepicker
```

## Usage
```javascript
import React, { useState } from 'react';
import { DatePicker } from 'kara-persian-datepicker';
import 'kara-persian-datepicker/dist/index.css'; // Import custom styles if needed

const App: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    return (
        <div>
            <h1>Kara Persian DatePicker</h1>
            <DatePicker
                value={selectedDate}
                onChange={(date) => {
                    console.log(date);
                    setSelectedDate(date);
                }}
                classStyle={{
                    backgroundColor: '#000', // dark background
                    textColor: '#fff', // white text
                    textPlaceholder: 'Pick a date', // Placeholder text in Persian
                    textAlign: 'right', // Text alignment
                    size: 'md', // Size of the date picker
                    radius: '8px', // Border radius for rounded corners
                    borderColor: '#E2e8f0', // Border color for the date picker
                    selectedDayColor: '#007BFF', // Blue color for the selected day
                    inputStyle: { padding: '10px', fontSize: '16px' }, // Custom input styles
                }}
                disabled={false} // Change to true to disable the date picker
                theme="dark" // Change to 'light' for light theme
            />
            {selectedDate && <p>Selected Date: {selectedDate}</p>}
        </div>
    );
};

export default App;


```

## Features
- **Light and Dark Themes**: Easily switch between light and dark modes.
- **Modern Design**: Flat design with rounded corners for a sleek look.
- **User-Friendly**: Simple interface for selecting dates.
- **Responsive**: Works well on various screen sizes.

## Props
| Prop         | Type                   | Description                                                                                  |
|--------------|------------------------|----------------------------------------------------------------------------------------------|
| `value`      | `string`               | string Or null                                                                               |
| `disabled`   | `boolean`              | Optional. If true, disables the date picker.                                                 |
| `theme`      | `string`               | Optional. Allows you to set the theme ('light' or 'dark'). Default is 'light'.               |
| `classStyle` | `object`               | Optional                                                                                     |
| `onChange`   | `(date: Date) => void` | Callback function called when a date is selected. Receives the selected date as an argument. |


## Customization
You can customize the appearance of the date picker by modifying the CSS file or overriding styles in your own stylesheets. The `classStyle` prop allows for extensive customization, including background color, text color, and size.