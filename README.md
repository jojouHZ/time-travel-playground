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

#### **Prerequisites**

- Ensure you have Node.js installed (preferably the latest LTS version).
- Ensure you have Yarn installed.

1. **Clone the repository**

   ```bash
   git clone git@github.com\:jojouHZ/time-travel-playground.git
   cd time-travel-playground
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```
3. **Set Up Environment Variables:**
   - Create a .env file in the root directory of your project and add the following environment variables:

   ```bash
   touch .env
   ```

   - Open the .env file and add the following content:

   ```
      # App Name
      VITE_APP_TITLE=Time Travel Playground

      # Base API URL
      VITE_API_BASE_URL=https://api.example.com

      # Debug Mode
      VITE_DEBUG_MODE=true

      # DB Name
      VITE_APP_DB_NAME=TimeTravelPlaygroundDB

      # DB Version
      VITE_APP_DB_VERSION=1

      # DB Store Name
      VITE_APP_STORE_NAME=codeHistory

   ```

4. **Run the Project:**

   ```
   yarn dev
   ```

   - This will start the application, and you can view it in your browser at http://localhost:5173 (or another port if specified).

## **Usage**

1. **Write Code**: Use the Monaco editor to write your code.
2. **Save Snapshots**: Click the "Save Snapshot" button to save the current state of your code.
3. **Navigate Snapshots**: Use the slider to navigate through different versions of your code.
4. **Compare Changes**: Open the diff viewer to compare different versions of your code.

```bash
      your-project-directory/
      ├── src/
      │   ├── components/       # Reusable components
      │   ├── pages/            # Page components
      │   ├── App.tsx           # Main application component
      │   ├── main.tsx          # Entry point
      │   └── index.css         # Global styles
      ├── public/               # Static files
      ├── .env                  # Environment variables
      ├── tailwind.config.js    # Tailwind CSS configuration
      ├── postcss.config.cjs    # PostCSS configuration
      ├── vite.config.ts        # Vite configuration
      ├── package.json          # Project dependencies and scripts
      └── README.md             # Project documentation
```

## **Troubleshooting**

- If you encounter any issues during installation or running the project, ensure all dependencies are correctly installed and there are no errors in the console.
- If you see warnings or errors related to environment variables, ensure the .env file is correctly configured and placed in the root directory.

## **Dependencies**

- TypeScript
- React
- Vite
- TailwindCSS
- Monaco Editor
- IndexedDB
- rc-slider
- react-diff-view
- Prettier
- Jest & React Testing Library

## **Contributing**

Contributions are welcome! Open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your branch and create a pull request.

## **License**

This project is licensed under the MIT License.
