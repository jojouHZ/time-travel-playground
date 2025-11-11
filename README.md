# Time Travel Playground 🚀

A **live coding playground** with **"time travel" debugging**—rewind your code to see previous states, compare versions, and visualize changes like Git for your JavaScript/HTML/CSS snippets.

![Time Travel Playground Demo](https://via.placeholder.com/600x400) _(Add a screenshot or GIF of your app here later!)_

---

## **Features**

- **Code Editor**: A fully functional Monaco editor for writing and editing code.
- **Snapshot Management**: Save and load different versions of your code.
- **Diff Viewer**: Compare different versions of your code with a clean and intuitive diff viewer.
- **Navigation**: Easily navigate through different code snapshots using a slider.

---

## **Installation**

1. **Clone the repository**:
   ```bash
   git clone git@github.com\:jojouHZ/time-travel-playground.git
   cd time-travel-playground
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm start
   ```

## **Usage**

1. **Write Code**: Use the Monaco editor to write your code.
2. **Save Snapshots**: Click the "Save Snapshot" button to save the current state of your code.
3. **Navigate Snapshots**: Use the slider to navigate through different versions of your code.
4. **Compare Changes**: Open the diff viewer to compare different versions of your code.

```bash
    time-travel-playground/
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── tests/             # Test files
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── ...                # Other source files
├── public/                # Public assets
├── package.json           # Project configuration
└── README.md              # Project documentation
```

## **Dependencies**

- React
- Monaco Editor
- IndexedDB
- rc-slider
- react-diff-view
- TypeScript
- Vite
- Jest & React Testing Library

## **Contributing**

Contributions are welcome! Open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your branch and create a pull request.

## **License**

This project is licensed under the MIT License.
