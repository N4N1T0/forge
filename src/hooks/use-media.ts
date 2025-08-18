import { useEffect, useState } from 'react'

/**
 * Hook that tracks state of a CSS media query
 * @param query - CSS media query string to evaluate
 * @returns boolean indicating if the media query matches
 */
export const useMedia = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    const updateMatches = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    setMatches(mediaQuery.matches)

    mediaQuery.addEventListener('change', updateMatches)

    return () => {
      mediaQuery.removeEventListener('change', updateMatches)
    }
  }, [query])

  return matches
}
