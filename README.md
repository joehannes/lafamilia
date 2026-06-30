# Punta Cana Adventures

Welcome to the Punta Cana Adventures project! This is a frontend-only e-commerce website designed for a tour vendor specializing in tropical excursions in the Dominican Republic, particularly in Bavaro and Punta Cana.

## Project Structure

The project is organized as follows:

```
punta-cana-adventures
├── src
│   ├── main.tsx               # Entry point of the application
│   ├── App.tsx                # Main application component with routing
│   ├── pages
│   │   ├── Home.tsx           # Homepage layout with hero and marketing sections
│   │   ├── Tours.tsx          # Page listing available excursions
│   │   └── Contact.tsx        # Contact form and vendor information
│   ├── components
│   │   ├── layout
│   │   │   ├── Header.tsx     # Navigation header component
│   │   │   └── Footer.tsx     # Footer component with copyright info
│   │   ├── ui
│   │   │   ├── Button.tsx     # Reusable button component
│   │   │   └── Icon.tsx       # Reusable icon component
│   │   ├── Hero.tsx           # Hero section component
│   │   ├── TourCard.tsx       # Component for displaying individual tours
│   │   ├── Testimonials.tsx    # Component for customer testimonials
│   │   ├── Features.tsx       # Component highlighting key tour features

│   │   └── ContactForm.tsx    # Contact form component
│   ├── data
│   │   └── tours.ts           # Data file containing tour information

│   ├── styles
│   │   └── globals.css        # Global styles and TailwindCSS imports
│   └── utils
│       └── whatsapp.ts        # Utility function for WhatsApp messaging
├── public                      # Directory for static assets
├── index.html                 # Main HTML file for the React application
├── package.json               # npm configuration file
├── tsconfig.json              # TypeScript configuration file
├── tailwind.config.cjs        # TailwindCSS configuration file
├── postcss.config.cjs         # PostCSS configuration file
├── vite.config.ts             # Vite configuration file
└── README.md                  # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd punta-cana-adventures
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the development server:**
   ```
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Features

- **Responsive Design:** The website is fully responsive and looks great on mobile, tablet, and desktop devices.
- **Tropical Aesthetic:** The design incorporates a tropical color palette and adventurous imagery to reflect the essence of Punta Cana tourism.
- **Dynamic Tour Listings:** The Tours page dynamically lists available excursions with options to book via WhatsApp.
- **Contact Form:** A professional contact form for inquiries, along with vendor contact information and social media links.
- **Smooth Animations:** The site features smooth animations for hover effects, button interactions, and scroll-based transitions.

## Welcome Story Admin (Unified Story Management)

The welcome home page story is now managed through the **Story Admin** interface, which provides a flexible, composable approach to building welcome narratives using story elements. This replaces the previous static journey approach while maintaining backward compatibility.

### Story Elements Configuration

**Primary Configuration** (Recommended):
- `VITE_JSONBIN_STORY_ELEMENTS_EN`: Bin ID for English story elements
- `VITE_JSONBIN_STORY_ELEMENTS_ES`: Bin ID for Spanish story elements

**Legacy Configuration** (Deprecated but still supported for fallback):
- `VITE_JSONBIN_JOURNEY_EN`: English journey story bin id (used only if story elements not available)
- `VITE_JSONBIN_JOURNEY_ES`: Spanish journey story bin id (used only if story elements not available)

### Accessing Story Admin

1. Navigate to `/admin`
2. Click the **"Story"** tab in the admin dashboard
3. Select language (English or Español)
4. Manage story title, tagline, and elements
5. Click **"Save Story"** to update JSONBin

### Supported Story Element Types

- **title**: Section headings with clear visual hierarchy
- **paragraph**: Rich text blocks for narrative content
- **picture**: Images uploaded to Cloudinary with mobile support
- **video**: Embedded videos (Vimeo, YouTube, TikTok, or custom URLs)
- **cta**: Call-To-Action sections with customizable buttons

### Environment Variables

