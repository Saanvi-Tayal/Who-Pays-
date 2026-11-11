Here is a comprehensive, in-depth architectural and product breakdown for **"Who Pays?"**, designed to serve as your master blueprint for development.

---

# Product Blueprint: "Who Pays?"

## 1. Executive Summary & Core Philosophy

"Who Pays?" is a high-energy, pass-the-phone party application designed to instantly resolve group disputes—who pays the bill, who takes out the trash, or who gets auxiliary cord privileges.

The core philosophy is **"The Digital Toy."** To win over judges, the app abandons traditional UI constraints (like forms, buttons, and loading screens) in favor of raw physics, aggressive haptics, and zero-friction onboarding. It feels less like utility software and more like a physical artifact you interact with.

## 2. System Architecture

To achieve 60fps physics, zero-latency multi-touch, and persistent ledger tracking without slowing down the app, the architecture is split into a robust native frontend and a lightweight backend.

* **Frontend Framework:** **React Native (via Expo).** Expo is critical here because of its deep native API access.
* **Animation & Physics Engine:** **Reanimated 3.** Standard CSS/React state animations are too slow. Reanimated runs animations directly on the UI thread, allowing for complex spring physics, fluid collision detection, and screen-shake effects without frame drops.
* **Haptics Engine:** **`expo-haptics`**. Used to trigger varying intensities of device vibrations (Selection, Light, Medium, Heavy, and custom patterns).
* **Gesture Handling:** **`react-native-gesture-handler`**. Essential for tracking up to 8 simultaneous touch points (fingers on the screen) with zero latency.
* **Backend & Database:** **Supabase (PostgreSQL).** Used exclusively to power "The Ledger." It stores anonymous match histories linked to local device IDs, allowing you to track who loses the most without forcing users to create an account or type an email.

## 3. Screen-by-Screen UI & Workflow

### Screen 1: The Drop-In (Zero-Boarding)

There is no splash screen, no login, and no "Create Game" button.

* **Visuals:** A vibrant, dark-mode canvas pulsing softly. Text in the center reads: *"Everyone, touch the screen."*
* **Interaction:** As players place their fingers on the screen, a neon-colored liquid "blob" expands under each fingertip, accompanied by a satisfying haptic *thud*.
* **Logic:** The gesture handler registers 2 to 8 touch points. Once the fingers are held for 2.5 seconds, the blobs lock in, assigning a unique color to each player.

### Screen 2: The Stakes (Mode Selection)

Once players release their fingers, the UI transitions to a massive, bold carousel. The phone owner swipes horizontally to choose the consequence of the game.

* **Who Pays?** (The classic bill-roulette).
* **Awkward Duty:** Settles uncomfortable social tasks (e.g., asking the waiter to fix an order).
* **Ledger Vengeance:** The app queries Supabase for the two players with the lowest loss rate this month and forces them into a sudden-death duel.
* **Aux Cord Dictator:** Winner gets absolute control of the car's playlist.
* **Screen Time Penalty:** The loser must keep their phone face-down for the meal; touching it means they buy dessert.

### Screen 3: The Arena (Mini-Games)

The phone owner selects one of the four mini-games. The UI disappears, replaced entirely by the game mechanics.

* **Game 1: The Time Bomb (Hot Potato)**
* *Visuals:* A glowing, unstable sphere in the center of the screen that pulses and changes colors based on who is holding it.
* *Haptics:* The device emits a rhythmic "heartbeat" vibration. As the hidden, randomized timer gets closer to zero, the haptic heartbeat accelerates to a frantic pace.
* *Climax:* When the timer hits zero, the screen visually "shatters" with a massive `Heavy` haptic impact and a loud glass-breaking sound effect.


* **Game 2: Haptic Roulette (Spin)**
* *Visuals:* A heavy, metallic-looking physics wheel segmented by the colors of the active players.
* *Haptics:* A player swipes the screen to spin it. As the wheel's needle crosses the boundary of each color segment, the phone triggers a sharp, precise `Selection` haptic click. As the wheel loses momentum, the clicks slow down perfectly in sync with the visual physics.


* **Game 3: Tap Frenzy (Tap Race)**
* *Visuals:* The screen splits evenly into zones matching the players' colors. A massive "3, 2, 1" countdown takes over the screen.
* *Mechanics:* Players rapid-fire tap their assigned zones. A real-time particle effect erupts with every tap.
* *Resolution:* After 5 seconds, the player with the *fewest* taps is engulfed in a red overlay and declared the loser.


* **Game 4: Reaction Standoff**
* *Visuals:* The screen goes completely pitch black. A low, tension-building hum plays from the speakers.
* *Mechanics:* All players must hold one finger on their corner of the phone. The phone waits a random interval (2 to 7 seconds). Suddenly, the screen flashes blindingly bright neon green with a loud *crack*.
* *Resolution:* Players must lift their fingers instantly. The system tracks the release time in milliseconds. The slowest reaction loses.



### Screen 4: The Verdict

* **Visuals:** The loser's assigned color takes over the entire screen. Massive, bold typography declares their fate (e.g., *"RED PAYS THE BILL"*).
* **Audio/Haptics:** A sad trombone sound or a comedic explosion plays, paired with a long, rumbling vibration.
* **Interaction:** The UI presents two massive buttons: "REMATCH" (instantly restarts the same game with the same players) or "LOG IT" (saves the result).

### Screen 5: The Ledger (History & Karma)

If the user clicks "LOG IT," they are taken to the Ledger.

* **The Tagging System:** To keep setup frictionless, players aren't named until *after* the game. On this screen, the phone owner can quickly tap the "Red" player's icon and type "Gravit," or select a previously saved friend from a quick-list.
* **The Database:** This data is pushed to Supabase. The Ledger displays a beautiful, dynamic bar chart showing the group's history ("Gravit has bought dinner 4 times, Saanvi has bought 0").
* **The Karma Engine:** This history isn't just for show. In future games, the app uses this data to subtly adjust physics. If someone has a terrible losing streak, the Roulette wheel's friction might be altered by 2% to make it slightly less likely to land on them, ensuring long-term group fairness (and preventing actual fights!).

## 4. Why Judges Will Love This

* **No "App" Clutter:** By replacing text inputs and drop-downs with multi-touch gestures, you prove you understand *user experience in a social setting*. When people are at a restaurant, they don't want to type 6 names on a tiny keyboard.
* **Hardware Mastery:** Utilizing `expo-haptics` mapped directly to physics animations (like the roulette clicks) shows technical depth and an understanding of hardware-software integration.
* **Data with Purpose:** The Ledger proves you can build full-stack CRUD applications, but applying that data to a "Karma Engine" shows high-level product thinking.