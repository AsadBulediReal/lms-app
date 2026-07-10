# ELearner

<!-- Add Badges here -->
![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

![ELearner Banner](./placeholder-image.png)

Welcome to **ELearner**! This project is a comprehensive Learning Management System built to provide a seamless educational experience with video streaming, course management, and secure payments.

**[🚀 View Live Demo](#)** <!-- Replace with actual link -->

## 🌟 Overview

I built this project to create a robust platform for online education. It features student and teacher modes, enabling content creators to publish courses with video lessons and attachments, while students can track their progress, purchase courses, and learn effectively.

## 📸 Screenshots & Previews

<!-- Add your actual screenshots or GIFs here -->
*Include a GIF demonstrating the course player and dashboard here to immediately grab attention.*

| Course Dashboard | Video Player |
| :---: | :---: |
| <img src="./Dashboard.gif" alt="Dashboard" width="400" /> | <img src="./Course-Player.gif" alt="Course Player" width="400" /> |

## 🚀 Key Features

- **Authentication**: Secure login and registration powered by Clerk.
- **Video Streaming**: High-quality video delivery and playback using Mux.
- **Course Management**: Intuitive drag-and-drop course and chapter reordering.
- **Rich Text Editor**: Create engaging course descriptions with React Quill.
- **Secure Payments**: Integrated Stripe checkout for course purchases.
- **File Uploads**: Seamless image and attachment uploads via Uploadthing.
- **Student Progress**: Visual progress tracking with charts and progress bars.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) + [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Database / ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Video Hosting**: [Mux](https://mux.com/)
- **File Uploads**: [Uploadthing](https://uploadthing.com/)

## 📂 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine. You will also need API keys for Clerk, Stripe, Mux, Uploadthing, and a database connection URL.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AsadBulediReal/lms-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd lms-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   Create a `.env` file in the root directory and add the required API keys and database URL.

5. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running Locally

```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 📬 Contact

Created by **[Asad Jamil Buledi](https://github.com/AsadBulediReal)** - feel free to reach out!
- LinkedIn: [Asad Jamil Buledi](https://linkedin.com/in/asad-jamil-buledi-7b1154245)
- GitHub: [AsadBulediReal](https://github.com/AsadBulediReal)
- Email: [bulediasadjamil@gmail.com](mailto:bulediasadjamil@gmail.com)