- `VITE_JSONBIN_STORY_ELEMENTS_EN`: Bin ID for English story elements (new Story Admin feature).
- `VITE_JSONBIN_STORY_ELEMENTS_ES`: Bin ID for Spanish story elements (new Story Admin feature).
- `VITE_JSONBIN_JOURNEY_EN`: English journey story bin id (deprecated - fallback only).
- `VITE_JSONBIN_JOURNEY_ES`: Spanish journey story bin id (deprecated - fallback only).
- `VITE_JSONBIN_MASTER_KEY`: JSONBin master key used for all private bins.
- `VITE_JSONBIN_BRAND_BIN_ID`: Bin ID for brand settings (name, phone, payment links).
- `VITE_JSONBIN_TOURS_EN`: Bin ID for English tours data.
- `VITE_JSONBIN_TOURS_ES`: Bin ID for Spanish tours data.
- `VITE_JSONBIN_TRANSPORT_EN`: Bin ID for English transport services data.
- `VITE_JSONBIN_TRANSPORT_ES`: Bin ID for Spanish transport services data.
- `VITE_JSONBIN_SOCIAL_BIN_ID`: Bin ID for social media accounts and videos data.
- `VITE_JSONBIN_TESTIMONIALS_BIN_ID`: Bin ID for testimonial records.
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID used for testimonial sign-in.
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for image uploads.
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset for image uploads.

## Story Elements JSONBin

The welcome story is built from flexible story elements that can be managed through the Story Admin interface.



Testimonials can be loaded and saved using JSONBin. If the remote request fails or the bin is missing, the app falls back to a small sample set of reviews.

Use this JSON structure for the bin referenced by `VITE_JSONBIN_TESTIMONIALS_BIN_ID`:

```json
{
  "testimonials": [
    {
      "id": "1",
      "name": "Maria Lopez",
      "email": "maria@example.com",
      "review": "Amazing trip! The guides were friendly, and the whole experience felt safe and fun.",
      "rating": 5,
      "profileImage": "https://example.com/avatar.jpg",
      "createdAt": "2024-04-10"
    }
  ]
}
```

## Story Elements JSONBin

The welcome story screen can be built dynamically from JSONBin using flexible story elements (titles, paragraphs, pictures, and social videos). The Story Admin panel allows you to manage these elements for both English and Spanish versions.

### Story Elements Configuration

Add these environment variables to manage story elements for each language:

- `VITE_JSONBIN_STORY_ELEMENTS_EN`: Bin ID for English story elements
- `VITE_JSONBIN_STORY_ELEMENTS_ES`: Bin ID for Spanish story elements

### Story Elements JSON Structure

Use this JSON structure for the bins referenced by the story elements environment variables:

```json
{
  "storyTitle": "Your Perfect Day in Paradise",
  "storyTagline": "From beach calm to jungle energy, discover why travelers love Bavaro",
  "elements": [
    {
      "id": "element-123456",
      "type": "title",
      "order": 0,
      "content": {
        "title": "The Golden Hour Awakening"
      }
    },
    {
      "id": "element-123457",
      "type": "paragraph",
      "order": 1,
      "content": {
        "text": "You wake up to the sound of waves and a soft Caribbean breeze. After a few restful beach days, your body is ready for something fresh: open air, turquoise water, local flavor, and a little movement beyond the resort."
      }
    },
    {
      "id": "element-123458",
      "type": "picture",
      "order": 2,
      "content": {
        "imageUrl": "/imgs/tours/tour_saona_island_detail_12.jpg"
      }
    },
    {
      "id": "element-123459",
      "type": "video",
      "order": 3,
      "content": {
        "title": "Adventure Highlights",
        "videoUrl": "https://vimeo.com/example-video",
        "videoSource": "vimeo",
        "videoOrientation": "horizontal"
      }
    }
  ]
}
```

### Supported Element Types

