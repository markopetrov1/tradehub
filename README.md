# TradeHub

## Overview
TradeHub is a mobile application designed to facilitate the exchange of various products between users. It provides a platform for users to post products they wish to exchange and discover products posted by others for potential exchanges. With an intuitive user interface and powerful search features, TradeHub streamlines the process of finding and negotiating products, creating a vibrant online trading community.


## Architecture and Design

**React Native**: The frontend of Tradehub is built using React Native, enabling cross-platform development for iOS and Android devices.
**Firebase**: Firebase provides the backend infrastructure for Tradehub, including user authentication, real-time database, and cloud storage.
**Redux**: Redux is used for state management, providing a centralized store for managing app-wide data and state changes.                       
**Material UI**: Material UI components are used for building a consistent and visually appealing user interface across the app.

## Software Design Patterns
The app implements several software design patterns:

1. **Singleton Pattern**: Used in the Firebase initialization to ensure only one instance of Firebase is used throughout the app and.
2. **Flux Architecture Pattern**: Implemented Redux for managing application state, which follows the Flux architecture pattern. Redux allows for a centralized store to manage state changes across the app, providing a predictable state container.
3. **Factory Pattern**: Used to create instances of certain UI elements based on dynamic conditions. This pattern allows for flexible object creation and customization.

## State Management
In Tradehub, the state management system relies on React Native's state management libraries, primarily Redux. Redux facilitates the management of both UI state and data across the application. 

