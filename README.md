# Time Travel Playground 🚀

A **live coding playground** with **"time travel" debugging**—rewind your code to see previous states, compare versions, and visualize changes like Git for your JavaScript/HTML/CSS snippets.

![Time Travel Playground Demo](https://via.placeholder.com/600x400) *(Add a screenshot or GIF of your app here later!)*

---

## **Features**
✅ **Live Code Editor**: Write and execute JavaScript/HTML/CSS in real-time.<br>
✅ **Time Travel Debugging**: Save snapshots of your code and rewind to any state.<br>
✅ **IndexedDB Storage**: All snapshots are saved locally in your browser.<br>
✅ **Diff Viewer**: Compare changes between code snapshots.<br>
✅ **Matrix-Style Visualization**: Animated transitions between code states (coming soon!).<br>

---

## **Tech Stack**
- **Frontend**: React, Vite, Monaco Editor
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Storage**: IndexedDB (for persistent code history)
- **Styling**: CSS (or your preferred styling solution)

---

## **Installation**
1. **Clone the repository**:
   ```bash
   git clone git@github.com\:jojouHZ/time-travel-playground.git
   cd time-travel-playground
   ```
2. **Install dependencies**:
    ```bash
    yarn install
    ```
3. **Run the development server:**
    ```bash
    yarn dev
    ```
4. **Open**:
- open http://localhost:5173 in your browser.


## **Usage**

1. **Write Code**: Use the Monaco Editor to write JavaScript, HTML, or CSS.
2. **Save Snapshots**: Click "Save Snapshot" to save your current code state.
3. **Time Travel**:
    - Use the **slider** or input field to jump to any saved snapshot.
    - Click "Back" or **"Forward"** to navigate through history.


4. **Compare Changes**: Use the **Diff Viewer** to see changes between snapshots.
```bash
    time-travel-playground/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── utils/          # Utility functions (e.g., IndexedDB helper)
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── public/             # Static files
    ├── README.md           # Project documentation
    └── package.json        # Dependencies and scripts
```

## **Roadmap**

- [x] Core Editor: Integrate Monaco Editor.<br>
- [x] Snapshot System: Save and load code snapshots.<br>
- [x] IndexedDB Storage: Persist snapshots in the browser.<br>
- [ ] Diff Viewer: Highlight changes between snapshots.<br>
- [ ] Matrix Visualization: Animated transitions between code states.<br>
- [ ] Collaboration: Real-time multiplayer coding (stretch goal).<br>


## **Contributing**
Contributions are welcome! Open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch: (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "feat: add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## **License**
This project is licensed under the MIT License.

## **Acknowledgments**

- Monaco Editor: Powerful code editor.
- Vite: Fast frontend tooling.
- IndexedDB: Browser-based database.