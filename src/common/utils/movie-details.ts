/**
 * Utility functions for movie details
 */

import { Video } from '../../types/tv';

/**
 * Format runtime from minutes to hours and minutes
 * @param minutes Runtime in minutes
 * @returns Formatted runtime string (e.g., "2h 15m")
 */
export function formatRuntime(minutes?: number): string {
  if (!minutes) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}

/**
 * Format date from ISO string to localized date
 * @param dateString ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Dec 25, 2022")
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Get video URL based on video provider
 * @param video Video object
 * @returns Video URL for YouTube, Vimeo, etc.
 */
export function getVideoUrl(video: Video): string | null {
  if (!video || !video.site || !video.key) return null;

  switch (video.site.toLowerCase()) {
    case 'youtube':
      return `https://www.youtube.com/watch?v=${video.key}`;
    case 'vimeo':
      return `https://vimeo.com/${video.key}`;
    default:
      return null;
  }
}

/**
 * Format currency amount
 * @param amount Amount in dollars
 * @returns Formatted currency string (e.g., "$10,000,000")
 */
export function formatCurrency(amount?: number): string {
  if (!amount && amount !== 0) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format release year from full date
 * @param dateString ISO date string (YYYY-MM-DD)
 * @returns Year only (e.g., "2022")
 */
export function formatReleaseYear(dateString?: string): string {
  if (!dateString) return 'N/A';

  try {
    return dateString.substring(0, 4);
  } catch (error) {
    console.error('Error formatting release year:', error);
    return 'N/A';
  }
}
