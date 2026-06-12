# 📱 Multi-Converter Utility for Android

A sleek, lightweight Android utility application designed to handle real-time encoding, decoding, and cipher translations. Seamlessly convert text data across different mediums—including standard alphabetic indexing, raw binary data, and traditional Morse code—all within a clean, intuitive user interface.

---

## 🎨 Alpha-Num

<p align="center">
  <img src="https://raw.githubusercontent.com/ayanarshad/Alpha-Num/2bb302b2a9ce3799887a4e09d1708165b37570af/app/src/main/assets/favicon.svg" width="340" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);"/>
</p>

---

## 🚀 Key Features

* **🔤 Alphabet ⇄ Number Index ($A = 1 \dots Z = 26$):** Instantly converts characters to their numeric equivalents based on standard position values, and reconstructs strings from number arrays.
* **🔢 Letter ⇄ Binary String:** Translates readable text characters into standard 8-bit binary formatting (`01000001`) and decodes raw binary data back into letters.
* **📻 Words ⇄ Morse Code:** Encodes plain text words into classic telegraphic audio/visual signals (`·` and `−`), and handles reverse-parsing from Morse sequences back to human-readable words.
* **⚡ Live Real-Time Parsing:** No "Convert" button necessary; conversion occurs instantly on a separate UI worker thread as the user type characters.
* **📋 Clipboard Synchronization:** Integrated quick-action copy and paste controls for lightning-fast workflows.

---

## 🛠️ Tech Stack & Implementation Details

* **Platform:** Android
* **Language:** Kotlin / Java
* **UI Structure:** High-fidelity layouts optimized for responsiveness, clean contrast, and fluid data updates.
* **Core Conversion Logic:**
  * **Alphabet Shift:** Handled securely via character code index offsets:
    $$\text{Position} = \text{Character} - 'A' + 1$$
  * **Binary Framework:** Characters are individual bit-masked arrays scaled to 8-bit parsing chunks.

---

## 📥 Getting Started & Build Setup

### Prerequisites
* Android Studio (Latest Version)
* Android SDK (API 21 or higher recommended)

### Installation
1. Clone the repository locally:
   ```bash
   git clone https://github.com/ayanarshad/Alpha-Num.git
### Installation in Android
* [download](https://github.com/ayanarshad/Alpha-Num/releases) the APK
