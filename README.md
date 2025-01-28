# AltSchoolExamProject

# **Calendar Todo App**

A user-friendly calendar application that helps you organize, manage, and track your daily tasks effectively.

## **Demo**

Check out the live demo here: https://taskhivetracker.netlify.app/

## **Features**

- **Add Todo**: Easily create tasks and assign due dates to them.
- **View Tasks in Calendar**: See all your tasks laid out in a monthly view.
- **Click to View Details**: Click on any task to see more details or get notified.
- **Interactive UI**: Fully interactive calendar with drag-and-drop capabilities.
- **Responsive Design**: Works seamlessly on all devices.
- **Custom 404**: redirection for seamless navigation.
-**Error boundary**: to ensure app stability.
-**Sticky notes**: feature for quick reminders.
-**Additional tools**: to enhance productivity.
  
## **Tech Stack**
- **Frontend Framework**: React.js
- **Styling**: CSS (custom styles), FullCalendar.js
- **Libraries**:
  - `@fullcalendar/react` (for calendar rendering)
  - `react-toastify` (for notifications)
  - `@fullcalendar/daygrid`, `@fullcalendar/timegrid` (for different calendar views)
  - `@fullcalendar/interaction` (for interaction plugins)

## **Installation Instructions**

1. **Clone the Repository**  
   ```bash
   git clone <your-repository-link>
   cd <your-repository-folder>
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```

3. **Run the App**  
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000` (or a port you specify).

## **How to Use**

1. **Add a Task**: navigate to the "Today page " from the menu bar and click on "add new task", then input all relevant information  regarding the task
2. **View Tasks**: All tasks will appear in their respective dates on the calendar.  as well as tapping on any created task would allow visualization of the clicked on task  
3. **Notifications**: Clicking a task will show a toast notification with the task details.
4. **Interactive Calendar**: Navigate between months, drag tasks to different dates, or modify them as needed.


## **API Used**

- **FullCalendar.js**: Provides interactive calendar functionality.
- **React-Toastify**: Handles notifications.
- **Context API**: Manages the application state.





---

Let me know if you need further customization or help with any part of this file! 😊
