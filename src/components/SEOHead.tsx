import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_DOMAIN = 'https://www.sktradersphilipslighting.com';
const DEFAULT_TITLE = 'SK Traders | Authorized Philips Lighting Distributor';
const DEFAULT_DESC =
  'Authorized distributor of authentic Philips Lighting products in Hyderabad. Supplying LED lights, commercial fixtures, and smart BLDC fans.';
const DEFAULT_IMAGE = `${DEFAULT_DOMAIN}/images/card_ceiling_design_lights.jpg`;

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath = '',
  image,
  type = 'website',
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Title
    const fullTitle = title
      ? title.includes('SK Traders')
        ? title
        : `${title} | SK Traders`
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to update meta tag by name or property
    const updateMeta = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Meta Description & Keywords
    const metaDesc = description || DEFAULT_DESC;
    updateMeta('name', 'description', metaDesc);

    if (keywords) {
      updateMeta('name', 'keywords', keywords);
    }

    // 3. Canonical Tag
    const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    const fullCanonicalUrl = `${DEFAULT_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;
    
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', fullCanonicalUrl);

    // 4. Open Graph Tags
    const ogImage = image
      ? image.startsWith('http')
        ? image
        : `${DEFAULT_DOMAIN}${image.startsWith('/') ? '' : '/'}${image}`
      : DEFAULT_IMAGE;

    updateMeta('property', 'og:title', fullTitle);
    updateMeta('property', 'og:description', metaDesc);
    updateMeta('property', 'og:url', fullCanonicalUrl);
    updateMeta('property', 'og:image', ogImage);
    updateMeta('property', 'og:type', type);

    // 5. Twitter Card Tags
    updateMeta('name', 'twitter:title', fullTitle);
    updateMeta('name', 'twitter:description', metaDesc);
    updateMeta('name', 'twitter:image', ogImage);
    updateMeta('name', 'twitter:card', 'summary_large_image');

    // 6. JSON-LD Dynamic Script
    let jsonLdScript = document.getElementById('dynamic-seo-jsonld');
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'dynamic-seo-jsonld';
        jsonLdScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      // Cleanup dynamic JSON-LD when component unmounts
      const scriptToRemove = document.getElementById('dynamic-seo-jsonld');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, canonicalPath, image, type, jsonLd]);

  return null; // Head elements managed via side-effects
};

export default SEOHead;
