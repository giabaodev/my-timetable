# Requirements: My Timetable (Next-Gen Edition)

## 1. Project Vision

To transform the current "My Timetable" into a high-aesthetic, mobile-first scheduling app that resonates with Gen Z users. The focus shifts from a simple list to an interactive, hourly-based timeline with a clean, "minimalist-beige" atmosphere.

---

## 2. Design & Aesthetic (Gen Z Vibe)

### 2.1. Color Palette (Neutral Beige)

- **Primary Background:** `#F5F5DC` (Beige) or `#FAF9F6` (Bone White).
- **Surface/Cards:** `#FFFFFF` (Pure White) with 60-80% opacity for a subtle glassmorphism effect.
- **Accents:** Muted pastel tones for different subjects:
  - _Sage Green:_ `#B2AC88`
  - _Dusty Rose:_ `#DCAE96`
  - _Soft Blue:_ `#A7C7E7`
- **Text:** Deep Charcoal (`#333333`) for readability, avoid pure black.

### 2.2. Typography

- **Primary Font:** `Lexend` or `Plus Jakarta Sans` (Modern, geometric, and designed for high readability).
- **Fallback:** `Montserrat`.
- **Styling:** - Bold headers for subject names.
  - Light/Medium weight for time indicators to maintain a clean look.

### 2.3. UI Components

- **Border Radius:** Large rounded corners (`rounded-2xl` or `24px`) for all containers.
- **Shadows:** Very soft, diffused shadows (`box-shadow: 0 10px 30px rgba(0,0,0,0.03)`).
- **Micro-interactions:** Subtle scale-up effects when tapping a course card.

---

## 3. Functional Requirements

### 3.1. Hourly Timeline Layout (Mobile-First)

- **The Two-Column Grid:**
  - **Left Column (Time Axis):** Fixed width (approx. 50-60px). Displays hours (07:00, 08:00, etc.) in a vertical line.
  - **Right Column (Content):** The main area where course cards are placed.
- **Dynamic Positioning:** - Course cards must be positioned absolutely or via CSS Grid based on their `start_time` and `end_time`.
  - The **height** of the card must represent the duration (e.g., a 90-minute class is 1.5x taller than a 60-minute class).
- **Current Time Indicator:** A horizontal "Red Line" (or a stylish beige dot) indicating the exact current time on the schedule.

### 3.2. Schedule Management

- **Hourly Input:** Users can set specific start and end times (HH:mm).
- **Day Navigation:** Top sticky header with "Mon, Tue, Wed..." chips. Users can swipe left/right to switch days.
- **Quick Edit:** Long-press or tap a card to