- **title**: Displays a heading with the title in `content.title`
- **paragraph**: Displays a text block from `content.text`
- **picture**: Displays an image from `content.imageUrl` (supports local paths like `/imgs/...` or full URLs)
  - **Upload from mobile**: Click the "Upload Image" button to select an image from your device
  - Image is automatically uploaded to Cloudinary and the URL is populated in the data structure
  - Upload progress is shown during transfer
- **video**: Displays an embedded video with:
  - `videoSource`: `'vimeo' | 'youtube' | 'tiktok' | 'custom'`
  - `videoUrl`: Full URL to the video
  - `videoOrientation`: `'vertical' | 'horizontal'`
  - `title`: Optional title for the video

### Image Upload Workflow

The Story Admin includes seamless image uploading:
1. **Select Image**: Click "Upload Image" button from your mobile or desktop
2. **Upload Progress**: Watch the upload percentage indicator
3. **Automatic Save**: Once uploaded to Cloudinary, the image URL is automatically populated
4. **Preview**: Image preview displays immediately in the editor
5. **Persist**: Click "Save Story" to store the URL in JSONBin

**Requirements**: Ensure these environment variables are set for image uploads:
- `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset (must be unsigned for mobile uploads)

### Accessing Story Admin

From the Admin Dashboard:
1. Click the **Story** button in the admin navigation
2. Select the language (English or Español)
3. Edit the story title and tagline
4. Add, edit, reorder, or delete story elements
5. Click **Save Story** to update the JSONBin

**Note:** Story Admin is mobile-first responsive, making it easy to manage on any device.

### English Journey JSON

Use this JSON for the bin referenced by `VITE_JSONBIN_JOURNEY_EN`.

```json
{
  "storyTitle": "Your Perfect Day in Paradise",
  "storyTagline": "From beach calm to jungle energy, discover why travelers love Bavaro",
  "sections": [
    {
      "id": "morning",
      "title": "The Golden Hour Awakening",
      "emoji": "☀️",
      "timeframe": "6:30 AM - 10:00 AM",
      "description": "You wake up to the sound of waves and a soft Caribbean breeze. After a few restful beach days, your body is ready for something fresh: open air, turquoise water, local flavor, and a little movement beyond the resort.",
      "narrative": "Morning light turns the ocean gold as you sip your coffee. Your family or friends are still easing into the day, but you are already picturing a few beautiful hours outside: not rushed, not exhausting, just vivid, easy, and memorable.",
      "imageUrl": "/imgs/tours/tour_saona_island_detail_12.jpg",
      "mood": "curious, energized, ready"
    },
    {
      "id": "decision",
      "title": "The Question Every Traveler Asks",
      "emoji": "🤔",
      "timeframe": "Late Morning",
      "description": "Should we do something more?\n\nMaybe you are with your partner and want a quiet romantic moment away from the resort. Maybe your friends want a story worth retelling. Maybe the family needs a day that feels shared, simple, and real.",
      "narrative": "We get it. You came here to rest. But a great trip can hold both comfort and discovery: the beach chair in the morning, a local route in the afternoon, and a memory that feels entirely your own.",
      "imageUrl": "/imgs/tours/tour_montaa_redonda_detail_7.jpg",
      "mood": "contemplative, hopeful"
    },
    {
      "id": "adventure_preview",
      "title": "Three Beautiful Ways to Explore",
      "emoji": "⚡",
      "description": "You do not have to choose between relaxation and adventure. These handpicked experiences make it easy to step out for a few hours and return with salt air, laughter, and a brighter story.",
      "adventures": [
        {
          "id": "buggy",
          "title": "Jungle Boogie: 4x4 Quad Adventure",
          "emoji": "🏜️",
          "duration": "4-5 hours",
          "vibe": "Adrenaline, Nature, Freedom",
          "description": "Mud flies, your quad hums, and the trail opens into green Dominican countryside. A cool cenote waits along the route before you ride back smiling, dusty, and fully awake.",
          "highlights": [
            "Off-road jungle trails through authentic Dominican terrain",
            "Visit a hidden natural cenote for a cooling swim",
            "Professional guides with years of local knowledge",
            "Perfect for thrill-seekers, couples, and groups"
          ],
          "bestFor": "Adventure couples, friend groups, families with older kids",
          "vimeoUrl": "https://vimeo.com/example-buggy",
          "imageUrl": "/imgs/tours/tour_buggies_detail_15.jpg",
          "mood": "Wild, Free, Unstoppable"
        },
        {
          "id": "party_boat",
          "title": "Caribbean Vibes: Party Boat Saona",
          "emoji": "🎉",
          "duration": "6-7 hours",
          "vibe": "Social, Music, Pure Joy",
          "description": "You are on a catamaran with bright music, warm sun, and impossibly turquoise water. Friends are laughing, new people feel familiar, and the shoreline looks better with every mile.",
          "highlights": [
            "Full-day boat adventure to Saona Island",
            "Snorkeling in pristine natural pools",
            "Fresh Dominican lunch and premium drinks included",
            "Beach time on untouched white sand",
            "Music, dancing, and genuine Caribbean hospitality"
          ],
          "bestFor": "Friend groups, romantic couples, families seeking social adventure",
          "vimeoUrl": "https://vimeo.com/example-boat",
          "imageUrl": "/imgs/tours/tour_party_boat_detail_11.jpg",
          "mood": "Euphoric, Connected, Unforgettable"
        },
        {
          "id": "waterfall",
          "title": "Jungle Serenity: Samana Waterfalls",
          "emoji": "🌊",
          "duration": "5-6 hours",
          "vibe": "Nature, Calm, Romantic",
          "description": "You walk through lush jungle canopy as the sound of water grows closer. Then the waterfall appears, pouring into a clear natural pool where the air is cool, fresh, and peaceful.",
          "highlights": [
            "Journey to the stunning Samana waterfalls",
            "Hike through pristine tropical jungle",
            "Swim in crystal-clear natural pools",
            "Perfect photo moments in lush natural settings",
            "Local guide expertise on flora, fauna, and culture"
          ],
          "bestFor": "Couples (incredibly romantic), families, nature lovers, photographers",
          "vimeoUrl": "https://vimeo.com/example-waterfall",
          "imageUrl": "/imgs/tours/tour_saman_detail_9.jpg",
          "mood": "Peaceful, Fresh, Romantic"
        }
      ]
    },
    {
      "id": "afternoon_post",
      "title": "The Afternoon Glow",
      "emoji": "🌅",
      "description": "You are back at the resort, sun-kissed and content. You grab a cold drink, find a lounge chair, and let the day settle in. The best part is simple: you did more than stay here, you felt the place.",
      "narrative": "A few hours away became the memory everyone keeps returning to. Your friends are still laughing about it, your family is already choosing the next route, and the day feels complete in that easy Caribbean way.",
      "imageUrl": "/imgs/tours/tour_isla_saona_vip_detail_8.jpg",
      "mood": "satisfied, alive, grateful"
    }
  ],
  "callToActions": [
    {
      "text": "Start Your Jungle Adventure",
      "target": "buggy",
      "action": "scroll-to"
    },
    {
      "text": "Reserve the Party Boat",
      "target": "party_boat",
      "action": "contact"
    },
    {
      "text": "Discover Samana Waterfalls",
      "target": "waterfall",
      "action": "scroll-to"
    }
  ]
}
```

### Spanish Journey JSON

Use this JSON for the bin referenced by `VITE_JSONBIN_JOURNEY_ES`.

```json
{
  "storyTitle": "Tu Día Perfecto en el Paraíso",
  "storyTagline": "De la calma de la playa a la energía de la selva, descubre por qué los viajeros aman Bávaro",
  "sections": [
    {
      "id": "morning",
      "title": "El Despertar de la Hora Dorada",
      "emoji": "☀️",
      "timeframe": "6:30 AM - 10:00 AM",
      "description": "Te despiertas con el sonido de las olas y una brisa caribeña suave. Después de unos días de descanso en la playa, el cuerpo pide algo fresco: aire libre, agua turquesa, sabor local y un poco de movimiento fuera del resort.",
      "narrative": "La luz de la mañana pinta el océano de oro mientras tomas tu café. Tu familia o amigos todavía empiezan el día con calma, pero tú ya imaginas unas horas hermosas afuera: sin prisa, sin agotarte, llenas de vida, fáciles e inolvidables.",
      "imageUrl": "/imgs/tours/tour_saona_island_detail_12.jpg",
      "mood": "curioso, energizado, listo"
    },
    {
      "id": "decision",
      "title": "La Pregunta que Todo Viajero se Hace",
      "emoji": "🤔",
      "timeframe": "Media Mañana",
      "description": "¿Deberíamos hacer algo más?\n\nQuizás estás con tu pareja y quieres un momento romántico lejos del resort. Quizás tus amigos buscan una historia para recordar. Quizás la familia necesita un día compartido, simple y real.",
      "narrative": "Lo entendemos. Viniste a descansar. Pero un gran viaje puede tener ambas cosas: la silla de playa en la mañana, una ruta local en la tarde y un recuerdo que se siente completamente tuyo.",
      "imageUrl": "/imgs/tours/tour_montaa_redonda_detail_7.jpg",
      "mood": "contemplativo, esperanzado"
    },
    {
      "id": "adventure_preview",
      "title": "Tres Formas Hermosas de Explorar",
      "emoji": "⚡",
      "description": "No tienes que elegir entre relajación y aventura. Estas experiencias seleccionadas te permiten salir unas horas y regresar con brisa salada, risas y una historia más luminosa.",
      "adventures": [
        {
          "id": "buggy",
          "title": "Ritmo Salvaje: Aventura en Quad 4x4",
          "emoji": "🏜️",
          "duration": "4-5 horas",
          "vibe": "Adrenalina, Naturaleza, Libertad",
          "description": "El lodo vuela, tu quad vibra y el camino se abre entre paisajes verdes dominicanos. Un cenote fresco espera en la ruta antes de volver sonriendo, con polvo y energía.",
          "highlights": [
            "Senderos fuera de carretera por la auténtica selva dominicana",
            "Visita a un cenote natural oculto para nadar",
            "Guías profesionales con años de conocimiento local",
            "Perfecto para aventureros, parejas y grupos"
          ],
          "bestFor": "Parejas aventureras, grupos de amigos, familias con niños mayores",
          "vimeoUrl": "https://vimeo.com/example-buggy",
          "imageUrl": "/imgs/tours/tour_buggies_detail_15.jpg",
          "mood": "Salvaje, Libre, Imparable"
        },
        {
          "id": "party_boat",
          "title": "Vibra Caribeña: Barco Fiesta Saona",
          "emoji": "🎉",
          "duration": "6-7 horas",
          "vibe": "Social, Música, Pura Alegría",
          "description": "Estás en un catamarán con música alegre, sol cálido y agua turquesa. Tus amigos ríen, la gente nueva se siente cercana y la costa se ve mejor con cada milla.",
          "highlights": [
            "Aventura en barco de día completo a Isla Saona",
            "Snorkel en piscinas naturales prístinas",
            "Almuerzo dominicano fresco y bebidas premium incluidas",
            "Tiempo en playa de arena blanca intacta",
            "Música, baile y genuina hospitalidad caribeña"
          ],
          "bestFor": "Grupos de amigos, parejas románticas, familias buscando aventura social",
          "vimeoUrl": "https://vimeo.com/example-boat",
          "imageUrl": "/imgs/tours/tour_party_boat_detail_11.jpg",
          "mood": "Eufórico, Conectado, Inolvidable"
        },
        {
          "id": "waterfall",
          "title": "Serenidad Selvática: Cascadas de Samaná",
          "emoji": "🌊",
          "duration": "5-6 horas",
          "vibe": "Naturaleza, Calma, Romántico",
          "description": "Caminas bajo un dosel tropical mientras el sonido del agua se acerca. Luego aparece la cascada, cayendo sobre una piscina natural clara donde el aire se siente fresco y tranquilo.",
          "highlights": [
            "Viaje a las espectaculares cascadas de Samaná",
            "Caminata por la selva tropical prístina",
            "Nado en piscinas naturales cristalinas",
            "Momentos fotográficos perfectos en escenarios naturales",
            "Expertise de guía local sobre flora, fauna y cultura"
          ],
          "bestFor": "Parejas (increíblemente romántico), familias, amantes de la naturaleza, fotógrafos",
          "vimeoUrl": "https://vimeo.com/example-waterfall",
          "imageUrl": "/imgs/tours/tour_saman_detail_9.jpg",
          "mood": "Pacífico, Fresco, Romántico"
        }
      ]
    },
    {
      "id": "afternoon_post",
      "title": "El Brillo de la Tarde",
      "emoji": "🌅",
      "description": "Estás de vuelta en el resort, bronceado y contento. Tomas una bebida fría, encuentras una silla de playa y dejas que el día repose. Lo mejor es simple: hiciste más que quedarte, sentiste el lugar.",
      "narrative": "Unas horas afuera se convirtieron en el recuerdo al que todos vuelven. Tus amigos siguen riendo, tu familia ya piensa en la próxima ruta y el día se siente completo a la manera caribeña.",
      "imageUrl": "/imgs/tours/tour_isla_saona_vip_detail_8.jpg",
      "mood": "satisfecho, vivo, agradecido"
    }
  ],
  "callToActions": [
    {
      "text": "Comienza tu Aventura en la Selva",
      "target": "buggy",
      "action": "scroll-to"
    },
    {
      "text": "Reserva el Barco Fiesta",
      "target": "party_boat",
      "action": "contact"
    },
    {
      "text": "Descubre las Cascadas de Samaná",
      "target": "waterfall",
      "action": "scroll-to"
    }
  ]
}
```

## Social Media JSONBin

The admin panel social media accounts and videos can be managed through JSONBin. If the remote request fails or configuration is missing, the app falls back to empty defaults.

### Social Media JSON Structure

Use this JSON structure for the bin referenced by `VITE_JSONBIN_SOCIAL_BIN_ID`:

```json
{
  "accounts": [
    {
      "platform": "instagram",
      "username": "yourusername",
      "url": "https://instagram.com/yourusername",
      "enabled": true
    },
    {
      "platform": "tiktok",
      "username": "yourusername",
      "url": "https://tiktok.com/@yourusername",
      "enabled": true
    }
  ],
  "videos": [
    {
      "id": "video-1",
      "platform": "instagram",
      "title": "Amazing Dominican Adventure",
      "url": "https://instagram.com/p/VIDEO_ID",
      "description": "Check out this incredible experience in Punta Cana!",
      "createdAt": "2024-01-15"
    }
  ]
}
```

## Cloudflare Pages Deployment

This project is designed to be deployed on Cloudflare Pages. Set up the following environment variables in your Cloudflare Pages dashboard:

### Required Environment Variables

```
VITE_JSONBIN_MASTER_KEY = "your-jsonbin-master-key"
VITE_JSONBIN_BRAND_BIN_ID = "your-brand-settings-bin-id"
VITE_JSONBIN_TOURS_EN = "your-english-tours-bin-id"
VITE_JSONBIN_TOURS_ES = "your-spanish-tours-bin-id"
VITE_JSONBIN_TRANSPORT_EN = "your-english-transport-bin-id"
VITE_JSONBIN_TRANSPORT_ES = "your-spanish-transport-bin-id"
VITE_JSONBIN_SOCIAL_BIN_ID = "your-social-media-bin-id"
VITE_JSONBIN_TESTIMONIALS_BIN_ID = "your-testimonials-bin-id"
VITE_JSONBIN_BLOG_EN = "your-english-blog-bin-id"
VITE_JSONBIN_BLOG_ES = "your-spanish-blog-bin-id"
VITE_JSONBIN_STORY_ELEMENTS_EN = "your-story-elements-en-bin-id"
VITE_JSONBIN_STORY_ELEMENTS_ES = "your-story-elements-es-bin-id"
VITE_JSONBIN_JOURNEY_EN = "your-english-journey-bin-id"
VITE_JSONBIN_JOURNEY_ES = "your-spanish-journey-bin-id"
VITE_JSONBIN_EN_BIN_ID = "your-english-translation-bin-id"
VITE_JSONBIN_ES_BIN_ID = "your-spanish-translation-bin-id"
VITE_JSONBIN_EXAMPLETESTOURS_EN_BIN_ID = "your-example-tours-en-bin-id"
VITE_JSONBIN_EXAMPLETESTOURS_ES_BIN_ID = "your-example-tours-es-bin-id"
VITE_JSONBIN_TRANSFER_BIN_ID = "your-transfer-config-bin-id"
VITE_GOOGLE_CLIENT_ID = "your-google-client-id"
VITE_CLOUDINARY_CLOUD_NAME = "your-cloudinary-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET = "your-cloudinary-upload-preset"
INIT_DATA_SECRET = "your-initialization-secret"
```

### Setting up Environment Variables in Cloudflare

1. Go to your Cloudflare Pages dashboard
2. Select your project
3. Go to Settings → Environment variables
4. Add each variable with its corresponding value
5. Create a Cloudflare KV namespace and bind it to the Pages function as `DATA_KV`
6. Add `INIT_DATA_SECRET` to protect the one-time initializer
7. Redeploy your site for changes to take effect

After deployment, trigger the initializer by calling the `/api/init-data` endpoint with the `x-init-secret` header set to the shared secret, or use the helper script:

```bash
INIT_DATA_URL=https://tours-4n8.pages.dev/api/init-data INIT_DATA_SECRET="your-initialization-secret" npm run init-cloudflare-data
```

### Automatic initialization on deploy

If you also add `INIT_DATA_URL` and `INIT_DATA_SECRET` to your Cloudflare Pages environment, the build command will attempt to trigger the init endpoint automatically after `vite build` completes.

Set these variables in Cloudflare Pages:

```
INIT_DATA_URL=https://tours-4n8.pages.dev/api/init-data
INIT_DATA_SECRET=your-initialization-secret
```

Then deploy normally. The build step will retry calling the init endpoint up to 10 times.

> Note: This is best-effort automation. If the deployed endpoint is not reachable yet during build, the trigger script will log a warning and continue without failing the build.

If the automatic path does not complete, perform these manual steps:

1. Deploy the site.
2. Confirm the site is live at `https://tours-4n8.pages.dev`.
3. Run:

