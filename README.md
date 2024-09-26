# Kara Persian DatePicker

A modern, Persian date picker for React applications. This date picker supports both light and dark themes, providing a sleek and user-friendly interface for selecting dates.

## Installation

### npm

To install the package via npm, run:

```bash
npm install persian-flat-datepicker
```

### yarn
```bash
yarn add persian-flat-datepicker
```

## Usage
```javascript
import React, { useState } from 'react';
import {DatePicker} from 'persian-flat-datepicker';
import 'persian-flat-datepicker/dist/index.css';

const App: React.FC = () => {

  return (
    <div>
      <h1>Persian Flat DatePicker</h1>
      <DatePicker
          onChange={(date) => console.log(date)}
          theme={{
              backgroundColor: '#000', // dark background
              textColor: '#fff', // white text
              selectedDayColor: '#007BFF', // blue for selected day
              currentDayBorderColor: '#fff', // white border for current day
          }}
      />
      {selectedDate && <p>Selected Date: {selectedDate.toLocaleDateString()}</p>}
    </div>
  );
};

export default App;

```

## Features
- Light and Dark Themes: Easily switch between light and dark modes.
- Modern Design: Flat design with rounded corners for a sleek look.
- User-Friendly: Simple interface for selecting dates.
- Responsive: Works well on various screen sizes.

## Props
| Prop       | Type                   | Description                                                                                  |
|------------|------------------------|----------------------------------------------------------------------------------------------|
| `theme`   | `object`               | Optional                                                                                     |
| `onChange`| `(date: Date) => void` | Callback function called when a date is selected. Receives the selected date as an argument. |


## Customization
You can customize the appearance of the date picker by modifying the CSS file or overriding styles in your own stylesheets.
