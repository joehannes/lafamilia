# Backend Integration Guide - JSONBin & Google OAuth

This guide explains how to set up the optional backend integrations for storing testimonials and user authentication.

## 📦 JSONBin Integration (For Persistent Testimonials Storage)

### What is JSONBin?
JSONBin.io is a free JSON storage service perfect for storing small-to-medium datasets like testimonials.

### Step 1: Create JSONBin Account
1. Visit [jsonbin.io](https://jsonbin.io)
2. Sign up for a free account
3. Note your API key

### Step 2: Create Bins for Testimonials
Create 4 bins (or as many as you need):

```bash
# Example bin creation via API
curl -X POST "https://api.jsonbin.io/v3/b" \
  -H "Content-Type: application/json" \
  -H "X-Master-Key: YOUR_API_KEY" \
  -d '{
    "testimonials": []
  }'
```

Each request returns a `id` field. Save these:
- `VITE_JSONBIN_TESTIMONIALS_EN` - English testimonials
- `VITE_JSONBIN_TESTIMONIALS_ES` - Spanish testimonials
- `VITE_JSONBIN_INTRO_EN` - English intro story
- `VITE_JSONBIN_INTRO_ES` - Spanish intro story

### Step 3: Update .env File

Create `.env` in project root:

```env
# JSONBin API Configuration
VITE_JSONBIN_API_KEY=YOUR_API_KEY_HERE
VITE_JSONBIN_TESTIMONIALS_EN=https://api.jsonbin.io/v3/b/YOUR_BIN_ID_EN
VITE_JSONBIN_TESTIMONIALS_ES=https://api.jsonbin.io/v3/b/YOUR_BIN_ID_ES
VITE_JSONBIN_INTRO_EN=https://api.jsonbin.io/v3/b/YOUR_BIN_ID_INTRO_EN
VITE_JSONBIN_INTRO_ES=https://api.jsonbin.io/v3/b/YOUR_BIN_ID_INTRO_ES
```

### Step 4: Implement Fetching (Update TestimonialDisplay.tsx)

```typescript
// Example: Fetch testimonials from JSONBin
const fetchTestimonials = async () => {
  try {
    const response = await fetch(
      locale === 'es' 
        ? import.meta.env.VITE_JSONBIN_TESTIMONIALS_ES 
        : import.meta.env.VITE_JSONBIN_TESTIMONIALS_EN,
      {
        headers: {
          'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY
        }
      }
    );
    const data = await response.json();
    setTestimonials(data.record.testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
  }
};
```

### Step 5: Implement Saving (Update TestimonialForm.tsx)

```typescript
// Example: Save new testimonial to JSONBin
const saveTestimonial = async (testimonial: Testimonial) => {
  try {
    const response = await fetch(
      locale === 'es' 
        ? import.meta.env.VITE_JSONBIN_TESTIMONIALS_ES 
        : import.meta.env.VITE_JSONBIN_TESTIMONIALS_EN,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': import.meta.env.VITE_JSONBIN_API_KEY
        },
        body: JSON.stringify({
          testimonials: [...testimonials, testimonial]
        })
      }
    );
    const data = await response.json();
    console.log('Testimonial saved successfully');
  } catch (error) {
    console.error('Error saving testimonial:', error);
  }
};
```

## 🔐 Google OAuth Integration

### What is Google OAuth?
Google OAuth allows users to sign in using their Google account, reducing friction and enabling profile picture capture.

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"

### Step 2: Create OAuth Credentials
1. Go to "Credentials" section
2. Create "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://yourdomain.com` (production)

### Step 3: Get Client ID
Save your Client ID - you'll need this

### Step 4: Install Google OAuth Library

```bash
npm install @react-oauth/google
```

### Step 5: Wrap App with GoogleOAuthProvider

In `src/main.tsx`:

```typescript
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

### Step 6: Update .env File

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### Step 7: Implement Google Login in TestimonialForm.tsx

```typescript
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

interface GoogleCredentialResponse {
  credential: string;
}

const handleGoogleSuccess = (credentialResponse: GoogleCredentialResponse) => {
  const decoded: any = jwt_decode(credentialResponse.credential);
  setName(decoded.name);
  setEmail(decoded.email);
  setProfileImage(decoded.picture);
  setIsGoogleLogged(true);
};

// In JSX:
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => console.log('Login Failed')}
/>
```

### Step 8: Install JWT Decoder

```bash
npm install jwt-decode
```

## 🎬 TikTok Video Integration

### How It Works
The TikTok admin panel stores video URLs that are converted to embeddable formats.

### To Add TikTok Videos:

1. **Navigate to Admin Panel**: `/admin`
2. **Scroll to TikTok Section**
3. **Click "Add New TikTok Video"**
4. **Fill in:**
   - Adventure Category (Buggy, Boat, or Waterfall)
   - Video Title
   - Full TikTok URL: `https://www.tiktok.com/@username/video/ID`
   - Brief Description