```bash
INIT_DATA_URL=https://tours-4n8.pages.dev/api/init-data INIT_DATA_SECRET="your-initialization-secret" npm run init-cloudflare-data
```

4. Confirm the initializer response reports `success: true` and the resources initialized.

### Automatic trigger on deploy

If you set `INIT_DATA_URL` and `INIT_DATA_SECRET` in your build environment, the build command will attempt to initialize data automatically after `vite build` finishes.

Add these environment variables to Cloudflare Pages:

```
INIT_DATA_URL=https://tours-4n8.pages.dev/api/init-data
INIT_DATA_SECRET=your-initialization-secret
```

Then deploy normally. The build step will try to POST to the init endpoint up to 10 times.

> Note: Cloudflare Pages build may run before the new deployment URL is fully live. This helper is best-effort: if the endpoint is not reachable yet, it will retry and then log a warning instead of failing the build.

If the automatic trigger does not complete, run this manual step exactly:

1. Deploy your site.
2. Confirm the app is live at `https://tours-4n8.pages.dev`.
3. Run:

```bash
INIT_DATA_URL=https://tours-4n8.pages.dev/api/init-data INIT_DATA_SECRET="your-initialization-secret" npm run init-cloudflare-data
```

4. Verify the response shows `success: true` and the populated resource list.

## Technologies Used

- React
- TypeScript
- TailwindCSS
- Vite
- PostCSS

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Feel free to explore the code and contribute to the project!
