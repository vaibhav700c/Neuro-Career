"use client"

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Neuro Career",
    "description": "AI-powered career assessment and guidance platform with voice interaction",
    "url": "https://neuro-career-844x.vercel.app",
    "applicationCategory": "EducationalApplication",
    "applicationSubCategory": "Career Guidance",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Neuro Career",
      "url": "https://neuro-career-844x.vercel.app"
    },
    "featureList": [
      "AI-powered career assessment",
      "Voice interaction capabilities", 
      "Personalized career recommendations",
      "Real-time analysis",
      "Interactive career counseling"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "accessibilityFeature": [
      "voiceInput",
      "textualContent",
      "interactiveTranscript"
    ],
    "accessibilityHazard": "none",
    "accessMode": ["textual", "auditory"],
    "accessModeSufficient": ["textual", "auditory"]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}