5. **Click "Add Video"**

### URL Conversion
The system automatically converts:
- From: `https://www.tiktok.com/@username/video/123456789`
- To: `https://www.tiktok.com/embed/v2/123456789`

### Storing TikTok Videos in JSONBin

Add this to a new JSONBin bin:

```json
{
  "tiktokVideos": [
    {
      "id": "1",
      "adventureId": "buggy",
      "title": "Jungle Quad Adventure",
      "url": "https://www.tiktok.com/@yourhandle/video/123456789",
      "description": "Experience the thrill...",
      "createdAt": "2024-03-01"
    }
  ]
}
```

Then update `TikTokAdmin.tsx` to fetch/save from JSONBin.

## 🔄 Environment Variables Summary

Create `.env` file with all these variables:

```bash
# JSONBin Configuration
VITE_JSONBIN_API_KEY=your_api_key_here
VITE_JSONBIN_TESTIMONIALS_EN=https://api.jsonbin.io/v3/b/bin_id_en
VITE_JSONBIN_TESTIMONIALS_ES=https://api.jsonbin.io/v3/b/bin_id_es
VITE_JSONBIN_INTRO_EN=https://api.jsonbin.io/v3/b/bin_id_intro_en
VITE_JSONBIN_INTRO_ES=https://api.jsonbin.io/v3/b/bin_id_intro_es
VITE_JSONBIN_TIKTOK_VIDEOS=https://api.jsonbin.io/v3/b/bin_id_tiktok

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# Application Configuration
VITE_WHATSAPP_PHONE=+18095553333
```

## ✅ Implementation Checklist

### JSONBin Setup
- [ ] Create JSONBin account
- [ ] Create 4-5 bins for data storage
- [ ] Get API key and bin IDs
- [ ] Add environment variables
- [ ] Update components with fetch/save logic
- [ ] Test testimonial submission & retrieval

### Google OAuth Setup
- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Get Client ID
- [ ] Add to environment variables
- [ ] Install `@react-oauth/google` package
- [ ] Wrap app with GoogleOAuthProvider
- [ ] Implement login in TestimonialForm
- [ ] Test sign-in and profile capture

### TikTok Integration
- [ ] Set up JSONBin for video storage
- [ ] Add TikTok video URLs via admin
- [ ] Test video embedding
- [ ] Verify URL conversion works

## 🚀 Deployment Notes

### Production Considerations
1. **Environment Variables**: Ensure .env.production exists with production URLs
2. **CORS**: JSONBin may require CORS headers - use API properly
3. **API Keys**: Never commit `.env` to git - use `.gitignore`
4. **Google OAuth**: Update redirect URIs to production domain
5. **Rate Limiting**: JSONBin has rate limits - implement caching if needed

### GitHub/GitLab .gitignore

```
.env
.env.local
.env.production
node_modules/
dist/
.DS_Store
```

## 📚 Useful Resources

- [JSONBin Documentation](https://jsonbin.io/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [TikTok Embed API](https://www.tiktok.com/embed/)
- [@react-oauth/google](https://github.com/react-oauth/react-oauth.io)

## 🆘 Troubleshooting

### JSONBin Issues
- **403 Forbidden**: Check API key is correct
- **404 Not Found**: Verify bin ID is correct
- **CORS Error**: JSONBin should handle this, ensure URL is correct

### Google OAuth Issues
- **Invalid Client ID**: Check in Google Cloud Console
- **Redirect URI Mismatch**: Ensure URIs match in Google console
- **Token Expired**: Implement token refresh logic

### TikTok Issues
- **Video Won't Embed**: Verify video is public on TikTok
- **URL Format**: Ensure URL includes `/video/` and video ID

---

**Last Updated**: May 8, 2026
**Status**: Ready for Implementation
